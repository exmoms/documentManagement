using DM.Domain.Models;
using DM.Repository.Contexts;
using DM.Service.Services;
using DM.Service.ServiceModels;
using DM.Service.ServiceModels.DocumentClassDTO;
using DM.Service.Utils;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Data.Sqlite;
using Moq;

using System;
using System.Collections.Generic;
using System.Linq;

using Xunit;


namespace DM.UnitTest.ServiceUT
{
    public class DocumentClassServiceTest
    {
        [Fact]
        public void TestGetMetaDataModelsFunction()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var option = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(option))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(option);

                // Add document class
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new DocumentClass { ID = 2, DocumentClassName = "classB", UserId = 1 });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentClassService> logger = loggerFactory.CreateLogger<DocumentClassService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService documentClassService = new DocumentClassService(dbContext, logger, localizer, null);

                //Act
                var result = documentClassService.GetDocumentClasses();

                //Assert
                Assert.Equal(2, result.Count());

                Assert.Equal("classA", result.ElementAt(0).DocumentClassName);
                Assert.Equal(1, result.ElementAt(0).Id);

                Assert.Equal("classB", result.ElementAt(1).DocumentClassName);
                Assert.Equal(2, result.ElementAt(1).Id);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetMetaDataModelsFunctionEmpty()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var option = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(option))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(option);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentClassService> logger = loggerFactory.CreateLogger<DocumentClassService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService documentClassService = new DocumentClassService(dbContext, logger, localizer, null);

                //Act
                var result = documentClassService.GetDocumentClasses();

                //Assert
                Assert.Empty(result);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetDocumentClassFunction()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var option = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(option))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(option);

                // Add document class
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new DocumentClass { ID = 2, DocumentClassName = "classB", UserId = 1 });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentClassService> logger = loggerFactory.CreateLogger<DocumentClassService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService documentClassService = new DocumentClassService(dbContext, logger, localizer, null);

                //Act
                var result = documentClassService.GetDocumentClass(1);

                //Assert
                Assert.Equal("classA", result.DocumentClassName);
                Assert.Equal(1, result.Id);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetDocumentClassFunctionNotExist()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var option = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(option))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(option);

                // Add document class
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new DocumentClass { ID = 2, DocumentClassName = "classB", UserId = 1 });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentClassService> logger = loggerFactory.CreateLogger<DocumentClassService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService documentClassService = new DocumentClassService(dbContext, logger, localizer, null);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => documentClassService.GetDocumentClass(3));
                Assert.Equal("Document Class Not Found", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddDocumentClassFunction()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var option = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(option))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(option);

                // Add document class
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new DocumentClass { ID = 2, DocumentClassName = "classB", UserId = 1 });
                dbContext.SaveChanges();

                // document class
                 DocumentClassDTO documentClassDto = new DocumentClassDTO();
                documentClassDto.Id = 3;
                documentClassDto.DocumentClassName = "classD";
                documentClassDto.UserName = "Sam";
                documentClassDto.AddedDate = DateTime.Now;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentClassService> logger = loggerFactory.CreateLogger<DocumentClassService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentClassService>(factory);

                var userInfomationServiceMock = new Mock<IUserInformationService>();
                userInfomationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentClassService documentClassService = new DocumentClassService(dbContext, logger, localizer, userInfomationServiceMock.Object);
                var set = dbContext.Set<ApplicationUser>();

                //Act
                documentClassService.AddDocumentClass(documentClassDto);

                //Assert
                var allDocumentClasses = dbContext.Set<DocumentClass>().ToList();
                Assert.Equal(3, allDocumentClasses.Count());
                Assert.Equal("classD", allDocumentClasses.ElementAt(2).DocumentClassName);
                Assert.Equal(3, allDocumentClasses.ElementAt(2).ID);
                //Assert.Equal("admin", allDocumentClasses.ElementAt(2).User.UserName);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddDocumentClassFunctionEmptyName()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var option = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(option))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(option);

                // Add document class
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new DocumentClass { ID = 2, DocumentClassName = "classB", UserId = 1 });
                dbContext.SaveChanges();

                // document class
                DocumentClassDTO documentClassDto = new DocumentClassDTO();
                documentClassDto.Id = 3;
                documentClassDto.DocumentClassName = "";
                documentClassDto.AddedDate = DateTime.Now;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentClassService> logger = loggerFactory.CreateLogger<DocumentClassService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService documentClassService = new DocumentClassService(dbContext, logger, localizer, null);

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => documentClassService.AddDocumentClass(documentClassDto));
                Assert.Equal("Document Class Name is NULL or Empty", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddDocumentClassFunctionDuplicatedId()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var option = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(option))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(option);

                // Add document class
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new DocumentClass { ID = 2, DocumentClassName = "classB", UserId = 1 });
                dbContext.SaveChanges();

                // document class
                DocumentClassDTO documentClassDto = new DocumentClassDTO();
                documentClassDto.DocumentClassName = "classC";
                documentClassDto.Id = 2;
                documentClassDto.AddedDate = DateTime.Now;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentClassService> logger = loggerFactory.CreateLogger<DocumentClassService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentClassService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentClassService documentClassService = new DocumentClassService(dbContext, logger, localizer, userInformationServiceMock.Object);

                // Act
                documentClassService.AddDocumentClass(documentClassDto);

                // Assert
                var allDocumentClasses = dbContext.Set<DocumentClass>().ToList();
                Assert.Equal(3, allDocumentClasses.Count());
                Assert.Equal("classC", allDocumentClasses.ElementAt(2).DocumentClassName);
                Assert.Equal(3, allDocumentClasses.ElementAt(2).ID);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddDocumentClassFunctionDuplicatedName()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var option = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(option))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(option);

                // Add document class
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new DocumentClass { ID = 2, DocumentClassName = "classB", UserId = 1 });
                dbContext.SaveChanges();

                // document class
                DocumentClassDTO documentClassDto = new DocumentClassDTO();
                documentClassDto.DocumentClassName = "classB";
                documentClassDto.Id = 3;
                documentClassDto.AddedDate = DateTime.Now;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentClassService> logger = loggerFactory.CreateLogger<DocumentClassService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentClassService>(factory);

                var userInfomationServiceMock = new Mock<IUserInformationService>();
                userInfomationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentClassService documentClassService = new DocumentClassService(dbContext, logger, localizer, userInfomationServiceMock.Object);

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => documentClassService.AddDocumentClass(documentClassDto));
                Assert.Equal("Document Class Name Already Added classB", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestDeleteDocumentClassFunction()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var option = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(option))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(option);

                // Add document class
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new DocumentClass { ID = 2, DocumentClassName = "classB", UserId = 1 });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentClassService> logger = loggerFactory.CreateLogger<DocumentClassService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService documentClassService = new DocumentClassService(dbContext, logger, localizer, null);
                var set = dbContext.Set<ApplicationUser>();
                //Act
                documentClassService.DeleteDocumentClass(1);

                //Assert
                var allDocumentClasses = dbContext.Set<DocumentClass>().ToList();
                Assert.Single(allDocumentClasses);
                Assert.Equal("classB", allDocumentClasses.ElementAt(0).DocumentClassName);
                Assert.Equal(2, allDocumentClasses.ElementAt(0).ID);
                //Assert.Equal("admin", allDocumentClasses.ElementAt(2).User.UserName);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestDeleteDocumentClassFunctionAlreadyDeleted()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var option = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(option))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(option);

                // Add document class
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new DocumentClass { ID = 2, DocumentClassName = "classB", UserId = 1 });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentClassService> logger = loggerFactory.CreateLogger<DocumentClassService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService documentClassService = new DocumentClassService(dbContext, logger, localizer, null);
                var set = dbContext.Set<ApplicationUser>();
                documentClassService.DeleteDocumentClass(1);

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => documentClassService.DeleteDocumentClass(1));
                Assert.Equal("Document Class Not Found", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }


        [Fact]
        public void TestDeleteDocumentClassFunctionNotExisted()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var option = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(option))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(option);

                // Add document class
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new DocumentClass { ID = 2, DocumentClassName = "classB", UserId = 1 });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentClassService> logger = loggerFactory.CreateLogger<DocumentClassService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService documentClassService = new DocumentClassService(dbContext, logger, localizer, null);
                var set = dbContext.Set<ApplicationUser>();

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => documentClassService.DeleteDocumentClass(10));
                Assert.Equal("Document Class Not Found", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestDeleteDocumentClassFunctionHasMetaData()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var option = new DbContextOptionsBuilder<DocumentDBContext>()
                 .UseSqlite(connection)
                 .Options;

                // Create the schema in the database
                using (var context = new DocumentDBContext(option))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(option);

                // Add document class
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new DocumentClass { ID = 2, DocumentClassName = "classB", UserId = 1 });
                dbContext.SaveChanges();

                // Define attributes
                MetaDataAttribute attr1 = new MetaDataAttribute { ID = 1, MetaDataAttributeName = "isEmployee", IsRequired = true, DataTypeID = 1 };  // bool

                // Add the meta data model with children
                MetaDataModel mdl = new MetaDataModel();
                mdl.ID = 1;
                mdl.DocumentClassId = 2;
                mdl.MetaDataModelName = "MetaDataModel2";
                mdl.UserId = 1;
                mdl.MetaDataAttributes = new List<MetaDataAttribute>();
                mdl.MetaDataAttributes.Add(attr1);
                dbContext.Add(mdl);
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentClassService> logger = loggerFactory.CreateLogger<DocumentClassService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService documentClassService = new DocumentClassService(dbContext, logger, localizer, null);
                var set = dbContext.Set<ApplicationUser>();

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => documentClassService.DeleteDocumentClass(2));
                Assert.Equal("Document Class Is In Use By Metadata Model MetaDataModel2, Delete MetaData Model First Then You Can Delete Document Class", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }
    }

}
