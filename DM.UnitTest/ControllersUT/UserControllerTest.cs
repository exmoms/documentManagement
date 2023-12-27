using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using DM.Domain;
using DM.Presentation.Controllers;
using DM.Repository.Contexts;
using DM.Service.ServiceModels;
using DM.Service.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;
namespace DM.UnitTest.Controllers
{
    public class UserControllerTest
    {/*
        [Fact]
        public void LoginAsync()
        {
                 var options = new DbContextOptionsBuilder<DocumentDBContext>()
                .UseInMemoryDatabase(databaseName: "edit_profile_database")
                .ConfigureWarnings(e => e.Ignore(InMemoryEventId.TransactionIgnoredWarning))
                .Options;
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
                null, null, null,new Mock<IUserConfirmation<ApplicationUser>>().Object);

                var roleStore = new Mock<IRoleStore<IdentityRole<int>>>();
                var roleManager = new Mock<RoleManager<IdentityRole<int>>>(
                roleStore.Object, null, null, null, null);

                var configuration = new Mock<IConfiguration>();
                configuration.Object["jwt:JwtKey"] = "***";
                configuration.Object["jwt:JwtExpireDays"] = "****";
                configuration.Object["jwt:JwtIssuer"] = "*****";

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<UserService>(factory);

                var userService = new UserService(mgr.Object, signInManager.Object, roleManager.Object, logger, configuration.Object, localizer);

            var userController = new UserController(userService);


            List<ApplicationUser> list = new List<ApplicationUser>();
            mgr.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success).Callback<ApplicationUser, string>((x, y) => { list.Add(x); }); 
            
            signInManager.Setup(x => x.PasswordSignInAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<bool>(), It.IsAny<bool>())).ReturnsAsync(SignInResult.Success);
            
            UserDTO userDTO = new UserDTO();
            userDTO.UserName = "Cersie";
            userDTO.Password = "123456789";
            userDTO.ConfirmedPassword = "123456789";
            userDTO.Email = "mm@mm.mm";
            Task t = userService.RegisterAsync(userDTO);
            mgr.Setup(x => x.FindByNameAsync("Cersie")).Returns(Task.FromResult(list[0]));
            //Assert
            //TODO Roles list shall contain only user roles.
            Assert.True(t.IsCompletedSuccessfully);
            Assert.Single(list);
            Assert.Equal("Cersie", list[0].UserName);
            Assert.Equal("mm@mm.mm", list[0].Email);
            //Act
            var result = userController.Login(userDTO);
            //Assert
            Assert.True(result.IsCompletedSuccessfully);
        }
        */
    }
}
