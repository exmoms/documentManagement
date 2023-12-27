using DM.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class DocumentClassConstraint
    {
        public DocumentClassConstraint(EntityTypeBuilder<DocumentClass> entityBuilder)
        {
            entityBuilder.Property(t => t.DocumentClassName).IsRequired();
            entityBuilder.HasIndex(t => t.DocumentClassName).IsUnique();
            entityBuilder.Property(b => b.AddedDate).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entityBuilder.HasQueryFilter(t => t.DeletedDate == null);
        }
    }
}
