using DM.Service.Utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using System.Threading.Tasks;

namespace DM.Presentation.Utils
{
    public class ConfigureJwtBearerOptions : IPostConfigureOptions<JwtBearerOptions>
    {
        private readonly IConfiguration _configuration;
        private readonly IDataProtectionProvider _dataProtectionProvider;
        private readonly IWebHostEnvironment _env;
        public ConfigureJwtBearerOptions(IConfiguration configuration, IWebHostEnvironment env, IDataProtectionProvider dataProtectionProvider)
        {
            _configuration = configuration;
            _dataProtectionProvider = dataProtectionProvider;
            _env = env;
        }

        public void PostConfigure(string name, JwtBearerOptions options)
        {
            SecretsHelper secretsHelper = new SecretsHelper(_configuration, _env, _dataProtectionProvider);
            string jwtSecretKey = secretsHelper.GetJwtIssuerSigningKey();

            if (_env.IsDevelopment())
            {
                options.RequireHttpsMetadata = false;
            }
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:JwtIssuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:JwtAudience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey)),
                ClockSkew = TimeSpan.Zero, // remove delay of token when expire
                RequireExpirationTime = true,
                ValidateLifetime = true
            };
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    context.Token = context.Request.Cookies["AuthToken"];
                    return Task.CompletedTask;
                }
            };
        }
    }
}
