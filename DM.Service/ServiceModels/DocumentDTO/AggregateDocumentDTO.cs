using DM.Domain.Models;

namespace DM.Service.ServiceModels.DocumentDTO
{
    public class AggregateDocumentDTO
    {
        public int ChildDocumentVersionId { get; set; }
        public int AggregateMetaDataModelID { get; set; }
        public string AggregateName { get; set; }
        public string DocumentName { get; set; }
        public int ChildMetadataModelId { get; set; }

        public static AggregateDocumentDTO GetDTO(AggregateDocument ad)
        {
            AggregateDocumentDTO dto = new AggregateDocumentDTO
            {
                ChildDocumentVersionId = ad.ChildDocumentVersionId,
                AggregateMetaDataModelID = ad.AggregateMetaDataModelID
            };

            if (ad.AggregateMetaDataModel != null)
            {
                dto.AggregateName = ad.AggregateMetaDataModel.AggregateName;
                dto.ChildMetadataModelId = ad.AggregateMetaDataModel.ChildMetadataModelId;
            }
            else
                dto.AggregateName = "";

            if (ad.ChildDocumentVersion != null && ad.ChildDocumentVersion.Document != null)
                dto.DocumentName = ad.ChildDocumentVersion.Document.Name;
            else
                dto.DocumentName = "Unknown";

            return dto;
        }

        public AggregateDocument GetEntity()
        {
            AggregateDocument ad = new AggregateDocument
            {
                AggregateMetaDataModelID = this.AggregateMetaDataModelID,
                ChildDocumentVersionId = this.ChildDocumentVersionId
            };

            return ad;
        }
    }
}
