using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace DM.Service.Utils
{
    public class SecretsHelper : ISecretsHelper
    {
        private readonly IConfiguration _configuration;
        private readonly IDataProtectionProvider _dataProtectionProvider;
        private readonly IWebHostEnvironment _env;
        public SecretsHelper(IConfiguration configuration, IWebHostEnvironment env, IDataProtectionProvider dataProtectionProvider)
        {
            _configuration = configuration;
            _dataProtectionProvider = dataProtectionProvider;
            _env = env;
        }

        public string GetJwtIssuerSigningKey()
        {
            string jwtSecretKey;
            if (_env.IsDevelopment())
            {
                // use the unencrypted key from appsettings.json when running in a development environment
                jwtSecretKey = _configuration["Jwt:JwtKey"];
            }
            else
            {
                // otherwise, use the encrypted key previously stored in -config mode
                var protector = ConfigureDataProtection.CreateProtector(_dataProtectionProvider);
                jwtSecretKey = protector.Unprotect(_configuration["protectedSecretTokenKey"]);
            }
            return jwtSecretKey;
        }

        public string GetConnectionString()
        {
            string connectionString;
            if (_env.IsDevelopment())
            {
                // use the unencrypted connection string from appsettings.json when running in a development environment
                connectionString = _configuration.GetConnectionString("DMDBConnection");
            }
            else
            {
                // otherwise, use the encrypted connection string previously stored in -config mode
                var protector = ConfigureDataProtection.CreateProtector(_dataProtectionProvider);
                connectionString = protector.Unprotect(_configuration["protectedConnectionString"]);
            }
            return connectionString;
        }      
    }
}
