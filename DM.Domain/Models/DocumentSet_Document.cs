namespace DM.Domain.Models
{
    public class DocumentSet_Document
    {
        // Forgien-key to AggregateDocument
        public int DocumentSetId { get; set; }
        public DocumentSet DocumentSet { get; set; }

        // Forgien-key to Document
        public int DocumentId { get; set; }
        public Document Document { get; set; }
    }
}
