using DM.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class IntValueConstraints
    {
        public IntValueConstraints(EntityTypeBuilder<IntValue> entityBuilder)
        {
            // Define The primary key for DateValues 
            entityBuilder.HasKey(t => new { t.MinDocumentVersionId, t.MetaDataAttributeId });

            // one-to-many relationship (one MetaDataAttribute may has many DateValues)
            entityBuilder.HasOne(t => t.MetaDataAttribute).WithMany(t => t.IntValues).OnDelete(DeleteBehavior.NoAction);
            // one-to-many relationship (one DocumentVersion may has many DateValues)
            entityBuilder.HasOne(t => t.DocumentVersion).WithMany(t => t.IntValues).HasForeignKey(t => t.MinDocumentVersionId);
        }
    }
}
