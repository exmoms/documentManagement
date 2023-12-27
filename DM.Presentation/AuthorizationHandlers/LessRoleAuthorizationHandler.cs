using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DM.Presentation.AuthorizationHandlers
{
    public class LessRoleAuthorizationHandler :
    AuthorizationHandler<LessRoleRequirement, List<string>>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
                                                       LessRoleRequirement requirement,
                                                       List<string> roles)
        {
            if ((context.User.IsInRole("SuperAdmin") && !roles.Contains("SuperAdmin")) ||
                (context.User.IsInRole("Admin") && !roles.Contains("SuperAdmin") && !roles.Contains("Admin")))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }

    public class LessRoleRequirement : IAuthorizationRequirement { }
}
