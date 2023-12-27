using System;

namespace DM.Domain.Models
{
    public class Attachment
    {
        public int ID { get; set; }
        public string Name { get; set; }

        public byte[] AttachmentFile { get; set; }

        public string ContentType { get; set; }

        public int DocumentId { get; set; }
        public Document Document { get; set; }

        // Foreign-key to CompoundModelID
        public int? CompoundModelID { get; set; }
        public CompoundModel CompoundModel { get; set; }
        public DateTime AddedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
