using DM.Domain.Models;
using DM.Service.Interfaces;
using DM.Service.ServiceModels;
using DM.Service.ServiceModels.UserDTO;
using DM.Service.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;


namespace DM.Service.Services
{
    public class UserService : IUserService
    {
        private UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole<int>> _roleManager;
        private readonly ILogger<UserService> _logger;
        private readonly IConfiguration _configuration;
        private readonly IStringLocalizer<UserService> _localizer;
        private readonly IMailService _mailService;

        private readonly ISecretsHelper _secretsHelper;
        public UserService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,
                           RoleManager<IdentityRole<int>> roleManager, ILogger<UserService> logger,
                           IConfiguration configuration, IStringLocalizer<UserService> localizer, IMailService mailService, ISecretsHelper secretsHelper)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _logger = logger;
            _configuration = configuration;
            _localizer = localizer;
            _mailService = mailService;
            _secretsHelper = secretsHelper;
        }

        public List<UserDTO> GetAllUsers()
        {
            List<UserDTO> usersDTO = new List<UserDTO>();
            foreach (var user in _userManager.Users.ToList())
            {
                UserDTO userDTO = UserDTO.GetDTO(user);
                userDTO.Roles = _userManager.GetRolesAsync(user).Result.ToList();
                usersDTO.Add(userDTO);
            }
            //_logger.LogInformation(LoggingEvents.GetItem, "GetAllUsers() is called");
            return usersDTO;
        }

        public List<UserDTO> GetAllLessRoleUsers(string userRole)
        {
            if (string.IsNullOrEmpty(userRole))
            {
                ValidatorException exception = new ValidatorException();
                exception.AttributeMessages.Add(_localizer["You don't have the permission to view this information."]);
                throw exception;
            }
            List<UserDTO> usersDTO = new List<UserDTO>();
            foreach (var user in _userManager.Users.ToList())
            {
                if (!_userManager.IsInRoleAsync(user, userRole).Result && !_userManager.IsInRoleAsync(user, "SuperAdmin").Result)
                {
                    UserDTO userDTO = UserDTO.GetDTO(user);
                    userDTO.Roles = _userManager.GetRolesAsync(user).Result.ToList();
                    usersDTO.Add(userDTO);
                }
            }
            //_logger.LogInformation(LoggingEvents.GetItem, "GetAllUsers() is called");
            return usersDTO;
        }
        public UserProfileDTO GetUserProfile(int userId)
        {
            ApplicationUser user = _userManager.Users.FirstOrDefault(u => u.Id == userId);
            ValidateUser(user, "GetUserProfile({userId})");
            var userRoles = _userManager.GetRolesAsync(user).Result;
            UserProfileDTO userDTO = UserProfileDTO.GetDTO(user);
            userDTO.Roles = new List<RoleDTO>();
            foreach (var userRole in userRoles)
            {
                var role = _roleManager.FindByNameAsync(userRole).Result;
                RoleDTO roleDTO = new RoleDTO
                {
                    RoleId = role.Id,
                    RoleName = role.Name,
                    IsSelected = _userManager.IsInRoleAsync(user, role.Name).Result
                };
                userDTO.Roles.Add(roleDTO);
            }
            //_logger.LogInformation(LoggingEvents.GetItem, "GetUserProfile({userId}) is called");
            return userDTO;
        }
        public async Task<CurrentUserProfileDTO> GetCurrentUserProfileAsync(int userId)
        {
            ApplicationUser user = _userManager.Users.FirstOrDefault(u => u.Id == userId);
            ValidateUser(user, "GetUserProfile({userId})");
            CurrentUserProfileDTO userDTO = CurrentUserProfileDTO.GetDTO(user);
            userDTO.Roles = (await _userManager.GetRolesAsync(user)).ToList();
            return userDTO;
        }

        public async Task EditUserProfileAsync(ApplicationUser user, UserProfileDTO userProfileDTO)
        {
            user.Email = string.IsNullOrEmpty(userProfileDTO.Email) ? user.Email : userProfileDTO.Email;
            user.PhoneNumber = string.IsNullOrEmpty(userProfileDTO.PhoneNumber) ? user.PhoneNumber : userProfileDTO.PhoneNumber;
            var update_user_result = await _userManager.UpdateAsync(user);
            ValidateIdentityResult(update_user_result, LoggingEvents.UpdateError, "EditUserProfileAsync({userProfileDTO})");
            //_logger.LogInformation(LoggingEvents.GetItem, "EditUserProfileAsync({userProfileDTO}) is called");
        }

        public async Task EditPasswordAsync(EditUserPasswordDTO EditUserPasswordDTO)
        {
            ApplicationUser user = _userManager.Users.FirstOrDefault(u => u.Id == EditUserPasswordDTO.UserId);
            ValidateUser(user, "EditPasswordAsync({userDTO})");

            var update_password_result = await _userManager.ChangePasswordAsync(user, EditUserPasswordDTO.CurrentPassword, EditUserPasswordDTO.NewPassword);
            ValidateIdentityResult(update_password_result, LoggingEvents.UpdateError, "EditPasswordAsync({userDTO})");
            //_logger.LogInformation(LoggingEvents.GetItem, "EditPasswordAsync({userDTO}) is called");
        }

        // Get all the roles and mark the roles assigned for the passed userId
        public List<string> GetAllRoles(int userId)
        {
            ApplicationUser user = _userManager.Users.FirstOrDefault(u => u.Id == userId);
            ValidateUser(user, "GetAllRoles({userId})");
            List<string> roles = new List<string>();
            var userRoles = _roleManager.Roles.ToList();
            foreach (var role in userRoles)
            {
                if (_userManager.IsInRoleAsync(user, role.Name).Result)
                {
                    roles.Add(role.Name);
                }
            }
            //_logger.LogInformation(LoggingEvents.GetItem, "GetAllRoles({userId}) is called");
            return roles;
        }
        public async Task EditUserRolesAsync(ApplicationUser user, EditUserRolesDTO userRoles)
        {
            foreach (var role in userRoles.AssignedRoles)
            {
                if (!_userManager.IsInRoleAsync(user, role).Result)
                {
                    var result = await _userManager.AddToRoleAsync(user, role);
                    ValidateIdentityResult(result, LoggingEvents.UpdateError, "EditUserRolesAsync({userRoles})");
                    _logger.LogInformation(LoggingEvents.UpdateItem, "EditUserRolesAsync({userRoles}): Assign the role: " + role + " to the user: " + user.UserName);
                }// is it important to handel?
            }

            foreach (var role in userRoles.UnassignedRoles)
            {
                if (_userManager.IsInRoleAsync(user, role).Result)
                {
                    var result = await _userManager.RemoveFromRoleAsync(user, role);
                    ValidateIdentityResult(result, LoggingEvents.UpdateError, "EditUserRolesAsyn({userRoles})");
                    _logger.LogInformation(LoggingEvents.UpdateItem, "EditUserRolesAsync({userRoles}): Unassign the role: " + role + " from the user: " + user.UserName);
                }// is it important to handel?
            }
            //_logger.LogInformation(LoggingEvents.GetItem, "EditUserRolesAsync({userRoles}) is called");
        }

        //public UserDTO GetRegisterForm()
        //{
        //    UserDTO userDTO = new UserDTO();
        //    userDTO.Roles = new List<RoleDTO>();
        //    foreach (var role in roleManager.Roles)
        //    {
        //        userDTO.Roles.Add(DTOAssembler.ConvertRoletoRoleDTO(role));
        //    }
        //    return userDTO;
        //}

        public List<string> GetRoles()
        {
            List<string> roles = _roleManager.Roles.Select(role => role.Name).ToList();
            //_logger.LogInformation(LoggingEvents.GetItem, "GetRoles() is called");
            return roles;
        }

        // register and assign a role to a user 
        public async Task RegisterAsync(RegisterDTO registerDTO)
        {
            ApplicationUser user = registerDTO.GetEntity();
            var result = await _userManager.CreateAsync(user, registerDTO.Password);
            ValidateIdentityResult(result, LoggingEvents.InsertItem, "RegisterAsync({registerDTO})");

            foreach (var role in registerDTO.Roles)
            {
                if (role.IsSelected)
                {
                    result = await _userManager.AddToRoleAsync(user, role.RoleName);
                    ValidateIdentityResult(result, LoggingEvents.UpdateItem, "RegisterAsync({registerDTO})");
                    _logger.LogInformation(LoggingEvents.UpdateItem, "RegisterAsync({registerDTO}): Assign the role: " + role.RoleName + "To the user: " + user.UserName);
                }
            }
            //_logger.LogInformation(LoggingEvents.InsertItem, "RegisterAsync({registerDTO}) is called");
        }

        public async Task<KeyValuePair<string,string>> LoginAsync(LoginDTO loginDTO)
        {
            ApplicationUser user = _userManager.FindByNameAsync(loginDTO.UserName).Result;
            ValidateUser(user, "LoginAsync(loginDTO)");
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDTO.Password, false);// TODO: recheck lockout policies
            if (!result.Succeeded)
            {
                ValidatorException exception = new ValidatorException();
                exception.AttributeMessages.Add(_localizer["Invalid user name or password"]);
                _logger.LogError(LoggingEvents.Login, "LoginAsync({loginDTO}):  Invalid user name or password");
                throw exception;
            }
            //_logger.LogInformation(LoggingEvents.Login, "LoginAsync({loginDTO}) is called");
            var token = GenerateJwtToken(user);
            return new KeyValuePair<string, string>(token, user.Language);
        }
        public async Task LogoutAsync()
        {
            await _signInManager.SignOutAsync();
            //_logger.LogInformation(LoggingEvents.Logout, "LogoutAsync() is called");
        }

        // Validate methods
        public void ValidateUser(ApplicationUser user, string callingMethod)
        {
            if (user == null)
            {
                ValidatorException exception = new ValidatorException();
                exception.AttributeMessages.Add(_localizer["The user is not found"]);
                //_logger.LogError(LoggingEvents.GetItemNotFound, callingMethod + ": Item not found");
                throw exception;
            }
        }

        private void ValidateIdentityResult(IdentityResult result, int logEvent, string callingMethod)// localize
        {
            if (!result.Succeeded)
            {
                ValidatorException exception = new ValidatorException();
                foreach (var error in result.Errors.ToList())
                {
                    exception.AttributeMessages.Add(error.Description);
                    //_logger.LogError(logEvent, callingMethod + " : " + error.Description);
                }
                throw exception;
            }
        }

        private async Task<bool> CheckPassword(EditUserPasswordDTO editUserPasswordDTO, string password)
        {
            ApplicationUser user = _userManager.Users.FirstOrDefault(u => u.Id == editUserPasswordDTO.UserId);
            ValidateUser(user, "EditPasswordAsync({userDTO})");
            return await _userManager.CheckPasswordAsync(user, password);
        }

        private  string GenerateJwtToken(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Expiration, new DateTimeOffset().ToUniversalTime().ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };
            foreach (var role in _roleManager.Roles.ToList())
            {
                if (_userManager.IsInRoleAsync(user, role.Name).Result)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role.Name));
                }
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretsHelper.GetJwtIssuerSigningKey()));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(_configuration["jwt:JwtExpireDays"]));

            var token = new JwtSecurityToken(
                _configuration["jwt:JwtIssuer"],
                _configuration["jwt:JwtAudience"],
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        public async Task SendResetPasswordEmail(string email)
        {
            ApplicationUser user = await _userManager.FindByEmailAsync(email);

            if(user == null)
            {
                throw new ValidatorException();
            }

            string token = await _userManager.GeneratePasswordResetTokenAsync(user);

            // send email

            var emailConfig = _mailService.GetConfig();

            MimeMessage message = new MimeMessage();
            message.From.Add(new MailboxAddress("No reply", emailConfig.Email));
            message.Subject = "Reset Password";
            message.To.Add(new MailboxAddress(email));

            string url = _configuration["CurrentHostName"] + "ResetPassword?token=" + token + "&email=" + email;
            string body = " please follow the link to change your password :\n" + "<a href =\'"+url+"' > reset password link </a> ";

            BodyBuilder bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = body;

            message.Body = bodyBuilder.ToMessageBody();

            try
            {
                using (var client = new MailKit.Net.Smtp.SmtpClient())
                {
                    client.Connect(emailConfig.Server, emailConfig.Port, false);

                    client.Authenticate(emailConfig.Email, emailConfig.Password);

                    client.Send(message);
                    client.Disconnect(true);
                }
            }
            catch
            {
                ValidatorException exception = new ValidatorException();
                exception.AttributeMessages.Add(_localizer["Error in system email configuration, please report to the admin."]);
                throw exception;
            }

        }

        public async Task ResetPasswordByToken(ResetPasswordDTO resetPasswordObject)
        {
            ApplicationUser user = await _userManager.FindByEmailAsync(resetPasswordObject.Email);

            ValidateUser(user, "ResetPasswordByToken({resetPasswordObject})");

            var result = await _userManager.ResetPasswordAsync(user, resetPasswordObject.Token, resetPasswordObject.Password);

            ValidateIdentityResult(result, LoggingEvents.UpdateError, "ResetPasswordByToken({resetPasswordObject})");
        }

        public async Task EditUserProfileByAdminAsync(ApplicationUser user, AdminEditsUserProfileDTO profileDTO)
        {
            user.Email = string.IsNullOrEmpty(profileDTO.Email) ? user.Email : profileDTO.Email;
            user.PhoneNumber = string.IsNullOrEmpty(profileDTO.PhoneNumber) ? user.PhoneNumber : profileDTO.PhoneNumber;
            var update_user_result = await _userManager.UpdateAsync(user);
            ValidateIdentityResult(update_user_result, LoggingEvents.UpdateError, "EditUserProfileAsync({user, profileDTO})");
            if (!string.IsNullOrEmpty(profileDTO.NewPassword))
            {
                await ResetUserPasswordByAdminAsync(user, profileDTO);
            }
        }

        private async Task ResetUserPasswordByAdminAsync(ApplicationUser user, AdminEditsUserProfileDTO profileDTO)
        {
            string token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var update_password_result = await _userManager.ResetPasswordAsync(user, token, profileDTO.NewPassword);
            ValidateIdentityResult(update_password_result, LoggingEvents.UpdateError, "EditPasswordAsync({user, profileDTO})");
        }

        public async Task ChangeLanguage(string userId, string lang)
        {
            var user = await _userManager.FindByIdAsync(userId);
            ValidateUser(user, "ChangeLanguage({userId, lang})");
            user.Language = lang;
            var result = await _userManager.UpdateAsync(user);

            ValidateIdentityResult(result, LoggingEvents.UpdateError, "ChangeLanguage({userId, lang})");
        }
    }
}

