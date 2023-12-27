using DM.Domain.Enums;
using DM.Domain.Models;
using DM.Service.Utils;
using System;

namespace DM.Service.ServiceModels.DocumentDTO
{
    public class ValueDTO
    {
        public int TypeId { get; set; }
        public int AttributeId { get; set; }
        public string AttributeName { get; set; }
        public object Value { get; set; }
        public bool IsRequired { get; set; }

        public static ValueDTO GetDTO(BoolValue value)
        {
            ValueDTO res = new ValueDTO
            {
                AttributeId = value.MetaDataAttributeId,
                AttributeName = value.MetaDataAttribute.MetaDataAttributeName,
                IsRequired = value.MetaDataAttribute.IsRequired,
                Value = value.Value,
                TypeId = (int)DATA_TYPES.BOOL
            };

            return res;
        }

        public static ValueDTO GetDTO(DateValue value)
        {
            ValueDTO res = new ValueDTO
            {
                AttributeId = value.MetaDataAttributeId,
                AttributeName = value.MetaDataAttribute.MetaDataAttributeName,
                IsRequired = value.MetaDataAttribute.IsRequired,
                Value = value.Value,
                TypeId = (int)DATA_TYPES.DATE
            };

            return res;
        }

        public static ValueDTO GetDTO(DecimalValue value)
        {
            ValueDTO res = new ValueDTO
            {
                AttributeId = value.MetaDataAttributeId,
                AttributeName = value.MetaDataAttribute.MetaDataAttributeName,
                IsRequired = value.MetaDataAttribute.IsRequired,
                Value = value.Value,
                TypeId = (int)DATA_TYPES.DECIMAL
            };

            return res;
        }

        public static ValueDTO GetDTO(DoubleValue value)
        {
            ValueDTO res = new ValueDTO
            {
                AttributeId = value.MetaDataAttributeId,
                AttributeName = value.MetaDataAttribute.MetaDataAttributeName,
                IsRequired = value.MetaDataAttribute.IsRequired,
                Value = value.Value,
                TypeId = (int)DATA_TYPES.DOUBLE
            };

            return res;
        }

        public static ValueDTO GetDTO(IntValue value)
        {
            ValueDTO res = new ValueDTO
            {
                AttributeId = value.MetaDataAttributeId,
                AttributeName = value.MetaDataAttribute.MetaDataAttributeName,
                IsRequired = value.MetaDataAttribute.IsRequired,
                Value = value.Value,
                TypeId = (int)DATA_TYPES.INTEGER
            };

            return res;
        }

        public static ValueDTO GetDTO(StringValue value)
        {
            ValueDTO res = new ValueDTO
            {
                AttributeId = value.MetaDataAttributeId,
                AttributeName = value.MetaDataAttribute.MetaDataAttributeName,
                IsRequired = value.MetaDataAttribute.IsRequired,
                Value = value.Value,
                TypeId = (int)DATA_TYPES.STRING
            };

            return res;
        }

        public BoolValue GetBool()
        {
            BoolValue value = new BoolValue
            {
                MetaDataAttributeId = AttributeId,
                Value = (bool?)Value
            };

            return value;
        }

        public DateValue GetDate()
        {
            DateValue value = new DateValue
            {
                MetaDataAttributeId = AttributeId,
                Value = (DateTime?)Value
            };

            return value;
        }

        public DecimalValue GetDecimal()
        {
            DecimalValue value = new DecimalValue
            {
                MetaDataAttributeId = AttributeId,
                Value = (decimal?)Value
            };

            return value;
        }

        public DoubleValue GetDouble()
        {
            DoubleValue value = new DoubleValue
            {
                MetaDataAttributeId = AttributeId,
                Value = (double?)Value
            };

            return value;
        }

        public IntValue GetInt()
        {
            IntValue value = new IntValue
            {
                MetaDataAttributeId = AttributeId,
                Value = (int?)Value
            };

            return value;
        }

        public StringValue GetString()
        {
            string value = (string)this.Value;
            StringValue SValue = new StringValue
            {
                MetaDataAttributeId = AttributeId,
                Value = value,
                NormalizedValue = ArabicNormalizer.Normalize(value)
            };

            return SValue;
        }
    }
}
