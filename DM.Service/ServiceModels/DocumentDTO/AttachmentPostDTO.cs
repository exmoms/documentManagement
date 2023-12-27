using DM.Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace DM.Service.ServiceModels.DocumentDTO
{
    [ModelBinder(BinderType = typeof(FormDataJsonModelBinder))]
    public class AttachmentPostDTO
    {
        public int Id { get; set; }
        public int DocumentId { get; set; }
        public string Name { get; set; }
        public string ContentType { get; set; }
        public byte[] AttachmentFile { get; set; }
        public int? CompoundModelId { get; set; }

        public void AddAttachmentFile(IFormFile file)
        {
            if (file != null)
            {
                using (var ms = new MemoryStream())
                {
                    file.CopyTo(ms);
                    ContentType = file.ContentType;
                    Name = file.FileName;
                    AttachmentFile = ms.ToArray();
                }
            }
            else
            {
                ValidatorException exception = new ValidatorException();
                exception.AttributeMessages.Add("File can't be null");
                throw exception;
            }
        }
        public Attachment GetEntity()
        {
            Attachment attachment = new Attachment
            {
                ID = this.Id,
                DocumentId = this.DocumentId,
                Name = this.Name,
                ContentType = this.ContentType,
                AttachmentFile = this.AttachmentFile,
                CompoundModelID = this.CompoundModelId
            };
            return attachment;
        }
    }
}
