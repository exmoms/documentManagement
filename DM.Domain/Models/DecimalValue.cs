namespace DM.Domain.Models
{
    public class DecimalValue
    {
        // Forgien-key to metaDataAttribute
        public int MetaDataAttributeId { get; set; }
        public MetaDataAttribute MetaDataAttribute { get; set; }

        // Forgien-key to DocumentVersion
        public int MinDocumentVersionId { get; set; }
        public DocumentVersion DocumentVersion { get; set; }

        public int? MaxDocumentVersionId { get; set; }
        public decimal? Value { get; set; }

    }
}
