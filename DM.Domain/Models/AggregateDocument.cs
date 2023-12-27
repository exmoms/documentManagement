namespace DM.Domain.Models
{
    public class AggregateDocument
    {
        // Forgien-key to AggregateDocument
        public int MinParentDocumentVersionId { get; set; }
        public int? MaxParentDocumentVersionId { get; set; }
        public int ChildDocumentVersionId { get; set; }
        public DocumentVersion MinParentDocumentVersion { get; set; }
        public DocumentVersion ChildDocumentVersion { get; set; }

        // Forgien-key to SubModel Attribute ( a row in AggregateMetaDataModel)
        public int AggregateMetaDataModelID { get; set; }
        public AggregateMetaDataModel AggregateMetaDataModel { get; set; }
    }
}
