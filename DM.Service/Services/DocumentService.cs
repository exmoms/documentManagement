using DM.Domain.Enums;
using DM.Domain.Models;
using DM.Repository.Contexts;
using DM.Service.Interface;
using DM.Service.Interfaces;
using DM.Service.ServiceModels;
using DM.Service.ServiceModels.DocumentDTO;
using DM.Service.ServiceModels.MailModels;
using DM.Service.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace DM.Service.Services
{
    public class DocumentService : IDocumentService
    {
        private DocumentDBContext _context;
        private ValidatorException _exception;
        private readonly ILogger _logger;
        private readonly IStringLocalizer<DocumentService> _localizer;
        private readonly IMailService _mailService;
        private readonly IUserInformationService _userInformationService;

        public DocumentService(DocumentDBContext context, ILogger<DocumentService> logger, IStringLocalizer<DocumentService> localizer, IMailService mailService, IUserInformationService userInformationService)
        {
            _context = context;
            _exception = new ValidatorException();
            _logger = logger;
            _localizer = localizer;
            _mailService = mailService;
            _userInformationService = userInformationService;
        }

        public IEnumerable<DocumentGetDTO> GetDocuments()
        {
            List<Document> list = _context.Document.Include(d => d.MetaDataModel).Include(d=>d.LatestDocumentVersion).ThenInclude(dv=>dv.User).ToList();
            List<DocumentGetDTO> result = new List<DocumentGetDTO>();
            foreach (var doc in list)
            {
                DocumentGetDTO dto = DocumentGetDTO.GetDTO(doc);
                result.Add(dto);
            }
            return result;
        }

        public DocumentVersionGetDTO GetDocumentVersionById(int id)
        {
            CheckIfVersionIsExisted(id);
            DocumentVersion version = _context.DocumentVersion.Where(v => v.ID == id).Include(dv=>dv.User).Single();

            getVersionValues(version);
            getVersionChildren(version);
            getVersionScans(version);


            //_logger.LogInformation(LoggingEvents.GetItem, "GetDocumentVersionById({id}) fetched", id);
            return DocumentVersionGetDTO.GetDTO(version);
        }

        public void AddDocument(DocumentPostDTO documentDTO)
        {
            CheckIfMetaDataModelIsExisted(documentDTO.MetadataModelId);
            ValidateAggregationForNewDocument(documentDTO);
            ValidateValuesForNewDocument(documentDTO);
            ValidateDocumentScan(documentDTO);
            ValidateRequiredAttachment(documentDTO);


            using (var transaction = _context.Database.BeginTransaction())
            {
                Document d = documentDTO.GetEntity();
                d.Name = GetMetaDataModelNameById(documentDTO.MetadataModelId) + DateTime.UtcNow.Ticks;
                d.DocumentVersions[0].UserId = _userInformationService.GetUserID();
                d.IsArchived = false; // needs update;
                _context.Document.Add(d);
                _context.SaveChanges();
                DocumentVersion latest_version = _context.DocumentVersion.Where(e => e.DocumentId == d.ID).OrderByDescending(e => e.ID).FirstOrDefault();
                d.LatestVersionId = latest_version.ID;
                _context.Update(d);
                _context.SaveChanges();
                //_logger.LogInformation(LoggingEvents.InsertItem, "AddDocument({documentDTO}) Document Added", documentDTO);
                transaction.Commit();
            }
        }

        public IEnumerable<DocumentGetDTO> GetDocumentsByMetaDataModel(int metaDataModelId)
        {
            CheckIfMetaDataModelIsExisted(metaDataModelId);
            List<Document> list = _context.Document.Where(e => e.MetaDataModelId == metaDataModelId).Include(d => d.LatestDocumentVersion).ThenInclude(dv => dv.User).ToList();
            List<DocumentGetDTO> result = new List<DocumentGetDTO>();
            foreach (var doc in list)
            {
                DocumentGetDTO dto = DocumentGetDTO.GetDTO(doc);
                result.Add(dto);
            }
            //_logger.LogInformation(LoggingEvents.ListItems, "GetDocumentByMetaDataModel({metaDataModels}) ITEMS LISTED", metaDataModel);
            return result;
        }

        public DocumentGetDTO GetLastDocumnetByUserAndMetadataModel(int userId, int metaDataModelId)
        {
            CheckIfMetaDataModelIsExisted(metaDataModelId);
            DocumentGetDTO res = new DocumentGetDTO();
            var docVersion = _context.DocumentVersion.Where(a => a.UserId == userId).Include(a => a.Document).Where(d => d.Document.MetaDataModelId == metaDataModelId).OrderByDescending(a => a.AddedDate).FirstOrDefault();
            if (docVersion != null)
            {
                getVersionValues(docVersion);
                res = GetDocumentByVersionId(docVersion.ID);
            }
            return res;
        }

        public int UpdateVersion(DocumentVersionPostDTO  documentVersionDTO, bool updateParentsRecursive = true)
        {

            CheckIfDocumentIsExisted(documentVersionDTO.DocumentId);
            Document d = _context.Document.Include(d=>d.LatestDocumentVersion).ThenInclude(dv=>dv.User).Single(e => e.ID == documentVersionDTO.DocumentId);

            int currentVersionId = (int)d.LatestVersionId;


            DocumentVersion CurrentVersion = new DocumentVersion();
            CurrentVersion.DocumentId = d.ID;
            CurrentVersion.ID = currentVersionId;
            CurrentVersion.User = d.LatestDocumentVersion.User;
            getVersionValues(CurrentVersion);
            getVersionChildren(CurrentVersion);
            getVersionScans(CurrentVersion);
            DocumentVersionGetDTO CurrentVersionDTO = DocumentVersionGetDTO.GetDTO(CurrentVersion);

            if (documentVersionDTO.Values != null && CurrentVersionDTO.Values != null)
            {
                documentVersionDTO.Values.RemoveAll(value =>
                    CurrentVersionDTO.Values.Find(v => v.AttributeId == value.AttributeId && object.Equals(v.Value, value.Value)) != null
                );

            }

            if (documentVersionDTO.ChildrenDocuments != null && CurrentVersionDTO.ChildrenDocuments != null)
            {
                documentVersionDTO.ChildrenDocuments.RemoveAll(value =>
                    CurrentVersionDTO.ChildrenDocuments.Find(v => v.AggregateMetaDataModelID == value.AggregateMetaDataModelID && v.ChildDocumentVersionId == value.ChildDocumentVersionId) != null
                );

            }
            if ((documentVersionDTO.Values == null || documentVersionDTO.Values.Count == 0)
                && (documentVersionDTO.ChildrenDocuments == null || documentVersionDTO.ChildrenDocuments.Count == 0)
                && (documentVersionDTO.DocumentScans == null || documentVersionDTO.DocumentScans.Count == 0))
            {
                _logger.LogError(LoggingEvents.InsertItem, String.Format("UpdateVersion({0}) no Changes were made.", documentVersionDTO));
                return currentVersionId;
            }

            ValidateAggregationForUpdate(documentVersionDTO.ChildrenDocuments, documentVersionDTO.DocumentId);
            ValidateValuesForUpdate(documentVersionDTO.Values, documentVersionDTO.DocumentId);

            using (var transaction = _context.Database.BeginTransaction())
            {

                DocumentVersion new_version = documentVersionDTO.GetEntity();
                new_version.UserId = _userInformationService.GetUserID();

                _context.DocumentVersion.Add(new_version);
                _context.SaveChanges();

                if (documentVersionDTO.Values != null)
                {
                    foreach (var value in documentVersionDTO.Values)
                    {
                        if (value.TypeId == (int)DATA_TYPES.BOOL)
                        {
                            foreach (var oldValue in CurrentVersion.BoolValues)
                            {
                                if (oldValue.MetaDataAttributeId == value.AttributeId && oldValue.MaxDocumentVersionId == null)
                                {
                                    oldValue.MaxDocumentVersionId = new_version.ID;
                                    _context.Update(oldValue);
                                }
                            }

                            continue;
                        }

                        if (value.TypeId == (int)DATA_TYPES.DATE)
                        {
                            foreach (var oldValue in CurrentVersion.DateValues)
                            {
                                if (oldValue.MetaDataAttributeId == value.AttributeId && oldValue.MaxDocumentVersionId == null)
                                {
                                    oldValue.MaxDocumentVersionId = new_version.ID;
                                    _context.Update(oldValue);
                                }
                            }

                            continue;
                        }

                        if (value.TypeId == (int)DATA_TYPES.DECIMAL)
                        {
                            foreach (var oldValue in CurrentVersion.DecimalValues)
                            {
                                if (oldValue.MetaDataAttributeId == value.AttributeId && oldValue.MaxDocumentVersionId == null)
                                {
                                    oldValue.MaxDocumentVersionId = new_version.ID;
                                    _context.Update(oldValue);
                                }
                            }

                            continue;
                        }

                        if (value.TypeId == (int)DATA_TYPES.DOUBLE)
                        {
                            foreach (var oldValue in CurrentVersion.DoubleValues)
                            {
                                if (oldValue.MetaDataAttributeId == value.AttributeId && oldValue.MaxDocumentVersionId == null)
                                {
                                    oldValue.MaxDocumentVersionId = new_version.ID;
                                    _context.Update(oldValue);
                                }
                            }

                            continue;
                        }

                        if (value.TypeId == (int)DATA_TYPES.INTEGER)
                        {
                            foreach (var oldValue in CurrentVersion.IntValues)
                            {
                                if (oldValue.MetaDataAttributeId == value.AttributeId && oldValue.MaxDocumentVersionId == null)
                                {
                                    oldValue.MaxDocumentVersionId = new_version.ID;
                                    _context.Update(oldValue);
                                }
                            }

                            continue;
                        }

                        if (value.TypeId == (int)DATA_TYPES.STRING)
                        {
                            foreach (var oldValue in CurrentVersion.StringValues)
                            {
                                if (oldValue.MetaDataAttributeId == value.AttributeId && oldValue.MaxDocumentVersionId == null)
                                {
                                    oldValue.MaxDocumentVersionId = new_version.ID;
                                    _context.Update(oldValue);
                                }
                            }

                            continue;
                        }

                    }
                }

                if (documentVersionDTO.ChildrenDocuments != null)
                {
                    foreach (var child in documentVersionDTO.ChildrenDocuments)
                    {
                        foreach (var oldChild in CurrentVersion.ChildDocumentVersions)
                        {
                            if (oldChild.AggregateMetaDataModelID == child.AggregateMetaDataModelID && oldChild.MaxParentDocumentVersionId == null)
                            {
                                oldChild.MaxParentDocumentVersionId = new_version.ID;
                                _context.Update(oldChild);
                            }
                        }
                    }
                }

                if(documentVersionDTO.DocumentScans != null)
                {
                    foreach(var scan in CurrentVersion.DocumnetScans)
                    {
                        scan.MaxDocumentVersionId = new_version.ID;
                        _context.Update(scan);
                    }
                }


                d.LatestVersionId = new_version.ID;
                _context.Update(d);
                _context.SaveChanges();

                if (updateParentsRecursive)
                {
                    UpdateParentVersionRecursive(currentVersionId, new_version.ID);
                }
                transaction.Commit();
            }

            return (int)d.LatestVersionId;
        }


        public void SoftDeleteDocument(int id)
        {
            CheckIfDocumentIsExisted(id);
            Document doc = _context.Document.Where(d => d.ID == id).Single();

            if (doc.DeletedDate != null)
            {
                _exception.AttributeMessages.Add(_localizer["Document Deleted Before"]);
                _logger.LogError(LoggingEvents.UpdateItem, String.Format("SoftDeleteDocument({0}) Document deleted before.", id));
                throw _exception;
            }

            doc.DeletedDate = System.DateTime.Now;
            _context.Update(doc);
            List<DocumentVersion> list_of_versions = _context.DocumentVersion.Where(e => e.DocumentId == id).ToList();
            foreach (var ver in list_of_versions)
            {
                ver.DeletedDate = doc.DeletedDate;
                _context.Update(ver);
            }

            _context.SaveChanges();
        }

        public void AddAttachment(AttachmentPostDTO attachmentDTO)
        {

            if (!_context.Document.Any(e => e.ID == attachmentDTO.DocumentId))
            {
                _exception.AttributeMessages.Add(_localizer["Document NOT FOUND "] + attachmentDTO.DocumentId);
                _logger.LogError(LoggingEvents.InsertItem, String.Format("AddAttachment({0}) Document NOT FOUND", attachmentDTO));
                throw _exception;
            }
            
            if (_context.Attachment.Any(e => e.Name == attachmentDTO.Name && e.DocumentId == attachmentDTO.DocumentId))
            {
                _exception.AttributeMessages.Add(_localizer["Attachment Name Existed Before "]+ attachmentDTO.Name);
                _logger.LogError(LoggingEvents.InsertItem, String.Format("AddAttachment({0}) Attachment existed before", attachmentDTO));
                throw _exception;
            }


            if (attachmentDTO.CompoundModelId != null)
            {
                if (_context.Attachment.Any(e => e.DocumentId == attachmentDTO.DocumentId && e.CompoundModelID == attachmentDTO.CompoundModelId))
                {
                    _exception.AttributeMessages.Add(_localizer["Attachment Compound Model Id Existed Before"]);
                    _logger.LogError(LoggingEvents.DeleteItem, String.Format("AddAttachment({0}) Attachment existed before", attachmentDTO));
                    throw _exception;
                }
            }

            if(attachmentDTO.AttachmentFile == null || attachmentDTO.AttachmentFile.Length == 0)
            {
                _exception.AttributeMessages.Add(_localizer["Invalid File"]);
                _logger.LogError(LoggingEvents.DeleteItem, String.Format("AddAttachment({0}) Invalid File", attachmentDTO));
                throw _exception;
            }

            _context.Attachment.Add(attachmentDTO.GetEntity());
            _context.SaveChanges();
        }

        public void DeleteAttachment(int attachmentId)
        {

            Attachment originalAttachment = _context.Attachment.Where(p => p.ID == attachmentId).Include(p => p.CompoundModel).SingleOrDefault();
            if (originalAttachment == null)
            {
                _exception.AttributeMessages.Add(_localizer["Attachment NOT FOUND"]);
                _logger.LogError(LoggingEvents.DeleteItem, String.Format("DeleteAttachmentFromDocument({0}) Attachment NOT FOUND", attachmentId));
                throw _exception;
            }

            if (originalAttachment.CompoundModelID != null)
            {
                if (originalAttachment.CompoundModel.IsRequired == true)
                {
                    _exception.AttributeMessages.Add(_localizer["Attachment Is Required"]);
                    _logger.LogError(LoggingEvents.DeleteItem, String.Format("DeleteAttachmentFromDocument({0}) Attachment Is required", attachmentId));
                    throw _exception;
                }
            }
            _context.Attachment.Remove(originalAttachment);
            _context.SaveChanges();
        }

        public void UpdateAttachment(AttachmentPostDTO attachmentDTO)
        {

            Attachment originalAttachment = _context.Attachment.Where(a => a.ID == attachmentDTO.Id).SingleOrDefault();

            if (originalAttachment == null)
            {
                _exception.AttributeMessages.Add(_localizer["Attachment NOT FOUND"]);
                _logger.LogError(LoggingEvents.DeleteItem, String.Format("DeleteAttachmentFromDocument({0},{1}) Attachment NOT FOUND", attachmentDTO, attachmentDTO.Id));
                throw _exception;
            }

            if (originalAttachment.Name != attachmentDTO.Name)
            {
                if (!_exception.checkNames(attachmentDTO.Name))
                {
                    _exception.AttributeMessages.Add(_localizer["Attachment Name Is Null Or Empty"]);
                    _logger.LogError(LoggingEvents.InsertItem, String.Format("AddAttachment({0}) Name is Invalid", attachmentDTO));
                    throw _exception;
                }

                if (_context.Attachment.Any(e => e.Name == attachmentDTO.Name && e.DocumentId == attachmentDTO.DocumentId))
                {
                    _exception.AttributeMessages.Add(_localizer["Attachment Name Existed Before "] + attachmentDTO.Name);
                    _logger.LogError(LoggingEvents.InsertItem, String.Format("AddAttachment({0}) Attachment existed before", attachmentDTO));
                    throw _exception;
                }

                originalAttachment.Name = attachmentDTO.Name;
            }

            originalAttachment.AttachmentFile = attachmentDTO.AttachmentFile;
            originalAttachment.ContentType = attachmentDTO.ContentType;
            originalAttachment.ModifiedDate = System.DateTime.Now;

            _context.Attachment.Update(originalAttachment);
            _context.SaveChanges();
        }

        public AttachmentGetDTO GetAttachmentById(int id)
        {
            if (!_context.Attachment.Any(e => e.ID == id))
            {
                _exception.AttributeMessages.Add(_localizer["Attachment NOT FOUND"]);
                _logger.LogError(LoggingEvents.GetItem, String.Format("GetAttachmentById({0}) Attachment not found", id));
                throw _exception;
            }
            Attachment attachment = _context.Attachment.Single(e => e.ID == id);
            //_logger.LogInformation(LoggingEvents.GetItem, "GetAttachmentById({id}) Attachment fetched", id);
            return AttachmentGetDTO.GetDTO(attachment);
        }

        public IEnumerable<AttachmentGetDTO> GetAttachmentsByDocumentId(int id)
        {
            if (!_context.Document.Any(e => e.ID == id))
            {
                _exception.AttributeMessages.Add(_localizer["Document NOT FOUND"]);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("GetAttachmentsByDocumentId({0}) Document not found", id));
                throw _exception;
            }
            List<Attachment> attachment_list = _context.Attachment.Where(a => a.DocumentId == id).Include(a => a.CompoundModel).ToList();
            List<AttachmentGetDTO> attachmentDTO_list = new List<AttachmentGetDTO>();
            foreach (var attachment in attachment_list)
            {
                AttachmentGetDTO attachmentsDTO = AttachmentGetDTO.GetDTO(attachment);
                attachmentDTO_list.Add(attachmentsDTO);
            }
            //_logger.LogInformation(LoggingEvents.ListItems, "GetAttachments() all attachments were fetched.");
            return attachmentDTO_list;
        }

        private int GetDataTypeByAttributeId(int attributeId)
        {
            return _context.MetaDataAttribute.Where(a => a.ID == attributeId).Select(a => a.DataTypeID).Single();
        }

        private string GetMetaDataModelNameById(int id)
        {
            return _context.MetaDataModel.Where(m => m.ID == id).Select(m => m.MetaDataModelName).Single();
        }

        public DocumentGetDTO GetDocumentByVersionId(int versionId)
        {
            if (!_context.DocumentVersion.Any(e => e.ID == versionId))
            {
                _exception.AttributeMessages.Add(_localizer["Document Version NOT FOUND"]);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("GetDocumentByVersionId({0}) Document not found", versionId));
                throw _exception;
            }
            int documentId = _context.DocumentVersion.Where(v => v.ID == versionId).Select(V => V.DocumentId).Single();
            Document doc = _context.Document.Where(d => d.ID == documentId).Include(d => d.MetaDataModel).Include(d => d.Attachments).ThenInclude(a => a.CompoundModel).Include(d => d.LatestDocumentVersion).ThenInclude(dv => dv.User).Single();
            return DocumentGetDTO.GetDTO(doc);
        }

        private void UpdateParentVersionRecursive(int oldVersionId, int newVerionId)
        {
            List<AggregateDocument> aggs = _context.AggregateDocument.Where(a => a.ChildDocumentVersionId == oldVersionId)
                                        .Include(a => a.MinParentDocumentVersion).ToList();

            foreach (var agg in aggs)
            {
                if (agg.MaxParentDocumentVersionId != null)
                    continue;

                AggregateDocument newAgg = new AggregateDocument();
                newAgg.ChildDocumentVersionId = newVerionId;
                newAgg.AggregateMetaDataModelID = agg.AggregateMetaDataModelID;

                DocumentVersion newVersion = new DocumentVersion();
                newVersion.ChildDocumentVersions = new List<AggregateDocument>();
                newVersion.ChildDocumentVersions.Add(newAgg);
                newVersion.DocumentId = agg.MinParentDocumentVersion.DocumentId;
                newVersion.VersionMessage = "updated according to the update of document version" + oldVersionId + " to " + newVerionId;

                newVersion.UserId = _userInformationService.GetUserID();

                _context.DocumentVersion.Add(newVersion);
                _context.SaveChanges();

                agg.MaxParentDocumentVersionId = newVersion.ID;
                _context.AggregateDocument.Update(agg);

                Document parentDocument = _context.Document.Where(d => d.ID == agg.MinParentDocumentVersion.DocumentId).Single();
                int oldParentVerions = (int)parentDocument.LatestVersionId;

                parentDocument.LatestVersionId = newVersion.ID;
                _context.Document.Update(parentDocument);
                _context.SaveChanges();

                UpdateParentVersionRecursive(oldParentVerions, newVersion.ID);

            }

        }

        private void getVersionValues(DocumentVersion version)
        {
            version.StringValues = _context.StringValue.Where(s => s.MinDocumentVersionId <= version.ID &&
                                                                    (!s.MaxDocumentVersionId.HasValue || s.MaxDocumentVersionId > version.ID))
                                    .Include(s => s.DocumentVersion).Where(v => v.DocumentVersion.DocumentId == version.DocumentId)
                                    .Include(d => d.MetaDataAttribute).ToList();
            version.DateValues = _context.DateValue.Where(s => s.MinDocumentVersionId <= version.ID &&
                                                                    (!s.MaxDocumentVersionId.HasValue || s.MaxDocumentVersionId > version.ID))
                                    .Include(s => s.DocumentVersion).Where(v => v.DocumentVersion.DocumentId == version.DocumentId)
                                    .Include(d => d.MetaDataAttribute).ToList();
            version.DoubleValues = _context.DoubleValue.Where(s => s.MinDocumentVersionId <= version.ID &&
                                                                    (!s.MaxDocumentVersionId.HasValue || s.MaxDocumentVersionId > version.ID))
                                    .Include(s => s.DocumentVersion).Where(v => v.DocumentVersion.DocumentId == version.DocumentId)
                                    .Include(d => d.MetaDataAttribute).ToList();
            version.DecimalValues = _context.DecimalValue.Where(s => s.MinDocumentVersionId <= version.ID &&
                                                                    (!s.MaxDocumentVersionId.HasValue || s.MaxDocumentVersionId > version.ID))
                                    .Include(s => s.DocumentVersion).Where(v => v.DocumentVersion.DocumentId == version.DocumentId)
                                    .Include(d => d.MetaDataAttribute).ToList();
            version.IntValues = _context.IntValue.Where(s => s.MinDocumentVersionId <= version.ID &&
                                                                    (!s.MaxDocumentVersionId.HasValue || s.MaxDocumentVersionId > version.ID))
                                    .Include(s => s.DocumentVersion).Where(v => v.DocumentVersion.DocumentId == version.DocumentId)
                                    .Include(d => d.MetaDataAttribute).ToList();
            version.BoolValues = _context.BoolValue.Where(s => s.MinDocumentVersionId <= version.ID &&
                                                                    (!s.MaxDocumentVersionId.HasValue || s.MaxDocumentVersionId > version.ID))
                                    .Include(s => s.DocumentVersion).Where(v => v.DocumentVersion.DocumentId == version.DocumentId)
                                    .Include(d => d.MetaDataAttribute).ToList();
        }

        private void getVersionChildren(DocumentVersion version)
        {
            version.ChildDocumentVersions = _context.AggregateDocument
                                            .Where(d => d.MinParentDocumentVersionId <= version.ID && (!d.MaxParentDocumentVersionId.HasValue || d.MaxParentDocumentVersionId > version.ID))
                                            .Include(d => d.MinParentDocumentVersion).Where(d => d.MinParentDocumentVersion.DocumentId == version.DocumentId)
                                            .Include(d => d.AggregateMetaDataModel).Include(m => m.ChildDocumentVersion).ThenInclude(d => d.Document).ToList();
        }

        private void getVersionScans(DocumentVersion version)
        {
            version.DocumnetScans = _context.DocumentScan.Where(s => s.MinDocumentVersionId <= version.ID && (!s.MaxDocumentVersionId.HasValue || s.MaxDocumentVersionId > version.ID)).Include(s => s.DocumentVersion).Where(s => s.DocumentVersion.DocumentId == version.DocumentId).ToList();
        }


        public void ConvertJsonElementsToValue(List<ValueDTO> values)
        {
            if (values == null)
                return;
            foreach (var value in values)
            {
                int typeId = GetDataTypeByAttributeId(value.AttributeId);
                value.TypeId = typeId;
                JsonElement val = (JsonElement)value.Value;
                switch (typeId)
                {
                    case (int)DATA_TYPES.BOOL:
                        value.Value = val.GetBoolean();
                        break;
                    case (int)DATA_TYPES.DATE:
                        value.Value = val.GetDateTime();
                        break;
                    case (int)DATA_TYPES.DECIMAL:
                        value.Value = val.GetDecimal();
                        break;
                    case (int)DATA_TYPES.DOUBLE:
                        value.Value = val.GetDouble();
                        break;
                    case (int)DATA_TYPES.INTEGER:
                        value.Value = val.GetInt32();
                        break;
                    case (int)DATA_TYPES.STRING:
                        value.Value = val.GetString();
                        break;
                    default:
                        value.Value = null;
                        break;
                }

            }

        }


        public void ArchiveDocument(int docId)
        {
            Document d = _context.Document.Where(e => e.ID == docId).Single();
            if (d.IsArchived)
            {
                _exception.AttributeMessages.Add(_localizer["Document Already Archived"]);
                _logger.LogError(LoggingEvents.UpdateItem, String.Format("ArchiveDocument({0}) Document already archived.", docId));
                throw _exception;
            }
            d.IsArchived = true;
            _context.Update(d);
            _context.SaveChanges();
        }

        public void UnArchiveDocument(int docId)
        {
            Document d = _context.Document.Where(e => e.ID == docId).Single();
            if (!d.IsArchived)
            {
                _exception.AttributeMessages.Add(_localizer["Document Is Not Archived"]);
                _logger.LogError(LoggingEvents.UpdateItem, String.Format("ArchiveDocument({0}) Document is not archived.", docId));
                throw _exception;
            }
            d.IsArchived = false;
            _context.Update(d);
            _context.SaveChanges();
        }

        public DocumentScanDTO GetDocumentScanById(int id)
        {
            DocumentScan scan = _context.DocumentScan.Where(s => s.Id == id).Single();

            return DocumentScanDTO.GetDTO(scan);
        }

        public byte[] GetAttachmentImgById(int id, out string contentType)
        {
            Attachment a = _context.Attachment.Where(s => s.ID == id).Single();
            contentType = a.ContentType;
            return a.AttachmentFile;
        }

        private void CheckIfVersionIsExisted(int id)
        {
            if (!_context.DocumentVersion.Any(e => e.ID == id))
            {
                _exception.AttributeMessages.Add(_localizer["Document Version NOT FOUND"]);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("GetDocumentVersionById({0}) NOT FOUND ERROR", id));
                throw _exception;
            }
        }

        private void CheckIfDocumentIsExisted(int id)
        {
            if (!_context.Document.Any(e => e.ID == id))
            {
                _exception.AttributeMessages.Add(_localizer["Document NOT FOUND"]);
                _logger.LogError(LoggingEvents.UpdateItem, String.Format("UpdateVersion({0}) Document not found.", id));
                throw _exception;
            }
        }

        private void CheckIfMetaDataModelIsExisted(int id)
        {
            if (!_context.MetaDataModel.Any(e => e.ID == id))
            {
                _exception.AttributeMessages.Add(_localizer["Metadata NOT FOUND"]);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("AddDocument({0}) Metadata Not Found ERROR", id));
                throw _exception;
            }
        }

        private void ValidateAggregationForNewDocument(DocumentPostDTO doc)
        {
            var aggList = _context.AggregateMetaDataModel.Where(a => a.ParentMetadataModelId == doc.MetadataModelId).ToList();

            if (aggList.Count > 0 && (doc.DocumentVersion == null || doc.DocumentVersion.ChildrenDocuments == null))
            {
                _exception.AttributeMessages.Add(_localizer["Children NOT FOUND"]);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("AddDocument({0}) Children Not Found", doc));
                throw _exception;
            }

            if (aggList.Count == 0 && doc.DocumentVersion != null && doc.DocumentVersion.ChildrenDocuments != null
                    && doc.DocumentVersion.ChildrenDocuments.Count != 0)
            {
                _exception.AttributeMessages.Add(_localizer["Metadata Model Has No Children"]);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("AddDocument({0}) Model has no Child", doc));
                throw _exception;
            }

            foreach (var agg in aggList)
            {
                var children = doc.DocumentVersion.ChildrenDocuments.Where(a => a.AggregateMetaDataModelID == agg.ID).ToList();

                if (children.Count != 1)
                {
                    _exception.AttributeMessages.Add(_localizer["Aggregate Document Child Is Not Existed"]);
                    _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("AddDocument({0}) Child is not existed", doc));
                    throw _exception;
                }

                var child = children[0];

                if (!_context.DocumentVersion.Any(v => v.ID == child.ChildDocumentVersionId))
                {
                    _exception.AttributeMessages.Add(_localizer["Child Document Version Is Not Existed"]);
                    _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("AddDocument({0}) Child Version Is Not Existed", doc));
                    throw _exception;
                }

                int childModelId = _context.DocumentVersion.Where(v => v.ID == child.ChildDocumentVersionId).Include(v => v.Document)
                                    .Select(v => v.Document.MetaDataModelId).Single();

                if (childModelId != agg.ChildMetadataModelId)
                {
                    _exception.AttributeMessages.Add(_localizer["Wrong Child Metadata Model"]);
                    _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("AddDocument({0}) Wrong child", doc));
                    throw _exception;
                }
            }

        }

        private void ValidateDocumentScan(DocumentPostDTO doc)
        {
            if(doc.DocumentVersion == null || doc.DocumentVersion.DocumentScans == null || doc.DocumentVersion.DocumentScans.Count == 0)
            {
                _exception.AttributeMessages.Add(_localizer["Scan file is required"]);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("AddDocument({0}) scan is required", doc));
                throw _exception;
            }
        }

        private void ValidateRequiredAttachment(DocumentPostDTO doc)
        {
            var requitedAttachments = _context.CompoundModel.Where(c => c.IsRequired == true && c.MetaDataModel.ID == doc.MetadataModelId).ToList();

            if((doc.Attachments == null || doc.Attachments.Count == 0) && requitedAttachments.Count > 0)
            {
                _exception.AttributeMessages.Add(_localizer["Please add required attachments."]);
                _logger.LogError(LoggingEvents.InsertItem, String.Format("AddDocument({0}) required attachments", doc));
                throw _exception;
            }

            foreach(var item in requitedAttachments)
            {
                var found = doc.Attachments.Where(a => a.CompoundModelId == item.ID).SingleOrDefault();

                if(found == null)
                {
                    _exception.AttributeMessages.Add(_localizer["Please add required attachments."]);
                    _logger.LogError(LoggingEvents.InsertItem, String.Format("AddDocument({0}) required attachments", doc));
                    throw _exception;
                }
            }
        }

        private void ValidateValuesForNewDocument(DocumentPostDTO doc)
        {
            var attrList = _context.MetaDataAttribute.Where(a => a.MetaDataModelID == doc.MetadataModelId).ToList();
            bool hasRequired = attrList.AsQueryable().Any(a => a.IsRequired == true);

            if (hasRequired && (doc.DocumentVersion == null || doc.DocumentVersion.Values == null))
            {
                _exception.AttributeMessages.Add(_localizer["Null Values"]);
                _logger.LogError(LoggingEvents.InsertItem, String.Format("AddDocument({0}) Null Values", doc));
                throw _exception;
            }

            foreach (var attr in attrList)
            {
                if (attr.IsRequired)
                {
                    var values = doc.DocumentVersion.Values.Where(v => v.AttributeId == attr.ID).ToList();

                    if (values.Count != 1)
                    {
                        _exception.AttributeMessages.Add(_localizer["Required Value "]+attr.MetaDataAttributeName);
                        _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("AddDocument({0}) required Value", doc));
                        throw _exception;
                    }

                    var value = values[0];

                    if (value.Value == null)
                    {
                        _exception.AttributeMessages.Add(_localizer["Required Value"] + attr.MetaDataAttributeName);
                        _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("AddDocument({0}) required Value", doc));
                        throw _exception;
                    }

                }
                else
                {
                    var values = doc.DocumentVersion.Values.Where(v => v.AttributeId == attr.ID).ToList();

                    if (values.Count > 1)
                    {
                        _exception.AttributeMessages.Add(_localizer["More Than One Value For Attribute "] + attr.MetaDataAttributeName);
                        _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("AddDocument({0}) more than one Value for attribute", doc));
                        throw _exception;
                    }
                }
            }


            if (doc.DocumentVersion.Values != null)
            {
                foreach (var att in doc.DocumentVersion.Values)
                {                  
                    if (!attrList.Any(a => a.ID == att.AttributeId))
                    {
                       _exception.AttributeMessages.Add(_localizer["Attribute Id Does Not Belong To Model "] + att.AttributeId);
                        _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("AddDocument({0}) attribute does not belong to model", doc));
                        throw _exception;
                    }
                }
            }

        }

        private void ValidateAggregationForUpdate(List<AggregateDocumentDTO> children, int doc_id)
        {
            if (children == null)
                return;

            var doc = _context.Document.Where(e => e.ID == doc_id).Single();

            var aggList = _context.AggregateMetaDataModel.Where(a => a.ParentMetadataModelId == doc.MetaDataModelId).ToList();

            if (aggList.Count == 0 && children.Count != 0)
            {
                _exception.AttributeMessages.Add(_localizer["Metadata Model Has No Children "]+ doc.Name);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("UpdateVersion({0}) Model has no Child", doc));
                throw _exception;
            }

            int modelId = doc.MetaDataModelId;
            foreach (var child in children)
            {

                var childrenModelId = _context.DocumentVersion.Where(v => v.ID == child.ChildDocumentVersionId).Include(v => v.Document)
                    .Select(v => v.Document.MetaDataModelId).ToList();
                if (childrenModelId.Count() != 1)
                {
                    _exception.AttributeMessages.Add(_localizer["Child Version Is Not Existed"]);
                    _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("UpdateVersion({0}) Child Version Is Not existed", doc_id));
                    throw _exception;
                }

                var childModelId = childrenModelId[0];
                var agg = _context.AggregateMetaDataModel.Where(a => a.ID == child.AggregateMetaDataModelID).ToList();

                if (agg.Count() != 1 || agg.ElementAt(0).ParentMetadataModelId != modelId || agg.ElementAt(0).ChildMetadataModelId != childModelId)
                {
                    _exception.AttributeMessages.Add(_localizer["Wrong Aggregate Metadata Model ID "] + child.AggregateMetaDataModelID);
                    _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("UpdateVersion({0}) Wrong aggregate", doc_id));
                    throw _exception;
                }
                if (agg.ElementAt(0).ParentMetadataModelId != modelId || agg.ElementAt(0).ChildMetadataModelId != childModelId)
                {
                    _exception.AttributeMessages.Add(_localizer["Wrong Aggregate Metadata Model"] + agg.ElementAt(0).AggregateName);
                    _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("UpdateVersion({0}) Wrong aggregate", doc_id));
                    throw _exception;
                }
            }
        }
        private void ValidateValuesForUpdate(List<ValueDTO> values, int doc_id)
        {
            if (values == null)
                return;

            int modelId = _context.Document.Where(e => e.ID == doc_id).Select(e => e.MetaDataModelId).Single();

            var attrList = _context.MetaDataAttribute.Where(a => a.MetaDataModelID == modelId).ToList();

            foreach (var value in values)
            {
                if (!attrList.Any(a => a.ID == value.AttributeId))
                {
                    _exception.AttributeMessages.Add(_localizer["Attribute Id Does Not Belong To Model "] +  value.AttributeId);
                    _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("AddDocument({0}) attribute does not belong to model", doc_id));
                    throw _exception;
                }

                var attr = _context.MetaDataAttribute.Where(a => a.ID == value.AttributeId).Single();

                if (attr.MetaDataModelID != modelId)
                {
                    _exception.AttributeMessages.Add(_localizer["The Metadata Model Of The Attribute Is Not The Same As The Metadata Model Of The Document"]+ _context.MetaDataAttribute.Where(a => a.ID == value.AttributeId).Include(e=>e.MetaDataModel).ThenInclude(e=>e.MetaDataModelName));
                    _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("UpdateVersion({0}) Wrong value", doc_id));
                    throw _exception;
                }

                if (attr.IsRequired && value.Value == null)
                {
                    _exception.AttributeMessages.Add(_localizer["Required Value "]+attr.MetaDataAttributeName);
                    _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("UpdateVersion({0}) required value", doc_id));
                    throw _exception;
                }
            }
        }
        public IEnumerable<DocumentGetDTO> GetOrphanDocuments()
        {
            List<Document> documents = _context.Document.Include(d => d.LatestDocumentVersion).ThenInclude(dv => dv.User).ToList();
            List<Document> documentsInSets = _context.DocumentSet_Document.Select(e => e.Document).ToList();
            List<Document> OrphanDocs = documents.Except(documentsInSets).ToList();
            List<DocumentGetDTO> OrphanDocsDTO = new List<DocumentGetDTO>();
            foreach(var doc in OrphanDocs)
            {
                DocumentGetDTO dto = DocumentGetDTO.GetDTO(doc);
                OrphanDocsDTO.Add(dto);
            }
            return OrphanDocsDTO;
        }

        public List<dynamic> GetDocumentHistory(int docId)
        {
            if(!_context.Document.Any(d => d.ID == docId))
            {
                ValidatorException exception = new ValidatorException();
                exception.AttributeMessages.Add("Document not found");
                throw exception;
            }

            var versions =  _context.DocumentVersion.Where(v => v.DocumentId == docId).Include(v => v.Document).Include(dv=>dv.User)
                .Select(ver => new { ver.ID, ver.VersionMessage, ver.DocumentId, ver.Document.Name, ver.AddedDate, ver.User.UserName }).ToList();

            List<dynamic> result = new List<dynamic>();

            foreach(var ver in versions)
            {
                result.Add(new { VersionId = ver.ID, ver.VersionMessage, ver.DocumentId, DocumentName = ver.Name, ver.AddedDate, ver.UserName });
            }

            return result;
        }
        public void SendDocumentScansEmail(DocumentScanEmail mail)
        {
            if (mail == null)
                throw new ValidatorException();

            if (mail.DocumentVersionIds == null || mail.DocumentVersionIds.Count() == 0)
                throw new ValidatorException();

            if (mail.RecieverEmails == null || mail.RecieverEmails.Count() == 0)
                throw new ValidatorException();

            var emailConfig = _mailService.GetConfig();

            MimeMessage message = new MimeMessage();
            message.From.Add(new MailboxAddress(mail.SenderName, emailConfig.Email));
            message.Subject = mail.Subject;
            foreach (var rec in mail.RecieverEmails)
            {
                message.To.Add(new MailboxAddress(rec));
            }

            BodyBuilder bodyBuilder = new BodyBuilder();
            bodyBuilder.TextBody = mail.EmailBody;

            foreach (var id in mail.DocumentVersionIds)
            {
                int docId = _context.DocumentVersion.Where(v => v.ID == id).Select(v => v.DocumentId).Single();
                var scans = _context.DocumentScan.Where(s => s.MinDocumentVersionId <= id && (!s.MaxDocumentVersionId.HasValue || s.MaxDocumentVersionId > id) && s.DocumentVersion.Document.ID == docId).Select(s => new { s.DocumnetScan,s.ContentType,s.Name, DocName = s.DocumentVersion.Document.Name });

                foreach (var scan in scans)
                {
                    bodyBuilder.Attachments.Add(scan.DocName + "_" + scan.Name, scan.DocumnetScan, ContentType.Parse(scan.ContentType));
                }
            }

            message.Body = bodyBuilder.ToMessageBody();
            try
            {
                using (var client = new MailKit.Net.Smtp.SmtpClient())
                {
                    client.Connect(emailConfig.Server, emailConfig.Port, false);

                    client.Authenticate(emailConfig.Email, emailConfig.Password);

                    client.Send(message);
                    client.Disconnect(true);
                }
            }
            catch (Exception)
            {
                ValidatorException validatorException = new ValidatorException();
                validatorException.AttributeMessages.Add(_localizer["An error happened when trying to send the email, please report to the 'Admin'."]);
                throw validatorException;
            }
        }
        public List<dynamic> GetDocumentsScanByVersionIds(List<int> versionIds)
        {
            if (versionIds == null || versionIds.Count() == 0)
            {
                ValidatorException exception = new ValidatorException();
                exception.AttributeMessages.Add("No Documents selected");
                throw exception;
            }
                

            List<dynamic> result = new List<dynamic>();

            foreach (int versionId in versionIds)
            {
                int docId = _context.DocumentVersion.Where(v => v.ID == versionId).Select(v => v.DocumentId).SingleOrDefault();

                if(docId == 0)
                {
                    ValidatorException exception = new ValidatorException();
                    exception.AttributeMessages.Add("Invalid version id");
                    throw exception;
                }

                var scans = _context.DocumentScan.Where(s => s.MinDocumentVersionId <= versionId && (!s.MaxDocumentVersionId.HasValue || s.MaxDocumentVersionId > versionId)).Include(s => s.DocumentVersion).Where(s => s.DocumentVersion.DocumentId == docId).Select(s => s.Id).ToList();

                List<string> imgs = new List<string>();
                foreach(var scan in scans)
                {
                    imgs.Add(String.Format("/api/document/GetDocumentScan?imageId={0}", scan));
                }

                if(imgs.Count > 0)
                    result.Add(new { versionId, imgs });
            }

            return result;
        }
    }
}
