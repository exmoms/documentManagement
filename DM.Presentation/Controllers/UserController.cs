using DM.Service.Interfaces;
using DM.Service.ServiceModels;
using DM.Service.ServiceModels.UserDTO;

using FluentValidation.Results;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using DM.Domain.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Localization;
using System;

namespace DM.Presentation.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IStringLocalizer<UserController> _localizer;
        private readonly IAuthorizationService _authorizationService;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(IUserService userService, IAuthorizationService authorizationService, 
            UserManager<ApplicationUser> userManager, IStringLocalizer<UserController> localizer)
        {
            _userService = userService;
            _authorizationService = authorizationService;
            _userManager = userManager;
            _localizer = localizer;
        }

        [HttpGet]
        [Authorize(Roles = "SuperAdmin, Admin, User")]
        // GET: api/user
        public IEnumerable<dynamic> GetAllUsersNamesAndIds()
        {
            return _userService.GetAllUsers().Select(user => new { user.UserId, user.UserName, user.Roles});
        }
        
        [HttpGet("lessRoleUsers")]
        [Authorize(Roles ="SuperAdmin, Admin")]
        // GET: api/user/lessRoleUsers
        public IEnumerable<dynamic> GetAllLessRoleUsers()
        {
            var currentUserRoles = User.Claims.Where(u => u.Value == "Admin" || u.Value == "SuperAdmin");
            string currentUserRole="";
            if (currentUserRoles.Count() != 0)
            { 
                currentUserRole = currentUserRoles.ElementAt(0).Value;
            }
            return _userService.GetAllLessRoleUsers(currentUserRole).Select(user => new { user.UserId, user.UserName, user.Roles});
        }

        [HttpGet("{userId}")]
        [Authorize(Roles = "SuperAdmin, Admin, User")]
        // GET: api/user/1
        public IActionResult GetUserProfile(int userId)
        {
            // Do we need to show the roles of the user "readonly"
            UserProfileDTO user = _userService.GetUserProfile(userId);

            return Ok(user);

        }

        [HttpGet("CurrentUserProfile")]
        // GET: api/user/CurrentUserProfile
        public async Task<IActionResult> CurrentUserProfileAsync()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            CurrentUserProfileDTO user = await _userService.GetCurrentUserProfileAsync(userId);

            return Ok(user);

        }

       [HttpPost("EditUserProfile")] // Only the owner of the account
        // Post: api/user/EditUserProfile
        public async Task<IActionResult> EditUserProfileAsync(UserProfileDTO userProfileDTO)
        {
            userProfileDTO.UserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            ApplicationUser user = _userManager.Users.FirstOrDefault(u => u.Id == userProfileDTO.UserId);
            _userService.ValidateUser(user, "EditUserProfileAsync({userProfileDTO})");
            var authorizationResult = await _authorizationService.AuthorizeAsync(User, user, "ProfileOwnerPolicy");

            if (authorizationResult.Succeeded)
            {
                UserProfileValidator validator = new UserProfileValidator(_localizer);
                ValidationResult result = validator.Validate(userProfileDTO);
                if (!result.IsValid)
                {
                    ValidatorException exception = new ValidatorException();
                    foreach (var error in result.Errors)
                    {
                        exception.AttributeMessages.Add(error.ToString());
                    }
                    throw exception;
                }
                await _userService.EditUserProfileAsync(user, userProfileDTO);
                return Ok();
            }
            ValidatorException authException = new ValidatorException();
            authException.AttributeMessages.Add(_localizer["Sorry, You don't have the permission to do this operation."]);
            //_logger.LogError(logEvent, callingMethod + " : " + error.Description);
            throw authException;
        }

        [HttpPost("EditPassword")] // Only the owner of the account
        // Post: api/user/EditPassword
        public async Task<IActionResult> EditPasswordAsync(EditUserPasswordDTO EditUserPasswordDTO)
        {
            EditUserPasswordDTO.UserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            ApplicationUser user = _userManager.Users.FirstOrDefault(u => u.Id == EditUserPasswordDTO.UserId);
            _userService.ValidateUser(user, "EditPasswordAsync({EditUserPasswordDTO})");
            var authorizationResult = await _authorizationService.AuthorizeAsync(User, user, "ProfileOwnerPolicy");

            if (authorizationResult.Succeeded)
            {
                UserPasswordValidator validator = new UserPasswordValidator(_localizer);
                ValidationResult result = validator.Validate(EditUserPasswordDTO);
                if (!result.IsValid)
                {
                    ValidatorException exception = new ValidatorException();
                    foreach (var error in result.Errors)
                    {
                        exception.AttributeMessages.Add(error.ToString());
                    }
                    throw exception;
                }
                await _userService.EditPasswordAsync(EditUserPasswordDTO);
                return Ok();
            }
            ValidatorException authException = new ValidatorException();
            authException.AttributeMessages.Add(_localizer["Sorry, You don't have the permission to do this operation."]);
            throw authException;
        }


        [HttpGet("{userId}/GetAllRoles")]
        [Authorize(Roles = "SuperAdmin, Admin")]
        // Get: api/user/1/GetAllRoles
        public IActionResult GetAllRoles(int userId)
        {
            List<string> userRoles = _userService.GetAllRoles(userId);
            return Ok(userRoles);
        }


        [HttpPost("EditUserRoles")]
        [Authorize(Roles = "SuperAdmin, Admin")]
        // Post: api/user/EditUserRoles
        public async Task<IActionResult> EditUserRolesAsync(EditUserRolesDTO userRoles)
        {
            userRoles.UserId = GetUserId(userRoles.UserId);
            ApplicationUser user = _userManager.Users.FirstOrDefault(u => u.Id == userRoles.UserId);
            _userService.ValidateUser(user, "EditUserProfileAsync({userProfileDTO})");

            var roles = _userManager.GetRolesAsync(user).Result.ToList();
            var authorizationResult = await _authorizationService.AuthorizeAsync(User, roles, "LessRolePolicy");

            if (authorizationResult.Succeeded)
            {
                UserRolesValidator validator = new UserRolesValidator(_localizer);
                ValidationResult result = validator.Validate(userRoles);
                if (!result.IsValid)
                {
                    ValidatorException exception = new ValidatorException();
                    foreach (var error in result.Errors)
                    {
                        exception.AttributeMessages.Add(error.ToString());
                    }
                    throw exception;
                }
                try
                {
                    await _userService.EditUserRolesAsync(user, userRoles);
                }
                catch(NullReferenceException)
                {
                    return BadRequest();
                }
                return Ok();
            }
            ValidatorException authException = new ValidatorException();
            authException.AttributeMessages.Add(_localizer["Sorry, You don't have the permission to do this operation."]);
            //_logger.LogError(logEvent, callingMethod + " : " + error.Description);
            throw authException;
        }

        //[HttpGet("Register")]
        //public UserDTO Register()
        //{
        //    return _userService.GetRegisterForm();
        //}

        [HttpGet("GetRoles")]
        [Authorize(Roles = "SuperAdmin, Admin")]
        // Get: api/user/GetRoles
        public List<string> GetRoles()
        {
            return _userService.GetRoles();
        }

        [HttpPost("Register")]
        [Authorize(Roles = "SuperAdmin, Admin")]
        // Post: api/user/Register
        public async Task<IActionResult> Register(RegisterDTO registerDTO)
        {
            RegisterValidator validator = new RegisterValidator(_localizer);
            ValidationResult result = validator.Validate(registerDTO);
            if (!result.IsValid)
            {
                ValidatorException exception = new ValidatorException();
                foreach (var error in result.Errors)
                {
                    exception.AttributeMessages.Add(error.ToString());
                }
                throw exception;
            }
            try
            {
                await _userService.RegisterAsync(registerDTO);
            }
            catch (NullReferenceException)
            {
                return BadRequest();
            }
            return Ok();
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        // Post: api/user/Login
        public async Task<IActionResult> Login(LoginDTO loginDTO)
        {
            LoginValidator validator = new LoginValidator(_localizer);
            ValidationResult result = validator.Validate(loginDTO);
            if (!result.IsValid)
            {
                ValidatorException exception = new ValidatorException();
                foreach (var error in result.Errors)
                {
                    exception.AttributeMessages.Add(error.ToString());
                }
                throw exception;
            }
            var res =  await _userService.LoginAsync(loginDTO);

            Response.Cookies.Append(
               "lang",
               CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(res.Value))
           );

            Response.Cookies.Append(
                "AuthToken", res.Key, new Microsoft.AspNetCore.Http.CookieOptions { HttpOnly = true, Expires = DateTime.Now.AddDays(1) , SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Strict}
                );

            return Ok();

        }

        [HttpPost("Logout")]
        // Post: api/user/Logout
        public async Task<IActionResult> Logout()
        {
            await _userService.LogoutAsync();

            Response.Cookies.Delete("AuthToken");

            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> SendResetPasswordEmail(string email)
        {
            await _userService.SendResetPasswordEmail(email);
            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDTO resetPasswordObject)
        {
            ResetPasswordValidator validator = new ResetPasswordValidator(_localizer);
            ValidationResult result = validator.Validate(resetPasswordObject);
            if (!result.IsValid)
            {
                ValidatorException exception = new ValidatorException();
                foreach (var error in result.Errors)
                {
                    exception.AttributeMessages.Add(error.ToString());
                }
                throw exception;
            }
            await _userService.ResetPasswordByToken(resetPasswordObject);
            return Ok();
        }


        [HttpPost("EditUserProfileByAdmin")]
        [Authorize(Roles = "SuperAdmin, Admin")]
        // Post: api/user/EditUserProfileByAdmin
        public async Task<IActionResult> EditUserProfileByAdmin(AdminEditsUserProfileDTO adminEditsUserProfileDTO)
        {
            adminEditsUserProfileDTO.UserId = GetUserId(adminEditsUserProfileDTO.UserId);

            ApplicationUser user = _userManager.Users.FirstOrDefault(u => u.Id == adminEditsUserProfileDTO.UserId);
            _userService.ValidateUser(user, "EditUserProfileAsync({userProfileDTO})");
            var roles = _userManager.GetRolesAsync(user).Result.ToList();
            var authorizationResult = await _authorizationService.AuthorizeAsync(User, roles, "LessRolePolicy");

            if (authorizationResult.Succeeded)
            {
                EditUserProfileByAdminValidator validator = new EditUserProfileByAdminValidator(_localizer);
                ValidationResult result = validator.Validate(adminEditsUserProfileDTO);
                if (!result.IsValid)
                {
                    ValidatorException exception = new ValidatorException();
                    foreach (var error in result.Errors)
                    {
                        exception.AttributeMessages.Add(error.ToString());
                    }
                    throw exception;
                }
                await _userService.EditUserProfileByAdminAsync(user, adminEditsUserProfileDTO);
                return Ok();
            }

            ValidatorException authException = new ValidatorException();
            authException.AttributeMessages.Add(_localizer["You don't have the permission to do this operation."]);
            //_logger.LogError(logEvent, callingMethod + " : " + error.Description);
            throw authException;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> ChangeLanguage(string lang)
        {
            Response.Cookies.Append(
               "lang",
               CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(lang))
           );

            string userID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            await _userService.ChangeLanguage(userID,lang);

            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckToken()
        {
            return Ok();
        }

        private int GetUserId(int inUserId)
        {
            int userID;
            if (inUserId != -1)
            {
                userID = inUserId;
            }
            else
            {
                userID = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            }
            return userID;
        }

    }
}