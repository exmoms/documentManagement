using System;
using System.Collections.Generic;

namespace DM.Domain.Models
{
    public class MetaDataModel
    {
        public int ID { get; set; }
        public string MetaDataModelName { get; set; }

        // forgien-key for Document Class
        public int DocumentClassId { get; set; }
        public DocumentClass DocumentClass { get; set; }

        // Collection of Documents
        public List<Document> Documents { get; set; }

        // Collection of
        public List<AggregateMetaDataModel> ChildMetaDataModels { get; set; }

        // Collection of
        public List<AggregateMetaDataModel> ParentMetaDataModels { get; set; }

        // Collection of Attributes
        public List<MetaDataAttribute> MetaDataAttributes { get; set; }

        public List<CompoundModel> CompoundModels { get; set; }

        // Forgien-key to User
        public int UserId { get; set; }
        public ApplicationUser User { get; set; }
        public DateTime AddedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public DateTime? DeletedDate { get; set; }

    }
}
