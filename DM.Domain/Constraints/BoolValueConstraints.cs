using DM.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class BoolValueConstraints
    {
        public BoolValueConstraints(EntityTypeBuilder<BoolValue> entityBuilder)
        {
            // Define The primary key for BoolValues 
            entityBuilder.HasKey(t => new { t.MinDocumentVersionId, t.MetaDataAttributeId });

            // one-to-many relationship (one MetaDataAttribute may has many BoolValues)
            entityBuilder.HasOne(t => t.MetaDataAttribute).WithMany(t => t.BoolValues).OnDelete(DeleteBehavior.NoAction);
            // one-to-many relationship (one DocumentVersion may has many BoolValues)
            entityBuilder.HasOne(t => t.DocumentVersion).WithMany(t => t.BoolValues).HasForeignKey(t => t.MinDocumentVersionId);
        }
    }
}
