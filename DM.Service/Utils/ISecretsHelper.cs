namespace DM.Service.Utils
{
    public interface ISecretsHelper
    {
        public string GetJwtIssuerSigningKey();
        public string GetConnectionString();

    }
}
