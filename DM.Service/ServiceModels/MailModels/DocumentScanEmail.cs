using System;
using System.Collections.Generic;
using System.Text;

namespace DM.Service.ServiceModels.MailModels
{
    public class DocumentScanEmail
    {
        public string Subject { get; set; }
        public List<string> RecieverEmails { get; set; }
        public string SenderName { get; set; }
        public string EmailBody { get; set; }
        public List<int> DocumentVersionIds { get; set; }
    }
}
