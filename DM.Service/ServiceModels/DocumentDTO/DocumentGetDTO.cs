using DM.Domain.Models;
using System;
using System.Collections.Generic;

namespace DM.Service.ServiceModels.DocumentDTO
{
    public class DocumentGetDTO
    {
        public int Id { get; private set; }
        public string DocumentName { get; private set; }
        public int MetadataModelId { get; private set; }
        public string MetadataModelName { get; private set; }
        public string UsreName { get; private set; }
        public DateTime AddedDate { get; private set; }
        public DateTime DeletedDate { get; private set; }
        public DateTime ModifiedDate { get; private set; }
        public int? LatestVersion { get; private set; }
        public DocumentVersionGetDTO DocumentVersion { get; set; }
        public List<AttachmentGetDTO> Attachments { get; private set; }

        public static DocumentGetDTO GetDTO(Document doc)
        {
            DocumentGetDTO dto = new DocumentGetDTO
            {
                Id = doc.ID,
                DocumentName = doc.Name,
                MetadataModelId = doc.MetaDataModelId,
                AddedDate = doc.AddedDate,
                DeletedDate = doc.AddedDate,
                ModifiedDate = doc.ModifiedDate,
                LatestVersion = doc.LatestVersionId,
                UsreName = doc.LatestDocumentVersion.User?.UserName
            };

            if (doc.MetaDataModel != null && doc.MetaDataModel.MetaDataModelName != null)
            {
                dto.MetadataModelName = doc.MetaDataModel.MetaDataModelName;
            }

            if(doc.Attachments != null)
            {
                dto.Attachments = new List<AttachmentGetDTO>();
                foreach(var attach in doc.Attachments)
                {
                    dto.Attachments.Add(AttachmentGetDTO.GetDTO(attach));
                }
            }

            return dto;
        }
    }
}
