using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DM.Service.Interfaces;
using DM.Service.ServiceModels.MailModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DM.Presentation.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    [ApiController]
    [Authorize(Roles = "SuperAdmin, Admin")]
    public class MailController : ControllerBase
    {
        private IMailService _mailService;

        public MailController(IMailService mailService)
        {
            _mailService = mailService;
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddConfig(MailConfigurations config)
        {
            _mailService.AddMailConfigurations(config);
            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult TestConnection(MailConfigurations config)
        {
            _mailService.TestEmailConnection(config);
            return Ok();
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetConfig()
        {
            return Ok(_mailService.GetConfig());
        }


    }
}