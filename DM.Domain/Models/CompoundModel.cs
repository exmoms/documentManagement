using System.Collections.Generic;

namespace DM.Domain.Models
{
    public class CompoundModel
    {
        public int ID { get; set; }
        public int MetaDataModelID { get; set; }
        public bool IsRequired { get; set; }
        public string Caption { get; set; }
        public MetaDataModel MetaDataModel { get; set; }

        // Collection of Attachments 
        public List<Attachment> Attachments { get; set; }
    }
}
