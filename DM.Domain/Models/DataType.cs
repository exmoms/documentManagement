using System.Collections.Generic;

namespace DM.Domain.Models
{
    public class DataType
    {
        public int ID { get; set; }
        public string DataTypeName { get; set; }

        // collection of MetaDataAttributes
        public List<MetaDataAttribute> MetaDataAttributes { get; set; }
    }
}
