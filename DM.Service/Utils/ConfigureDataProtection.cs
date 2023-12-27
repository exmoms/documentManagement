using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.Repositories;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.IO;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text.Json;

namespace DM.Service.Utils
{
    public class ConfigureDataProtection
    {
        private const string APP_NAME = "DM.Presentation.Program.v0.0";
        private const string SECRET_CONFIG_FILE_NAME = "appsettings.secret.json";
        private const string CERTIFICATE_FILE_NAME = "dataProtection_cert.pfx";

        public static void ConfigAppSettingsSecret()
        {
            // Generate the certificate on non windows platforms.
            if (!RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                GenerateX509Certificate();
            }
            // Add DataProtection service.
            var serviceCollection = new ServiceCollection();
            AddDataProtection(serviceCollection);

            // Create Protector.
            var services = serviceCollection.BuildServiceProvider();
            var dataProtectionProvider = services.GetService<IDataProtectionProvider>();
            var protector = CreateProtector(dataProtectionProvider);

            // Request the secrets.
            Console.WriteLine("Enter the secret required for the token authentication");
            string secretTokenKey = Console.ReadLine();
            Console.WriteLine("Enter the Connection string");
            string connectionString = Console.ReadLine();

            // Encrypt the provided secrets.
            var protectedSecretTokenKey = protector.Protect(secretTokenKey);
            var protectedConnectionString = protector.Protect(connectionString);

            // Serialize encrypted secrets to JSON.
            string json = JsonSerializer.Serialize(new { protectedSecretTokenKey, protectedConnectionString });  

            // Write secrets to a file.
            var path = ConfigFileFullPath;
            File.WriteAllText(path, json);
            Console.WriteLine($"Writing app settings secret to '{path}' completed successfully.");
        }

        // Create a directory to store the secrets in.
        internal static DirectoryInfo SecretsDirectory
        {
            get 
            {
                var location = System.Reflection.Assembly.GetEntryAssembly().Location;
                var secretDirectory =  System.IO.Path.GetDirectoryName(location) + "/secrets_config";
                return Directory.CreateDirectory(secretDirectory);
            }
        }

        public static string ConfigFileFullPath
        {
            get { return Path.Combine(SecretsDirectory.FullName, SECRET_CONFIG_FILE_NAME); }
        }

        public static void AddDataProtection(IServiceCollection serviceCollection)
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows)) // Windows platform
            {
                serviceCollection.AddDataProtection()
                    .SetApplicationName(APP_NAME);
            }
            else // Other platforms
            {
                X509Certificate2 cert = new X509Certificate2(SecretsDirectory.FullName + "/" + CERTIFICATE_FILE_NAME);

                serviceCollection.AddDataProtection()
                            .PersistKeysToFileSystem(FileSystemXmlRepository.DefaultKeyStorageDirectory)
                            .ProtectKeysWithCertificate(cert)
                            .SetApplicationName(APP_NAME);
            }
        }

        // For more information about DataProtectionProvider check: 
        // https://docs.microsoft.com/en-us/aspnet/core/security/data-protection/using-data-protection?view=aspnetcore-3.1
        internal static IDataProtector CreateProtector(IDataProtectionProvider dataProtectionProvider)
        {
            return dataProtectionProvider.CreateProtector(APP_NAME);
        }

        private static void GenerateX509Certificate()
        {
            RSA rsaKey = RSA.Create(4096);
            CertificateRequest request = new CertificateRequest(
                "CN=SCASEE",
                rsaKey,
                HashAlgorithmName.SHA512,
                RSASignaturePadding.Pkcs1);

            request.CertificateExtensions.Add(
                new X509BasicConstraintsExtension(false, false, 0, false));

            request.CertificateExtensions.Add(
                new X509KeyUsageExtension(X509KeyUsageFlags.DigitalSignature | X509KeyUsageFlags.NonRepudiation, false));

            request.CertificateExtensions.Add(
                new X509EnhancedKeyUsageExtension(
                    new OidCollection
                    {
                    new Oid("1.3.6.1.5.5.7.3.8")
                    },
                    true));

            request.CertificateExtensions.Add(
                new X509SubjectKeyIdentifierExtension(request.PublicKey, false));

            X509Certificate2 certificate = request.CreateSelfSigned(
                DateTimeOffset.UtcNow.AddDays(-30),
                DateTimeOffset.UtcNow.AddYears(30));

            // export certificate
            var certificateContent = certificate.Export(X509ContentType.Pfx);
            var path = Path.Combine(SecretsDirectory.FullName, CERTIFICATE_FILE_NAME);
            File.WriteAllBytes(path, certificateContent);
        }

    }
}
