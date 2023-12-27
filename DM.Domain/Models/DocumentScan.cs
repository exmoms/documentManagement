using System;
using System.Collections.Generic;
using System.Text;

namespace DM.Domain.Models
{
    public class DocumentScan
    {
        public int Id { get; set; }
        public byte[] DocumnetScan { get; set; }
        public string Name { get; set; }
        public string ContentType { get; set; }
        public int MinDocumentVersionId { get; set; }
        public int? MaxDocumentVersionId { get; set; }
        public DocumentVersion DocumentVersion { get; set; }
    }
}
