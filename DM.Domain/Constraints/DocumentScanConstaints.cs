using DM.Domain.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class DocumentScanConstaints
    {
        public DocumentScanConstaints(EntityTypeBuilder<DocumentScan> entityBuilder)
        {
            // one-to-many relationship (one DocumentVersion may has many Scans)
            entityBuilder.HasOne(t => t.DocumentVersion).WithMany(t => t.DocumnetScans).HasForeignKey(t=>t.MinDocumentVersionId);

        }
    }
}
