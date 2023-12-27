using DM.Domain.Models;
using DM.Service.ServiceModels.UserDTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DM.Service.Interfaces
{
    public interface IUserService
    {
        public List<UserDTO> GetAllUsers();
        public List<UserDTO> GetAllLessRoleUsers(string userRole);
        public UserProfileDTO GetUserProfile(int userId);
        public Task EditUserProfileAsync(ApplicationUser user, UserProfileDTO userProfileDTO);
        public Task EditPasswordAsync(EditUserPasswordDTO EditUserPasswordDTO);
        public List<string> GetAllRoles(int userId);
        public Task EditUserRolesAsync(ApplicationUser user, EditUserRolesDTO userRoles);
        //public UserDTO GetRegisterForm();
        public List<string> GetRoles();
        public Task RegisterAsync(RegisterDTO registerDTO);
        public Task<KeyValuePair<string, string>> LoginAsync(LoginDTO loginDTO);
        public Task LogoutAsync();
        void ValidateUser(ApplicationUser user, string v);
        public Task SendResetPasswordEmail(string email);
        public Task ResetPasswordByToken(ResetPasswordDTO resetPasswordObject);
        public Task EditUserProfileByAdminAsync(ApplicationUser user, AdminEditsUserProfileDTO profileDTO);
        public Task<CurrentUserProfileDTO> GetCurrentUserProfileAsync(int userId);
        public Task ChangeLanguage(string userId,string lang);
    }
}
