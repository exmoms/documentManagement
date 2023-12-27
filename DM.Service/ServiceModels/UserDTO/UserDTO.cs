using DM.Domain.Models;
using FluentValidation;
using Microsoft.Extensions.Localization;
using System.Collections.Generic;

namespace DM.Service.ServiceModels.UserDTO
{
    public class UserDTO
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }

        public string PhoneNumber { get; set; }
        public List<string> Roles { get; set; }

        public static UserDTO GetDTO(ApplicationUser user)
        {
            UserDTO userDTO = new UserDTO
            {
                UserId = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber
            };

            return userDTO;
        }
    }
    public class UserValidator : AbstractValidator<UserDTO>
    {
        public UserValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Email).NotNull().EmailAddress();
            RuleFor(x => x.UserName).NotNull().WithName(x=>localizer["UserName"]);
        }
    }
}
