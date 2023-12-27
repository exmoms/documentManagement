using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;

using System;
using System.Collections.Generic;
using System.Linq;

using Xunit;
using Moq;

using DM.Service.ServiceModels.MailModels;
using DM.Service.Services;
using DM.Service.ServiceModels;
using DM.Repository.Contexts;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;

namespace DM.UnitTest.ServiceUT
{
    public class MailServiceTest
    {
        [Fact]
        public void TestAddMailConfigurations()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(options);

                MailConfigurations inputConfig = new MailConfigurations();
                inputConfig.Server = "mail.lit-co.net";
                inputConfig.Port = 587;
                inputConfig.Email = "a.mansour@lit-co.net";
                inputConfig.Password = "pXXrNb7v1JjS";

                var configMock = new Mock<IConfiguration>();
                configMock.SetupGet(p => p["SMTP:Server"]).Returns(inputConfig.Server);
                configMock.SetupGet(p => p["SMTP:Port"]).Returns(inputConfig.Port.ToString());
                configMock.SetupGet(p => p["SMTP:Email"]).Returns(inputConfig.Email);
                configMock.SetupGet(p => p["SMTP:Password"]).Returns(inputConfig.Password);

                MailService mailService = new MailService(dbContext, configMock.Object, GetMailServiceLocalizerObject());

                //Act
                mailService.AddMailConfigurations(inputConfig);

                //Assert
                configMock.VerifySet(p => p["SMTP:Server"] = inputConfig.Server);
                configMock.VerifySet(p => p["SMTP:Port"] = inputConfig.Port.ToString());
                configMock.VerifySet(p => p["SMTP:Email"] = inputConfig.Email);
                configMock.VerifySet(p => p["SMTP:Password"] = inputConfig.Password);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetConfig()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(options);

                var inMemorySettings = new Dictionary<string, string>
                {
                    {"SMTP:Server", "mail.lit-co.net"},
                    {"SMTP:Port", "587"},
                    {"SMTP:Email", "a.mansour@lit-co.net"},
                    {"SMTP:Password", "pXXrNb7v1JjS"},
                    //...populate as needed for the test
                };

                IConfiguration configuration = new ConfigurationBuilder()
                    .AddInMemoryCollection(inMemorySettings)
                    .Build();

                MailService mailService = new MailService(dbContext, configuration, GetMailServiceLocalizerObject());

                //Act
                var result = mailService.GetConfig();

                //Assert
                Assert.Equal("mail.lit-co.net", result.Server);
                Assert.Equal("587", result.Port.ToString());
                Assert.Equal("a.mansour@lit-co.net", result.Email);
                Assert.Equal("pXXrNb7v1JjS", result.Password);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestTestEmailConnection()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(options);

                var inMemorySettings = new Dictionary<string, string>
                {
                    {"SMTP:Server", "mail.lit-co.net"},
                    {"SMTP:Port", "587"},
                    {"SMTP:Email", "a.mansour@lit-co.net"},
                    {"SMTP:Password", "pXXrNb7v1JjS"},
                    //...populate as needed for the test
                };

                IConfiguration configuration = new ConfigurationBuilder()
                    .AddInMemoryCollection(inMemorySettings)
                    .Build();

                MailService mailService = new MailService(dbContext, configuration, GetMailServiceLocalizerObject());

                MailConfigurations inputConfig = new MailConfigurations();
                inputConfig.Server = "mail.lit-co.net";
                inputConfig.Port = 587;
                inputConfig.Email = "a.mansour@lit-co.net";
                inputConfig.Password = "pXXrNb7v1JjS";

                //Act
                mailService.TestEmailConnection(inputConfig);

                //Assert
                // the assertion is that no exception has been thrown.
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestTestEmailConnectionWrongServer()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(options);

                var inMemorySettings = new Dictionary<string, string>
                {
                    {"SMTP:Server", "mail.lit-co.net"},
                    {"SMTP:Port", "587"},
                    {"SMTP:Email", "a.mansour@lit-co.net"},
                    {"SMTP:Password", "pXXrNb7v1JjS"},
                    //...populate as needed for the test
                };

                IConfiguration configuration = new ConfigurationBuilder()
                    .AddInMemoryCollection(inMemorySettings)
                    .Build();

                MailService mailService = new MailService(dbContext, configuration, GetMailServiceLocalizerObject());

                MailConfigurations inputConfig = new MailConfigurations();
                inputConfig.Server = "mail.lit-co.nettt";
                inputConfig.Port = 587;
                inputConfig.Email = "a.mansour@lit-co.net";
                inputConfig.Password = "pXXrNb7v1JjS";

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => mailService.TestEmailConnection(inputConfig));
                Assert.Equal("No connection could be made. Recheck your configuration please.", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestTestEmailConnectionWrongPort()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(options);

                var inMemorySettings = new Dictionary<string, string>
                {
                    {"SMTP:Server", "mail.lit-co.net"},
                    {"SMTP:Port", "587"},
                    {"SMTP:Email", "a.mansour@lit-co.net"},
                    {"SMTP:Password", "pXXrNb7v1JjS"},
                    //...populate as needed for the test
                };

                IConfiguration configuration = new ConfigurationBuilder()
                    .AddInMemoryCollection(inMemorySettings)
                    .Build();

                MailService mailService = new MailService(dbContext, configuration, GetMailServiceLocalizerObject());

                MailConfigurations inputConfig = new MailConfigurations();
                inputConfig.Server = "mail.lit-co.net";
                inputConfig.Port = 5877;
                inputConfig.Email = "a.mansour@lit-co.net";
                inputConfig.Password = "pXXrNb7v1JjS";

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => mailService.TestEmailConnection(inputConfig));
                Assert.Equal("No connection could be made. Recheck your configuration please.", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestTestEmailConnectionWrongEmail()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(options);

                var inMemorySettings = new Dictionary<string, string>
                {
                    {"SMTP:Server", "mail.lit-co.net"},
                    {"SMTP:Port", "587"},
                    {"SMTP:Email", "a.mansour@lit-co.net"},
                    {"SMTP:Password", "pXXrNb7v1JjS"},
                    //...populate as needed for the test
                };

                IConfiguration configuration = new ConfigurationBuilder()
                    .AddInMemoryCollection(inMemorySettings)
                    .Build();

                MailService mailService = new MailService(dbContext, configuration, GetMailServiceLocalizerObject());

                MailConfigurations inputConfig = new MailConfigurations();
                inputConfig.Server = "mail.lit-co.net";
                inputConfig.Port = 587;
                inputConfig.Email = "a.mansourr@lit-co.net";
                inputConfig.Password = "pXXrNb7v1JjS";

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => mailService.TestEmailConnection(inputConfig));
                Assert.Equal("Incorrect authentication data.", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestTestEmailConnectionWrongPswd()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(options);

                var inMemorySettings = new Dictionary<string, string>
                {
                    {"SMTP:Server", "mail.lit-co.net"},
                    {"SMTP:Port", "587"},
                    {"SMTP:Email", "a.mansour@lit-co.net"},
                    {"SMTP:Password", "pXXrNb7v1JjS"},
                    //...populate as needed for the test
                };

                IConfiguration configuration = new ConfigurationBuilder()
                    .AddInMemoryCollection(inMemorySettings)
                    .Build();

                MailService mailService = new MailService(dbContext, configuration, GetMailServiceLocalizerObject());

                MailConfigurations inputConfig = new MailConfigurations();
                inputConfig.Server = "mail.lit-co.net";
                inputConfig.Port = 587;
                inputConfig.Email = "a.mansour@lit-co.net";
                inputConfig.Password = "111pXXrNb7v1JjS";

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => mailService.TestEmailConnection(inputConfig));
                Assert.Equal("Incorrect authentication data.", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestTestEmailConnectionNoInput()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(options);

                var inMemorySettings = new Dictionary<string, string>
                {
                    {"SMTP:Server", "mail.lit-co.net"},
                    {"SMTP:Port", "587"},
                    {"SMTP:Email", "a.mansour@lit-co.net"},
                    {"SMTP:Password", "pXXrNb7v1JjS"},
                    //...populate as needed for the test
                };

                IConfiguration configuration = new ConfigurationBuilder()
                    .AddInMemoryCollection(inMemorySettings)
                    .Build();

                MailService mailService = new MailService(dbContext, configuration, GetMailServiceLocalizerObject());

                // Act
                mailService.TestEmailConnection();

                // Assert
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestTestEmailConnectionNoInputWrongServer()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(options);

                var inMemorySettings = new Dictionary<string, string>
                {
                    {"SMTP:Server", "mail.lit-co.nett"},
                    {"SMTP:Port", "587"},
                    {"SMTP:Email", "a.mansour@lit-co.net"},
                    {"SMTP:Password", "pXXrNb7v1JjS"},
                    //...populate as needed for the test
                };

                IConfiguration configuration = new ConfigurationBuilder()
                    .AddInMemoryCollection(inMemorySettings)
                    .Build();

                MailService mailService = new MailService(dbContext, configuration, GetMailServiceLocalizerObject());

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => mailService.TestEmailConnection());
                Assert.Equal("No connection could be made. Recheck your configuration please.", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestTestEmailConnectionNoInputWrongPort()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(options);

                var inMemorySettings = new Dictionary<string, string>
                {
                    {"SMTP:Server", "mail.lit-co.net"},
                    {"SMTP:Port", "5877"},
                    {"SMTP:Email", "a.mansour@lit-co.net"},
                    {"SMTP:Password", "pXXrNb7v1JjS"},
                    //...populate as needed for the test
                };

                IConfiguration configuration = new ConfigurationBuilder()
                    .AddInMemoryCollection(inMemorySettings)
                    .Build();

                MailService mailService = new MailService(dbContext, configuration, GetMailServiceLocalizerObject());

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => mailService.TestEmailConnection());
                Assert.Equal("No connection could be made. Recheck your configuration please.", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestTestEmailConnectionNoInputWrongEmail()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(options);

                var inMemorySettings = new Dictionary<string, string>
                {
                    {"SMTP:Server", "mail.lit-co.net"},
                    {"SMTP:Port", "587"},
                    {"SMTP:Email", "aa.mansour@lit-co.net"},
                    {"SMTP:Password", "pXXrNb7v1JjS"},
                    //...populate as needed for the test
                };

                IConfiguration configuration = new ConfigurationBuilder()
                    .AddInMemoryCollection(inMemorySettings)
                    .Build();

                MailService mailService = new MailService(dbContext, configuration, GetMailServiceLocalizerObject());

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => mailService.TestEmailConnection());
                Assert.Equal("Incorrect authentication data.", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestTestEmailConnectionNoInputWrongPswd()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(options);

                var inMemorySettings = new Dictionary<string, string>
                {
                    {"SMTP:Server", "mail.lit-co.net"},
                    {"SMTP:Port", "587"},
                    {"SMTP:Email", "a.mansour@lit-co.net"},
                    {"SMTP:Password", "21pXXrNb7v1JjS"},
                    //...populate as needed for the test
                };

                IConfiguration configuration = new ConfigurationBuilder()
                    .AddInMemoryCollection(inMemorySettings)
                    .Build();

                MailService mailService = new MailService(dbContext, configuration, GetMailServiceLocalizerObject());

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => mailService.TestEmailConnection());
                Assert.Equal("Incorrect authentication data.", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        private StringLocalizer<MailService> GetMailServiceLocalizerObject()
        {
            var loggerFactory = LoggerFactory.Create(builder =>
            {
                builder
                    .AddFilter("Microsoft", LogLevel.Warning)
                    .AddFilter("System", LogLevel.Warning)
                    .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
            });
            var opt = Options.Create(new LocalizationOptions());  
            var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
            return new StringLocalizer<MailService>(factory);
        }
    }
}