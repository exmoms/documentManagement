using FluentValidation;
using Microsoft.Extensions.Localization;

namespace DM.Service.ServiceModels.UserDTO
{
    public class AdminEditsUserProfileDTO
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }

    }
    
    public class EditUserProfileByAdminValidator : AbstractValidator<AdminEditsUserProfileDTO>
    {
        const string passwordErrorMessage = "must contain:" +
                           " a minimum of 1 lower case letter [a - z] and," +
                           " a minimum of 1 upper case letter [A - Z] and," +
                           " a minimum of 1 numeric character [0 - 9] and," +
                           " a minimum of 1 special character, " +
                           "And it must be at least 8 characters in length.";
        public EditUserProfileByAdminValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.UserId).NotEmpty().WithName(x => localizer["UserId"]);
            RuleFor(x => x.Email).EmailAddress().WithName(x => localizer["Email"]).When(u => !string.IsNullOrEmpty(u.Email));
            RuleFor(x => x.NewPassword).MinimumLength(8).Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w]).{8,}$").When(u => !string.IsNullOrEmpty(u.NewPassword)).WithMessage(x => localizer["NewPassword"] + ": " + localizer[passwordErrorMessage]);
            RuleFor(x => x.ConfirmPassword).Equal(u => u.NewPassword).When(u => !string.IsNullOrEmpty(u.ConfirmPassword)).WithName(x => localizer["ConfirmPassword"]);
        }
    }
}
