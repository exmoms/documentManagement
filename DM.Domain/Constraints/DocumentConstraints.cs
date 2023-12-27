using DM.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class DocumentConstraints
    {
        public DocumentConstraints(EntityTypeBuilder<Document> entityBuilder)
        {
            entityBuilder.Property(t => t.Name).IsRequired();
            entityBuilder.HasOne(t => t.LatestDocumentVersion).WithOne().HasForeignKey<Document>(k => k.LatestVersionId).OnDelete(DeleteBehavior.NoAction);
            entityBuilder.Property(b => b.AddedDate).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entityBuilder.Property(b => b.IsArchived).HasDefaultValue(false);
            entityBuilder.HasQueryFilter(p => p.DeletedDate == null && p.IsArchived == false);
        }
    }
}