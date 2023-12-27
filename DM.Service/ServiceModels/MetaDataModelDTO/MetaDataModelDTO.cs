using DM.Domain.Models;
using System;
using System.Collections.Generic;

namespace DM.Service.ServiceModels.MetaDataModelDTO
{
    public class MetaDataModelDTO
    {
        public int Id { get; set; }
        public string MetaDataModelName { get; set; }
        public int DocumentClassId { get; set; }
        public string DocumentClassName { get; set; }
        public DateTime AddedDate { get; set; }
        public string UserName { get; set; }
        public List<MetaDataAttributeDTO> MetaDataAttributes { get; set; }
        public List<AggregateMetaDataModelDTO> ChildMetaDataModels { get; set; }
        public List<CompoundModelDTO> CompoundModels { get; set; }

        public MetaDataModelDTO()
        {
            MetaDataAttributes = new List<MetaDataAttributeDTO>();
            ChildMetaDataModels = new List<AggregateMetaDataModelDTO>();
            CompoundModels = new List<CompoundModelDTO>();
        }

        public static MetaDataModelDTO GetDTO(MetaDataModel mdm)
        {
            MetaDataModelDTO dto = new MetaDataModelDTO();
            dto.Id = mdm.ID;
            dto.MetaDataModelName = mdm.MetaDataModelName;
            dto.DocumentClassId = mdm.DocumentClassId;
            dto.UserName = mdm.User?.UserName;

            if (mdm.DocumentClass != null)
                dto.DocumentClassName = mdm.DocumentClass.DocumentClassName;
            else
                dto.DocumentClassName = "Unknown";

            if(mdm.MetaDataAttributes != null)
            {
                foreach(var att in mdm.MetaDataAttributes)
                {
                    dto.MetaDataAttributes.Add(MetaDataAttributeDTO.GetDTO(att));
                }
            }

            if(mdm.ChildMetaDataModels != null)
            {
                foreach(var child in mdm.ChildMetaDataModels)
                {
                    dto.ChildMetaDataModels.Add(AggregateMetaDataModelDTO.GetDTO(child));
                }
            }

            if(mdm.CompoundModels != null)
            {
                foreach(var model in mdm.CompoundModels)
                {
                    dto.CompoundModels.Add(CompoundModelDTO.GetDTO(model));
                }
            }

            return dto;

        }

        public MetaDataModel GetEntity()
        {
            MetaDataModel mdm = new MetaDataModel
            {
                MetaDataModelName = MetaDataModelName,
                DocumentClassId = DocumentClassId
            };

            if (MetaDataAttributes != null)
            {
                mdm.MetaDataAttributes = new List<MetaDataAttribute>();
                foreach (var attr in MetaDataAttributes)
                {
                    mdm.MetaDataAttributes.Add(attr.GetEntity());
                }
            }

            if (ChildMetaDataModels != null)
            {
                mdm.ChildMetaDataModels = new List<AggregateMetaDataModel>();
                foreach (var child in ChildMetaDataModels)
                {
                    mdm.ChildMetaDataModels.Add(child.GetEntity());
                }
            }

            if (CompoundModels != null)
            {
                mdm.CompoundModels = new List<CompoundModel>();
                foreach (var model in CompoundModels)
                {
                    mdm.CompoundModels.Add(model.GetEntity());
                }
            }

            return mdm;
        }

    }
}
