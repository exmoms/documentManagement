using DM.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class RecursiveDocumentSetConstraints
    {
        public RecursiveDocumentSetConstraints(EntityTypeBuilder<RecursiveDocumentSet> entityBuilder)
        {
            // Define The primary key for RecursiveDocumentSet 
            entityBuilder.HasKey(t => new { t.ParentDocumentSetId, t.ChildDocumentSetId });

            // many-to-many relationship (parent document set - child document set)
            entityBuilder.HasOne(t => t.ParentDocumentSet).WithMany(t => t.ChildDocumentsSets).HasForeignKey(t => t.ParentDocumentSetId);
            entityBuilder.HasOne(t => t.ChildDocumentSet).WithMany(t => t.ParentDocumentsSets).HasForeignKey(t => t.ChildDocumentSetId).OnDelete(DeleteBehavior.NoAction);
        }
    }
}
