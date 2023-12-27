using DM.Service.ServiceModels;
using DM.Service.ServiceModels.DocumentDTO;
using Microsoft.AspNetCore.Http;

namespace DM.Presentation.FormModels
{
    public class DocumentForm
    {
        public DocumentPostDTO Document { get; set; }
        public IFormFileCollection Scans { get ; set; }
        public IFormFileCollection Attachments { get; set; }
        public DocumentPostDTO AssignFilesFromForms()
        {
            if(Document == null)
                throw new ValidatorException();

            Document.AddAttachmentFiles(Attachments);
            Document.AddDocumentScans(Scans);

            return Document;
        }
    }
}
