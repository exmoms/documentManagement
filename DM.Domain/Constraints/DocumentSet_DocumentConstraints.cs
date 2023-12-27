using DM.Domain.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class DocumentSet_DocumentConstraints
    {
        public DocumentSet_DocumentConstraints(EntityTypeBuilder<DocumentSet_Document> entityBuilder)
        {
            // Define The primary key for DocumentSet_Document 
            entityBuilder.HasKey(t => new { t.DocumentSetId, t.DocumentId });

            // many-to-many relationship (Document - DocumentSet)
            entityBuilder.HasOne(t => t.Document).WithMany(t => t.Set_Documents).HasForeignKey(t => t.DocumentId);
            entityBuilder.HasOne(t => t.DocumentSet).WithMany(t => t.Set_Documents).HasForeignKey(t => t.DocumentSetId);
        }

    }
}
