using System.Collections.Generic;

using Microsoft.AspNetCore.Identity;

namespace DM.Domain.Models
{
    public class ApplicationUser : IdentityUser<int>
    {
        public string Language { get; set; }

        // Collection of Document versions
        public List<DocumentVersion> DocumentVersions { get; set; }

        // Collection of Metadata models
        public List<MetaDataModel> MetaDataModels { get; set; }

        // Collection of Document classes
        public List<DocumentClass> DocumentClasses { get; set; }

        // Collection of Document sets
        public List<DocumentSet> DocumentSets { get; set; }

    }
}
