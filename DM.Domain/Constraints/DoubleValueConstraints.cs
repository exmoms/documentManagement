using DM.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class DoubleValueConstraints
    {
        public DoubleValueConstraints(EntityTypeBuilder<DoubleValue> entityBuilder)
        {
            // Define The primary key for NumberValues 
            entityBuilder.HasKey(t => new { t.MinDocumentVersionId, t.MetaDataAttributeId });

            // one-to-many relationship (one MetaDataAttribute may has many NumberValues)
            entityBuilder.HasOne(t => t.MetaDataAttribute).WithMany(t => t.DoubleValues).OnDelete(DeleteBehavior.NoAction);
            // one-to-many relationship (one DocumentVersion may has many NumberValues)
            entityBuilder.HasOne(t => t.DocumentVersion).WithMany(t => t.DoubleValues).HasForeignKey(t => t.MinDocumentVersionId);
        }
    }
}
