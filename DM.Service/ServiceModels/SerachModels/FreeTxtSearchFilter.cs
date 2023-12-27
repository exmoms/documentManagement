
namespace DM.Service.ServiceModels.SerachModels
{
    public class FreeTxtSearchFilter
    {
        public string Text { get; set; }
        public int? ModelId { get; set; }
        public int? ClassId { get; set; }
        public int? SetId { get; set; }
        public int? SetIdExclude { get; set; }
    }
}
