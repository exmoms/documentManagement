using DM.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class DateValueConstraints
    {
        public DateValueConstraints(EntityTypeBuilder<DateValue> entityBuilder)
        {
            // Define The primary key for DateValues 
            entityBuilder.HasKey(t => new { t.MinDocumentVersionId, t.MetaDataAttributeId });

            // one-to-many relationship (one MetaDataAttribute may has many DateValues)
            entityBuilder.HasOne(t => t.MetaDataAttribute).WithMany(t => t.DateValues).OnDelete(DeleteBehavior.NoAction);
            // one-to-many relationship (one DocumentVersion may has many DateValues)
            entityBuilder.HasOne(t => t.DocumentVersion).WithMany(t => t.DateValues).HasForeignKey(t => t.MinDocumentVersionId);
        }
    }
}
