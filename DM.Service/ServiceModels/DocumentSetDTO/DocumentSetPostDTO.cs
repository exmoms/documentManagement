using DM.Domain.Models;
using System.Collections.Generic;

namespace DM.Service.ServiceModels.DocumentSetDTO
{
    public class DocumentSetPostDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ParentDocumentSet { get; set; }

        public DocumentSet GetEntity()
        {
            DocumentSet ds = new DocumentSet
            {
                ID = Id,
                Name = Name
            };
            if (ParentDocumentSet != 0)
            {
                ds.ParentDocumentsSets = new List<RecursiveDocumentSet>();
                RecursiveDocumentSet rec2 = new RecursiveDocumentSet();
                rec2.ParentDocumentSetId = ParentDocumentSet;
                ds.ParentDocumentsSets.Add(rec2);
            }


            return ds;

        }
    }
}
