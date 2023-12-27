using DM.Service.Interfaces;
using DM.Service.ServiceModels.DocumentClassDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace DM.Api.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    [ApiController]
    [Authorize(Roles = "SuperAdmin, Admin, User")]
    public class DocumentClassController : ControllerBase
    {
        private readonly IDocumentClassService _documentClassService;

        public DocumentClassController(IDocumentClassService documentClassesService)
        {
            _documentClassService = documentClassesService;
        }
       
        [HttpGet]
        public IEnumerable<DocumentClassDTO> Get()
        {
            return _documentClassService.GetDocumentClasses();
        }

        [HttpGet]
        [Route("[action]")]
        public IEnumerable<dynamic> GetDocumentClassesIdName()
        {
            return _documentClassService.GetDocumentClasses().Select(v => new { v.Id, v.DocumentClassName });
        }
        
        [HttpPost]
        [Route("[action]")]
        [Authorize(Roles = "SuperAdmin, Admin")]
        public IActionResult AddNewDocumentClass(DocumentClassDTO dc)
        {
            _documentClassService.AddDocumentClass(dc);
            return Ok();
        }

        [HttpDelete]
        [Route("[action]")]
        [Authorize(Roles = "SuperAdmin, Admin")]
        public IActionResult DeleteDocumentClass(int classId)
        {
            _documentClassService.DeleteDocumentClass(classId);
            return Ok();
        }
    }
}
