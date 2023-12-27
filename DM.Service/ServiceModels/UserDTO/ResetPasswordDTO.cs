using FluentValidation;
using Microsoft.Extensions.Localization;

namespace DM.Service.ServiceModels.UserDTO
{
    public class ResetPasswordDTO
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
    public class ResetPasswordValidator : AbstractValidator<ResetPasswordDTO>
    {
        const string passwordErrorMessage = "must contain:" +
                           " a minimum of 1 lower case letter [a - z] and," +
                           " a minimum of 1 upper case letter [A - Z] and," +
                           " a minimum of 1 numeric character [0 - 9] and," +
                           " a minimum of 1 special character, " +
                           "And it must be at least 8 characters in length.";
        public ResetPasswordValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithName(x => localizer["Email"]);
            RuleFor(x => x.Token).NotEmpty();
            RuleFor(x => x.Password).NotEmpty().MinimumLength(8).Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w]).{8,}$").WithMessage(x => localizer["Password"] + ": " + localizer[passwordErrorMessage]);
            RuleFor(x => x.ConfirmPassword).Equal(u => u.Password).NotEmpty().WithName(x => localizer["ConfirmPassword"]);
        }
    }
}
