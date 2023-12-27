using DM.Service.ServiceModels;
using DM.Service.ServiceModels.DocumentDTO;
using Microsoft.AspNetCore.Http;

namespace DM.Presentation.FormModels
{
    public class AttachmentForm
    {
        public AttachmentPostDTO Attachment { get;  set; }
        public IFormFile FileAttachment { get; set; }
        public AttachmentPostDTO AssignFileFromForm()
        {
            if (Attachment == null)
                throw new ValidatorException();

            Attachment.AddAttachmentFile(FileAttachment);

            return Attachment;
        }
    }
}
