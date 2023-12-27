using Microsoft.AspNetCore.Http;
using System.Security.Claims;
namespace DM.Service.Utils
{
    public class UserInformationService : IUserInformationService
    {
        private readonly IHttpContextAccessor _httpContext;
        public UserInformationService(IHttpContextAccessor httpContext)
        {
            _httpContext = httpContext;
        }

        public int GetUserID()
        {
            int userID =  int.Parse(_httpContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            return userID;
        }
    }
}
