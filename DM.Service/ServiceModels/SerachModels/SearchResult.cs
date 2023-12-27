using System.Collections.Generic;

namespace DM.Service.ServiceModels.SerachModels
{
    public class SearchResult
    {
        public int DocumentId { get; set; }
        public string DocumentName { get; set; }
        public int LatestVersion { get; set; }
        public List<dynamic> Values { get; set; }
    }
}
