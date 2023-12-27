using DM.Domain.Models;
using DM.Repository.Contexts;
using DM.Service.Interfaces;
using DM.Service.ServiceModels;
using DM.Service.ServiceModels.DocumentClassDTO;
using DM.Service.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DM.Service.Services
{
    public class DocumentClassService : IDocumentClassService
    {
        private DocumentDBContext _context;
        ValidatorException _exception;
        private readonly ILogger _logger;
        private readonly IStringLocalizer<DocumentClassService> _localizer;
        private readonly IUserInformationService _userInformationService;

        public DocumentClassService(DocumentDBContext context, ILogger<DocumentClassService> logger,
                                    IStringLocalizer<DocumentClassService> localizer, IUserInformationService userInformationService)
        {
            _context = context;
            _exception = new ValidatorException();
            _logger = logger;
            _localizer = localizer;
            _userInformationService = userInformationService;
        }
        public IEnumerable<DocumentClassDTO> GetDocumentClasses()
        {
            List<DocumentClassDTO> result = new List<DocumentClassDTO>();
            List<DocumentClass> documentClasses = _context.DocumentClass.Include(dc=>dc.User).ToList();
            foreach (var docClass in documentClasses)
            {
                DocumentClassDTO docClassDTO = DocumentClassDTO.GetDTO(docClass);
                result.Add(docClassDTO);
            }
            //_logger.LogInformation(LoggingEvents.GetItem, "GetDocumentClasses() is called");
            return result;
        }
        public DocumentClassDTO GetDocumentClass(int documentClassId)
        {
            if (!_context.DocumentClass.Any(e => e.ID == documentClassId))
            {
                _exception.AttributeMessages.Add(_localizer["Document Class Not Found"]);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("GetDocumentClass({0}) NOT FOUND", documentClassId));
                throw _exception;
            }

            DocumentClass documentClass = _context.DocumentClass.Include(dc => dc.User).Single(p => p.ID == documentClassId);
            //_logger.LogInformation(LoggingEvents.GetItem, "GetDocumentClass({documentClassId}) is fetched", documentClassId);
            return DocumentClassDTO.GetDTO(documentClass);
        }
        public void AddDocumentClass(DocumentClassDTO documentClassDto)
        {
        
            if (!_exception.checkNames(documentClassDto.DocumentClassName))
            {
                _exception.AttributeMessages.Add(_localizer["Document Class Name is NULL or Empty"]);
                _logger.LogError(LoggingEvents.InsertItem, String.Format("AddDocumentClass({0}) INVALID ENTRY ERROR", documentClassDto));
                throw _exception;
            }

            if (_context.DocumentClass.IgnoreQueryFilters().Any(e=>e.DocumentClassName.ToLower() == documentClassDto.DocumentClassName.ToLower()))
            {
                _exception.AttributeMessages.Add(_localizer["Document Class Name Already Added "]+ documentClassDto.DocumentClassName);
                _logger.LogError(LoggingEvents.InsertItem, String.Format("AddDocumentClass({0}) EXISTED BEFORE ERROR", documentClassDto));
                throw _exception;
            }

            //_logger.LogInformation(LoggingEvents.InsertItem, "AddDocumentClass({documentClassDto}) is fetched", documentClassDto);
            DocumentClass dc = documentClassDto.GetEntity();
            dc.UserId= _userInformationService.GetUserID();
            _context.DocumentClass.Add(dc);
            _context.SaveChanges();
        }

        public void DeleteDocumentClass(int classId)
        {
            if (!_context.DocumentClass.Any(p => p.ID == classId))
            {
                _exception.AttributeMessages.Add(_localizer["Document Class Not Found"]);
                _logger.LogError(LoggingEvents.DeleteItem, String.Format("DeleteDocumentClass({0}) Document Class NOT FOUND ERROR", classId));
                throw _exception;
            }

            if (_context.MetaDataModel.Any(p => p.DocumentClassId == classId))
            {
                _exception.AttributeMessages.Add(_localizer["Document Class Is In Use By Metadata Model "] + _context.MetaDataModel.Where(e => e.DocumentClassId == classId).Select(e => e.MetaDataModelName).First() 
                    +", "+ _localizer["Delete MetaData Model First Then You Can Delete Document Class"]);
                _logger.LogError(LoggingEvents.DeleteItem, String.Format("DeleteDocumentClass({0}) Document Class Attached by Metadata Model", classId));
                throw _exception;
            }

            DocumentClass documentClass = _context.DocumentClass.Single(p => p.ID == classId);
            documentClass.DeletedDate = DateTime.Now;
            _context.DocumentClass.Update(documentClass);
            _context.SaveChanges();
        }
    }
}
