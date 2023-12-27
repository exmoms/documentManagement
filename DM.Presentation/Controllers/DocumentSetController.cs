using DM.Service.Interfaces;
using DM.Service.ServiceModels.DocumentSetDTO;
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
    public class DocumentSetController : ControllerBase
    {
        private readonly IDocumentSetService _documentSetService;

        public DocumentSetController(IDocumentSetService documentSetService)
        {
            this._documentSetService = documentSetService;
        }

        [HttpGet]
        public IEnumerable<DocumentSetGetDTO> Get()
        {
            return _documentSetService.GetAllDocumentSets();
        }

       [HttpGet]
       [Route("[action]")]
       public DocumentSetGetDTO GetDocumentSetByID(int document_set_id)
       {
           return _documentSetService.GetDocumentSetByID(document_set_id);
       }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddNewDocumentSet(DocumentSetPostDTO document_set)
        {
                _documentSetService.AddDocumentSet(document_set);
                return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateDocumentSetName(DocumentSetPostDTO document_set)
        {
                _documentSetService.UpdateDocumentSetName(document_set);
                return Ok();
        }

        [HttpDelete]
        [Route("[action]")]
        public IActionResult DeleteDocumentSet(int document_set_id)
        {
                _documentSetService.DeleteDocumentSet(document_set_id);
                return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddDocumentToDocumentSet(List<int> documents_Ids, int document_set_Id)
        {
            _documentSetService.AddDocumentsToDocumentSet(documents_Ids, document_set_Id);
            return Ok();
        }

        [HttpDelete]
        [Route("[action]")]
        public IActionResult RemoveDocumentFromDocumentSet(int document_Id, int document_set_Id)
        {
                _documentSetService.RemoveDocumentFromDocumentSet(document_Id, document_set_Id);
                return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddDocumentSetToDocumentSet(int Parent_documentSet_Id, int child_documentSet_Id)
        {
                _documentSetService.AddRecursiveDocumentSet(Parent_documentSet_Id, child_documentSet_Id);
                return Ok();
        }

        [HttpDelete]
        [Route("[action]")]
        public IActionResult RemoveDocumentSetFromDocumentSet(int Parent_documentSet_Id, int child_documentSet_Id)
        {
                _documentSetService.RemoveDocumentSetFromDocumentSet(Parent_documentSet_Id, child_documentSet_Id);
                return Ok();
        }
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetRoots()
        {
            List<DocumentSetGetDTO> roots = _documentSetService.GetRootSets().ToList();
            return Ok(roots);
        }
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllSetsExcludingSetsOfSet(int Parent_documentSet_Id)
        {
            List<DocumentSetGetDTO> roots = _documentSetService.GetAllSetsExcludingSetsOfParent(Parent_documentSet_Id).ToList();
            return Ok(roots);
        }
    }
}
