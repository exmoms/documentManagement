namespace DM.Domain.Models
{
    public class RecursiveDocumentSet
    {
        // Forgien-key to Parent document set
        public int ParentDocumentSetId { get; set; }
        public DocumentSet ParentDocumentSet { get; set; }

        // Forgien-key to child document set
        public int ChildDocumentSetId { get; set; }
        public DocumentSet ChildDocumentSet { get; set; }
    }
}
