using DM.Domain.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class MetaDataAttributeConstraint
    {
        public MetaDataAttributeConstraint(EntityTypeBuilder<MetaDataAttribute> entityBuilder)
        {
            entityBuilder.Property(t => t.MetaDataAttributeName).IsRequired();
        }
    }
}
