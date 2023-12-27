using DM.Domain.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class DataTypeConstraints
    {
        public DataTypeConstraints(EntityTypeBuilder<DataType> entityBuilder)
        {
            entityBuilder.Property(t => t.DataTypeName).IsRequired();
            entityBuilder.HasIndex(t => t.DataTypeName).IsUnique();
        }
    }
}
