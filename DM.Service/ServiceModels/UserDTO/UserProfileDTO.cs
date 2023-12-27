using DM.Domain.Models;
using FluentValidation;
using Microsoft.Extensions.Localization;
using System.Collections.Generic;

namespace DM.Service.ServiceModels.UserDTO
{
    public class UserProfileDTO
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public List<RoleDTO> Roles { get; set; }
        public static UserProfileDTO GetDTO(ApplicationUser user)
        {
            UserProfileDTO userDTO = new UserProfileDTO
            {
                UserId = user.Id,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber
            };

            return userDTO;
        }

    }
    public class UserProfileValidator : AbstractValidator<UserProfileDTO>
    {
        public UserProfileValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Email).EmailAddress().WithName(x => localizer["Email"]).When(u => !string.IsNullOrEmpty(u.Email));
        }
    }
}
