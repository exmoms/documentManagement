using DM.Service.ServiceModels;
using DM.Service.ServiceModels.DocumentDTO;
using Microsoft.AspNetCore.Http;

namespace DM.Presentation.FormModels
{
    public class DocumentVersionForm
    {
        public DocumentVersionPostDTO Version { get; set; }
        public IFormFileCollection Scans { get; set; }
        public DocumentVersionPostDTO GetDocumnetGersionPostDTO()
        {
            if(Version == null)
                throw new ValidatorException();

            Version.AddScans(Scans);

            return Version;
        }
    }
}
