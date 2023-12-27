using DM.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class AggregateMetaDataModelConstraint
    {

        public AggregateMetaDataModelConstraint(EntityTypeBuilder<AggregateMetaDataModel> entityBuilder)
        {
            // many-to-many relationship (MetaDataModel - AggregateMetaDataModel) (self many-to-many relationship)
            entityBuilder.HasOne(t => t.ParentMetaDataModel).WithMany(t => t.ChildMetaDataModels).HasForeignKey(t => t.ParentMetadataModelId);
            entityBuilder.HasOne(t => t.ChildMetaDataModel).WithMany(t => t.ParentMetaDataModels).HasForeignKey(t => t.ChildMetadataModelId).OnDelete(DeleteBehavior.NoAction);

            entityBuilder.Property(t => t.AggregateName).IsRequired();
            entityBuilder.HasIndex(t => new { t.ParentMetadataModelId, t.ChildMetadataModelId, t.AggregateName }).IsUnique();

        }
    }
}
