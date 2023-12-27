using System.Collections.Generic;

namespace DM.Domain.Models
{
    public class MetaDataAttribute
    {
        public int ID { get; set; }
        public string MetaDataAttributeName { get; set; }

        public bool IsRequired { get; set; }

        // forgien-key to DataType
        public int DataTypeID { get; set; }
        public DataType DataType { get; set; }

        // forgien-key to DataType
        public int MetaDataModelID { get; set; }
        public MetaDataModel MetaDataModel { get; set; }

        // Collection of DoubleValues 
        public List<DoubleValue> DoubleValues { get; set; }

        // Collection of StringValue
        public List<StringValue> StringValues { get; set; }

        // Collection of DateValue
        public List<DateValue> DateValues { get; set; }

        // Collection of BoolValue
        public List<BoolValue> BoolValues { get; set; }

        // Collection of DateValue
        public List<DecimalValue> DecimalValues { get; set; }

        // Collection of BoolValue
        public List<IntValue> IntValues { get; set; }

    }
}
