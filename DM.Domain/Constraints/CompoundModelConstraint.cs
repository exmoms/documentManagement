using DM.Domain.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DM.Domain.Constraints
{
    public class CompoundModelConstraint
    {
        public CompoundModelConstraint(EntityTypeBuilder<CompoundModel> entityBuilder)
        {
            entityBuilder.Property(t => t.Caption).IsRequired();
        }
        
    }
}
