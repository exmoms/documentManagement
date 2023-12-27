using DM.Domain.Models;
using System.Collections.Generic;

namespace DM.Service.ServiceModels.UserDTO
{
    public class CurrentUserProfileDTO
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public List<string> Roles { get; set; }
        public static CurrentUserProfileDTO GetDTO(ApplicationUser user)
        {
            CurrentUserProfileDTO userDTO = new CurrentUserProfileDTO
            {
                UserId = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber
            };

            return userDTO;
        }
    }
}
