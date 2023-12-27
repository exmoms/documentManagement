using DM.Domain.Models;

namespace DM.Service.ServiceModels.MetaDataModelDTO
{
    public class CompoundModelDTO
    {
        public int Id { get; set; }
        public int MetadataModelId { get; set; }
        public bool IsRequired { get; set; }
        public string Caption { get; set; }

        public static CompoundModelDTO GetDTO(CompoundModel cm)
        {
            CompoundModelDTO dto = new CompoundModelDTO
            {
                Id = cm.ID,
                MetadataModelId = cm.MetaDataModelID,
                IsRequired = cm.IsRequired,
                Caption = cm.Caption
            };

            return dto;
        }

        public CompoundModel GetEntity()
        {
            CompoundModel cm = new CompoundModel
            {
                MetaDataModelID = MetadataModelId,
                IsRequired = IsRequired,
                Caption = Caption
            };

            return cm;
        }
    }
}
