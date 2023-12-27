using System;
using System.Collections.Generic;

namespace DM.Domain.Models
{
    public class DocumentSet 
    {
        public int ID { get; set; }
        public string Name { get; set; }

        // collection of DocumentSet_Documents
        public List<DocumentSet_Document> Set_Documents { get; set; }

        // collection of child sets
        public List<RecursiveDocumentSet> ChildDocumentsSets { get; set; }

        // collection of parents sets
        public List<RecursiveDocumentSet> ParentDocumentsSets { get; set; }

        // Forgien-key to User
        public int UserId { get; set; }
        public ApplicationUser User { get; set; }
        public DateTime AddedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
