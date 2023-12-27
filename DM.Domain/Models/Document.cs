using System;
using System.Collections.Generic;

namespace DM.Domain.Models
{
    public class Document
    {
        public int ID { get; set; }
        public string Name { get; set; }

        //forgien-key for MetaDataModel
        public int MetaDataModelId { get; set; }
        public MetaDataModel MetaDataModel { get; set; }

        // forgien key to the id of the last version of the document
        public int? LatestVersionId { get; set; }
        public DocumentVersion LatestDocumentVersion { get; set; }

        // Collection of DocumentVersion
        public List<DocumentVersion> DocumentVersions { get; set; }

        // Collection of DocumentSets that this documents belongs to
        public List<DocumentSet_Document> Set_Documents { get; set; }

        // Collection of attachment
        public List<Attachment> Attachments { get; set; }
        public DateTime AddedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool IsArchived { get; set; }
    }
}
