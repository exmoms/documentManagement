using DM.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class ApplicationUserConstraints
    {
        public ApplicationUserConstraints(EntityTypeBuilder<ApplicationUser> entityBuilder)
        {
            entityBuilder.HasMany(t => t.DocumentClasses).WithOne(t => t.User).HasForeignKey(t => t.UserId).OnDelete(DeleteBehavior.NoAction);
            entityBuilder.HasMany(t => t.MetaDataModels).WithOne(t => t.User).HasForeignKey(t => t.UserId).OnDelete(DeleteBehavior.NoAction);
            entityBuilder.HasMany(t => t.DocumentVersions).WithOne(t => t.User).HasForeignKey(t => t.UserId).OnDelete(DeleteBehavior.NoAction);
            entityBuilder.HasMany(t => t.DocumentSets).WithOne(t => t.User).HasForeignKey(t => t.UserId).OnDelete(DeleteBehavior.NoAction);
            entityBuilder.Property(t => t.Language).HasDefaultValue("en");
        }
    }
}
