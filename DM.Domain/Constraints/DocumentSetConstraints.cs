using DM.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class DocumentSetConstraints
    {
        public DocumentSetConstraints(EntityTypeBuilder<DocumentSet> entityBuilder)
        {
            entityBuilder.Property(t => t.Name).IsRequired();
            entityBuilder.Property(b => b.AddedDate).HasDefaultValueSql("CURRENT_TIMESTAMP");
        }
    }
}
