using System.Collections.Generic;

namespace DM.Service.ServiceModels.SerachModels
{
    public class ValuesSearchFilter
    {
        public int? SetId { get; set; }
        public int? SetIdExclude { get; set; }
        public List<ValueSearch> Values { get; set; }
    }
}
