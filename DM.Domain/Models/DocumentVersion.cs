using System;
using System.Collections.Generic;

namespace DM.Domain.Models
{
    public class DocumentVersion
    {
        public int ID { get; set; }
        public string VersionMessage { get; set; }
        public List<DocumentScan> DocumnetScans { get; set; }

        // Forgien-key to DocumentVersion
        public int DocumentId { get; set; }
        public Document Document { get; set; }

        // Collection of StringValues
        public List<StringValue> StringValues { get; set; }

        // Collection of NumberValues
        public List<DoubleValue> DoubleValues { get; set; }

        // Collection of DateValue
        public List<DateValue> DateValues { get; set; }

        // Collection of BoolValue
        public List<BoolValue> BoolValues { get; set; }

        // Collection of IntValues
        public List<IntValue> IntValues { get; set; }

        // Collection of DecimalValue
        public List<DecimalValue> DecimalValues { get; set; }

        // Collection: this documents belongs to one aggregate document
        public List<AggregateDocument> ChildDocumentVersions { get; set; }

        // Collection: This aggregate document has collection of document
        public List<AggregateDocument> ParentDocumentVersions { get; set; }

        // Forgien-key to User
        public int UserId { get; set; }
        public ApplicationUser User { get; set; }

        public DateTime AddedDate { get; set; }
        public DateTime? DeletedDate { get; set; }

    }
}
