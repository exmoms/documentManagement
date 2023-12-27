using DM.Presentation.AuthorizationHandlers;
using DM.Repository.Contexts;
using DM.Service.Interface;
using DM.Service.Interfaces;
using DM.Service.Services;

using FluentValidation.AspNetCore;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Microsoft.AspNetCore.DataProtection;
using DM.Presentation.Utils;
using Microsoft.Extensions.Options;
using DM.Service.Utils;
using DM.Domain.Models;
using Microsoft.AspNetCore.Mvc.Authorization;
using System.Threading.Tasks;

namespace DM.Presentation
{
    public class Startup
    {
        private IWebHostEnvironment CurrentEnvironment { get; set; }
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            CurrentEnvironment = env;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            if (!CurrentEnvironment.IsDevelopment())
            {
                ConfigureDataProtection.AddDataProtection(services);
            }

            services.AddLocalization(options => options.ResourcesPath = "Resources");

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddControllers(opt => { 
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy)); }).AddFluentValidation();
            services.AddDbContext<DocumentDBContext>((serviceProvider, options) =>
            {
                var dataProtectionProvider = serviceProvider.GetService<IDataProtectionProvider>();
                SecretsHelper secretsHelper = new SecretsHelper(Configuration, CurrentEnvironment, dataProtectionProvider);
                string connectionString = secretsHelper.GetConnectionString();
                options.UseSqlServer(connectionString);
            });
            
            services.AddIdentity<ApplicationUser, IdentityRole<int>>()
                .AddEntityFrameworkStores<DocumentDBContext>()
                .AddErrorDescriber<LocalizedIdentityErrorDescriber>()
                .AddDefaultTokenProviders();

            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                }).AddJwtBearer();

            services.AddAuthorization(options =>
            {
                options.AddPolicy("LessRolePolicy", policy =>
                    policy.Requirements.Add(new LessRoleRequirement()));
                options.AddPolicy("ProfileOwnerPolicy", policy =>
                   policy.Requirements.Add(new ProfileOwnerRequirement()));
            });
            
            RegisterServices(services);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory, DocumentDBContext dbContext)
        {
            var supportedCultures = new List<CultureInfo>
                    {
                        new CultureInfo("en"),
                        new CultureInfo("ar"),
                        new CultureInfo("de")
                    };

            var options = new RequestLocalizationOptions
            {
                DefaultRequestCulture = new RequestCulture("en"),
                SupportedCultures = supportedCultures,
                SupportedUICultures = supportedCultures,
                RequestCultureProviders = new List<IRequestCultureProvider>
                {
                    new CookieRequestCultureProvider()
                    {
                        CookieName = "lang"
                    }
                }
            };

            app.UseRequestLocalization(options);


            //app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            app.UseMiddleware(typeof(ErrorHandlingMiddleware));

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (CurrentEnvironment.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
            loggerFactory.AddFile("Logs/mylog-{Date}.txt");

            // apply migrations at run-time in staging/production environments
            if(!CurrentEnvironment.IsDevelopment())
            {
                ApplyMigrations(dbContext);
            }
        }

        private static void ApplyMigrations(DocumentDBContext dbContext)
        {
            if(dbContext.Database.GetPendingMigrations().Any())
            {
                dbContext.Database.Migrate();
            }
        }

        private static void RegisterServices(IServiceCollection services)
        {
            services.AddSingleton<IPostConfigureOptions<JwtBearerOptions>, ConfigureJwtBearerOptions>();
            services.AddScoped<IDocumentService, DocumentService>();
            services.AddScoped<IDocumentClassService, DocumentClassService>();
            services.AddScoped<IMetaDataModelService, MetaDataModelService>();
            services.AddScoped<IDocumentSetService, DocumentSetService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ISearchService, SearchService>();
            services.AddScoped<IMailService, MailService>();
            services.AddTransient<ISecretsHelper, SecretsHelper>();
            services.AddTransient<IAuthorizationHandler, LessRoleAuthorizationHandler>();
            services.AddScoped<IAuthorizationHandler, ProfileOwnerAuthorizationHandler>();
            services.AddTransient<IUserInformationService, UserInformationService>();
        }
    }
}
