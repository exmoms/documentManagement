using DM.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class DecimalValueConstraints
    {
        public DecimalValueConstraints(EntityTypeBuilder<DecimalValue> entityBuilder)
        {
            // configure decimal value precision and scale
            entityBuilder.Property(t => t.Value).HasColumnType("decimal(18,5)");

            // Define The primary key for DateValues 
            entityBuilder.HasKey(t => new { t.MinDocumentVersionId, t.MetaDataAttributeId });

            // one-to-many relationship (one MetaDataAttribute may has many DateValues)
            entityBuilder.HasOne(t => t.MetaDataAttribute).WithMany(t => t.DecimalValues).OnDelete(DeleteBehavior.NoAction);
            // one-to-many relationship (one DocumentVersion may has many DateValues)
            entityBuilder.HasOne(t => t.DocumentVersion).WithMany(t => t.DecimalValues).HasForeignKey(t => t.MinDocumentVersionId);
        }
    }
}
