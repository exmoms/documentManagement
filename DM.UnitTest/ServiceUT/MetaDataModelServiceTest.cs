using DM.Repository.Contexts;
using Microsoft.EntityFrameworkCore;
using System;
using Xunit;
using DM.Service.ServiceModels;
using DM.Service.Services;
using DM.Domain;
using System.Linq;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Localization;
using DM.Service.ServiceModels.MetaDataModelDTO;
using DM.Domain.Models;
using Moq;
using DM.Service.Utils;

namespace DM.UnitTest.ServiceUT
{

    public class MetaDataModelServiceTest
    {

        void AddDefaultDocumentClasses(DocumentDBContext dbcontext)
        {
            // Add document classes
            dbcontext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
            dbcontext.Add(new DocumentClass { ID = 2, DocumentClassName = "classB", UserId = 1 });
            dbcontext.SaveChanges();
        }

        MetaDataModel AddFirstDefaultMetaDataModel(DocumentDBContext dbcontext)
        {
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
            dbcontext.Add(mdl);
            dbcontext.SaveChanges();

            return mdl;
        }

        MetaDataModel AddSecondDefaultMetaDataModel(DocumentDBContext dbcontext)
        {
            // Define attributes
            MetaDataAttribute attr2 = new MetaDataAttribute { ID = 2, MetaDataAttributeName = "name", IsRequired = true, DataTypeID = 6 };  // string

            // Add the second meta data model without children or parents
            MetaDataModel mdl2 = new MetaDataModel();
            mdl2.ID = 2;
            mdl2.DocumentClassId = 2;
            mdl2.MetaDataModelName = "MetaDataModel3";
            mdl2.UserId = 1;
            mdl2.MetaDataAttributes = new List<MetaDataAttribute>();
            mdl2.MetaDataAttributes.Add(attr2);
            dbcontext.Add(mdl2);
            dbcontext.SaveChanges();

            return mdl2;
        }

        MetaDataModel AddThirdDefaultMetaDataModel(DocumentDBContext dbcontext)
        {
            // Define attributes
            MetaDataAttribute attr2 = new MetaDataAttribute { ID = 3, MetaDataAttributeName = "age", IsRequired = true, DataTypeID = 5 };  // int

            // Add the second meta data model with children
            // Define children to meta data model
            AggregateMetaDataModel agMdl = new AggregateMetaDataModel();
            agMdl.ChildMetadataModelId = 1;
            agMdl.AggregateName = "aggregate model";
            // Define compound to meta data model
            CompoundModel cmpModel = new CompoundModel();
            cmpModel.Caption = "caption";
            cmpModel.ID = 1;
            MetaDataModel mdl = new MetaDataModel();
            mdl.ID = 3;
            mdl.DocumentClassId = 1;
            mdl.MetaDataModelName = "MetaDataModel1";
            mdl.UserId = 1;
            mdl.MetaDataAttributes = new List<MetaDataAttribute>();
            mdl.MetaDataAttributes.Add(attr2);
            mdl.ChildMetaDataModels = new List<AggregateMetaDataModel>();
            mdl.ChildMetaDataModels.Add(agMdl);
            mdl.CompoundModels = new List<CompoundModel>();
            mdl.CompoundModels.Add(cmpModel);
            dbcontext.Add(mdl);
            dbcontext.SaveChanges();

            return mdl;
        }

        [Fact]
        public void TestGetMetaDataModelsFunction()
        {
            // This is a test to the function GetMetaDataModels() in case there are 3 meta data models in the database but one of them is deleted.

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

                // Add document classes
                AddDefaultDocumentClasses(dbContext);

                // Add metadata model
                AddFirstDefaultMetaDataModel(dbContext);
                var mdll = AddSecondDefaultMetaDataModel(dbContext);
                mdll.DeletedDate = DateTime.Now;
                dbContext.Update(mdll);
                dbContext.SaveChanges();
                AddThirdDefaultMetaDataModel(dbContext);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                //Act
                var result = meta.GetMetaDataModels();

                //Assert
                Assert.Equal(2, result.Count());

                // check first metadata model
                Assert.Equal("MetaDataModel2", result.ElementAt(0).MetaDataModelName);
                Assert.Equal(2, result.ElementAt(0).DocumentClassId);
                Assert.Equal(1, result.ElementAt(0).Id);

                Assert.Single(result.ElementAt(0).MetaDataAttributes);
                Assert.Empty(result.ElementAt(0).ChildMetaDataModels);
                Assert.Empty(result.ElementAt(0).CompoundModels);

                // check second metadata model
                Assert.Equal("MetaDataModel1", result.ElementAt(1).MetaDataModelName);
                Assert.Equal(1, result.ElementAt(1).DocumentClassId);
                Assert.Equal(3, result.ElementAt(1).Id);

                Assert.Single(result.ElementAt(1).MetaDataAttributes);

                Assert.Equal("aggregate model", result.ElementAt(1).ChildMetaDataModels.ElementAt(0).AggregateName);
                Assert.Equal(3, result.ElementAt(1).ChildMetaDataModels.ElementAt(0).ParentMetaDataModelId);
                Assert.Equal(1, result.ElementAt(1).ChildMetaDataModels.ElementAt(0).ChildMetaDataModelId);

                Assert.Equal(1, result.ElementAt(1).CompoundModels.ElementAt(0).Id);
                Assert.Equal(3, result.ElementAt(1).CompoundModels.ElementAt(0).MetadataModelId);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetMetaDataModelsEmptyFunction()
        {
            // This is a test to the function GetMetaDataModels() in case there isn't any  meta data model in the database.

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


                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                //Act
                var result = meta.GetMetaDataModels();

                //Assert
                Assert.Empty(result);
            }
            finally
            {
                connection.Close();
            }
        }


        [Fact]
        public void TestGetMetaDataModelByIdFunction()
        {
            // This is a test to the function GetMetaDataModel() by the id as input parameter,
            // in case there is a meta data model with the same id in the database.

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

                // Add document classes
                AddDefaultDocumentClasses(dbContext);

                // Add metadata model
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);
                AddThirdDefaultMetaDataModel(dbContext);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                //Act
                var result = meta.GetMetaDataModelById(3);

                //Assert
                Assert.Equal("MetaDataModel1", result.MetaDataModelName);
                Assert.Equal(1, result.DocumentClassId);
                Assert.Equal(3, result.Id);

                Assert.Single(result.MetaDataAttributes);
                Assert.Equal("age", result.MetaDataAttributes.ElementAt(0).MetaDataAttributeName);

                Assert.Equal("aggregate model", result.ChildMetaDataModels.ElementAt(0).AggregateName);
                Assert.Equal(3, result.ChildMetaDataModels.ElementAt(0).ParentMetaDataModelId);
                Assert.Equal(1, result.ChildMetaDataModels.ElementAt(0).ChildMetaDataModelId);

                Assert.Single(result.CompoundModels);
                Assert.Equal("caption", result.CompoundModels.ElementAt(0).Caption);
            }
            finally
            {
                connection.Close();
            }
        }


        [Fact]
        public void TestGetMetaDataModelNotExistsFunction()
        {
            // This is a test to the function GetMetaDataModel() by the id as input parameter,
            // in case there isn't any meta data model with the input id in the database.

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

                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new MetaDataModel { MetaDataModelName = "MetaDataModel1", DocumentClassId = 1, UserId = 1 });
                dbContext.Add(new MetaDataModel { MetaDataModelName = "MetaDataModel2", DocumentClassId = 1, UserId = 1 });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                //Act & Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => meta.GetMetaDataModelById(4));
                Assert.Equal("Metadata Model NOT FOUND", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetMetaDataModelFunctionDeletedBefore()
        {
            // This is a test to the function GetMetaDataModel() by the id as input parameter,
            // in case the required meta data model has been deleted before.

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

                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new MetaDataModel { ID = 1, MetaDataModelName = "MetaDataModel1", DocumentClassId = 1, UserId = 1 });
                dbContext.Add(new MetaDataModel { ID = 2, MetaDataModelName = "MetaDataModel2", DocumentClassId = 1, UserId = 1, DeletedDate = DateTime.Now });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                //Act & Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => meta.GetMetaDataModelById(2));
                Assert.Equal("Metadata Model NOT FOUND", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        
        [Fact]
        public void TestGetMetaDataModelsByClassIdFunction()
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

                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new DocumentClass { ID = 2, DocumentClassName = "classB", UserId = 1 });
                dbContext.Add(new MetaDataModel { ID = 1, MetaDataModelName = "MetaDataModel1", DocumentClassId = 1, UserId = 1 });
                dbContext.Add(new MetaDataModel { ID = 2, MetaDataModelName = "MetaDataModel2", DocumentClassId = 1, UserId = 1, DeletedDate = DateTime.Now });
                dbContext.Add(new MetaDataModel { ID = 3, MetaDataModelName = "MetaDataModel3", DocumentClassId = 1, UserId = 2 });
                dbContext.Add(new MetaDataModel { ID = 4, MetaDataModelName = "MetaDataModel4", DocumentClassId = 2, UserId = 2 });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                //Act
                var result = meta.GetMetaDataModelsByClassId(1);

                //Assert
                Assert.Equal(2, result.Count());

                Assert.Equal(result[0].GetType().GetProperty("MetaDataModelName").GetValue(result[0], null), "MetaDataModel1");
                Assert.Equal(result[0].GetType().GetProperty("ID").GetValue(result[0], null), 1);

                Assert.Equal(result[1].GetType().GetProperty("MetaDataModelName").GetValue(result[1], null), "MetaDataModel3");
                Assert.Equal(result[1].GetType().GetProperty("ID").GetValue(result[1], null), 3);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetMetaDataModelsByClassIdNotExistFunction()
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

                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new DocumentClass { ID = 2, DocumentClassName = "classB", UserId = 1 });
                dbContext.Add(new MetaDataModel { ID = 1, MetaDataModelName = "MetaDataModel1", DocumentClassId = 1, UserId = 1 });
                dbContext.Add(new MetaDataModel { ID = 2, MetaDataModelName = "MetaDataModel2", DocumentClassId = 1, UserId = 1, DeletedDate = DateTime.Now });
                dbContext.Add(new MetaDataModel { ID = 3, MetaDataModelName = "MetaDataModel3", DocumentClassId = 1, UserId = 2 });
                dbContext.Add(new MetaDataModel { ID = 4, MetaDataModelName = "MetaDataModel4", DocumentClassId = 2, UserId = 2 });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                //Act
                var result = meta.GetMetaDataModelsByClassId(5);

                //Assert
                Assert.Empty(result);
            }
            finally
            {
                connection.Close();
            }
        }
        

        [Fact]
        public void TestAddMetaDataModelFunctionWithoutAttributes() // ToDo: is it accepted? or it should throw an exception?
        {
            // This is a test to the function AddMetaDataModel(),
            // in case meta data model is not compound and doesn't have any attributes and doesn't have any children.

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

                // Add document class
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.SaveChanges();

                // meta data model without children or parents
                MetaDataModelDTO mdl = new MetaDataModelDTO();
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.UserName = "Sam";

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, userInformationServiceMock.Object);

                //Act
                meta.AddMetaDataModel(mdl);

                //Assert
                var model = dbContext.Set<MetaDataModel>().Single(x => x.MetaDataModelName == "MetaDataModel1");
                Assert.Equal("MetaDataModel1", model.MetaDataModelName);
                Assert.Equal(1, model.DocumentClassId);
                Assert.Equal(1, model.ID);
                Assert.Equal(1, model.UserId);
                Assert.NotEqual(DateTime.MinValue, model.AddedDate);
                Assert.Empty(model.MetaDataAttributes);
                Assert.Empty(model.ChildMetaDataModels);
                Assert.Empty(model.CompoundModels);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddMetaDataModelFunctionWithChildren()
        {
            // This is a test to the function AddMetaDataModel(),
            // in case meta data model is not compound but has children.

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

                // Add document classes
                AddDefaultDocumentClasses(dbContext);

                // Add metadata model
                AddFirstDefaultMetaDataModel(dbContext);

                // Initialize the input
                // Define attributes to input meta data model
                MetaDataAttributeDTO attrDto = new MetaDataAttributeDTO { MetaDataAttributeName = "age", IsRequired = true, DataTypeID = 5 };
                // Define children of input meta data model
                AggregateMetaDataModelDTO agMdl = new AggregateMetaDataModelDTO();
                agMdl.ParentMetaDataModelId = 55; // must be ignored
                agMdl.ChildMetaDataModelId = 1;
                agMdl.AggregateName = "aggregate model";
                // input meta data model with children
                MetaDataModelDTO mdl = new MetaDataModelDTO();
                mdl.Id = 25; // must be ignored
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.UserName = "Sam";
                mdl.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                mdl.MetaDataAttributes.Add(attrDto);
                mdl.ChildMetaDataModels = new List<AggregateMetaDataModelDTO>();
                mdl.ChildMetaDataModels.Add(agMdl);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, userInformationServiceMock.Object);

                //Act
                meta.AddMetaDataModel(mdl);

                //Assert
                var model = dbContext.Set<MetaDataModel>().Single(x => x.MetaDataModelName == "MetaDataModel1");

                Assert.Equal("MetaDataModel1", model.MetaDataModelName);
                Assert.Equal(1, model.DocumentClassId);
                Assert.Equal(2, model.ID);
                Assert.Equal(1, model.UserId);
                Assert.NotEqual(DateTime.MinValue, model.AddedDate);

                Assert.Single(model.MetaDataAttributes);
                Assert.Equal("age", model.MetaDataAttributes.ElementAt(0).MetaDataAttributeName);
                Assert.Equal(5, model.MetaDataAttributes.ElementAt(0).DataTypeID);

                Assert.Single(model.ChildMetaDataModels);
                Assert.Equal("aggregate model", model.ChildMetaDataModels.ElementAt(0).AggregateName);
                Assert.Equal(2, model.ChildMetaDataModels.ElementAt(0).ParentMetadataModelId);
                Assert.Equal(1, model.ChildMetaDataModels.ElementAt(0).ChildMetadataModelId);

            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddMetaDataModelFunctionDuplicateAttributeName()
        {
            // This is a test to the function AddMetaDataModel(),
            // in case meta data model with duplicate attribute name.

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

                // Add document classes
                AddDefaultDocumentClasses(dbContext);

                // Add metadata model
                AddFirstDefaultMetaDataModel(dbContext);

                // Initialize the input
                // Define attributes to input meta data model
                MetaDataAttributeDTO attrDto = new MetaDataAttributeDTO { MetaDataAttributeName = "age", IsRequired = true, DataTypeID = 5 };
                MetaDataAttributeDTO attrDto2 = new MetaDataAttributeDTO { MetaDataAttributeName = "age", IsRequired = true, DataTypeID = 5 };
                // input meta data model with children
                MetaDataModelDTO mdl = new MetaDataModelDTO();
                mdl.Id = 25; // must be ignored
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.UserName = "Sam";
                mdl.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                mdl.MetaDataAttributes.Add(attrDto);
                mdl.MetaDataAttributes.Add(attrDto2);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                //Act & Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => meta.AddMetaDataModel(mdl));
                Assert.Equal("Metadata Model Attribute Name EXISTED BEFORE age", ex.AttributeMessages.ElementAt(0));

            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddMetaDataModelFunctionWithNullChilds()
        {
            // This is a test to the function AddMetaDataModel(),
            // in case meta data model is not compound but has Null children.

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

                // Add document classes
                AddDefaultDocumentClasses(dbContext);

                // Add metadata model
                AddFirstDefaultMetaDataModel(dbContext);

                // Initialize the input
                // Define attributes to input meta data model
                MetaDataAttributeDTO attrDto = new MetaDataAttributeDTO { MetaDataAttributeName = "age", IsRequired = true, DataTypeID = 5 };
                // Define children of input meta data model
                AggregateMetaDataModelDTO agMdl = new AggregateMetaDataModelDTO();
                // input meta data model with children
                MetaDataModelDTO mdl = new MetaDataModelDTO();
                mdl.Id = 25; // must be ignored
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.UserName = "Sam";
                mdl.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                mdl.MetaDataAttributes.Add(attrDto);
                mdl.ChildMetaDataModels = new List<AggregateMetaDataModelDTO>();
                mdl.ChildMetaDataModels.Add(agMdl);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                var documentClass = dbContext.Set<DocumentClass>().Single(x => x.DocumentClassName == "classA");

                // Act & Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => meta.AddMetaDataModel(mdl));
                Assert.Equal("Child Metadata Model NOT FOUND", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddMetaDataModelFunctionAggregateNameIsNull()
        {
            // This is a test to the function AddMetaDataModel(),
            // in case meta data model is not compound but has children.

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

                // Add document classes
                AddDefaultDocumentClasses(dbContext);

                // Add metadata model
                AddFirstDefaultMetaDataModel(dbContext);

                // Initialize the input
                // Define attributes to input meta data model
                MetaDataAttributeDTO attrDto = new MetaDataAttributeDTO { MetaDataAttributeName = "age", IsRequired = true, DataTypeID = 5 };
                // Define children of input meta data model
                AggregateMetaDataModelDTO agMdl = new AggregateMetaDataModelDTO();
                agMdl.ParentMetaDataModelId = 55; // must be ignored
                agMdl.ChildMetaDataModelId = 1;
                //agMdl.AggregateName = "aggregate model";
                // input meta data model with children
                MetaDataModelDTO mdl = new MetaDataModelDTO();
                mdl.Id = 25; // must be ignored
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.UserName = "Sam";
                mdl.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                mdl.MetaDataAttributes.Add(attrDto);
                mdl.ChildMetaDataModels = new List<AggregateMetaDataModelDTO>();
                mdl.ChildMetaDataModels.Add(agMdl);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                var documentClass = dbContext.Set<DocumentClass>().Single(x => x.DocumentClassName == "classA");

                // Act & Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => meta.AddMetaDataModel(mdl));
                Assert.Equal("Aggregate Metadata Model Name Is NULL or Empty", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddMetaDataModelFunctionNotExistedMetaIdOfChildren()
        {
            // This is a test to the function AddMetaDataModel(),
            // in case meta data model is not compound but has children.

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

                // Add document classes
                AddDefaultDocumentClasses(dbContext);

                // Add metadata model
                AddFirstDefaultMetaDataModel(dbContext);

                // Initialize the input
                // Define attributes to input meta data model
                MetaDataAttributeDTO attrDto = new MetaDataAttributeDTO { MetaDataAttributeName = "age", IsRequired = true, DataTypeID = 5 };
                // Define children of input meta data model
                AggregateMetaDataModelDTO agMdl = new AggregateMetaDataModelDTO();
                agMdl.ParentMetaDataModelId = 55; // must be ignored
                agMdl.ChildMetaDataModelId = 20;
                agMdl.AggregateName = "aggregate model";
                // input meta data model with children
                MetaDataModelDTO mdl = new MetaDataModelDTO();
                mdl.Id = 25; // must be ignored
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.UserName = "Sam";
                mdl.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                mdl.MetaDataAttributes.Add(attrDto);
                mdl.ChildMetaDataModels = new List<AggregateMetaDataModelDTO>();
                mdl.ChildMetaDataModels.Add(agMdl);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                var documentClass = dbContext.Set<DocumentClass>().Single(x => x.DocumentClassName == "classA");

                // Act & Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => meta.AddMetaDataModel(mdl));
                Assert.Equal("Child Metadata Model NOT FOUND", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }

        }
        [Fact]
        public void TestAddMetaDataModelFunctionWithChildsAndIsCompound()
        {
            // This is a test to the function AddMetaDataModel(),
            // in case meta data model which is compound and has children.

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

                // Add document classes
                AddDefaultDocumentClasses(dbContext);

                // Add metadata model
                AddFirstDefaultMetaDataModel(dbContext);

                // Initialize the input
                // Define attributes to input meta data model
                MetaDataAttributeDTO attrDto = new MetaDataAttributeDTO { MetaDataAttributeName = "age", IsRequired = true, DataTypeID = 5 };
                // Define children of input meta data model
                AggregateMetaDataModelDTO agMdl = new AggregateMetaDataModelDTO();
                agMdl.ParentMetaDataModelId = 55; // must be ignored
                agMdl.ChildMetaDataModelId = 1;
                agMdl.AggregateName = "aggregate model";
                // Define compound attachments
                CompoundModelDTO cmpModel = new CompoundModelDTO();
                cmpModel.Id = 66; // must be ignored
                cmpModel.MetadataModelId = 55; // must be ignored
                cmpModel.Caption = "caption";
                cmpModel.IsRequired = true;
                CompoundModelDTO cmpModel2 = new CompoundModelDTO();
                cmpModel2.Id = 66; // must be ignored
                cmpModel2.MetadataModelId = 55; // must be ignored
                cmpModel2.Caption = "caption2";
                cmpModel2.IsRequired = false;
                // input meta data model with children
                MetaDataModelDTO mdl = new MetaDataModelDTO();
                mdl.Id = 25; // must be ignored
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.UserName = "Sam";
                mdl.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                mdl.MetaDataAttributes.Add(attrDto);
                mdl.ChildMetaDataModels = new List<AggregateMetaDataModelDTO>();
                mdl.ChildMetaDataModels.Add(agMdl);
                mdl.CompoundModels.Add(cmpModel);
                mdl.CompoundModels.Add(cmpModel2);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, userInformationServiceMock.Object);

                //Act
                meta.AddMetaDataModel(mdl);

                //Assert
                var model = dbContext.Set<MetaDataModel>().Single(x => x.MetaDataModelName == "MetaDataModel1");
                Assert.Equal("MetaDataModel1", model.MetaDataModelName);
                Assert.Equal(1, model.DocumentClassId);
                Assert.Equal(2, model.ID);
                Assert.Equal(1, model.UserId);
                Assert.NotEqual(DateTime.MinValue, model.AddedDate);
                // check attributes
                Assert.Single(model.MetaDataAttributes);
                Assert.Equal("age", model.MetaDataAttributes.ElementAt(0).MetaDataAttributeName);
                Assert.Equal(5, model.MetaDataAttributes.ElementAt(0).DataTypeID);
                // check children
                Assert.Single(model.ChildMetaDataModels);
                Assert.Equal("aggregate model", model.ChildMetaDataModels.ElementAt(0).AggregateName);
                Assert.Equal(2, model.ChildMetaDataModels.ElementAt(0).ParentMetadataModelId);
                Assert.Equal(1, model.ChildMetaDataModels.ElementAt(0).ChildMetadataModelId);
                // check compound
                Assert.Equal(2, model.CompoundModels.Count());
                // first compound
                Assert.True(model.CompoundModels.ElementAt(0).IsRequired);
                Assert.Equal("caption", model.CompoundModels.ElementAt(0).Caption);
                Assert.Equal(2, model.CompoundModels.ElementAt(0).MetaDataModelID);
                Assert.Equal(1, model.CompoundModels.ElementAt(0).ID);
                // second compound
                Assert.False(model.CompoundModels.ElementAt(1).IsRequired);
                Assert.Equal("caption2", model.CompoundModels.ElementAt(1).Caption);
                Assert.Equal(2, model.CompoundModels.ElementAt(1).MetaDataModelID);
                Assert.Equal(2, model.CompoundModels.ElementAt(1).ID);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddMetaDataModelFunctionDuplicateAggregateName()
        {
            // This is a test to the function AddMetaDataModel(),
            // in case meta data model has duplicate aggregate name.

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

                // Add document classes
                AddDefaultDocumentClasses(dbContext);

                // Add metadata model
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Initialize the input
                // Define attributes to input meta data model
                MetaDataAttributeDTO attrDto = new MetaDataAttributeDTO { MetaDataAttributeName = "age", IsRequired = true, DataTypeID = 5 };
                // Define children of input meta data model
                AggregateMetaDataModelDTO agMdl = new AggregateMetaDataModelDTO();
                agMdl.ParentMetaDataModelId = 55; // must be ignored
                agMdl.ChildMetaDataModelId = 1;
                agMdl.AggregateName = "aggregate model";
                AggregateMetaDataModelDTO agMdl2 = new AggregateMetaDataModelDTO();
                agMdl2.ParentMetaDataModelId = 55; // must be ignored
                agMdl2.ChildMetaDataModelId = 2;
                agMdl2.AggregateName = "aggregate model";
                // input meta data model with children
                MetaDataModelDTO mdl = new MetaDataModelDTO();
                mdl.Id = 25; // must be ignored
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.UserName = "Sam";
                mdl.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                mdl.MetaDataAttributes.Add(attrDto);
                mdl.ChildMetaDataModels = new List<AggregateMetaDataModelDTO>();
                mdl.ChildMetaDataModels.Add(agMdl);
                mdl.ChildMetaDataModels.Add(agMdl2);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                // Act & Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => meta.AddMetaDataModel(mdl));
                Assert.Equal("Aggregate Metadata Model Name EXISTED BEFORE aggregate model", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddMetaDataModelFunctionIsWrongCompoundDuplicateCaption()
        {
            // This is a test to the function AddMetaDataModel(),
            // in case meta data model has two compound model with same caption.

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

                // Add document classes
                AddDefaultDocumentClasses(dbContext);

                // Add metadata model
                AddFirstDefaultMetaDataModel(dbContext);

                // Initialize the input
                // Define attributes to input meta data model
                MetaDataAttributeDTO attrDto = new MetaDataAttributeDTO { MetaDataAttributeName = "age", IsRequired = true, DataTypeID = 5 };
                // Define children of input meta data model
                AggregateMetaDataModelDTO agMdl = new AggregateMetaDataModelDTO();
                agMdl.ParentMetaDataModelId = 55; // must be ignored
                agMdl.ChildMetaDataModelId = 1;
                agMdl.AggregateName = "aggregate model";
                // Define compound attachments
                CompoundModelDTO cmpModel = new CompoundModelDTO();
                cmpModel.Id = 66; // must be ignored
                cmpModel.MetadataModelId = 55; // must be ignored
                cmpModel.Caption = "caption";
                cmpModel.IsRequired = true;
                CompoundModelDTO cmpModel2 = new CompoundModelDTO();
                cmpModel2.Id = 6; // must be ignored
                cmpModel2.MetadataModelId = 55; // must be ignored
                cmpModel2.Caption = "caption";
                cmpModel2.IsRequired = false;
                // input meta data model with children
                MetaDataModelDTO mdl = new MetaDataModelDTO();
                mdl.Id = 25; // must be ignored
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.UserName = "Sam";
                mdl.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                mdl.MetaDataAttributes.Add(attrDto);
                mdl.ChildMetaDataModels = new List<AggregateMetaDataModelDTO>();
                mdl.ChildMetaDataModels.Add(agMdl);
                mdl.CompoundModels.Add(cmpModel);
                mdl.CompoundModels.Add(cmpModel2);


                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                var documentClass = dbContext.Set<DocumentClass>().Single(x => x.DocumentClassName == "classA");

                // Act & Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => meta.AddMetaDataModel(mdl));
                Assert.Equal("Caption EXISTED BEFORE caption", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddMetaDataModelFunctionIsWrongCompoundNullCaption()
        {
            // This is a test to the function AddMetaDataModel(),
            // in case meta data model has compound model with null caption.

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

                // Add document classes
                AddDefaultDocumentClasses(dbContext);

                // Add metadata model
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Initialize the input
                // Define attributes to input meta data model
                MetaDataAttributeDTO attrDto = new MetaDataAttributeDTO { MetaDataAttributeName = "age", IsRequired = true, DataTypeID = 5 };
                // Define children of input meta data model
                AggregateMetaDataModelDTO agMdl = new AggregateMetaDataModelDTO();
                agMdl.ParentMetaDataModelId = 55; // must be ignored
                agMdl.ChildMetaDataModelId = 1;
                agMdl.AggregateName = "aggregate model";
                // Define compound attachments
                CompoundModelDTO cmpModel = new CompoundModelDTO();
                cmpModel.Id = 66; // must be ignored
                cmpModel.MetadataModelId = 55; // must be ignored
                //cmpModel.Caption = "caption";
                cmpModel.IsRequired = true;
                // input meta data model with children
                MetaDataModelDTO mdl = new MetaDataModelDTO();
                mdl.Id = 25; // must be ignored
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.UserName = "Sam";
                mdl.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                mdl.MetaDataAttributes.Add(attrDto);
                mdl.ChildMetaDataModels = new List<AggregateMetaDataModelDTO>();
                mdl.ChildMetaDataModels.Add(agMdl);
                mdl.CompoundModels.Add(cmpModel);


                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                var documentClass = dbContext.Set<DocumentClass>().Single(x => x.DocumentClassName == "classA");

                // Act & Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => meta.AddMetaDataModel(mdl));
                Assert.Equal("Caption Is NULL or Empty", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddMetaDataModelFunctionNullCompound()
        {
            // This is a test to the function AddMetaDataModel(),
            // in case meta data model has compound model with null compound.

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

                // Add document classes
                AddDefaultDocumentClasses(dbContext);

                // Add metadata model
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Initialize the input
                // Define attributes to input meta data model
                MetaDataAttributeDTO attrDto = new MetaDataAttributeDTO { MetaDataAttributeName = "age", IsRequired = true, DataTypeID = 5 };
                // Define children of input meta data model
                AggregateMetaDataModelDTO agMdl = new AggregateMetaDataModelDTO();
                agMdl.ParentMetaDataModelId = 55; // must be ignored
                agMdl.ChildMetaDataModelId = 1;
                agMdl.AggregateName = "aggregate model";
                // Define compound attachments
                CompoundModelDTO cmpModel = new CompoundModelDTO();
                // input meta data model with children
                MetaDataModelDTO mdl = new MetaDataModelDTO();
                mdl.Id = 25; // must be ignored
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.UserName = "Sam";
                mdl.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                mdl.MetaDataAttributes.Add(attrDto);
                mdl.ChildMetaDataModels = new List<AggregateMetaDataModelDTO>();
                mdl.ChildMetaDataModels.Add(agMdl);
                mdl.CompoundModels.Add(cmpModel);


                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                var documentClass = dbContext.Set<DocumentClass>().Single(x => x.DocumentClassName == "classA");

                // Act & Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => meta.AddMetaDataModel(mdl));
                Assert.Equal("Caption Is NULL or Empty", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddMetaDataModelFunctionWithTwoSimilarChildrens()
        {
            // This is a test to the function AddMetaDataModel(),
            // in case meta data model has two similar children.

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

                // Add document classes
                AddDefaultDocumentClasses(dbContext);

                // Add metadata model
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Initialize the input
                // Define attributes to input meta data model
                MetaDataAttributeDTO attrDto = new MetaDataAttributeDTO { MetaDataAttributeName = "age", IsRequired = true, DataTypeID = 5 };
                // Define children of input meta data model
                AggregateMetaDataModelDTO agMdl = new AggregateMetaDataModelDTO();
                agMdl.ParentMetaDataModelId = 55; // must be ignored
                agMdl.ChildMetaDataModelId = 1;
                agMdl.AggregateName = "aggregate model";
                AggregateMetaDataModelDTO agMdl2 = new AggregateMetaDataModelDTO();
                agMdl2.ParentMetaDataModelId = 55; // must be ignored
                agMdl2.ChildMetaDataModelId = 2;
                agMdl2.AggregateName = "aggregate model";
                // input meta data model with children
                MetaDataModelDTO mdl = new MetaDataModelDTO();
                mdl.Id = 25; // must be ignored
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.UserName = "Sam";
                mdl.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                mdl.MetaDataAttributes.Add(attrDto);
                mdl.ChildMetaDataModels = new List<AggregateMetaDataModelDTO>();
                mdl.ChildMetaDataModels.Add(agMdl);
                mdl.ChildMetaDataModels.Add(agMdl2);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                // Act & Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => meta.AddMetaDataModel(mdl));
                Assert.Equal("Aggregate Metadata Model Name EXISTED BEFORE aggregate model", ex.AttributeMessages.ElementAt(0));

            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddMetaDataModelFunctionLinkToWrongClass()
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

                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.SaveChanges();

                MetaDataModelDTO inputMetaDataModel = new MetaDataModelDTO { MetaDataModelName = "MetaDataModel1", DocumentClassId = 13, UserName = "Sam"
            };

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                // Act & Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => meta.AddMetaDataModel(inputMetaDataModel));
                Assert.Equal("Document Class NOT FOUND", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddMetaDataModelWrongAttributeType()
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

                // Add document class
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.SaveChanges();

                // Initialize the input
                // Define attributes to input meta data model
                MetaDataAttributeDTO attrDto = new MetaDataAttributeDTO();
                attrDto.MetaDataAttributeName = "age";
                attrDto.IsRequired = true;
                attrDto.DataTypeID = 25;
                // input meta data model
                MetaDataModelDTO mdl = new MetaDataModelDTO();
                mdl.Id = 25; // must be ignored
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.UserName = "Sam";
                mdl.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                mdl.MetaDataAttributes.Add(attrDto);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                // Act & Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => meta.AddMetaDataModel(mdl));
                Assert.Equal("Wrong Attribute Type age", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddMetaDataModelFunctionDuplicateMetaName()
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

                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.SaveChanges();

                MetaDataModel inputMetaDataModel = new MetaDataModel { MetaDataModelName = "MetaDataModel1", DocumentClassId = 1, UserId = 1 };
                dbContext.Add(inputMetaDataModel); // to make it duplicated after the act
                dbContext.SaveChanges();

                MetaDataModelDTO inputMetaDataModel2 = new MetaDataModelDTO { MetaDataModelName = "MetaDataModel1", DocumentClassId = 1, UserName = "Sam"
            };

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                // Act & Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => meta.AddMetaDataModel(inputMetaDataModel2));
                Assert.Equal("Metadata Model Name EXISTED BEFORE MetaDataModel1", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestDeleteMetaDataModelFunctionNotExistedId()
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

                // Add document class
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new MetaDataModel { ID = 1, MetaDataModelName = "MetaDataModelName1", UserId = 1, DocumentClassId = 1 });
                dbContext.Add(new MetaDataModel { ID = 2, MetaDataModelName = "MetaDataModelName2", UserId = 1, DocumentClassId = 1 });
                dbContext.SaveChanges();

                var allModelsCount = dbContext.MetaDataModel.Where(x => x.DeletedDate == null).Count();
                Assert.Equal(2, allModelsCount);


                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => meta.DeleteMetaDataModel(4));
                Assert.Equal("Metadata Model NOT FOUND", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestDeleteMetaDataModelFunctionDeleteChildMeta()
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

                // Add document classes
                AddDefaultDocumentClasses(dbContext);

                // Add metadata model
                AddFirstDefaultMetaDataModel(dbContext);

                // Define attributes to meta data model
                MetaDataAttribute attr = new MetaDataAttribute { MetaDataAttributeName = "age", IsRequired = true, DataTypeID = 5 };
                // Define children to meta data model
                AggregateMetaDataModel agMdl = new AggregateMetaDataModel { ChildMetadataModelId = 1, AggregateName = "aggregate model" };
                // Add the meta data model with children
                MetaDataModel mdl = new MetaDataModel();
                mdl.UserId = 2;
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModelParent";
                mdl.MetaDataAttributes = new List<MetaDataAttribute>();
                mdl.MetaDataAttributes.Add(attr);
                mdl.ChildMetaDataModels = new List<AggregateMetaDataModel>();
                mdl.ChildMetaDataModels.Add(agMdl);
                dbContext.Add(mdl);
                dbContext.SaveChanges();

                var allModelsCount = dbContext.MetaDataModel.Where(x => x.DeletedDate == null).Count();
                Assert.Equal(2, allModelsCount);


                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => meta.DeleteMetaDataModel(1));
                Assert.Equal("Metadata Module Aggregated With Another One MetaDataModelParent", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestDeleteMetaDataModelFunctionDeleteChildMetaOfDeletedParent()
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

                // Add document classes
                AddDefaultDocumentClasses(dbContext);

                // Add metadata model
                AddFirstDefaultMetaDataModel(dbContext);

                // Define attributes to meta data model
                MetaDataAttribute attr = new MetaDataAttribute { MetaDataAttributeName = "age", IsRequired = true, DataTypeID = 5 };
                // Define children to meta data model
                AggregateMetaDataModel agMdl = new AggregateMetaDataModel { ChildMetadataModelId = 1, AggregateName = "aggregate model" };
                // Add the meta data model with children
                MetaDataModel mdl = new MetaDataModel();
                mdl.UserId = 2;
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModelParent";
                mdl.MetaDataAttributes = new List<MetaDataAttribute>();
                mdl.MetaDataAttributes.Add(attr);
                mdl.ChildMetaDataModels = new List<AggregateMetaDataModel>();
                mdl.ChildMetaDataModels.Add(agMdl);
                dbContext.Add(mdl);
                dbContext.SaveChanges();

                var allModelsCount = dbContext.MetaDataModel.Where(x => x.DeletedDate == null).Count();
                Assert.Equal(2, allModelsCount);


                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                //Act
                meta.DeleteMetaDataModel(2);
                meta.DeleteMetaDataModel(1);

                //Assert
                Assert.Equal(0, dbContext.MetaDataModel.Where(x => x.DeletedDate == null).IgnoreQueryFilters().Count());
                Assert.Equal(2, dbContext.MetaDataModel.Where(x => x.DeletedDate != null).IgnoreQueryFilters().Count());
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestDeleteMetaDataModelFunction()
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

                // Add document class
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new MetaDataModel { ID = 1, MetaDataModelName = "MetaDataModelName1", UserId = 1, DocumentClassId = 1 });
                dbContext.Add(new MetaDataModel { ID = 2, MetaDataModelName = "MetaDataModelName2", UserId = 1, DocumentClassId = 1 });
                dbContext.SaveChanges();

                var allModelsCount = dbContext.MetaDataModel.Where(x => x.DeletedDate == null).Count();
                Assert.Equal(2, allModelsCount);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                //Act
                meta.DeleteMetaDataModel(1);

                //Assert
                Assert.Equal(1, dbContext.MetaDataModel.Where(x => x.DeletedDate == null).IgnoreQueryFilters().Count());
                Assert.Equal(1, dbContext.MetaDataModel.Where(x => x.DeletedDate != null).IgnoreQueryFilters().Count());

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => meta.DeleteMetaDataModel(1));
                Assert.Equal("Metadata Model NOT FOUND", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }


        [Fact]
        public void TestGetNumberOfCompoundAttachmentsByMetaDataModelIdFunction()
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

                // Add document classes
                AddDefaultDocumentClasses(dbContext);

                // Add metadata model
                AddFirstDefaultMetaDataModel(dbContext);

                // Define attributes to meta data model
                MetaDataAttribute attr = new MetaDataAttribute { MetaDataAttributeName = "age",IsRequired = true, DataTypeID = 5};
                // Define children to meta data model
                AggregateMetaDataModel agMdl = new AggregateMetaDataModel { ChildMetadataModelId =1, AggregateName = "aggregate model" };
                // Define compound to meta data model
                CompoundModel cmpModel = new CompoundModel { Caption = "caption", ID = 1 };
                CompoundModel cmpModel2 = new CompoundModel {Caption = "caption2", ID = 2};
                CompoundModel cmpModel3 = new CompoundModel { Caption = "caption3", ID = 3 };
                // Add the meta data model with children
                MetaDataModel mdl = new MetaDataModel();
                mdl.UserId = 2;
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.MetaDataAttributes = new List<MetaDataAttribute>();
                mdl.MetaDataAttributes.Add(attr);
                mdl.ChildMetaDataModels = new List<AggregateMetaDataModel>();
                mdl.ChildMetaDataModels.Add(agMdl);
                mdl.CompoundModels = new List<CompoundModel>();
                mdl.CompoundModels.Add(cmpModel);
                mdl.CompoundModels.Add(cmpModel2);
                mdl.CompoundModels.Add(cmpModel3);
                dbContext.Add(mdl);
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                //Act
                var resultId1 = meta.GetNumberOfCompoundAttachmentsByMetaDataModelId(1);
                var resultId2 = meta.GetNumberOfCompoundAttachmentsByMetaDataModelId(2);
                ValidatorException ex = Assert.Throws<ValidatorException>(() => meta.GetNumberOfCompoundAttachmentsByMetaDataModelId(3));
                Assert.Equal("Metadata Model NOT FOUND", ex.AttributeMessages.ElementAt(0));

                //Assert
                Assert.Equal(0, resultId1);
                Assert.Equal(3, resultId2);
            }
            finally
            {
                connection.Close();
            }
        }
        [Fact]
        public void TestGetNumberOfCompoundAttachmentsByMetaDataModelIdFunctionForDeletedModel()
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

                // Add document classes
                AddDefaultDocumentClasses(dbContext);

                // Add metadata model
                var addedMeta= AddFirstDefaultMetaDataModel(dbContext);
                addedMeta.DeletedDate = DateTime.Now;
                dbContext.Update(addedMeta);
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<MetaDataModelService> logger = loggerFactory.CreateLogger<MetaDataModelService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(dbContext, logger, localizer, null);

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => meta.GetNumberOfCompoundAttachmentsByMetaDataModelId(1));
                Assert.Equal("Metadata Model NOT FOUND", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

    }

}

