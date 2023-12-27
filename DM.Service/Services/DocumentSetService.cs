using DM.Repository.Contexts;
using DM.Service.Interfaces;
using DM.Service.ServiceModels;
using DM.Service.ServiceModels.DocumentSetDTO;

using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using System;
using System.Collections.Generic;
using System.Linq;
using DM.Domain.Models;
using DM.Service.Utils;

namespace DM.Service.Services
{
    public class DocumentSetService : IDocumentSetService
    {
        private DocumentDBContext _context;
        private ValidatorException _exception;
        private readonly ILogger _logger;
        private readonly IStringLocalizer<DocumentSetService> _localizer;
        private readonly IUserInformationService _userInformationService;

        public DocumentSetService(DocumentDBContext context, ILogger<DocumentSetService> logger, IStringLocalizer<DocumentSetService> localizer, IUserInformationService userInformationService)
        {
            _context = context;
            _exception = new ValidatorException();
            _logger = logger;
            _localizer = localizer;
            _userInformationService = userInformationService;
        }

        public IEnumerable<DocumentSetGetDTO> GetAllDocumentSets()
        {
            List<DocumentSetGetDTO> result = new List<DocumentSetGetDTO>();
            List<DocumentSet> document_sets = _context.DocumentSet.Include(ds => ds.User).ToList();
            foreach (var docSet in document_sets)
            {
                result.Add(DocumentSetGetDTO.GetDTO(docSet));
            }

            //_logger.LogInformation(LoggingEvents.GetItem, "GetAllDocumentSets() is called");
            return result;
        }
        public DocumentSetGetDTO GetDocumentSetByID(int document_set_id)
        {
            if (!_context.DocumentSet.Any(p => p.ID == document_set_id))
            {
                _exception.AttributeMessages.Add(_localizer["Document Set NOT FOUND"]);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("GetDocumentSetByID({0}) NOT FOUND", document_set_id));
                throw _exception;
            }
            
            DocumentSet document_set = _context.DocumentSet
                .Include(p=> p.ChildDocumentsSets).ThenInclude(p => p.ChildDocumentSet).ThenInclude(p=>p.User)
                .Include(p => p.Set_Documents).ThenInclude(p=>p.Document).ThenInclude(p=>p.MetaDataModel)
                .Include(p => p.Set_Documents).ThenInclude(p => p.Document).ThenInclude(p => p.LatestDocumentVersion).ThenInclude(p => p.User).Where(p => p.ID == document_set_id).Single();

            //_logger.LogInformation(LoggingEvents.GetItem, "GetDocumentSetByID({document_set_id}) is fetched", document_set_id);
            return DocumentSetGetDTO.GetDTO(document_set);
        }
        public void AddDocumentSet(DocumentSetPostDTO document_set_dto)
        {
            if (document_set_dto == null)
            {
                _exception.AttributeMessages.Add(_localizer["Document Set is NULL"]);
                _logger.LogError(LoggingEvents.InsertItem, String.Format("AddDocumentSet({0}) MISSING INFORMATION ERROR", document_set_dto));
                throw _exception;
            }

            if (!_exception.checkNames(document_set_dto.Name))
            {
                _exception.AttributeMessages.Add(_localizer["Document Set Name is NULL or Empty"]);
                _logger.LogError(LoggingEvents.InsertItem, String.Format("AddDocumentSet({0}) INVALID ENTRY ERROR", document_set_dto));
                throw _exception;
            }

            if (_context.DocumentSet.Any(p => p.Name == document_set_dto.Name || p.ID == document_set_dto.Id))
            {
                _exception.AttributeMessages.Add(_localizer["Document Set Existed before"]+ document_set_dto.Name);
                _logger.LogError(LoggingEvents.InsertItem, String.Format("AddDocumentSet({0}) EXISTED BEFORE ERROR", document_set_dto));
                throw _exception;
            }

            //_logger.LogInformation(LoggingEvents.InsertItem, "AddDocumentSet({document_set_dto}) is called", document_set_dto);
            DocumentSet documentSet = document_set_dto.GetEntity();
            documentSet.UserId = _userInformationService.GetUserID();
            _context.DocumentSet.Add(documentSet);
            _context.SaveChanges();
        }
        public void UpdateDocumentSetName(DocumentSetPostDTO document_set_dto)
        {
            if (!_context.DocumentSet.Any(p => p.ID == document_set_dto.Id))
            {
                _exception.AttributeMessages.Add(_localizer["Document Set NOt FOUND"]);
                _logger.LogError(LoggingEvents.UpdateItem, String.Format("UpdateDocumentSetName({0}) NOT FOUND", document_set_dto));
                throw _exception;
            }

            if (_context.DocumentSet.Any(p => p.Name == document_set_dto.Name))
            {
                _exception.AttributeMessages.Add(_localizer["Document Set Name Existed Before"]+ document_set_dto.Name);
                _logger.LogError(LoggingEvents.UpdateItem, String.Format("UpdateDocumentSetName({0}) EXISTED BEFORE ERROR", document_set_dto));
                throw _exception;
            }

            if (!_exception.checkNames(document_set_dto.Name))
            {
                _exception.AttributeMessages.Add(_localizer["Document Set Name Is NULL or Empty"]);
                _logger.LogError(LoggingEvents.UpdateItem, String.Format("UpdateDocumentSetName({0}) INVALID ENTRY ERROR", document_set_dto));
                throw _exception;
            }

            DocumentSet document_set = _context.DocumentSet.Single(p => p.ID == document_set_dto.Id);
            document_set.Name = document_set_dto.Name;
            document_set.ModifiedDate = DateTime.Now;

            //_logger.LogInformation(LoggingEvents.UpdateItem, "UpdateDocumentSetName({document_set_dto}) is called", document_set_dto);
            _context.DocumentSet.Update(document_set);
            _context.SaveChanges();
        }
        public void DeleteDocumentSet(int document_set_id)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                if (_context.DocumentSet.Any(p => p.ID == document_set_id))
                {
                    if (_context.RecursiveDocumentSet.Any(p => p.ParentDocumentSetId == document_set_id || p.ChildDocumentSetId == document_set_id))
                    {
                        _context.RecursiveDocumentSet.RemoveRange(_context.RecursiveDocumentSet.Where(p => p.ParentDocumentSetId == document_set_id || p.ChildDocumentSetId == document_set_id));
                        _context.SaveChanges();
                    }
                    if (_context.DocumentSet_Document.Any(p => p.DocumentSetId == document_set_id))
                    {
                        _context.DocumentSet_Document.RemoveRange(_context.DocumentSet_Document.Where(p => p.DocumentSetId == document_set_id));
                        _context.SaveChanges();
                    }

                    DocumentSet document_set = _context.DocumentSet.Single(p => p.ID == document_set_id);
                    _context.DocumentSet.Remove(document_set);
                    _context.SaveChanges();
                    transaction.Commit();
                    //_logger.LogInformation(LoggingEvents.DeleteItem, "DeleteDocumentSet({id}) is called", document_set_id);
                }
                else
                {
                    _exception.AttributeMessages.Add(_localizer["Document Set NOT FOUND"]);
                    _logger.LogError(LoggingEvents.DeleteItem, String.Format("DeleteDocumentSet({0}) NOT FOUND", document_set_id));
                    throw _exception;
                }
            }
        }
        public void AddDocumentsToDocumentSet(List<int> documents_Ids, int document_set_Id)
        {
            // check if valid.
            if (documents_Ids == null || documents_Ids.Count == 0)
            {
                _exception.AttributeMessages.Add(_localizer["Document NOT FOUND"]);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("AddDocumentToDocumentSet({0}) Document NOT FOUND", document_set_Id));
                throw _exception;
            }

            if (!_context.DocumentSet.Any(p => p.ID == document_set_Id))
            {
                _exception.AttributeMessages.Add(_localizer["Document Set NOT FOUND"]);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("AddDocumentToDocumentSet({0}) Document Set NOT FOUND", document_set_Id));
                throw _exception;
            }

            foreach (var doc_id in documents_Ids)
            {
                if (!_context.Document.Any(p => p.ID == doc_id))
                {
                    _exception.AttributeMessages.Add(_localizer["Document NOT FOUND"]);
                    _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("AddDocumentToDocumentSet({0},{1}) Document NOT FOUND", doc_id, document_set_Id));
                    throw _exception;
                }

                if (_context.DocumentSet_Document.Any(p => p.DocumentSetId == document_set_Id && p.DocumentId == doc_id))
                {
                    _exception.AttributeMessages.Add(_localizer["Document already added to Document Set"]);
                    _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("AddDocumentToDocumentSet({0},{1}) Document already added to Document Set", doc_id, document_set_Id));
                    throw _exception;
                }
            }

            using (var transaction = _context.Database.BeginTransaction())
            {
                foreach (var doc_id in documents_Ids)
                {
                    DocumentSet_Document doc_doc_set = new DocumentSet_Document
                    {
                        DocumentId = doc_id,
                        DocumentSetId = document_set_Id
                    };
                    _context.DocumentSet_Document.Add(doc_doc_set);
                }
                _context.SaveChanges();
                transaction.Commit();
            }
        }
        public void RemoveDocumentFromDocumentSet(int document_Id, int document_set_Id)
        {
            if (!_context.DocumentSet_Document.Any(p => p.DocumentId == document_Id && p.DocumentSetId == document_set_Id))
            {
                _exception.AttributeMessages.Add(_localizer["Document Set Does Not Contain Document"]);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("RemoveDocumentFromDocumentSet({0},{1}) Document Set Does Not Contain Document", document_Id, document_set_Id));
                throw _exception;
            }
            _context.DocumentSet_Document.Remove(_context.DocumentSet_Document.Single(p => p.DocumentId == document_Id && p.DocumentSetId == document_set_Id));
            _context.SaveChanges();
        }
        public void AddRecursiveDocumentSet(int Parent_documentSet_Id, int child_documentSet_Id)
        {
            if(!_context.DocumentSet.Any(e=>e.ID==Parent_documentSet_Id))
            {
                _exception.AttributeMessages.Add(_localizer["Parent Document Set NOT FOUND"]);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("AddRecursiveDocumentSet({0},{1}) document set not found", Parent_documentSet_Id, child_documentSet_Id));
                throw _exception;
            }
            if(!_context.DocumentSet.Any(e=>e.ID==child_documentSet_Id))
            {
                _exception.AttributeMessages.Add(_localizer["Child Document Set NOT FOUND"]);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("AddRecursiveDocumentSet({0},{1}) document set not found", Parent_documentSet_Id, child_documentSet_Id));
                throw _exception;
            }
            List<int> all = new List<int>();
            getAttachedDocSets(Parent_documentSet_Id, all);
            getParents(Parent_documentSet_Id, all);
            all.Add(Parent_documentSet_Id);
            if (all.Contains(child_documentSet_Id))
            {
                _exception.AttributeMessages.Add(_localizer["Child Document Set already Added to Parent Document Set"]);
                _logger.LogError(LoggingEvents.ListItems, String.Format("AddRecursiveDocumentSet({0},{1}) document set already added to the document set", Parent_documentSet_Id, child_documentSet_Id));
                throw _exception;
            }
            RecursiveDocumentSet rec_doc_set = new RecursiveDocumentSet();
            rec_doc_set.ParentDocumentSetId = Parent_documentSet_Id;
            rec_doc_set.ChildDocumentSetId = child_documentSet_Id;
            _context.RecursiveDocumentSet.Add(rec_doc_set);
            //_logger.LogInformation(LoggingEvents.InsertItem, "AddRecursiveDocumentSet({Parent_documentSet_Id},{child_documentSet_Id}) document set added to the document set succcessfully");
            _context.SaveChanges();
        }
        public void RemoveDocumentSetFromDocumentSet(int Parent_documentSet_Id, int child_documentSet_Id)
        {
            if (!_context.RecursiveDocumentSet.Any(p => p.ParentDocumentSetId == Parent_documentSet_Id && p.ChildDocumentSetId == child_documentSet_Id))
            {
                _exception.AttributeMessages.Add(_localizer["Parent Document Set Does not Contain Child Document Set"]);
                _logger.LogError(LoggingEvents.ListItems, String.Format("RemoveDocumentSetFromDocumentSet({0},{1}) Parent Document Set Does not Contain Child Document Set", Parent_documentSet_Id, child_documentSet_Id));
                throw _exception;
            }
            _context.RecursiveDocumentSet.Remove(_context.RecursiveDocumentSet.Single(p => p.ParentDocumentSetId == Parent_documentSet_Id && p.ChildDocumentSetId == child_documentSet_Id));
            _context.SaveChanges();
        }

        /// <summary>
        ///      Helper function to get all parents of a document set.
        /// </summary>
        /// <param name="documentSetId">The document set id</param>
        /// <param name="all">list Output of all id's of the parents</param>
        private void getParents(int documentSetId, List<int> all)
        {
            List<RecursiveDocumentSet> list = _context.RecursiveDocumentSet.Where(p => p.ChildDocumentSetId == documentSetId).ToList();
            foreach (var x in list)
            {
                all.Add(x.ParentDocumentSetId);
                getParents(x.ParentDocumentSetId, all);
            }
        }

        /// <summary>
        ///     Helper function to get all recursive document sets.
        /// </summary>
        /// <param name="documentSetId">The parent document set id</param>
        /// <param name="all">Output list of all recursive document set id's</param>
        private void getAttachedDocSets(int documentSetId, List<int> all)
        {
            List<RecursiveDocumentSet> list = _context.RecursiveDocumentSet.Where(p => p.ParentDocumentSetId == documentSetId).ToList();
            foreach (var x in list)
            {
                all.Add(x.ChildDocumentSetId);
                getAttachedDocSets(x.ChildDocumentSetId, all);
            }
        }

        public IEnumerable<DocumentSetGetDTO> GetRootSets()
        {
            List<DocumentSet> documentSets = _context.DocumentSet.Include(ds => ds.User).ToList();
            List<DocumentSetGetDTO> rootSets = new List<DocumentSetGetDTO>();
            foreach(var set in documentSets)
            {
                if(!_context.RecursiveDocumentSet.Any(p=>p.ChildDocumentSetId==set.ID))
                {
                    rootSets.Add(DocumentSetGetDTO.GetDTO(set));
                }
            }
            return rootSets;
        }

        public DocumentSetGetDTO GetDocumentSetByName(string name)
        {
            if (!_exception.checkNames(name))
            {
                _exception.AttributeMessages.Add(_localizer["Document Set Name is NULL or Empty"]);
                _logger.LogError(LoggingEvents.InsertItem, String.Format("GetDocumentSetByName({0}) INVALID ENTRY ERROR", name));
                throw _exception;
            }
            if (!_context.DocumentSet.Any(p => p.Name == name))
            {
                _exception.AttributeMessages.Add(_localizer["Document Set NOT FOUND"]);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("GetDocumentSetByName({0}) NOT FOUND", name));
                throw _exception;
            }
            DocumentSet docSet = _context.DocumentSet.Where(e => e.Name == name).Include(ds => ds.User).Single();
            return DocumentSetGetDTO.GetDTO(docSet);
        }
        public IEnumerable<DocumentSetGetDTO> GetAllSetsExcludingSetsOfParent(int Parent_documentSet_Id)
        {
            if (!_context.DocumentSet.Any(p => p.ID == Parent_documentSet_Id))
            {
                _exception.AttributeMessages.Add(_localizer["Document Set NOT FOUND"]);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("GetAllSetsExcludingSetsOfParent({0}) NOT FOUND", Parent_documentSet_Id));
                throw _exception;
            }
            List<int> all = new List<int>();
            getAttachedDocSets(Parent_documentSet_Id, all);
            getParents(Parent_documentSet_Id, all);
            all.Add(Parent_documentSet_Id);

            var result = _context.DocumentSet.Where(e => !all.Contains(e.ID)).Include(ds => ds.User).ToList();
            List<DocumentSetGetDTO> finalResult = new List<DocumentSetGetDTO>();
            foreach (var set in result)
            {
                finalResult.Add(DocumentSetGetDTO.GetDTO(set));
            }
            return finalResult;
        }
    }
}
