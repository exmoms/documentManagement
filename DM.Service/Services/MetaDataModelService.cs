using DM.Domain.Models;
using DM.Repository.Contexts;
using DM.Service.Interfaces;
using DM.Service.ServiceModels;
using DM.Service.ServiceModels.MetaDataModelDTO;
using DM.Service.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DM.Service.Services
{
    public class MetaDataModelService : IMetaDataModelService
    {

        private DocumentDBContext _context;
        private ValidatorException _exception;
        private readonly ILogger _logger;
        private readonly IStringLocalizer<MetaDataModelService> _localizer;
        private readonly IUserInformationService _userInformationService;

        public MetaDataModelService(DocumentDBContext context, ILogger<MetaDataModelService> logger, IStringLocalizer<MetaDataModelService> localizer, IUserInformationService userInformationService)
        {
            this._context = context;
            this._exception = new ValidatorException();
            _logger = logger;
            _localizer = localizer;
            _userInformationService = userInformationService;
        }
        public IEnumerable<MetaDataModelDTO> GetMetaDataModels()
        {
            List<MetaDataModelDTO> result = new List<MetaDataModelDTO>();
            List<MetaDataModel> metadata_models = _context.MetaDataModel.Include(model => model.DocumentClass)
                                                                        .Include(model => model.ChildMetaDataModels)
                                                                        .Include(model => model.CompoundModels)
                                                                        .Include(model => model.MetaDataAttributes)
                                                                        .ThenInclude(att => att.DataType)
                                                                        .Include(model => model.User)
                                                                        .Where(model => model.DeletedDate == null).ToList();
            foreach (var metaData in metadata_models)
            {
                MetaDataModelDTO metaDataDto = MetaDataModelDTO.GetDTO(metaData);
                result.Add(metaDataDto);
            }
            //_logger.LogInformation(LoggingEvents.GetItem, "GetMetaDataModels() is called");
            return result;
        }
        public MetaDataModelDTO GetMetaDataModelById(int metadataModelId)
        {
            if (!_context.MetaDataModel.Any(e => e.ID == metadataModelId))
            {
                _exception.AttributeMessages.Add(_localizer["Metadata Model NOT FOUND"]);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("GetMetaDataModel({0}) NOT FOUND", metadataModelId));
                throw _exception;
            }

            if (_context.MetaDataModel.Any(e => e.ID == metadataModelId && e.DeletedDate != null))
            {
                _exception.AttributeMessages.Add(_localizer["Metadata Model Is Deleted"]);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("GetMetaDataModel({0}) DELETED BEFORE", metadataModelId));
                throw _exception;
            }

            MetaDataModel metadata_model = _context.MetaDataModel.Include(model => model.ChildMetaDataModels).ThenInclude(c => c.ChildMetaDataModel)
                                            .Include(model => model.CompoundModels).Include(model => model.DocumentClass)
                                            .Include(model => model.MetaDataAttributes).ThenInclude(att => att.DataType)
                                            .Include(model => model.User)
                                            .Where(model => model.ID == metadataModelId && model.DeletedDate == null).Single();

            //_logger.LogInformation(LoggingEvents.GetItem, "GetMetaDataModel({id}) is fetched", metadataModelId);
            return MetaDataModelDTO.GetDTO(metadata_model);
        }

        public List<dynamic> GetMetaDataModelsByClassId(int classId)
        {
            List<dynamic> result = new List<dynamic>();
            var metadata_by_class = _context.MetaDataModel.Where(model => model.DocumentClassId == classId).Include(model=>model.User).Select(x => new { x.ID, x.MetaDataModelName, x.User.UserName}).ToList();
            foreach (var x in metadata_by_class)
            {
                result.Add(x);
            }
            return result;
        }

        public void AddMetaDataModel(MetaDataModelDTO metaDataModelDto)
        {
            if (_context.MetaDataModel.IgnoreQueryFilters().Any(p => p.MetaDataModelName.ToLower() == metaDataModelDto.MetaDataModelName.ToLower()))
            {
                _exception.AttributeMessages.Add(_localizer["Metadata Model Name EXISTED BEFORE "]+ metaDataModelDto.MetaDataModelName);
                _logger.LogError(LoggingEvents.InsertItem, String.Format("AddMetaDataModel({0}) Meta Name EXISTED BEFORE ERROR", metaDataModelDto));
                throw _exception;
            }

            if (!_exception.checkNames(metaDataModelDto.MetaDataModelName))
            {
                _exception.AttributeMessages.Add(_localizer["MetaData Model Name Is NULL or Empty"]);
                _logger.LogError(LoggingEvents.InsertItem, String.Format("AddMetaDataModel({0}) MetaData Name INVALID ENTRY ERROR", metaDataModelDto));
                throw _exception;
            }

            if (!_context.DocumentClass.Any(p => p.ID == metaDataModelDto.DocumentClassId))
            {
                _exception.AttributeMessages.Add(_localizer["Document Class NOT FOUND"]);
                _logger.LogError(LoggingEvents.InsertItem, String.Format("AddMetaDataModel({0}) Document Class INVALID ENTRY ERROR", metaDataModelDto));
                throw _exception;
            }


            if (metaDataModelDto.MetaDataAttributes != null)
            {
                foreach (var v in metaDataModelDto.MetaDataAttributes)
                {
                    if (!_context.DataType.Any(p => p.ID == v.DataTypeID))
                    {
                        _exception.AttributeMessages.Add(_localizer["Wrong Attribute Type "]+v.MetaDataAttributeName);
                        _logger.LogError(LoggingEvents.InsertItem, String.Format("Wrong Attribute Type{0}", v.DataTypeID));
                        throw _exception;
                    }

                    if (metaDataModelDto.MetaDataAttributes.Where(p => p.MetaDataAttributeName == v.MetaDataAttributeName).Count() > 1)
                    {
                        _exception.AttributeMessages.Add(_localizer["Metadata Model Attribute Name EXISTED BEFORE "]+ v.MetaDataAttributeName);
                        _logger.LogError(LoggingEvents.InsertItem, String.Format("AddMetaDataModel({0}) EXISTED BEFORE ERROR", v.MetaDataAttributeName));
                        throw _exception;
                    }
                }
            }

            if (metaDataModelDto.ChildMetaDataModels != null)
            {
                // check it's added before for each two aggregated.
                foreach (AggregateMetaDataModelDTO new_aggr in metaDataModelDto.ChildMetaDataModels)
                {
                    if (!_context.MetaDataModel.Any(p => p.ID == new_aggr.ChildMetaDataModelId))
                    {
                        _exception.AttributeMessages.Add(_localizer["Child Metadata Model NOT FOUND"]);
                        _logger.LogError(LoggingEvents.InsertItem, String.Format("AddMetaDataModel({0}) NOT FOUND ERROR", new_aggr.ChildMetaDataModelId));
                        throw _exception;
                    }

                    if (!_exception.checkNames(new_aggr.AggregateName))
                    {
                        _exception.AttributeMessages.Add(_localizer["Aggregate Metadata Model Name Is NULL or Empty"]);
                        _logger.LogError(LoggingEvents.InsertItem, String.Format("The field of the added MetaDataModel({0}) INVALID ENTRY ERROR", new_aggr.AggregateName));
                        throw _exception;
                    }

                    if (metaDataModelDto.ChildMetaDataModels.Where(p => p.AggregateName == new_aggr.AggregateName).Count() > 1)
                    {
                        _exception.AttributeMessages.Add(_localizer["Aggregate Metadata Model Name EXISTED BEFORE "]+ new_aggr.AggregateName);
                        _logger.LogError(LoggingEvents.InsertItem, String.Format("AddMetaDataModel({0}) EXISTED BEFORE ERROR", metaDataModelDto));
                        throw _exception;
                    }

                }
            }

            if (metaDataModelDto.CompoundModels != null)
            {
                foreach (var v in metaDataModelDto.CompoundModels)
                {
                    v.Id = 0;
                    if (!_exception.checkNames(v.Caption))
                    {
                        _exception.AttributeMessages.Add(_localizer["Caption Is NULL or Empty"]);
                        _logger.LogError(LoggingEvents.InsertItem, String.Format("The field of the added MetaDataModel({0}) INVALID ENTRY ERROR", v.Caption));
                        throw _exception;
                    }

                    if (metaDataModelDto.CompoundModels.Where(p => p.Caption == v.Caption).Count() > 1)
                    {
                        _exception.AttributeMessages.Add(_localizer["Caption EXISTED BEFORE "]+v.Caption);
                        _logger.LogError(LoggingEvents.InsertItem, String.Format("AddMetaDataModel({0}) EXISTED BEFORE ERROR", v.Caption));
                        throw _exception;
                    }
                }
            }


            MetaDataModel model = metaDataModelDto.GetEntity();
            model.UserId = _userInformationService.GetUserID();

            _context.MetaDataModel.Add(model);
            _context.SaveChanges();
        }
        public void DeleteMetaDataModel(int metadataModelId)
        {
            if (!_context.MetaDataModel.Any(p => p.ID == metadataModelId))
            {
                _exception.AttributeMessages.Add(_localizer["Metadata Model NOT FOUND"]);
                _logger.LogError(LoggingEvents.DeleteItem, String.Format("DeleteMetaDataModel({0}) Meta ID NOT FOUND ERROR", metadataModelId));
                throw _exception;
            }

            if (_context.MetaDataModel.Any(p => p.ID == metadataModelId && p.DeletedDate != null))
            {
                _exception.AttributeMessages.Add(_localizer["Metadata Model DELETED BEFORE"]+ _context.MetaDataModel.Where(e=>e.ID==metadataModelId).Select(e=>e.MetaDataModelName));
                _logger.LogError(LoggingEvents.DeleteItem, String.Format("DeleteMetaDataModel({0}) DELETED BEFORE ERROR", metadataModelId));
                throw _exception;
            }

            // check if all the aggregated are deleted before.
            var aggregatedIds = _context.AggregateMetaDataModel.Where(p => p.ChildMetadataModelId == metadataModelId).Select(x => x.ParentMetadataModelId);
           if (aggregatedIds.Count() > 0)
            {
                if (_context.MetaDataModel.Any(e => aggregatedIds.Contains(e.ID)))
                {
                    _exception.AttributeMessages.Add(_localizer["Metadata Module Aggregated With Another One "] + _context.MetaDataModel.Where(e => aggregatedIds.Contains(e.ID)).Select(e => e.MetaDataModelName).FirstOrDefault());
                    _logger.LogError(LoggingEvents.DeleteItem, String.Format("DeleteMetaDataModel({0}) Metadata Module Aggregated With Another One", metadataModelId));
                    throw _exception;
                }
            }

            MetaDataModel metadataModule = _context.MetaDataModel.Single(p => p.ID == metadataModelId);
            metadataModule.DeletedDate = DateTime.Now;
            _context.MetaDataModel.Update(metadataModule);
            _context.SaveChanges();
            //_logger.LogInformation(LoggingEvents.DeleteItem, "DeleteMetaDataModel({metadataModelId}) Delete Success", metadataModelId);
        }
        public int GetNumberOfCompoundAttachmentsByMetaDataModelId(int metadataModelId)
        {
            if (!_context.MetaDataModel.Any(p => p.ID == metadataModelId))
            {
                _exception.AttributeMessages.Add(_localizer["Metadata Model NOT FOUND"]);
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("GetNumberOfRequiredAttachemntsByMetaDataModelId({0}) item not found", metadataModelId));
                throw _exception;
            }

            if (_context.MetaDataModel.Any(e => e.ID == metadataModelId && e.DeletedDate != null))
            {
                _exception.AttributeMessages.Add(_localizer["Metadata Model Is Deleted"] + _context.MetaDataModel.Where(e => e.ID == metadataModelId).Select(e => e.MetaDataModelName));
                _logger.LogError(LoggingEvents.GetItemNotFound, String.Format("GetMetaDataModel({0}) DELETED BEFORE", metadataModelId));
                throw _exception;
            }

            int requiredAttachments = 0;
            if (_context.CompoundModel.Any(e => e.MetaDataModelID == metadataModelId))
            {
                requiredAttachments = _context.CompoundModel.Where(p => p.MetaDataModelID == metadataModelId).Count();
            }
            //_logger.LogInformation(LoggingEvents.GetItem, "GetNumberOfRequiredAttachemntsByMetaDataModelId({metadataModelId}) fetch success", metadataModelId);
            return requiredAttachments;
        }

    }
}
