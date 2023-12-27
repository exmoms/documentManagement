using DM.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class StringValueConstraints
    {
        public StringValueConstraints(EntityTypeBuilder<StringValue> entityBuilder)
        {
            // Define The primary key for StringValues 
            entityBuilder.HasKey(t => new { t.MinDocumentVersionId, t.MetaDataAttributeId });

            // one-to-many relationship (one MetaDataAttribute may has many StringValues)
            entityBuilder.HasOne(t => t.MetaDataAttribute).WithMany(t => t.StringValues).OnDelete(DeleteBehavior.NoAction);
            // one-to-many relationship (one DocumentVersion may has many StringValues)
            entityBuilder.HasOne(t => t.DocumentVersion).WithMany(t => t.StringValues).HasForeignKey(t=>t.MinDocumentVersionId);

        }
    }
}
