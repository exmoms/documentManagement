using DM.Domain.Models;

namespace DM.Service.ServiceModels.MetaDataModelDTO
{
    public class AggregateMetaDataModelDTO
    {
        public int Id { get; set; }
        public int ChildMetaDataModelId { get; set; }
        public int ParentMetaDataModelId { get; set; }
        public string AggregateName { get; set; }
        public string ChildMetaDataModelName { get; set; }

        public static AggregateMetaDataModelDTO GetDTO(AggregateMetaDataModel amd)
        {
            AggregateMetaDataModelDTO dto = new AggregateMetaDataModelDTO();
            dto.Id = amd.ID;
            dto.ChildMetaDataModelId = amd.ChildMetadataModelId;
            dto.ParentMetaDataModelId = amd.ParentMetadataModelId;
            dto.AggregateName = amd.AggregateName;
            dto.ChildMetaDataModelName = amd.ChildMetaDataModel.MetaDataModelName;

            return dto;
        }

        public AggregateMetaDataModel GetEntity()
        {
            AggregateMetaDataModel amd = new AggregateMetaDataModel();
            amd.ChildMetadataModelId = ChildMetaDataModelId;
            amd.ParentMetadataModelId = ParentMetaDataModelId;
            amd.AggregateName = AggregateName;

            return amd;
        }
    }
}
