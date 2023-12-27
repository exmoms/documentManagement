using FluentValidation;
using Microsoft.Extensions.Localization;
using System.Collections.Generic;

namespace DM.Service.ServiceModels.UserDTO
{
    public class EditUserRolesDTO
    {
        public int UserId { get; set; }
        public List<string> AssignedRoles { get; set; }
        public List<string> UnassignedRoles { get; set; }
    }
    public class UserRolesValidator : AbstractValidator<EditUserRolesDTO>
    {
        public UserRolesValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.UserId).NotEmpty().WithName(x => localizer["UserId"]);
        }
    }
}
