using DM.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DM.Presentation.AuthorizationHandlers
{
    public class ProfileOwnerAuthorizationHandler :
    AuthorizationHandler<ProfileOwnerRequirement, ApplicationUser>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
                                                       ProfileOwnerRequirement requirement,
                                                       ApplicationUser resource)
        {
            if (int.Parse(context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value) == resource.Id)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }

    public class ProfileOwnerRequirement : IAuthorizationRequirement { }
}
