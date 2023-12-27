using DM.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class AttachmentConstraints
    {
        public AttachmentConstraints(EntityTypeBuilder<Attachment> entityBuilder)
        {
            entityBuilder.Property(t => t.Name).IsRequired();
            entityBuilder.HasOne(t => t.CompoundModel).WithMany(t => t.Attachments).OnDelete(DeleteBehavior.NoAction);
            entityBuilder.Property(b => b.AddedDate).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entityBuilder.HasIndex(t => new { t.DocumentId, t.CompoundModelID }).IsUnique();
        }
    }
}
