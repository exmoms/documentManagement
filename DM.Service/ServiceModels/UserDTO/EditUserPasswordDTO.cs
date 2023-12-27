using FluentValidation;
using Microsoft.Extensions.Localization;

namespace DM.Service.ServiceModels.UserDTO
{
    public class EditUserPasswordDTO
    {
        public int UserId { get; set; }

        public string CurrentPassword { get; set; }

        public string NewPassword { get; set; }

        public string ConfirmPassword { get; set; }
    }
    public class UserPasswordValidator : AbstractValidator<EditUserPasswordDTO>
    {
        const string passwordErrorMessage = "must contain:" +
                           " a minimum of 1 lower case letter [a - z] and," +
                           " a minimum of 1 upper case letter [A - Z] and," +
                           " a minimum of 1 numeric character [0 - 9] and," +
                           " a minimum of 1 special character, " +
                           "And it must be at least 8 characters in length.";
        public UserPasswordValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.UserId).NotEmpty().WithName(x=>localizer["UserId"]);
            RuleFor(x => x.NewPassword).NotEmpty().WithName(x=>localizer["NewPassword"]).MinimumLength(8).Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w]).{8,}$").WithMessage(x => localizer["NewPassword"] + ": " + localizer[passwordErrorMessage]);
            RuleFor(x => x.CurrentPassword).NotEmpty().WithName(x => localizer["CurrentPassword"]);
            RuleFor(x => x.ConfirmPassword).Equal(u => u.NewPassword).NotEmpty().WithName(x => localizer["ConfirmPassword"]);
        }
    }
}
