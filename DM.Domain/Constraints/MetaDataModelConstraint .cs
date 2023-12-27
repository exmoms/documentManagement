using DM.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class MetaDataModelConstraint
    {
        public MetaDataModelConstraint(EntityTypeBuilder<MetaDataModel> entityBuilder)
        {
            entityBuilder.Property(t => t.MetaDataModelName).IsRequired();
            entityBuilder.HasIndex(t => t.MetaDataModelName).IsUnique();
            entityBuilder.Property(b => b.AddedDate).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entityBuilder.HasQueryFilter(p => p.DeletedDate == null);
        }
    }
}
