using DM.Service.ServiceModels.MailModels;

namespace DM.Service.Interfaces
{
    public interface IMailService
    {
        public void AddMailConfigurations(MailConfigurations config);
        public void TestEmailConnection(MailConfigurations config);
        public void TestEmailConnection();
        public MailConfigurations GetConfig();
        
    }
}
