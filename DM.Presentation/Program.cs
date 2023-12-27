using DM.Service.Utils;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace DM.Presentation
{
    public class Program
    {
        public static void Main(string[] args)
        {
            if (args != null && args.Length == 1 && args[0].ToLowerInvariant() == "-config")
            {
                ConfigureDataProtection.ConfigAppSettingsSecret();
                return;
            }
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
            .ConfigureLogging(logBuilder =>
            {
                logBuilder.ClearProviders(); // removes all providers from LoggerFactory
                logBuilder.AddConsole();
                logBuilder.AddTraceSource("Information, ActivityTracing"); // Add Trace listener provider
            })
            .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                })
            .ConfigureAppConfiguration((builder, options) =>
                {
                    options.AddJsonFile(ConfigureDataProtection.ConfigFileFullPath, optional: true, reloadOnChange: false);
                });
    }
}
