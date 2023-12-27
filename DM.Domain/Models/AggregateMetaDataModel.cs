using System.Collections.Generic;

namespace DM.Domain.Models
{
    public class AggregateMetaDataModel
    {
        public int ID { get; set; }
        public int ParentMetadataModelId { get; set; }
        public int ChildMetadataModelId { get; set; }
        public string AggregateName { get; set; }
        public MetaDataModel ParentMetaDataModel { get; set; }
        public MetaDataModel ChildMetaDataModel { get; set; }
        public List<AggregateDocument> AggregateDocuments { get; set; }
    }
}
