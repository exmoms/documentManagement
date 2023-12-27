using FluentValidation;
using Microsoft.Extensions.Localization;

namespace DM.Service.ServiceModels.UserDTO
{
    public class RoleDTO
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public bool IsSelected { get; set; }
    }
    public class RoleValidator : AbstractValidator<RoleDTO>
    {
        public RoleValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.RoleName).NotEmpty().WithName(x => localizer["RoleName"]);
         }
    }
}
