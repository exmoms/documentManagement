using DM.Repository.Contexts;
using DM.Service.Interfaces;
using DM.Service.ServiceModels;
using DM.Service.ServiceModels.MailModels;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Localization;
using MimeKit;
using System;
using System.Linq;
using System.Net.Sockets;

namespace DM.Service.Services
{
    public class MailService : IMailService
    {
        private DocumentDBContext _context; 
        private IConfiguration _configuration;
        private readonly IStringLocalizer<MailService> _localizer;

        public MailService(DocumentDBContext context, IConfiguration configuration, IStringLocalizer<MailService> localizer)
        {
            _context = context;
            _configuration = configuration;
            _localizer = localizer;
        }

        public void AddMailConfigurations(MailConfigurations config)
        {
            _configuration["SMTP:Server"] = config.Server;
            _configuration["SMTP:Port"] = config.Port.ToString();
            _configuration["SMTP:Email"] = config.Email;
            _configuration["SMTP:Password"] = config.Password;
        }

        public MailConfigurations GetConfig()
        {
            return _configuration.GetSection("SMTP").Get<MailConfigurations>();
        }

        
        public void TestEmailConnection(MailConfigurations config)
        {
            try
            {
                using (var client = new MailKit.Net.Smtp.SmtpClient())
                {
                    client.Connect(config.Server, config.Port, false);
                    client.Authenticate(config.Email, config.Password);
                    client.Disconnect(true);
                }
            }
            catch (AuthenticationException)
            {
                ValidatorException validatorException = new ValidatorException();
                validatorException.AttributeMessages.Add(_localizer["Incorrect authentication data."]);
                throw validatorException;
            }
            catch (SocketException)
            {
                ValidatorException validatorException = new ValidatorException();
                validatorException.AttributeMessages.Add(_localizer["No connection could be made. Recheck your configuration please."]);
                throw validatorException;
            }
        }

        public void TestEmailConnection()
        {
            try
            {
                using (var client = new MailKit.Net.Smtp.SmtpClient())
                {
                    client.Connect(_configuration["SMTP:Server"], Int32.Parse(_configuration["SMTP:Port"]), false);
                    client.Authenticate(_configuration["SMTP:Email"], _configuration["SMTP:Password"]);
                    client.Disconnect(true);
                }
            }
            catch (AuthenticationException)
            {
                ValidatorException validatorException = new ValidatorException();
                validatorException.AttributeMessages.Add(_localizer["Incorrect authentication data."]);
                throw validatorException;
            }
            catch (SocketException)
            {
                ValidatorException validatorException = new ValidatorException();
                validatorException.AttributeMessages.Add(_localizer["No connection could be made. Recheck your configuration please."]);
                throw validatorException;
            }
        }
    }
}
