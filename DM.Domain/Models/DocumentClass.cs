using System;
using System.Collections.Generic;

namespace DM.Domain.Models
{
    public class DocumentClass
    {
        public int ID { get; set; }
        public string DocumentClassName { get; set; }

        // collection of MetaDataModels
        public List<MetaDataModel> MetaDataModels { get; set; }

        // Forgien-key to User
        public int UserId { get; set; }
        public ApplicationUser User { get; set; }

        public DateTime AddedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
    }
}
