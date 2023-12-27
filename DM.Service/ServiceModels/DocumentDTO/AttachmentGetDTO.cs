using DM.Domain.Models;
using System;

namespace DM.Service.ServiceModels.DocumentDTO
{
    public class AttachmentGetDTO
    {
        public int Id { get; private set; }
        public string Name { get; private set; }
        public string ContentType { get; private set; }
        public string AttachmentFile { get; private set; }
        public int? CompoundModelId { get; private set; }
        public string Caption { get; private set; }
        public DateTime AddedDate { get; private set; }

        public static AttachmentGetDTO GetDTO(Attachment attachment)
        {
            AttachmentGetDTO dto = new AttachmentGetDTO
            {
                Id = attachment.ID,
                Name = attachment.Name,
                ContentType = attachment.ContentType,
                AttachmentFile = String.Format("/api/document/GetAttachment?attachId={0}", attachment.ID),
                CompoundModelId = attachment.CompoundModelID,
                AddedDate = attachment.AddedDate
            };

            if (attachment.CompoundModel != null && attachment.CompoundModel.Caption != null)
            {
                dto.Caption = attachment.CompoundModel.Caption;
            }

            return dto;
        }
    }
}
