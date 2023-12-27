using FluentValidation;
using Microsoft.Extensions.Localization;

namespace DM.Service.ServiceModels.UserDTO
{
    public class LoginDTO
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
    public class LoginValidator : AbstractValidator<LoginDTO>
    {
        public LoginValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.UserName).NotEmpty().WithName(x => localizer["UserName"]);
            RuleFor(x => x.Password).NotEmpty().WithName(x => localizer["Password"]);
        }
    }
}
