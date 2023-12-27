
namespace DM.Service.ServiceModels.SerachModels
{
    public class  ValueSearch
    {
        public int TypeId { get; set; }
        public int AttributeId { get; set; }
        public object MinValue { get; set; }
        public object MaxValue { get; set; }
    }
}
