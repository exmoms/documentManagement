using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DM.Domain;
using DM.Domain.Models;
using DM.Repository.Contexts;
using DM.Service.ServiceModels.UserDTO;
using DM.Service.Services;
using DM.Service.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Moq;
using Xunit;
namespace DM.UnitTest.ServiceUT
{
    public class UserServiceTest
    {
        [Fact]
        public void GetAllUsersTest()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
    .UseInMemoryDatabase(databaseName: "get_all_database")
    .ConfigureWarnings(e => e.Ignore(InMemoryEventId.TransactionIgnoredWarning))
    .Options;

            using (var context = new DocumentDBContext(options))
            {
                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<UserService> logger = loggerFactory.CreateLogger<UserService>();

                var store = new Mock<IUserStore<ApplicationUser>>();
                var mgr = new Mock<UserManager<ApplicationUser>>(store.Object, null, null, null, null, null, null, null, null);
                

                var signInManager = new Mock<SignInManager<ApplicationUser>>(mgr.Object, new HttpContextAccessor { HttpContext = new Mock<HttpContext>().Object },
                new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>().Object,
                null, null,null,null);

                var roleStore = new Mock<IRoleStore<IdentityRole<int>>>();
                var roleManager = new RoleManager<IdentityRole<int>>(
                roleStore.Object, null, null, null, null);

                var configuration = new Mock<IConfiguration>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<UserService>(factory);
                // Mock the secret helper
                var secretsHelper = new Mock<ISecretsHelper>();
                var userService = new UserService(mgr.Object, signInManager.Object, roleManager, logger, configuration.Object, localizer,null, secretsHelper.Object);

                RegisterDTO userDTO = new RegisterDTO();
                userDTO.UserName = "Cersie";
                userDTO.Password = "123456789";
                userDTO.ConfirmPassword = "123456789";
                userDTO.Email = "mm@mm.mm";
                userDTO.Roles = new List<RoleDTO>();

                List<ApplicationUser> list = new List<ApplicationUser>(); 
                mgr.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success).Callback<ApplicationUser, string>((x, y) => { list.Add(x); });
                IQueryable<ApplicationUser> query = list.AsQueryable();
                mgr.Setup(_ => _.Users).Returns(query);
                List<string> userRole = new List<string> {"Admin"};
                mgr.Setup(x => x.GetRolesAsync(It.IsAny<ApplicationUser>())).ReturnsAsync(userRole);

                Task t = userService.RegisterAsync(userDTO);

                Assert.True(t.IsCompletedSuccessfully);
                Assert.Single(list);
                //Act
                List<UserDTO> list2 = userService.GetAllUsers();
                //Assert
                Assert.Single(list2);
                Assert.Equal("Cersie",list2[0].UserName);
                Assert.Equal("mm@mm.mm", list2[0].Email);
                Assert.Single(list2[0].Roles);
                Assert.Equal("Admin", list2[0].Roles[0]);
            }
        }
        [Fact]
        public void GetUserProfileTest()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
    .UseInMemoryDatabase(databaseName: "get_profile_database")
    .ConfigureWarnings(e => e.Ignore(InMemoryEventId.TransactionIgnoredWarning))
    .Options;

            using (var context = new DocumentDBContext(options))
            {
                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<UserService> logger = loggerFactory.CreateLogger<UserService>();

                var store = new Mock<IUserStore<ApplicationUser>>();
                var mgr = new Mock<UserManager<ApplicationUser>>(store.Object, null, null, null, null, null, null, null, null);


                var signInManager = new Mock<SignInManager<ApplicationUser>>(mgr.Object, new HttpContextAccessor { HttpContext = new Mock<HttpContext>().Object },
                new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>().Object,
                null, null, null, null);

                var roleStore = new Mock<IRoleStore<IdentityRole<int>>>();
                var roleManager = new Mock<RoleManager<IdentityRole<int>>>(
                roleStore.Object, null, null, null, null);

                var configuration = new Mock<IConfiguration>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<UserService>(factory);
                // Mock the secret helper
                var secretsHelper = new Mock<ISecretsHelper>();

                var userService = new UserService(mgr.Object, signInManager.Object, roleManager.Object, logger, configuration.Object, localizer, null, secretsHelper.Object);

                RegisterDTO userDTO = new RegisterDTO();
                userDTO.UserName = "Cersie";
                userDTO.Password = "123456789";
                userDTO.ConfirmPassword = "123456789";
                userDTO.Email = "mm@mm.mm";
                RoleDTO roleDTO = new RoleDTO();
                roleDTO.RoleName = "Admin";
                roleDTO.IsSelected = true;
                userDTO.Roles = new List<RoleDTO>();
                userDTO.Roles.Add(roleDTO);

                List<ApplicationUser> list = new List<ApplicationUser>();
                mgr.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success).Callback<ApplicationUser, string>((x, y) => { list.Add(x); });
                //ApplicationUser user = DTOAssembler.ConvertUserDTOToUser(userDTO);
                mgr.Setup(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success);
                IQueryable<ApplicationUser> query = list.AsQueryable();
                mgr.Setup(_ => _.Users).Returns(query);

                Task t = userService.RegisterAsync(userDTO);
                Assert.True(t.IsCompletedSuccessfully);
                Assert.Single(list);

                IList<string> roles = new List<string>();
                roles.Add("Admin");
                mgr.Setup(x => x.GetRolesAsync(list[0])).Returns(Task.FromResult(roles));
                IdentityRole<int> r = new IdentityRole<int>();
                r.Id = 1;
                r.Name = "Admin";
                bool result = true;
                mgr.Setup(x => x.IsInRoleAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).Returns(Task.FromResult(result));
                roleManager.Setup(x => x.FindByNameAsync(It.IsAny<string>())).Returns(Task.FromResult(r));

                //Act
                UserProfileDTO user = userService.GetUserProfile(0);
                //Assert
                Assert.Equal("mm@mm.mm", user.Email);
                Assert.Single(user.Roles);
                Assert.Equal("Admin", user.Roles[0].RoleName);
            }
        }
        [Fact]
        public void EditUserProfileAsyncTest()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
    .UseInMemoryDatabase(databaseName: "edit_profile_database")
    .ConfigureWarnings(e => e.Ignore(InMemoryEventId.TransactionIgnoredWarning))
    .Options;

            using (var context = new DocumentDBContext(options))
            {
                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<UserService> logger = loggerFactory.CreateLogger<UserService>();

                var store = new Mock<IUserStore<ApplicationUser>>();
                var mgr = new Mock<UserManager<ApplicationUser>>(store.Object, null, null, null, null, null, null, null, null);


                var signInManager = new Mock<SignInManager<ApplicationUser>>(mgr.Object, new HttpContextAccessor { HttpContext = new Mock<HttpContext>().Object },
                new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>().Object,
                null, null, null, null);

                var roleStore = new Mock<IRoleStore<IdentityRole<int>>>();
                var roleManager = new Mock<RoleManager<IdentityRole<int>>>(
                roleStore.Object, null, null, null, null);

                var configuration = new Mock<IConfiguration>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<UserService>(factory);
                // Mock the secret helper
                var secretsHelper = new Mock<ISecretsHelper>();

                var userService = new UserService(mgr.Object, signInManager.Object, roleManager.Object, logger, configuration.Object, localizer, null, secretsHelper.Object);

                RegisterDTO userDTO = new RegisterDTO();
                userDTO.UserName = "Cersie";
                userDTO.Password = "123456789";
                userDTO.ConfirmPassword = "123456789";
                userDTO.Email = "mm@mm.mm";
                RoleDTO roleDTO = new RoleDTO();
                roleDTO.RoleName = "Admin";
                roleDTO.IsSelected = true;
                userDTO.Roles = new List<RoleDTO>();
                userDTO.Roles.Add(roleDTO);

                List<ApplicationUser> list = new List<ApplicationUser>();
                mgr.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success).Callback<ApplicationUser, string>((x, y) => { list.Add(x); });
                //ApplicationUser user = DTOAssembler.ConvertUserDTOToUser(userDTO);
                mgr.Setup(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success);
                IQueryable<ApplicationUser> query = list.AsQueryable();
                mgr.Setup(_ => _.Users).Returns(query);

                Task t = userService.RegisterAsync(userDTO);
                Assert.True(t.IsCompletedSuccessfully);
                Assert.Single(list);

                IList<string> roles = new List<string>();
                roles.Add("Admin");
                mgr.Setup(x => x.GetRolesAsync(list[0])).Returns(Task.FromResult(roles));
                IdentityRole<int> r = new IdentityRole<int>();
                r.Id = 1;
                r.Name = "Admin";
                bool result = true;
                mgr.Setup(x => x.IsInRoleAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).Returns(Task.FromResult(result));
                roleManager.Setup(x => x.FindByNameAsync(It.IsAny<string>())).Returns(Task.FromResult(r));

                //Act

                UserProfileDTO userProfileDTO = userService.GetUserProfile(0);
                userProfileDTO.Email = "mais@mm.mm";
                ApplicationUser user_ob = mgr.Object.Users.FirstOrDefault(u => u.Id == userProfileDTO.UserId);
                Task res = userService.EditUserProfileAsync(user_ob, userProfileDTO);


                //Assert
                Assert.True(t.IsCompletedSuccessfully);
                UserProfileDTO user = userService.GetUserProfile(0);
                Assert.Equal("mais@mm.mm", user.Email);
                Assert.Single(user.Roles);
                Assert.Equal("Admin", user.Roles[0].RoleName);
            }
        }
        //Test commented out because it will be tested through controller.
        /*
        [Fact]
        public void EditPasswordAsyncTest()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
    .UseInMemoryDatabase(databaseName: "edit_profile_database")
    .ConfigureWarnings(e => e.Ignore(InMemoryEventId.TransactionIgnoredWarning))
    .Options;

            using (var context = new DocumentDBContext(options))
            {
                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<UserService> logger = loggerFactory.CreateLogger<UserService>();

                var store = new Mock<IUserStore<ApplicationUser>>();
                var hasher = new PasswordHasher<ApplicationUser>();
                var mgr = new Mock<UserManager<ApplicationUser>>(store.Object, null, hasher, null, null, null, null, null, null);
                

                var signInManager = new Mock<SignInManager<ApplicationUser>>(mgr.Object, new HttpContextAccessor { HttpContext = new Mock<HttpContext>().Object },
                new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>().Object,
                null, null,null);

                var roleStore = new Mock<IRoleStore<IdentityRole<int>>>();
                var roleManager = new Mock<RoleManager<IdentityRole<int>>>(
                roleStore.Object, null, null, null, null);

                var configuration = new Mock<IConfiguration>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<UserService>(factory);

                var userService = new UserService(mgr.Object, signInManager, roleManager.Object, logger, configuration.Object, localizer);

                UserDTO userDTO = new UserDTO();
                userDTO.UserName = "Cersie";
                userDTO.Password = "Xx?123456789";
                userDTO.ConfirmedPassword = "Xx?123456789";
                userDTO.Email = "mm@mm.mm";
                RoleDTO roleDTO = new RoleDTO();
                roleDTO.RoleName = "Admin";
                roleDTO.IsSelected = true;
                userDTO.Roles = new List<RoleDTO>();
                userDTO.Roles.Add(roleDTO);

                List<ApplicationUser> list = new List<ApplicationUser>(); 
                mgr.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success).Callback<ApplicationUser, string>((x, y) => { list.Add(x); });
                //ApplicationUser user = DTOAssembler.ConvertUserDTOToUser(userDTO);
                mgr.Setup(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success);
                IQueryable<ApplicationUser> query = list.AsQueryable();
                mgr.Setup(_ => _.Users).Returns(query);

                Task t = userService.RegisterAsync(userDTO);
                Assert.True(t.IsCompletedSuccessfully);
                Assert.Single(list);

                IList<string> roles = new List<string>();
                roles.Add("Admin");
                mgr.Setup(x => x.GetRolesAsync(list[0])).Returns(Task.FromResult(roles));
                IdentityRole<int> r = new IdentityRole<int>();
                r.Id = 1;
                r.Name = "Admin";
                bool result = true;
                mgr.Setup(x => x.IsInRoleAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).Returns(Task.FromResult(result));
                mgr.Setup(x => x.ChangePasswordAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success);
                roleManager.Setup(x => x.FindByNameAsync(It.IsAny<string>())).Returns(Task.FromResult(r));

                userDTO.Password = "Xx?123456789?";
                userDTO.ConfirmedPassword = "Xx?123456789?";
                //Act
                Task res = userService.EditPasswordAsync(userDTO);
                //Assert
                Assert.True(t.IsCompletedSuccessfully);
                UserDTO user = userService.GetUserProfile(0);
                //TODO shall add a method to check the password is set to the new value.
                Assert.Equal("Cersie", user.UserName);
               bool t3 = userService.CheckPassword(user, "Xx?123456789?");
                Assert.True(t3);
                Assert.Single(user.Roles);
                Assert.Equal("Admin", user.Roles[0].RoleName);
            }
        }*/
        [Fact]
        public void GetAllRolesTest()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
    .UseInMemoryDatabase(databaseName: "edit_profile_database")
    .ConfigureWarnings(e => e.Ignore(InMemoryEventId.TransactionIgnoredWarning))
    .Options;

            using (var context = new DocumentDBContext(options))
            {
                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<UserService> logger = loggerFactory.CreateLogger<UserService>();

                var store = new Mock<IUserStore<ApplicationUser>>();
                var mgr = new Mock<UserManager<ApplicationUser>>(store.Object, null, null, null, null, null, null, null, null);


                var signInManager = new Mock<SignInManager<ApplicationUser>>(mgr.Object, new HttpContextAccessor { HttpContext = new Mock<HttpContext>().Object },
                new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>().Object,
                null, null, null, null);

                var roleStore = new Mock<IRoleStore<IdentityRole<int>>>();
                var roleManager = new Mock<RoleManager<IdentityRole<int>>>(
                roleStore.Object, null, null, null, null);

                var configuration = new Mock<IConfiguration>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<UserService>(factory);
                // Mock the secret helper
                var secretsHelper = new Mock<ISecretsHelper>();

                var userService = new UserService(mgr.Object, signInManager.Object, roleManager.Object, logger, configuration.Object, localizer,null , secretsHelper.Object);

                RegisterDTO userDTO = new RegisterDTO();
                userDTO.UserName = "Cersie";
                userDTO.Password = "123456789";
                userDTO.ConfirmPassword = "123456789";
                userDTO.Email = "mm@mm.mm";
                RoleDTO roleDTO = new RoleDTO();
                roleDTO.RoleName = "Admin";
                roleDTO.IsSelected = true;
                userDTO.Roles = new List<RoleDTO>();
                userDTO.Roles.Add(roleDTO);
                RoleDTO roleDTO2 = new RoleDTO();
                roleDTO2.RoleName = "Visitor";
                roleDTO2.IsSelected = true;
                userDTO.Roles.Add(roleDTO2);

                List<ApplicationUser> list = new List<ApplicationUser>();
                mgr.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success).Callback<ApplicationUser, string>((x, y) => { list.Add(x); });
                //ApplicationUser user = DTOAssembler.ConvertUserDTOToUser(userDTO);
                mgr.Setup(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success);
                IQueryable<ApplicationUser> query = list.AsQueryable();
                mgr.Setup(_ => _.Users).Returns(query);

                Task t = userService.RegisterAsync(userDTO);
                Assert.True(t.IsCompletedSuccessfully);
                Assert.Single(list);
                List<IdentityRole<int>> list2 = new List<IdentityRole<int>>();
                IdentityRole<int> r = new IdentityRole<int>();
                r.Id = 1;
                r.Name = "Admin";
                list2.Add(r);
                IdentityRole<int> r2 = new IdentityRole<int>();
                r2.Id = 2;
                r2.Name = "Visitor";
                list2.Add(r2);
                IQueryable<IdentityRole<int>> rolesQuery = list2.AsQueryable();
                roleManager.Setup(_ => _.Roles).Returns(rolesQuery);
                bool result = true;
                mgr.Setup(x => x.IsInRoleAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).Returns(Task.FromResult(result));

                int id = 0;
                //Act
                List<string> res = userService.GetAllRoles(id);
                //Assert
                Assert.Equal(2, res.Count());
                Assert.Equal("Admin", res[0]);
                Assert.Equal("Visitor", res[1]);
            }
        }
        [Fact]
        public void EditUserRolesTest()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
    .UseInMemoryDatabase(databaseName: "edit_profile_database")
    .ConfigureWarnings(e => e.Ignore(InMemoryEventId.TransactionIgnoredWarning))
    .Options;

            using (var context = new DocumentDBContext(options))
            {
                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<UserService> logger = loggerFactory.CreateLogger<UserService>();

                var store = new Mock<IUserStore<ApplicationUser>>();
                var mgr = new Mock<UserManager<ApplicationUser>>(store.Object, null, null, null, null, null, null, null, null);


                var signInManager = new Mock<SignInManager<ApplicationUser>>(mgr.Object, new HttpContextAccessor { HttpContext = new Mock<HttpContext>().Object },
                new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>().Object,
                null, null, null, null);

                var roleStore = new Mock<IRoleStore<IdentityRole<int>>>();
                var roleManager = new Mock<RoleManager<IdentityRole<int>>>(
                roleStore.Object, null, null, null, null);

                var configuration = new Mock<IConfiguration>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<UserService>(factory);
                // Mock the secret helper
                var secretsHelper = new Mock<ISecretsHelper>();

                var userService = new UserService(mgr.Object, signInManager.Object, roleManager.Object, logger, configuration.Object, localizer, null, secretsHelper.Object);

                RegisterDTO userDTO = new RegisterDTO();
                userDTO.UserName = "Cersie";
                userDTO.Password = "123456789";
                userDTO.ConfirmPassword = "123456789";
                userDTO.Email = "mm@mm.mm";
                RoleDTO roleDTO = new RoleDTO();
                roleDTO.RoleName = "Admin";
                roleDTO.IsSelected = true;
                userDTO.Roles = new List<RoleDTO>();
                userDTO.Roles.Add(roleDTO);
                RoleDTO roleDTO2 = new RoleDTO();
                roleDTO2.RoleName = "Visitor";
                roleDTO2.IsSelected = true;
                userDTO.Roles.Add(roleDTO2);

                List<ApplicationUser> list = new List<ApplicationUser>();
                mgr.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success).Callback<ApplicationUser, string>((x, y) => { list.Add(x); });
                //ApplicationUser user = DTOAssembler.ConvertUserDTOToUser(userDTO);
                mgr.Setup(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success);
                mgr.Setup(x => x.RemoveFromRoleAsync(It.IsAny<ApplicationUser>(), "Visitor")).ReturnsAsync(IdentityResult.Success);
                IQueryable<ApplicationUser> query = list.AsQueryable();
                mgr.Setup(_ => _.Users).Returns(query);

                Task t = userService.RegisterAsync(userDTO);
                Assert.True(t.IsCompletedSuccessfully);
                Assert.Single(list);
                List<IdentityRole<int>> list2 = new List<IdentityRole<int>>();
                IdentityRole<int> r = new IdentityRole<int>();
                r.Id = 1;
                r.Name = "Admin";
                list2.Add(r);
                IdentityRole<int> r2 = new IdentityRole<int>();
                r2.Id = 2;
                r2.Name = "Visitor";
                list2.Add(r2);
                IQueryable<IdentityRole<int>> rolesQuery = list2.AsQueryable();
                roleManager.Setup(_ => _.Roles).Returns(rolesQuery);
                bool result = true;
                mgr.Setup(x => x.IsInRoleAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).Returns(Task.FromResult(result));
                //Roles before
                IList<string> roles = new List<string>();
                roles.Add("Admin");
                roles.Add("Visitor");
                mgr.Setup(x => x.GetRolesAsync(list[0])).Returns(Task.FromResult(roles));
                roleManager.Setup(x => x.FindByNameAsync("Admin")).Returns(Task.FromResult(r));
                roleManager.Setup(x => x.FindByNameAsync("Visitor")).Returns(Task.FromResult(r2));

                //Act

                UserProfileDTO userProfileDTO = userService.GetUserProfile(0);
                List<string> assignedRoles = new List<string>();
                assignedRoles.Add("Admin");
                List<string> unAssignedRoles = new List<string>();
                unAssignedRoles.Add("Visitor");
                EditUserRolesDTO editUserRolesDTO = new EditUserRolesDTO();
                editUserRolesDTO.UserId = list[0].Id;
                editUserRolesDTO.AssignedRoles = assignedRoles;
                editUserRolesDTO.UnassignedRoles = unAssignedRoles;
                ApplicationUser user_ob = mgr.Object.Users.FirstOrDefault(u => u.Id == editUserRolesDTO.UserId);
                Task res = userService.EditUserRolesAsync(user_ob, editUserRolesDTO);

                //Assert
                //TODO Roles list shall contain only user roles.
                Assert.True(res.IsCompletedSuccessfully);
                UserProfileDTO user = userService.GetUserProfile(0);
                Assert.Equal(2, user.Roles.Count());
                Assert.Equal("Admin", user.Roles[0].RoleName);
                Assert.True(user.Roles[0].IsSelected);
            }
        }
        [Fact]
        public void GetRolesTest()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
    .UseInMemoryDatabase(databaseName: "getRoles_database")
    .ConfigureWarnings(e => e.Ignore(InMemoryEventId.TransactionIgnoredWarning))
    .Options;

            using (var context = new DocumentDBContext(options))
            {
                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<UserService> logger = loggerFactory.CreateLogger<UserService>();

                var store = new Mock<IUserStore<ApplicationUser>>();
                var mgr = new Mock<UserManager<ApplicationUser>>(store.Object, null, null, null, null, null, null, null, null);


                var signInManager = new Mock<SignInManager<ApplicationUser>>(mgr.Object, new HttpContextAccessor { HttpContext = new Mock<HttpContext>().Object },
                new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>().Object,
                null, null, null, null);

                var roleStore = new Mock<IRoleStore<IdentityRole<int>>>();
                var roleManager = new Mock<RoleManager<IdentityRole<int>>>(
                roleStore.Object, null, null, null, null);

                var configuration = new Mock<IConfiguration>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<UserService>(factory);
                // Mock the secret helper
                var secretsHelper = new Mock<ISecretsHelper>();

                var userService = new UserService(mgr.Object, signInManager.Object, roleManager.Object, logger, configuration.Object, localizer, null, secretsHelper.Object);

                List<IdentityRole<int>> list2 = new List<IdentityRole<int>>();
                IdentityRole<int> r = new IdentityRole<int>();
                r.Id = 1;
                r.Name = "Admin";
                list2.Add(r);
                IdentityRole<int> r2 = new IdentityRole<int>();
                r2.Id = 2;
                r2.Name = "Visitor";
                list2.Add(r2);
                IQueryable<IdentityRole<int>> rolesQuery = list2.AsQueryable();
                roleManager.Setup(_ => _.Roles).Returns(rolesQuery);
                //Act
                List<string> res = userService.GetRoles();
                //Assert
                Assert.Equal(2, res.Count());
                Assert.Equal("Admin", res[0]);
                Assert.Equal("Visitor", res[1]);
            }
        }

        [Fact]
        public void RegisterAsyncTest()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
    .UseInMemoryDatabase(databaseName: "edit_profile_database")
    .ConfigureWarnings(e => e.Ignore(InMemoryEventId.TransactionIgnoredWarning))
    .Options;

            using (var context = new DocumentDBContext(options))
            {
                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<UserService> logger = loggerFactory.CreateLogger<UserService>();

                var store = new Mock<IUserStore<ApplicationUser>>();
                var mgr = new Mock<UserManager<ApplicationUser>>(store.Object, null, null, null, null, null, null, null, null);


                var signInManager = new Mock<SignInManager<ApplicationUser>>(mgr.Object, new HttpContextAccessor { HttpContext = new Mock<HttpContext>().Object },
                new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>().Object,
                null, null, null, null);

                var roleStore = new Mock<IRoleStore<IdentityRole<int>>>();
                var roleManager = new Mock<RoleManager<IdentityRole<int>>>(
                roleStore.Object, null, null, null, null);

                var configuration = new Mock<IConfiguration>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<UserService>(factory);
                // Mock the secret helper
                var secretsHelper = new Mock<ISecretsHelper>();

                var userService = new UserService(mgr.Object, signInManager.Object, roleManager.Object, logger, configuration.Object, localizer, null, secretsHelper.Object);

                RegisterDTO userDTO = new RegisterDTO();
                userDTO.UserName = "Cersie";
                userDTO.Password = "123456789";
                userDTO.ConfirmPassword = "123456789";
                userDTO.Email = "mm@mm.mm";
                RoleDTO roleDTO = new RoleDTO();
                roleDTO.RoleName = "Admin";
                roleDTO.IsSelected = true;
                userDTO.Roles = new List<RoleDTO>();
                userDTO.Roles.Add(roleDTO);
                RoleDTO roleDTO2 = new RoleDTO();
                roleDTO2.RoleName = "Visitor";
                roleDTO2.IsSelected = true;
                userDTO.Roles.Add(roleDTO2);

                List<ApplicationUser> list = new List<ApplicationUser>();
                mgr.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success).Callback<ApplicationUser, string>((x, y) => { list.Add(x); });
                mgr.Setup(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success);
                IQueryable<ApplicationUser> query = list.AsQueryable();
                mgr.Setup(_ => _.Users).Returns(query);


                List<IdentityRole<int>> list2 = new List<IdentityRole<int>>();
                IdentityRole<int> r = new IdentityRole<int>();
                r.Id = 1;
                r.Name = "Admin";
                list2.Add(r);
                IdentityRole<int> r2 = new IdentityRole<int>();
                r2.Id = 2;
                r2.Name = "Visitor";
                list2.Add(r2);
                IQueryable<IdentityRole<int>> rolesQuery = list2.AsQueryable();
                roleManager.Setup(_ => _.Roles).Returns(rolesQuery);
                bool result = true;
                mgr.Setup(x => x.IsInRoleAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).Returns(Task.FromResult(result));

                //Act
                Task t = userService.RegisterAsync(userDTO);
                //Assert
                //TODO Roles list shall contain only user roles.
                Assert.True(t.IsCompletedSuccessfully);
                Assert.Single(list);
                Assert.Equal("Cersie", list[0].UserName);
                Assert.Equal("mm@mm.mm", list[0].Email);
                List<string> listRoles = userService.GetAllRoles(0);
                Assert.Equal(2, listRoles.Count());
                Assert.Equal("Admin", listRoles[0]);
                Assert.Equal("Visitor", listRoles[1]);
            }
        }
        //Test commented out because it will be tested through controller.
        /*
        [Fact]
        public void LoginAsyncTest()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
    .UseInMemoryDatabase(databaseName: "edit_profile_database")
    .ConfigureWarnings(e => e.Ignore(InMemoryEventId.TransactionIgnoredWarning))
    .Options;

            using (var context = new DocumentDBContext(options))
            {
                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<UserService> logger = loggerFactory.CreateLogger<UserService>();

                var store = new Mock<IUserStore<ApplicationUser>>();
                var hasher = new PasswordHasher<ApplicationUser>();
                var mgr = new Mock<UserManager<ApplicationUser>>(store.Object, null, hasher, null, null, null, null, null, null);


                var signInManager = new Mock<SignInManager<ApplicationUser>>(mgr.Object, new HttpContextAccessor { HttpContext = new Mock<HttpContext>().Object },
                new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>().Object,
                null, null, null);

                var roleStore = new Mock<IRoleStore<IdentityRole<int>>>();
                var roleManager = new Mock<RoleManager<IdentityRole<int>>>(
                roleStore.Object, null, null, null, null);

                var configuration = new Mock<IConfiguration>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<UserService>(factory);

                var userService = new UserService(mgr.Object, signInManager, roleManager.Object, logger, configuration.Object, localizer);

                UserDTO userDTO = new UserDTO();
                userDTO.UserName = "Cersie";
                userDTO.NormalizedUserName = userDTO.UserName.ToUpper();
                userDTO.Password = "123456789";
                userDTO.ConfirmedPassword = "123456789";
                userDTO.Email = "mm@mm.mm";
                userDTO.NormalizedEmail = userDTO.Email.ToUpper();
                RoleDTO roleDTO = new RoleDTO();
                roleDTO.RoleName = "Admin";
                roleDTO.IsSelected = true;
                userDTO.Roles = new List<RoleDTO>();
                userDTO.Roles.Add(roleDTO);
                RoleDTO roleDTO2 = new RoleDTO();
                roleDTO2.RoleName = "Visitor";
                roleDTO2.IsSelected = true;
                userDTO.Roles.Add(roleDTO2);

                List<ApplicationUser> list = new List<ApplicationUser>();
                mgr.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success).Callback<ApplicationUser, string>((x, y) => { list.Add(x); });
                //ApplicationUser user = DTOAssembler.ConvertUserDTOToUser(userDTO);
                mgr.Setup(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success);
                IQueryable<ApplicationUser> query = list.AsQueryable();
                mgr.Setup(_ => _.Users).Returns(query);
                //signInManager

                Task t = userService.RegisterAsync(userDTO);
                Assert.True(t.IsCompletedSuccessfully);
                Assert.Single(list);
                //Act
                Task<string> res = userService.LoginAsync(userDTO);
                //Assert
                Assert.True(res.IsCompletedSuccessfully);
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.ReadToken(res.Result) as JwtSecurityToken;
                Assert.Single(securityToken.Claims);
                var stringClaimValue = securityToken.Claims.First(claim => claim.Type == ClaimTypes.Role).Value;

            }
        }
        */
    }
}
