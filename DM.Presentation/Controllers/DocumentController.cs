using DM.Presentation.FormModels;
using DM.Service.Interface;
using DM.Service.Interfaces;
using DM.Service.ServiceModels.DocumentDTO;
using DM.Service.ServiceModels.MailModels;
using DM.Service.ServiceModels.SerachModels;
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
    public class DocumentController : ControllerBase
    {
        private IDocumentService _documentService;
        private ISearchService _searchService;

        public DocumentController(IDocumentService documentService, ISearchService searchService)
        {
            _documentService = documentService;
            _searchService = searchService;
        }

        [HttpGet]
        public IEnumerable<dynamic> Get()
        {
            return _documentService.GetDocuments().Select(d => new { d.Id, d.DocumentName, d.MetadataModelId, d.MetadataModelName, d.LatestVersion, d.AddedDate, d.UsreName });
        }

        [HttpGet]
        [Route("[action]")]
        public IEnumerable<dynamic> GetDocumentsByMetaDataModelId(int model_id)
        {
            return _documentService.GetDocumentsByMetaDataModel(model_id)
                    .Select(d => new { d.Id, d.DocumentName, d.LatestVersion, d.UsreName });
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetDocumentVersionById(int id)
        {
            DocumentGetDTO document = _documentService.GetDocumentByVersionId(id);
            DocumentVersionGetDTO version = _documentService.GetDocumentVersionById(id);
            document.DocumentVersion = version;
            return Ok(document);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddNewDocument([FromForm] DocumentForm documentForm)
        {
            DocumentPostDTO document = documentForm.AssignFilesFromForms();
            if (document != null && document.DocumentVersion != null && document.DocumentVersion.Values != null)
            {
                _documentService.ConvertJsonElementsToValue(document.DocumentVersion.Values);
            }
            _documentService.AddDocument(document);
            return Ok();
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAttachment(int attachId)
        {
            string contet;
            byte[] att = _documentService.GetAttachmentImgById(attachId, out contet);
            return File(att, contet);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAttachmentsByDocumentId(int docId)
        {

            List<AttachmentGetDTO> attachs = _documentService.GetAttachmentsByDocumentId(docId).ToList();
            return Ok(attachs);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddNewAttachmentToDocument([FromForm] AttachmentForm attachmentForm)
        {
            AttachmentPostDTO  attachment = attachmentForm.AssignFileFromForm();
            _documentService.AddAttachment(attachment);
            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateAttachment([FromForm]AttachmentForm attachmentForm)
        {

            AttachmentPostDTO attachment = attachmentForm.AssignFileFromForm();
            _documentService.UpdateAttachment(attachment);
            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteAttachments(int id)
        {
            _documentService.DeleteAttachment(id);
            return Ok();
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateDocumentVersion([FromForm]DocumentVersionForm documentVersionFrom)
        {
            DocumentVersionPostDTO documentVersionDto = documentVersionFrom.GetDocumnetGersionPostDTO();
            if (documentVersionDto != null && documentVersionDto.Values != null)
            {
                _documentService.ConvertJsonElementsToValue(documentVersionDto.Values);
            }
           int newVersionId = _documentService.UpdateVersion(documentVersionDto);
            var result = new { LatestVersionId = newVersionId };
            return Ok(result);
        }

        

        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteDocument(int docId)
        {
            _documentService.SoftDeleteDocument(docId);
            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult ArchiveDocument(int docId)
        {
            _documentService.ArchiveDocument(docId);
            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult UnArchiveDocument(int docId)
        {
            _documentService.UnArchiveDocument(docId);
            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult SearchByValue(ValuesSearchFilter filter)
        {
            _searchService.ConvertJsonElementsToValueSearch(filter.Values);
            List<SearchResult> d = _searchService.SearchForDocumentsByValues(filter);
            return Ok(d);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult SearchByFreeTxt(FreeTxtSearchFilter searchObj)
        {
            List<SearchResult> d = _searchService.SearchForDocumentsByFreeText(searchObj);
            return Ok(d);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetDocumentScan(int imageId)
        {
            DocumentScanDTO scan = _documentService.GetDocumentScanById(imageId);
            return File(scan.ScanImage, scan.ContentType,scan.Name);
        }

        
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetOrphans()
        {
            List<DocumentGetDTO> orphans = _documentService.GetOrphanDocuments().ToList();
            return Ok(orphans);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetDocumentHistory(int docId)
        {
            List<dynamic> versions = _documentService.GetDocumentHistory(docId);

            return Ok(versions);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult SendDocumentScansByEmail(DocumentScanEmail email)
        {
            _documentService.SendDocumentScansEmail(email);
            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetDocumentScansByVersionIds(List<int> versionIds)
        {
            var scans = _documentService.GetDocumentsScanByVersionIds(versionIds);
            return Ok(scans);
        }
    }
}
