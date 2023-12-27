using DM.Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace DM.Service.ServiceModels.DocumentDTO
{
    [ModelBinder(BinderType = typeof(FormDataJsonModelBinder))]
    public class DocumentPostDTO
    {
        public int Id { get; set; }
        public int MetadataModelId { get; set; }
        public DocumentVersionPostDTO DocumentVersion { get; set; }
        public List<AttachmentPostDTO> Attachments { get; set; }

        public void AddAttachmentFiles(IFormFileCollection files)
        {
            if(files != null)
            {
                foreach(var file in files)
                {
                    AttachmentPostDTO att = Attachments.Where(a => a.Name == file.FileName).FirstOrDefault();
                    att.AddAttachmentFile(file);
                }
            }

        }

        public void AddDocumentScans(IFormFileCollection files)
        {
            if (DocumentVersion == null)
            {
                DocumentVersion = new DocumentVersionPostDTO();
            }

            DocumentVersion.AddScans(files);
        }

        public Document GetEntity()
        {
            Document doc = new Document
            {
                ID = Id,
                MetaDataModelId = MetadataModelId,

                DocumentVersions = new List<DocumentVersion>()
            };

            if (DocumentVersion != null)
            {
                doc.DocumentVersions.Add(DocumentVersion.GetEntity());
            }

            if(Attachments != null)
            {
                doc.Attachments = new List<Attachment>();
                foreach (var attach in Attachments)
                {
                    doc.Attachments.Add(attach.GetEntity());
                }
            }

            return doc;
        }
    }
}
