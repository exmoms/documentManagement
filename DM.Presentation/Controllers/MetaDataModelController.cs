using DM.Service.Interfaces;
using DM.Service.ServiceModels.MetaDataModelDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using System.Collections.Generic;
using System.Linq;

namespace DM.Presentation.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    [ApiController]
    [Authorize(Roles = "SuperAdmin, Admin, User")]
    public class MetaDataModelController : ControllerBase
    {
        private readonly IMetaDataModelService _metaDataModelSerivce;

        public MetaDataModelController(IMetaDataModelService metaDataModelSerivce)
        {
            this._metaDataModelSerivce = metaDataModelSerivce;
        }

        [HttpGet]
        public IEnumerable<dynamic> Get()
        {
            return _metaDataModelSerivce.GetMetaDataModels().Select(m => new { m.Id, m.MetaDataModelName, m.DocumentClassName, m.AddedDate, m.UserName });
        }

        [HttpGet]
        [Route("[action]")]
        public IEnumerable<dynamic> GetMetaDataModelsIdName()
        {
            return _metaDataModelSerivce.GetMetaDataModels().Select(model => new { model.Id, model.MetaDataModelName});
        }


        [HttpGet("{id}")]
        public IActionResult GetMetaDataModelById(int id)
        {
            MetaDataModelDTO model = _metaDataModelSerivce.GetMetaDataModelById(id);
            return Ok(model);
        }

        [HttpGet]
        [Route("[action]")]
        public List<dynamic> GetMetaDataModelsByClassId(int classId)
        {
            return _metaDataModelSerivce.GetMetaDataModelsByClassId(classId);
        }

        [HttpPost]
        [Route("[action]")]
        [Authorize(Roles = "SuperAdmin, Admin")]
        public IActionResult AddNewMetaDataModel(MetaDataModelDTO mdm)
        {
            _metaDataModelSerivce.AddMetaDataModel(mdm);
            return Ok();
        }

        [HttpDelete]
        [Route("[action]")]
        [Authorize(Roles = "SuperAdmin, Admin")]
        public IActionResult DeleteMetaDataModel(int meta_data_id)
        {
            _metaDataModelSerivce.DeleteMetaDataModel(meta_data_id);
            return Ok();
        }

    }
}