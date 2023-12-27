using System;
using System.Collections.Generic;
using System.Text;

namespace DM.Service.ServiceModels.MailModels
{
    public class MailConfigurations
    {
        public string Server { get; set; }
        public int Port { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
