using DM.Domain.Models;

namespace DM.Service.ServiceModels.MetaDataModelDTO
{
    public class MetaDataAttributeDTO
    {
        public int Id { get; set; }
        public string MetaDataAttributeName { get; set; }
        public bool IsRequired { get; set; }
        public int DataTypeID { get; set; }

        public static MetaDataAttributeDTO GetDTO(MetaDataAttribute attribute)
        {
            MetaDataAttributeDTO dto = new MetaDataAttributeDTO
            {
                Id = attribute.ID,
                MetaDataAttributeName = attribute.MetaDataAttributeName,
                IsRequired = attribute.IsRequired,
                DataTypeID = attribute.DataTypeID
            };

            return dto;
        }

        public MetaDataAttribute GetEntity()
        {
            MetaDataAttribute attribute = new MetaDataAttribute
            {
                MetaDataAttributeName = MetaDataAttributeName,
                IsRequired = IsRequired,
                DataTypeID = DataTypeID
            };

            return attribute;
        }
    }
}
