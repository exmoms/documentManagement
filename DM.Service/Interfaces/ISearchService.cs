using DM.Service.ServiceModels.SerachModels;
using System.Collections.Generic;

namespace DM.Service.Interfaces
{
    public interface ISearchService
    {
        public List<SearchResult> SearchForDocumentsByValues(ValuesSearchFilter filter);
        public List<SearchResult> SearchForDocumentsByFreeText(FreeTxtSearchFilter searchObj);
        public void ConvertJsonElementsToValueSearch(List<ValueSearch> values);
    }
}
