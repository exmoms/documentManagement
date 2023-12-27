using DM.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class AggregateDocumentConstraint 
    {
        public AggregateDocumentConstraint(EntityTypeBuilder<AggregateDocument> entityBuilder) 
        {
            // Define The primary key for AggregateDocument_Document 
            entityBuilder.HasKey(t => new { t.MinParentDocumentVersionId, t.ChildDocumentVersionId });

            // many-to-many relationship (ParentDocumentVersion may has many ChildDocumnetVersions) (self many-to-many relationship)
            entityBuilder.HasOne(t => t.MinParentDocumentVersion).WithMany(t => t.ChildDocumentVersions).HasForeignKey(t => t.MinParentDocumentVersionId);
            entityBuilder.HasOne(t => t.ChildDocumentVersion).WithMany(t => t.ParentDocumentVersions).HasForeignKey(t => t.ChildDocumentVersionId).OnDelete(DeleteBehavior.NoAction);
            // one-to-many relationship (AggregateDocument - AggregateModel)
            entityBuilder.HasOne(t => t.AggregateMetaDataModel).WithMany(t => t.AggregateDocuments).OnDelete(DeleteBehavior.NoAction);
        }

    }
}
