using DM.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class DocumentVersionsConstraints
    {
        public DocumentVersionsConstraints(EntityTypeBuilder<DocumentVersion> entityBuilder)
        {
            entityBuilder.Property(t => t.VersionMessage).IsRequired();
            entityBuilder.Property(b => b.AddedDate).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entityBuilder.HasQueryFilter(p => p.DeletedDate == null);
        }
    }
}
