using DM.Domain.Models;
using DM.Repository.Contexts;
using DM.Service.Services;
using DM.Service.ServiceModels;
using DM.Service.ServiceModels.DocumentDTO;
using DM.Service.ServiceModels.MailModels;
using DM.Service.ServiceModels.MetaDataModelDTO;
using DM.Service.Utils;

using Microsoft.AspNetCore.Http;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Configuration;

using Moq;

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;

using Xunit;

namespace DM.UnitTest.ServiceUT
{
    public class DocumentServiceTest
    {
        void AddDefaultDocumentClasses(DocumentDBContext dbcontext)
        {
            // Add document classes
            dbcontext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
            dbcontext.Add(new DocumentClass { ID = 2, DocumentClassName = "classB", UserId = 1 });
            dbcontext.SaveChanges();
        }
        void AddFirstDefaultMetaDataModel(DocumentDBContext dbcontext)
        {
            // Define attributes
            MetaDataAttribute attr1 = new MetaDataAttribute { ID = 1, MetaDataAttributeName = "name", IsRequired = true, DataTypeID = 6 };  // string
            MetaDataAttribute attr2 = new MetaDataAttribute { ID = 2, MetaDataAttributeName = "age", IsRequired = false, DataTypeID = 5 };  // int

            // Add the meta data model with children
            MetaDataModel mdl = new MetaDataModel();
            mdl.ID = 1;
            mdl.DocumentClassId = 1;
            mdl.MetaDataModelName = "MetaDataModel1";
            mdl.UserId = 1;
            mdl.MetaDataAttributes = new List<MetaDataAttribute>();
            mdl.MetaDataAttributes.Add(attr1);
            mdl.MetaDataAttributes.Add(attr2);
            dbcontext.Add(mdl);
            dbcontext.SaveChanges();
        }

        void AddSecondDefaultMetaDataModel(DocumentDBContext dbcontext)
        {
            // Define attributes
            MetaDataAttribute attr3 = new MetaDataAttribute { ID = 3, MetaDataAttributeName = "isEmployee", IsRequired = true, DataTypeID = 1 };  // bool

            // Add the second meta data model without children or parents
            MetaDataModel mdl2 = new MetaDataModel();
            mdl2.ID = 2;
            mdl2.DocumentClassId = 1;
            mdl2.MetaDataModelName = "MetaDataModel2";
            mdl2.UserId = 1;
            mdl2.MetaDataAttributes = new List<MetaDataAttribute>();
            mdl2.MetaDataAttributes.Add(attr3);
            dbcontext.Add(mdl2);
            dbcontext.SaveChanges();
        }
        void AddFirstDefaultDocumentVersionOfFirstMetaModel(DocumentDBContext dbcontext)
        {
            // Define values
            StringValue stringValue = new StringValue { MetaDataAttributeId = 1, MinDocumentVersionId = 1, Value = "Jack" };
            IntValue intValue = new IntValue { MetaDataAttributeId = 2, MinDocumentVersionId = 1, Value = 25 };

            // Add document version
            DocumentVersion documentVersion = new DocumentVersion();
            documentVersion.ID = 1;
            documentVersion.DocumentId = 1;
            documentVersion.UserId = 1;
            documentVersion.VersionMessage = "VersionMessage of document version 1 of document 1";
            documentVersion.StringValues = new List<StringValue>();
            documentVersion.StringValues.Add(stringValue);
            documentVersion.IntValues = new List<IntValue>();
            documentVersion.IntValues.Add(intValue);
            dbcontext.Add(documentVersion);
        }
        void AddFirstDefaultDocumentVersionOfSecondMetaModel(DocumentDBContext dbcontext)
        {
            // Define values
            BoolValue boolValue = new BoolValue { MetaDataAttributeId = 3, MinDocumentVersionId = 2, Value = true };

            // Add document version
            DocumentVersion documentVersion2 = new DocumentVersion(); // relates to second document
            documentVersion2.ID = 2;
            documentVersion2.DocumentId = 2;
            documentVersion2.UserId = 1;
            documentVersion2.VersionMessage = "VersionMessage of document version 1 of document 2";
            documentVersion2.BoolValues = new List<BoolValue>();
            documentVersion2.BoolValues.Add(boolValue);
            dbcontext.Add(documentVersion2);
            dbcontext.SaveChanges();
        }
        void AddSecondDefaultDocumentVersionOfSecondMetaModel(DocumentDBContext dbcontext)
        {
            // Define values
            BoolValue boolValue2 = new BoolValue { MetaDataAttributeId = 3, MinDocumentVersionId = 3, Value = false };

            // Add document version
            DocumentVersion documentVersion3 = new DocumentVersion(); // relates to 3 document
            documentVersion3.ID = 3;
            documentVersion3.DocumentId = 2;
            documentVersion3.UserId = 1;
            documentVersion3.VersionMessage = "VersionMessage of document version 4 of document 3";
            documentVersion3.BoolValues = new List<BoolValue>();
            documentVersion3.BoolValues.Add(boolValue2);
            dbcontext.Add(documentVersion3);
            dbcontext.SaveChanges();
        }
        void AddThirdDefaultDocumentVersionOfSecondMetaModel(DocumentDBContext dbcontext)
        {
            // Define values
            BoolValue boolValue3 = new BoolValue { MetaDataAttributeId = 3, MinDocumentVersionId = 4, Value = false };

            // Add document version
            DocumentVersion documentVersion4 = new DocumentVersion(); // relates to 3 document
            documentVersion4.ID = 4;
            documentVersion4.DocumentId = 2;
            documentVersion4.UserId = 1;
            documentVersion4.VersionMessage = "VersionMessage of document version 4 of document 4";
            documentVersion4.BoolValues = new List<BoolValue>();
            documentVersion4.BoolValues.Add(boolValue3);
            dbcontext.Add(documentVersion4);
            dbcontext.SaveChanges();
        }
        void UpdateLatestVersionId(DocumentDBContext dbcontext, string documentName, int newLatestVersion)
        {
            var doc = dbcontext.Set<Document>().Where(s => s.Name == documentName).Single();
            doc.LatestVersionId = newLatestVersion;
            dbcontext.Update(doc);
            dbcontext.SaveChanges();
        }
        string CreateFirstDefaultAttachment(string fileName)
        {
            string filePath = System.IO.Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);
            filePath += '\\' + fileName;
            // Check if file already exists. If yes, delete it.     
            if (File.Exists(filePath))
            {
                System.GC.Collect();
                System.GC.WaitForPendingFinalizers();
                File.Delete(filePath);
            }

            // Create a new file     
            using (FileStream fs = File.Create(filePath))
            {
                // Add some text to file    
                Byte[] title = new UTF8Encoding(true).GetBytes("New Text File");
                fs.Write(title, 0, title.Length);
                byte[] author = new UTF8Encoding(true).GetBytes("Razan Hussien");
                fs.Write(author, 0, author.Length);
            }
            return filePath;
        }

        private FormFile GetFormFile(string name, string extention)
        {
            var path = CreateFirstDefaultAttachment(name + "." + extention);
            Debug.Write(path);
            var stream = File.OpenRead(path);
            FormFile file = new FormFile(stream, 0, stream.Length, null, name)
            {
                Headers = new HeaderDictionary(),
                ContentType = "application/txt"
            };
            return file;
        }

        [Fact]
        public void TestGetDocumentsFunction()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.Add(new Document { ID = 3, Name = "document name 3", MetaDataModelId = 2, DeletedDate = DateTime.Now }); // will not present in the getter
                dbContext.Add(new Document { ID = 4, Name = "document name 4", MetaDataModelId = 2, IsArchived = true }); // will not present in the getter
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = true });
                dbContext.SaveChanges();
                dbContext.Add(new Attachment { CompoundModelID = 1, DocumentId = 1, Name = "photo attachment" });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                //Act
                var result = doc.GetDocuments();

                //Assert
                Assert.Equal(2, result.Count());

                Assert.Equal(1, result.ElementAt(0).Id);
                Assert.NotEqual(DateTime.MinValue, result.ElementAt(0).AddedDate);
                Assert.NotEqual(DateTime.MinValue, result.ElementAt(0).DeletedDate);
                Assert.Equal(DateTime.MinValue, result.ElementAt(0).ModifiedDate);
                Assert.Equal("document name 1", result.ElementAt(0).DocumentName);
                Assert.Equal(1, result.ElementAt(0).MetadataModelId);
                Assert.Equal(1, result.ElementAt(0).LatestVersion);
                Assert.Equal("MetaDataModel1", result.ElementAt(0).MetadataModelName);

                Assert.Equal(2, result.ElementAt(1).Id);
                Assert.NotEqual(DateTime.MinValue, result.ElementAt(1).AddedDate);
                Assert.NotEqual(DateTime.MinValue, result.ElementAt(1).DeletedDate);
                Assert.Equal(DateTime.MinValue, result.ElementAt(1).ModifiedDate);
                Assert.Equal("document name 2", result.ElementAt(1).DocumentName);
                Assert.Equal(2, result.ElementAt(1).MetadataModelId);
                Assert.Equal(2, result.ElementAt(1).LatestVersion);
                Assert.Equal("MetaDataModel2", result.ElementAt(1).MetadataModelName);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetDocumentsFunctionEmpty()
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
                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                //Act
                var result = doc.GetDocuments();

                //Assert
                Assert.Empty(result);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetDocumentVersionByIdFunction()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                // Add aggregate meta data model
                dbContext.Add(new AggregateMetaDataModel { ID = 1, AggregateName = "first aggregate model", ParentMetadataModelId = 1, ChildMetadataModelId = 2 });
                dbContext.SaveChanges();

                // Add aggregate document
                dbContext.Add(new AggregateDocument { ChildDocumentVersionId = 2, MinParentDocumentVersionId = 1, AggregateMetaDataModelID = 1 });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                //Act
                var result = doc.GetDocumentVersionById(1);

                //Assert
                Assert.NotEqual(DateTime.MinValue, result.AddedDate);
                Assert.Equal(1, result.Id);
                Assert.Equal(2, result.Values.Count());
                Assert.Equal("name", result.Values.ElementAt(0).AttributeName);
                Assert.Equal("Jack", result.Values.ElementAt(0).Value);
                Assert.Equal("age", result.Values.ElementAt(1).AttributeName);
                Assert.Equal(25, result.Values.ElementAt(1).Value);
                Assert.Single(result.ChildrenDocuments);
                Assert.Equal(2, result.ChildrenDocuments.ElementAt(0).ChildDocumentVersionId);
                Assert.Equal(1, result.ChildrenDocuments.ElementAt(0).AggregateMetaDataModelID);

                //Act
                var result2 = doc.GetDocumentVersionById(2);

                //Assert
                Assert.NotEqual(DateTime.MinValue, result2.AddedDate);
                Assert.Equal(2, result2.Id);
                Assert.Single(result2.Values);
                Assert.Equal("isEmployee", result2.Values.ElementAt(0).AttributeName);
                Assert.Equal(true, result2.Values.ElementAt(0).Value);
                Assert.Empty(result2.ChildrenDocuments);

                //Assert
                Assert.NotEqual(DateTime.MinValue, result2.AddedDate);
                Assert.Equal(2, result2.Id);
                Assert.Single(result2.Values);
                Assert.Equal("isEmployee", result2.Values.ElementAt(0).AttributeName);
                Assert.Equal(true, result2.Values.ElementAt(0).Value);
                Assert.Empty(result2.ChildrenDocuments);

                //Act && Assert
                Assert.Throws<ValidatorException>(() => doc.GetDocumentVersionById(4));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetDocumentVersionByIdFunctionDeletedBefore()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Define values
                StringValue stringValue = new StringValue { MetaDataAttributeId = 1, MinDocumentVersionId = 1, Value = "Jack" };
                IntValue intValue = new IntValue { MetaDataAttributeId = 2, MinDocumentVersionId = 1, Value = 25 };

                // Add document version
                DocumentVersion documentVersion = new DocumentVersion();
                documentVersion.ID = 1;
                documentVersion.DeletedDate = DateTime.Now;
                documentVersion.DocumentId = 1;
                documentVersion.UserId = 1;
                documentVersion.VersionMessage = "VersionMessage of document version 1 of document 1";
                documentVersion.StringValues = new List<StringValue>();
                documentVersion.StringValues.Add(stringValue);
                documentVersion.IntValues = new List<IntValue>();
                documentVersion.IntValues.Add(intValue);
                dbContext.Add(documentVersion);

                //Update LatestVersionId of the added documents
                var doc1 = dbContext.Set<Document>().Where(s => s.Name == "document name 1").Single();
                doc1.LatestVersionId = 1;
                dbContext.Update(doc1);
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                //Act && Assert
                Assert.Throws<ValidatorException>(() => doc.GetDocumentVersionById(1));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddDocumentFunction()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add aggregate meta data model
                dbContext.Add(new AggregateMetaDataModel { ID = 1, AggregateName = "first aggregate model", ParentMetadataModelId = 1, ChildMetadataModelId = 2 });
                dbContext.SaveChanges();

                // Add documents
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.SaveChanges();

                // Add document version
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define aggregate document
                AggregateDocumentDTO aggregateDocumentDto = new AggregateDocumentDTO();
                aggregateDocumentDto.ChildDocumentVersionId = 2;
                aggregateDocumentDto.AggregateMetaDataModelID = 1;
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                //  documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                documentVersionDTO.ChildrenDocuments = new List<AggregateDocumentDTO>();
                documentVersionDTO.ChildrenDocuments.Add(aggregateDocumentDto);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();

                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;

                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);

                documentDTO.AddDocumentScans(images);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, userInformationServiceMock.Object);

                //Act
                doc.AddDocument(documentDTO);

                //Assert
                Document d = dbContext.Document.Where(s => s.ID == 1).Single();
                Assert.Contains("MetaDataModel1", d.Name);
                Assert.Equal(1, d.MetaDataModelId);
                Assert.Single(d.DocumentVersions);
                Assert.Equal(1, d.DocumentVersions.ElementAt(0).DocumentId);
                Assert.Equal(1, d.DocumentVersions.ElementAt(0).Document.ID);
                //Assert.Empty(d.Attachments); // ToDo
                Assert.NotEqual(DateTime.MinValue, d.AddedDate);
                Assert.Equal(3, d.LatestVersionId);
                Assert.Equal(3, d.DocumentVersions.ElementAt(0).ChildDocumentVersions.Last().MinParentDocumentVersionId);
                Assert.Equal(2, d.DocumentVersions.ElementAt(0).ChildDocumentVersions.Last().ChildDocumentVersionId);

                DocumentScan documentScan = dbContext.DocumentScan.Where(s => s.MinDocumentVersionId == d.DocumentVersions.ElementAt(0).ID).Single();
                Assert.Null(documentScan.MaxDocumentVersionId);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddDocumentFunctionNullValues()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Initialize the input document
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);


                // TODO: Review if should throw exception when it is null.
                //     ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.AddDocument(documentDTOWithImg));
                //           Assert.Equal("AddDocument({documentDTO}) Null Values", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddDocumentFunctionEmptyValues()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Initialize the input document
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>(); // empty
                                                                  // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);


                //Act && Assert
                // TODO: Review if should throw exception when it's value is null.
                // ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.AddDocument(documentDTOWithImg));
                //     Assert.Equal("AddDocument({documentDTO}) required Value", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }


        [Fact]
        public void TestAddDocumentFunctionAggregateButNullChildrensContainer()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add aggregate meta data model
                dbContext.Add(new AggregateMetaDataModel { ID = 1, AggregateName = "first aggregate model", ParentMetadataModelId = 1, ChildMetadataModelId = 2 });
                dbContext.SaveChanges();

                // Add documents
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.SaveChanges();

                // Add document version
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                //Act && Assert

                // TODO: Review if should throw exception.
                //ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.AddDocument(documentDTOWithImg));
                // Assert.Equal("AddDocument({documentDTO}) AGGREGATE NOT Found", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }


        [Fact]
        public void TestAddDocumentFunctionAggregateButEmptyChildrensContainer()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add aggregate meta data model
                dbContext.Add(new AggregateMetaDataModel { ID = 1, AggregateName = "first aggregate model", ParentMetadataModelId = 1, ChildMetadataModelId = 2 });
                dbContext.SaveChanges();

                // Add documents
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.SaveChanges();

                // Add document version
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                documentVersionDTO.ChildrenDocuments = new List<AggregateDocumentDTO>();
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.AddDocument(documentDTO));
                Assert.Equal("Aggregate Document Child Is Not Existed", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddDocumentFunctionAggregateButNullChildren()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add aggregate meta data model
                dbContext.Add(new AggregateMetaDataModel { ID = 1, AggregateName = "first aggregate model", ParentMetadataModelId = 1, ChildMetadataModelId = 2 });
                dbContext.SaveChanges();

                // Add documents
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.SaveChanges();

                // Add document version
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.AddDocument(documentDTO));
                Assert.Equal("Children NOT FOUND", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddDocumentFunctionChildrenHasWrongMetaDataModel()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add aggregate meta data model
                dbContext.Add(new AggregateMetaDataModel { ID = 1, AggregateName = "first aggregate model", ParentMetadataModelId = 1, ChildMetadataModelId = 2 });
                dbContext.SaveChanges();

                // Add documents
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document version
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define aggregate document
                AggregateDocumentDTO aggregateDocumentDto = new AggregateDocumentDTO();
                aggregateDocumentDto.ChildDocumentVersionId = 2;
                aggregateDocumentDto.AggregateMetaDataModelID = 1;
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                documentVersionDTO.ChildrenDocuments = new List<AggregateDocumentDTO>();
                documentVersionDTO.ChildrenDocuments.Add(aggregateDocumentDto);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.AddDocument(documentDTO));
                Assert.Equal("Wrong Child Metadata Model", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddDocumentFunctionChildrenHasNotExistedId()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add aggregate meta data model
                dbContext.Add(new AggregateMetaDataModel { ID = 1, AggregateName = "first aggregate model", ParentMetadataModelId = 1, ChildMetadataModelId = 2 });
                dbContext.SaveChanges();

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define aggregate document
                AggregateDocumentDTO aggregateDocumentDto = new AggregateDocumentDTO();
                aggregateDocumentDto.ChildDocumentVersionId = 2; // not existed
                aggregateDocumentDto.AggregateMetaDataModelID = 1;
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                documentVersionDTO.ChildrenDocuments = new List<AggregateDocumentDTO>();
                documentVersionDTO.ChildrenDocuments.Add(aggregateDocumentDto);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.AddDocument(documentDTO));
                Assert.Equal("Child Document Version Is Not Existed", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddDocumentFunctionWrongMetaDataModel()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add aggregate meta data model
                dbContext.Add(new AggregateMetaDataModel { ID = 1, AggregateName = "first aggregate model", ParentMetadataModelId = 1, ChildMetadataModelId = 2 });
                dbContext.SaveChanges();

                // Add documents
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.SaveChanges();

                // Add document version
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define aggregate document
                AggregateDocumentDTO aggregateDocumentDto = new AggregateDocumentDTO();
                aggregateDocumentDto.ChildDocumentVersionId = 2;
                aggregateDocumentDto.AggregateMetaDataModelID = 1;
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                documentVersionDTO.ChildrenDocuments = new List<AggregateDocumentDTO>();
                documentVersionDTO.ChildrenDocuments.Add(aggregateDocumentDto);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 3;
                documentDTO.DocumentVersion = documentVersionDTO;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.AddDocument(documentDTO));
                Assert.Equal("Metadata NOT FOUND", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddDocumentFunctionNotAggregateAndHasChildren()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.SaveChanges();

                // Add document version
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define aggregate document
                AggregateDocumentDTO aggregateDocumentDto = new AggregateDocumentDTO();
                aggregateDocumentDto.ChildDocumentVersionId = 2;
                aggregateDocumentDto.AggregateMetaDataModelID = 1;
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                documentVersionDTO.ChildrenDocuments = new List<AggregateDocumentDTO>();
                documentVersionDTO.ChildrenDocuments.Add(aggregateDocumentDto);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.AddDocument(documentDTO));
                Assert.Equal("Metadata Model Has No Children", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddDocumentFunctionWrongAttributeId()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add aggregate meta data model
                dbContext.Add(new AggregateMetaDataModel { ID = 1, AggregateName = "first aggregate model", ParentMetadataModelId = 1, ChildMetadataModelId = 2 });
                dbContext.SaveChanges();

                // Add documents
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.SaveChanges();

                // Add document version
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                ValueDTO ValueDTO3 = new ValueDTO { AttributeId = 3, Value = 25 }; // wrong attribute id
                                                                                   // Define aggregate document
                AggregateDocumentDTO aggregateDocumentDto = new AggregateDocumentDTO();
                aggregateDocumentDto.ChildDocumentVersionId = 2;
                aggregateDocumentDto.AggregateMetaDataModelID = 1;
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                documentVersionDTO.Values.Add(ValueDTO3);

                documentVersionDTO.ChildrenDocuments = new List<AggregateDocumentDTO>();
                documentVersionDTO.ChildrenDocuments.Add(aggregateDocumentDto);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.AddDocument(documentDTO));
                Assert.Equal("Attribute Id Does Not Belong To Model 3", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddDocumentFunctionWrongAttributeIdNotInDB()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add aggregate meta data model
                dbContext.Add(new AggregateMetaDataModel { ID = 1, AggregateName = "first aggregate model", ParentMetadataModelId = 1, ChildMetadataModelId = 2 });
                dbContext.SaveChanges();

                // Add documents
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.SaveChanges();

                // Add document version
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                ValueDTO ValueDTO3 = new ValueDTO { AttributeId = 10, Value = 25 }; // wrong attribute id
                                                                                    // Define aggregate document
                AggregateDocumentDTO aggregateDocumentDto = new AggregateDocumentDTO();
                aggregateDocumentDto.ChildDocumentVersionId = 2;
                aggregateDocumentDto.AggregateMetaDataModelID = 1;
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                documentVersionDTO.Values.Add(ValueDTO3);

                documentVersionDTO.ChildrenDocuments = new List<AggregateDocumentDTO>();
                documentVersionDTO.ChildrenDocuments.Add(aggregateDocumentDto);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.AddDocument(documentDTO));
                Assert.Equal("Attribute Id Does Not Belong To Model 10", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddDocumentFunctionRequiredValueIsNull()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add aggregate meta data model
                dbContext.Add(new AggregateMetaDataModel { ID = 1, AggregateName = "first aggregate model", ParentMetadataModelId = 1, ChildMetadataModelId = 2 });
                dbContext.SaveChanges();

                // Add documents
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.SaveChanges();

                // Add document version
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO();
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define aggregate document
                AggregateDocumentDTO aggregateDocumentDto = new AggregateDocumentDTO();
                aggregateDocumentDto.ChildDocumentVersionId = 2;
                aggregateDocumentDto.AggregateMetaDataModelID = 1;
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                documentVersionDTO.ChildrenDocuments = new List<AggregateDocumentDTO>();
                documentVersionDTO.ChildrenDocuments.Add(aggregateDocumentDto);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.AddDocument(documentDTO));
                Assert.Equal("Required Value name", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddDocumentFunctionNullDocumentVersion() // ToDo wrong exception
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add aggregate meta data model
                dbContext.Add(new AggregateMetaDataModel { ID = 1, AggregateName = "first aggregate model", ParentMetadataModelId = 1, ChildMetadataModelId = 2 });
                dbContext.SaveChanges();

                // Add documents
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.SaveChanges();

                // Add document version
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define aggregate document
                AggregateDocumentDTO aggregateDocumentDto = new AggregateDocumentDTO();
                aggregateDocumentDto.ChildDocumentVersionId = 2;
                aggregateDocumentDto.AggregateMetaDataModelID = 1;
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.AddDocument(documentDTO));
                Assert.Equal("Children NOT FOUND", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddDocumentFunctionMissingRequiredValues()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add aggregate meta data model
                dbContext.Add(new AggregateMetaDataModel { ID = 1, AggregateName = "first aggregate model", ParentMetadataModelId = 1, ChildMetadataModelId = 2 });
                dbContext.SaveChanges();

                // Add documents
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.SaveChanges();

                // Add document version
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define aggregate document
                AggregateDocumentDTO aggregateDocumentDto = new AggregateDocumentDTO();
                aggregateDocumentDto.ChildDocumentVersionId = 2;
                aggregateDocumentDto.AggregateMetaDataModelID = 1;
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                //documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                documentVersionDTO.ChildrenDocuments = new List<AggregateDocumentDTO>();
                documentVersionDTO.ChildrenDocuments.Add(aggregateDocumentDto);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.AddDocument(documentDTO));
                Assert.Equal("Required Value name", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        /*
        [Fact]
        public void TestAddDocumentFunctionDuplicatedDocumentName() // ToDo
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
                 .UseSqlite(connection)
                 .Options;
                // Create the schema in the database
                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(options);

                // Add document classes
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new DocumentClass { ID = 2, DocumentClassName = "classB", UserId = 1 });

                // Define attributes
                MetaDataAttribute attr1 = new MetaDataAttribute();
                attr1.ID = 1;
                attr1.MetaDataAttributeName = "name";
                attr1.IsRequired = true;
                attr1.DataTypeID = 6; // string
                dbContext.Add(attr1);
                MetaDataAttribute attr2 = new MetaDataAttribute();
                attr2.ID = 2;
                attr2.MetaDataAttributeName = "age";
                attr2.IsRequired = true;
                attr2.DataTypeID = 5; // int
                dbContext.Add(attr2);
                MetaDataAttribute attr3 = new MetaDataAttribute();
                attr3.ID = 3;
                attr3.MetaDataAttributeName = "isEmployee";
                attr3.IsRequired = true;
                attr3.DataTypeID = 1; // bool

                // Add the meta data model with children
                MetaDataModel mdl = new MetaDataModel();
                mdl.ID = 1;
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.UserId = 1;
                mdl.MetaDataAttributes = new List<MetaDataAttribute>();
                mdl.MetaDataAttributes.Add(attr1);
                mdl.MetaDataAttributes.Add(attr2);
                dbContext.Add(mdl);
                dbContext.SaveChanges();

                // Add the second meta data model without children or parents
                MetaDataModel mdl2 = new MetaDataModel();
                mdl2.ID = 2;
                mdl2.DocumentClassId = 1;
                mdl2.MetaDataModelName = "MetaDataModel2";
                mdl2.UserId = 1;
                mdl2.MetaDataAttributes = new List<MetaDataAttribute>();
                mdl2.MetaDataAttributes.Add(attr3);
                dbContext.Add(mdl2);
                dbContext.SaveChanges();

                // Add aggregate meta data model
                AggregateMetaDataModel aggregateMetaDataModel = new AggregateMetaDataModel();
                aggregateMetaDataModel.ID = 1;
                aggregateMetaDataModel.AggregateName = "first aggregate model";
                aggregateMetaDataModel.ParentMetadataModelId = 1;
                aggregateMetaDataModel.ChildMetadataModelId = 2;
                dbContext.Add(aggregateMetaDataModel);
                dbContext.SaveChanges();

                ValueDTO valueDTO1 = new ValueDTO();
                valueDTO1.AttributeId = 1;
                valueDTO1.Value = "Mary";

                ValueDTO valueDTO2 = new ValueDTO();
                valueDTO2.AttributeId = 2;
                valueDTO2.Value = 25;

                BoolValue boolValue = new BoolValue(); // relates to second document
                boolValue.MetaDataAttributeId = 3;
                boolValue.MinDocumentVersionId = 2;
                boolValue.Value = true;

                // Add aggregate document
                AggregateDocumentDTO aggregateDocumentDto = new AggregateDocumentDTO();
                aggregateDocumentDto.ChildDocumentVersionId = 2;
                aggregateDocumentDto.AggregateMetaDataModelID = 1;

                DocumentVersionAddDTO documentVersionDTO = new DocumentVersionAddDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                documentVersionDTO.ChildrenDocuments = new List<AggregateDocumentDTO>();
                documentVersionDTO.ChildrenDocuments.Add(aggregateDocumentDto);

                Document document2 = new Document();
                document2.Name = "document name";
                document2.ID = 2;
                document2.MetaDataModelId = 2;
                //document2.LatestVersionId = 2;
                dbContext.Add(document2);
                dbContext.SaveChanges();

                DocumentVersion documentVersion2 = new DocumentVersion();
                documentVersion2.ID = 2;
                documentVersion2.VersionMessage = "VersionMessage of document version 2";
                documentVersion2.DocumentId = 2;
                documentVersion2.UserId = 1;
                documentVersion2.BoolValues = new List<BoolValue>();
                documentVersion2.BoolValues.Add(boolValue);
                dbContext.Add(documentVersion2);
                dbContext.SaveChanges();

                var documentToUpdate = dbContext.Document.Where(s => s.ID == 2).Single();
                documentToUpdate.LatestVersionId = 2;
                dbContext.Update(documentToUpdate);
                dbContext.SaveChanges();

                DocumentAddDTO documentDTO = new DocumentAddDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);
                DocumentDtoWithImages documentDTOWithImg = new DocumentDtoWithImages();
                documentDTOWithImg.Document = documentDTO;

                //Act
                Assert.Throws<ValidatorException>(() => doc.AddDocument(documentDTOWithImg));
            }
            finally
            {
                connection.Close();
            }
        }
        */
        [Fact]
        public void TestGetDocumentByMetaDataModelFunction()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.Add(new Document { ID = 3, Name = "document name 3", MetaDataModelId = 2 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 3", 3);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                MetaDataModelDTO metaDataModelDTO = new MetaDataModelDTO();
                metaDataModelDTO.Id = 2;

                //Act
                var result = doc.GetDocumentsByMetaDataModel(2);

                //Assert
                Assert.Equal(2, result.Count());
                Assert.Equal("document name 2", result.ElementAt(0).DocumentName);
                Assert.Equal("MetaDataModel2", result.ElementAt(0).MetadataModelName);
                Assert.Equal(2, result.ElementAt(0).MetadataModelId);
                Assert.Equal(2, result.ElementAt(0).LatestVersion);
                Assert.Equal(2, result.ElementAt(0).Id);
                //Assert.Equal(2, result.ElementAt(0).document_version.Id); // ToDo
                Assert.Equal("document name 3", result.ElementAt(1).DocumentName);
                Assert.Equal("MetaDataModel2", result.ElementAt(1).MetadataModelName);
                Assert.Equal(2, result.ElementAt(1).MetadataModelId);
                Assert.Equal(3, result.ElementAt(1).LatestVersion);
                Assert.Equal(3, result.ElementAt(1).Id);
                //Assert.Equal(3, result.ElementAt(1).document_version.Id); // ToDo

                // Act && Assert
                // not existed metaDataModelDTO.Id = 10; 
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.GetDocumentsByMetaDataModel(10));
                Assert.Equal("Metadata NOT FOUND", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetDocumentByMetaDataModelFunctionDeletedBefore()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2, DeletedDate = DateTime.Now });
                dbContext.Add(new Document { ID = 3, Name = "document name 3", MetaDataModelId = 2, DeletedDate = DateTime.Now });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                MetaDataModelDTO metaDataModelDTO = new MetaDataModelDTO();
                metaDataModelDTO.Id = 2;

                // Act
                var result = doc.GetDocumentsByMetaDataModel(2);

                // Assert
                Assert.Empty(result);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestUpdateVersionFunctionInvalidDocumentId()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                DocumentVersionPostDTO documentVersionsDTO = new DocumentVersionPostDTO();
                documentVersionsDTO.DocumentId = 5;

                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);

                documentVersionsDTO.AddScans(images);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.UpdateVersion(documentVersionsDTO));
                Assert.Equal("Document NOT FOUND", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestUpdateVersionFunctionArchived()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1, IsArchived = true });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                DocumentVersionPostDTO documentVersionsDTO = new DocumentVersionPostDTO();
                documentVersionsDTO.DocumentId = 1;

                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);


                documentVersionsDTO.AddScans(images);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.UpdateVersion(documentVersionsDTO));
                Assert.Equal("Document NOT FOUND", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestUpdateVersionFunctionNullChildrenAndNullValues() // ToDo
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                DocumentVersionPostDTO documentVersionsDTO = new DocumentVersionPostDTO();
                documentVersionsDTO.DocumentId = 1;
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestUpdateVersionFunctionChildrensHaveWrongId()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add aggregate meta data model
                dbContext.Add(new AggregateMetaDataModel { ID = 1, AggregateName = "first aggregate model", ParentMetadataModelId = 1, ChildMetadataModelId = 2 });
                dbContext.SaveChanges();

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.SaveChanges();


                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                // Add aggregate document
                dbContext.Add(new AggregateDocument { ChildDocumentVersionId = 2, MinParentDocumentVersionId = 1, AggregateMetaDataModelID = 1 });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary", TypeId = 6 };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25, TypeId = 5 };

                // Add aggregate document
                AggregateDocumentDTO aggregateDocumentDto = new AggregateDocumentDTO { ChildDocumentVersionId = 5, AggregateMetaDataModelID = 1 };

                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "any thing";
                documentVersionDTO.ChildrenDocuments = new List<AggregateDocumentDTO>();
                documentVersionDTO.ChildrenDocuments.Add(aggregateDocumentDto);

                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);


                documentVersionDTO.AddScans(images);

                //Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.UpdateVersion(documentVersionDTO));
                Assert.Equal("Child Version Is Not Existed", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestUpdateVersionFunctionChildrensHaveWrongMetaId()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add aggregate meta data model
                dbContext.Add(new AggregateMetaDataModel { ID = 1, AggregateName = "first aggregate model", ParentMetadataModelId = 1, ChildMetadataModelId = 2 });
                dbContext.SaveChanges();

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.SaveChanges();


                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                // Add aggregate document
                dbContext.Add(new AggregateDocument { ChildDocumentVersionId = 2, MinParentDocumentVersionId = 1, AggregateMetaDataModelID = 1 });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary", TypeId = 6 };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25, TypeId = 5 };

                // Add aggregate document
                AggregateDocumentDTO aggregateDocumentDto = new AggregateDocumentDTO { ChildDocumentVersionId = 2, AggregateMetaDataModelID = 5 };

                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "any thing";
                documentVersionDTO.ChildrenDocuments = new List<AggregateDocumentDTO>();
                documentVersionDTO.ChildrenDocuments.Add(aggregateDocumentDto);

                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);

                documentVersionDTO.AddScans(images);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.UpdateVersion(documentVersionDTO));
                Assert.Equal("Wrong Aggregate Metadata Model ID 5", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestUpdateVersionFunctionIsNotAggregateButUpdateWithChildren()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.SaveChanges();


                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary", TypeId = 6 };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25, TypeId = 5 };

                // Add aggregate document
                AggregateDocumentDTO aggregateDocumentDto = new AggregateDocumentDTO { ChildDocumentVersionId = 5, AggregateMetaDataModelID = 5 };

                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "any thing";
                documentVersionDTO.ChildrenDocuments = new List<AggregateDocumentDTO>();
                documentVersionDTO.ChildrenDocuments.Add(aggregateDocumentDto);

                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);

                documentVersionDTO.AddScans(images);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.UpdateVersion(documentVersionDTO));
                Assert.Equal("Metadata Model Has No Children document name 1", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestUpdateVersionFunctionRequiredValueUpdateToNull()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.SaveChanges();


                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, TypeId = 6 };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25, TypeId = 5 };

                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "any thing";
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);

                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);

                documentVersionDTO.AddScans(images);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.UpdateVersion(documentVersionDTO));
                Assert.Equal("Required Value name", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestUpdateVersionFunctionNotRequiredValueUpdateToNull()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
                 .UseSqlite(connection)
                 .Options;
                // Create the schema in the database
                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(options);

                // Add document classes
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });

                // Define attributes
                MetaDataAttribute attr1 = new MetaDataAttribute { ID = 1, MetaDataAttributeName = "name", IsRequired = false, DataTypeID = 6 };  // string
                MetaDataAttribute attr2 = new MetaDataAttribute { ID = 2, MetaDataAttributeName = "age", IsRequired = false, DataTypeID = 5 };  // int
                MetaDataAttribute attr3 = new MetaDataAttribute { ID = 3, MetaDataAttributeName = "salary", IsRequired = false, DataTypeID = 5 };  // int

                // Add the meta data model without children
                MetaDataModel mdl = new MetaDataModel();
                mdl.ID = 1;
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.UserId = 1;
                mdl.MetaDataAttributes = new List<MetaDataAttribute>();
                mdl.MetaDataAttributes.Add(attr1);
                mdl.MetaDataAttributes.Add(attr2);
                mdl.MetaDataAttributes.Add(attr3);
                dbContext.Add(mdl);
                dbContext.SaveChanges();

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Define values
                StringValue stringValue = new StringValue { MetaDataAttributeId = 1, MinDocumentVersionId = 1, Value = "Jack" };
                IntValue intValue = new IntValue { MetaDataAttributeId = 2, MinDocumentVersionId = 1, Value = 25 };
                IntValue intValue2 = new IntValue { MetaDataAttributeId = 3, MinDocumentVersionId = 1, Value = 1000 };

                // Add document version
                DocumentVersion documentVersion = new DocumentVersion();
                documentVersion.ID = 1;
                documentVersion.DocumentId = 1;
                documentVersion.UserId = 1;
                documentVersion.VersionMessage = "VersionMessage of document version 1 of document 1";
                documentVersion.StringValues = new List<StringValue>();
                documentVersion.StringValues.Add(stringValue);
                documentVersion.IntValues = new List<IntValue>();
                documentVersion.IntValues.Add(intValue);
                documentVersion.IntValues.Add(intValue2);
                dbContext.Add(documentVersion);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, userInformationServiceMock.Object);

                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, TypeId = 6 };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25, TypeId = 5 };
                ValueDTO ValueDTO3 = new ValueDTO { AttributeId = 3, TypeId = 5 };

                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "any thing";
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                documentVersionDTO.Values.Add(ValueDTO3);

                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);

                documentVersionDTO.AddScans(images);

                //Act
                doc.UpdateVersion(documentVersionDTO);

                //Assert
                Document d = dbContext.Document.Where(s => s.ID == 1).Single();
                Assert.Equal(2, d.LatestVersionId);

                DocumentVersion dv = dbContext.DocumentVersion.Where(s => s.ID == 2).Include(m => m.BoolValues)
                    .Include(m => m.DateValues)
                    .Include(m => m.DecimalValues)
                    .Include(m => m.DoubleValues)
                    .Include(m => m.IntValues)
                    .Include(m => m.StringValues)
                    .Include(m => m.ChildDocumentVersions)
                    .Single();

                Assert.Empty(dv.DateValues);
                Assert.Empty(dv.DecimalValues);
                Assert.Empty(dv.DoubleValues);
                Assert.Single(dv.IntValues);
                Assert.Equal(2, dv.IntValues.ElementAt(0).MinDocumentVersionId);
                Assert.Null(dv.IntValues.ElementAt(0).MaxDocumentVersionId);
                Assert.Null(dv.IntValues.ElementAt(0).Value);
                Assert.Single(dv.StringValues);
                Assert.Equal(2, dv.StringValues.ElementAt(0).MinDocumentVersionId);
                Assert.Null(dv.StringValues.ElementAt(0).MaxDocumentVersionId);
                Assert.Null(dv.StringValues.ElementAt(0).Value);
                Assert.Empty(dv.ChildDocumentVersions);
                Assert.Equal(1,dv.UserId);

                // old one
                DocumentVersion oldDv = dbContext.DocumentVersion.Where(s => s.ID == 1).Include(m => m.BoolValues)
                   .Include(m => m.DateValues)
                   .Include(m => m.DecimalValues)
                   .Include(m => m.DoubleValues)
                   .Include(m => m.IntValues)
                   .Include(m => m.StringValues)
                   .Include(m => m.ChildDocumentVersions)
                   .Single();

                Assert.Empty(oldDv.DateValues);
                Assert.Empty(oldDv.DecimalValues);
                Assert.Empty(oldDv.DoubleValues);
                Assert.Equal(2, oldDv.IntValues.Count());
                Assert.Equal(1, oldDv.IntValues.ElementAt(0).MinDocumentVersionId);
                Assert.Null(oldDv.IntValues.ElementAt(0).MaxDocumentVersionId);
                Assert.Equal(25, oldDv.IntValues.ElementAt(0).Value);
                Assert.Equal(1, oldDv.IntValues.ElementAt(1).MinDocumentVersionId);
                Assert.Equal(2, oldDv.IntValues.ElementAt(1).MaxDocumentVersionId);
                Assert.Equal(1000, oldDv.IntValues.ElementAt(1).Value);
                Assert.Single(oldDv.StringValues);
                Assert.Equal(1, oldDv.StringValues.ElementAt(0).MinDocumentVersionId);
                Assert.Equal(2, oldDv.StringValues.ElementAt(0).MaxDocumentVersionId);
                Assert.Equal("Jack", oldDv.StringValues.ElementAt(0).Value);
                Assert.Empty(oldDv.ChildDocumentVersions);

                DocumentScan documentScan = dbContext.DocumentScan.Where(s => s.MinDocumentVersionId == 2).Single();
                Assert.Null(documentScan.MaxDocumentVersionId);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestUpdateVersionFunctionWrongeAttributes()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.SaveChanges();


                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Jack", TypeId = 6 };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 3, Value = 25, TypeId = 5 };

                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "any thing";
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);

                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);

                documentVersionDTO.AddScans(images);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.UpdateVersion(documentVersionDTO));
                Assert.Equal("Attribute Id Does Not Belong To Model 3", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestUpdateVersionFunctionWrongeAttributesNotInDatabase()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);
                AddSecondDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.SaveChanges();


                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Jack", TypeId = 6 };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 10, Value = 25, TypeId = 5 };

                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "any thing";
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);

                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);

                documentVersionDTO.AddScans(images);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.UpdateVersion(documentVersionDTO));
                Assert.Equal("Attribute Id Does Not Belong To Model 10", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestUpdateVersionFunction()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
                 .UseSqlite(connection)
                 .Options;
                // Create the schema in the database
                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(options);

                // Add document classes
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new DocumentClass { ID = 2, DocumentClassName = "classB", UserId = 1 });

                // Define attributes
                MetaDataAttribute attr1 = new MetaDataAttribute { ID = 1, MetaDataAttributeName = "name", IsRequired = true, DataTypeID = 6 };  // string
                MetaDataAttribute attr2 = new MetaDataAttribute { ID = 2, MetaDataAttributeName = "age", IsRequired = false, DataTypeID = 5 };  // int
                MetaDataAttribute attr3 = new MetaDataAttribute { ID = 3, MetaDataAttributeName = "isEmployee", IsRequired = false, DataTypeID = 1 };  // bool
                MetaDataAttribute attr4 = new MetaDataAttribute { ID = 4, MetaDataAttributeName = "count", IsRequired = false, DataTypeID = 5 };  // int

                // Add the meta data model with children
                MetaDataModel mdl = new MetaDataModel();
                mdl.ID = 1;
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.UserId = 1;
                mdl.MetaDataAttributes = new List<MetaDataAttribute>();
                mdl.MetaDataAttributes.Add(attr1);
                mdl.MetaDataAttributes.Add(attr2);
                dbContext.Add(mdl);
                dbContext.SaveChanges();

                // Add the second meta data model without children or parents
                MetaDataModel mdl2 = new MetaDataModel();
                mdl2.ID = 2;
                mdl2.DocumentClassId = 1;
                mdl2.MetaDataModelName = "MetaDataModel2";
                mdl2.UserId = 1;
                mdl2.MetaDataAttributes = new List<MetaDataAttribute>();
                mdl2.MetaDataAttributes.Add(attr3);
                dbContext.Add(mdl2);
                dbContext.SaveChanges();

                // Add the third meta data model without children or parents
                MetaDataModel mdl3 = new MetaDataModel();
                mdl3.ID = 3;
                mdl3.DocumentClassId = 1;
                mdl3.MetaDataModelName = "MetaDataModel3";
                mdl3.UserId = 1;
                mdl3.MetaDataAttributes = new List<MetaDataAttribute>();
                mdl3.MetaDataAttributes.Add(attr4);
                dbContext.Add(mdl3);
                dbContext.SaveChanges();

                // Add aggregate meta data model
                dbContext.Add(new AggregateMetaDataModel { ID = 1, AggregateName = "first aggregate model", ParentMetadataModelId = 1, ChildMetadataModelId = 2 });
                dbContext.SaveChanges();
                dbContext.Add(new AggregateMetaDataModel { ID = 2, AggregateName = "second aggregate model", ParentMetadataModelId = 1, ChildMetadataModelId = 3 });
                dbContext.SaveChanges();

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.Add(new Document { ID = 3, Name = "document name 3", MetaDataModelId = 2 });
                dbContext.Add(new Document { ID = 4, Name = "document name 4", MetaDataModelId = 3 });
                dbContext.SaveChanges();

                // Define values
                StringValue stringValue = new StringValue { MetaDataAttributeId = 1, MinDocumentVersionId = 1, Value = "Jack" };
                IntValue intValue = new IntValue { MetaDataAttributeId = 2, MinDocumentVersionId = 1, Value = 25 };
                BoolValue boolValue = new BoolValue { MetaDataAttributeId = 3, MinDocumentVersionId = 2, Value = true };
                BoolValue boolValue2 = new BoolValue { MetaDataAttributeId = 3, MinDocumentVersionId = 3, Value = false };
                IntValue intValue2 = new IntValue { MetaDataAttributeId = 4, MinDocumentVersionId = 4, Value = 26 };

                // Add document version
                DocumentVersion documentVersion = new DocumentVersion();
                documentVersion.DocumentId = 1;
                documentVersion.UserId = 1;
                documentVersion.VersionMessage = "VersionMessage of document version 1 of document 1";
                documentVersion.StringValues = new List<StringValue>();
                documentVersion.StringValues.Add(stringValue);
                documentVersion.IntValues = new List<IntValue>();
                documentVersion.IntValues.Add(intValue);
                dbContext.Add(documentVersion);
                dbContext.SaveChanges();
                DocumentVersion documentVersion2 = new DocumentVersion(); // relates to second document
                documentVersion2.DocumentId = 2;
                documentVersion2.UserId = 1;
                documentVersion2.VersionMessage = "VersionMessage of document version 1 of document 2";
                documentVersion2.BoolValues = new List<BoolValue>();
                documentVersion2.BoolValues.Add(boolValue);
                dbContext.Add(documentVersion2);
                dbContext.SaveChanges();
                DocumentVersion documentVersion3 = new DocumentVersion(); // relates to third document
                documentVersion3.DocumentId = 3;
                documentVersion3.UserId = 1;
                documentVersion3.VersionMessage = "VersionMessage of document version 3 of document 3";
                documentVersion3.BoolValues = new List<BoolValue>();
                documentVersion3.BoolValues.Add(boolValue2);
                dbContext.Add(documentVersion3);
                dbContext.SaveChanges();
                DocumentVersion documentVersion4 = new DocumentVersion(); // relates to 4 document
                documentVersion4.DocumentId = 4;
                documentVersion4.UserId = 1;
                documentVersion4.VersionMessage = "VersionMessage of document version 4 of document 4";
                documentVersion4.IntValues = new List<IntValue>();
                documentVersion4.IntValues.Add(intValue2);
                dbContext.Add(documentVersion4);
                dbContext.SaveChanges();

                // Add aggregate document
                dbContext.Add(new AggregateDocument { ChildDocumentVersionId = 2, MinParentDocumentVersionId = 1, AggregateMetaDataModelID = 1 });
                dbContext.SaveChanges();
                dbContext.Add(new AggregateDocument { ChildDocumentVersionId = 4, MinParentDocumentVersionId = 1, AggregateMetaDataModelID = 2 });
                dbContext.SaveChanges();

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 3", 3);
                UpdateLatestVersionId(dbContext, "document name 4", 4);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, userInformationServiceMock.Object);

                // Add aggregate document
                AggregateDocumentDTO aggregateDocumentDto = new AggregateDocumentDTO { ChildDocumentVersionId = 3, AggregateMetaDataModelID = 1 };
                AggregateDocumentDTO aggregateDocumentDto2 = new AggregateDocumentDTO { ChildDocumentVersionId = 4, AggregateMetaDataModelID = 2 };

                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary", TypeId = 6 };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25, TypeId = 5 }; // this value is not changed

                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "any thing";
                documentVersionDTO.ChildrenDocuments = new List<AggregateDocumentDTO>();
                documentVersionDTO.ChildrenDocuments.Add(aggregateDocumentDto);
                documentVersionDTO.ChildrenDocuments.Add(aggregateDocumentDto2);
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);

                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);

                documentVersionDTO.AddScans(images);

                // Act
                doc.UpdateVersion(documentVersionDTO);

                // Assert
                Document d = dbContext.Document.Where(s => s.ID == 1).Single();
                Assert.Equal(5, d.LatestVersionId);

                DocumentVersion dv = dbContext.DocumentVersion.Where(s => s.ID == 5).Include(m => m.BoolValues)
                    .Include(m => m.DateValues)
                    .Include(m => m.DecimalValues)
                    .Include(m => m.DoubleValues)
                    .Include(m => m.IntValues)
                    .Include(m => m.StringValues)
                    .Include(m => m.ChildDocumentVersions)
                    .Single();

                Assert.Empty(dv.DateValues);
                Assert.Empty(dv.DecimalValues);
                Assert.Empty(dv.DoubleValues);
                Assert.Empty(dv.IntValues);
                Assert.Single(dv.StringValues);
                Assert.Equal("Mary", dv.StringValues.ElementAt(0).Value);
                Assert.Equal(5, dv.StringValues.ElementAt(0).MinDocumentVersionId);
                Assert.Null(dv.StringValues.ElementAt(0).MaxDocumentVersionId);
                Assert.Single(dv.ChildDocumentVersions);
                Assert.Equal(1, dv.ChildDocumentVersions.ElementAt(0).AggregateMetaDataModelID);
                Assert.Equal(1, dv.UserId);

                DocumentVersion dvOld = dbContext.DocumentVersion.Where(s => s.ID == 1).Include(m => m.BoolValues)
                    .Include(m => m.DateValues)
                    .Include(m => m.DecimalValues)
                    .Include(m => m.DoubleValues)
                    .Include(m => m.IntValues)
                    .Include(m => m.StringValues)
                    .Include(m => m.ChildDocumentVersions)
                    .Single();

                Assert.Empty(dvOld.DateValues);
                Assert.Empty(dvOld.DecimalValues);
                Assert.Empty(dvOld.DoubleValues);
                Assert.Single(dvOld.IntValues);
                Assert.Equal(25, dvOld.IntValues.ElementAt(0).Value);
                Assert.Equal(1, dvOld.IntValues.ElementAt(0).MinDocumentVersionId);
                Assert.Null(dvOld.IntValues.ElementAt(0).MaxDocumentVersionId);
                Assert.Single(dvOld.StringValues);
                Assert.Equal("Jack", dvOld.StringValues.ElementAt(0).Value);
                Assert.Equal(1, dvOld.StringValues.ElementAt(0).MinDocumentVersionId);
                Assert.Equal(5, dvOld.StringValues.ElementAt(0).MaxDocumentVersionId);
                Assert.Equal(2, dvOld.ChildDocumentVersions.Count());
                Assert.Equal(1, dvOld.ChildDocumentVersions.ElementAt(0).AggregateMetaDataModelID);
                Assert.Equal(2, dvOld.ChildDocumentVersions.ElementAt(1).AggregateMetaDataModelID);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestUpdateVersionFunctionWithUpdateParents()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
                 .UseSqlite(connection)
                 .Options;
                // Create the schema in the database
                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(options);

                // Add document classes
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new DocumentClass { ID = 2, DocumentClassName = "classB", UserId = 1 });

                // Define attributes
                MetaDataAttribute attr1 = new MetaDataAttribute { ID = 1, MetaDataAttributeName = "name", IsRequired = true, DataTypeID = 6 };  // string
                MetaDataAttribute attr2 = new MetaDataAttribute { ID = 2, MetaDataAttributeName = "age", IsRequired = false, DataTypeID = 5 };  // int
                MetaDataAttribute attr3 = new MetaDataAttribute { ID = 3, MetaDataAttributeName = "isEmployee", IsRequired = false, DataTypeID = 1 };  // bool
                MetaDataAttribute attr4 = new MetaDataAttribute { ID = 4, MetaDataAttributeName = "count", IsRequired = false, DataTypeID = 5 };  // int

                // Add the meta data model with children
                MetaDataModel mdl = new MetaDataModel();
                mdl.ID = 1;
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.UserId = 1;
                mdl.MetaDataAttributes = new List<MetaDataAttribute>();
                mdl.MetaDataAttributes.Add(attr1);
                mdl.MetaDataAttributes.Add(attr2);
                dbContext.Add(mdl);
                dbContext.SaveChanges();

                // Add the second meta data model without children or parents
                MetaDataModel mdl2 = new MetaDataModel();
                mdl2.ID = 2;
                mdl2.DocumentClassId = 1;
                mdl2.MetaDataModelName = "MetaDataModel2";
                mdl2.UserId = 1;
                mdl2.MetaDataAttributes = new List<MetaDataAttribute>();
                mdl2.MetaDataAttributes.Add(attr3);
                dbContext.Add(mdl2);
                dbContext.SaveChanges();

                // Add the third meta data model without children or parents
                MetaDataModel mdl3 = new MetaDataModel();
                mdl3.ID = 3;
                mdl3.DocumentClassId = 1;
                mdl3.MetaDataModelName = "MetaDataModel3";
                mdl3.UserId = 1;
                mdl3.MetaDataAttributes = new List<MetaDataAttribute>();
                mdl3.MetaDataAttributes.Add(attr4);
                dbContext.Add(mdl3);
                dbContext.SaveChanges();

                // Add aggregate meta data model
                dbContext.Add(new AggregateMetaDataModel { ID = 1, AggregateName = "first aggregate model", ParentMetadataModelId = 1, ChildMetadataModelId = 2 });
                dbContext.SaveChanges();
                dbContext.Add(new AggregateMetaDataModel { ID = 2, AggregateName = "second aggregate model", ParentMetadataModelId = 2, ChildMetadataModelId = 3 });
                dbContext.SaveChanges();

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.Add(new Document { ID = 3, Name = "document name 3", MetaDataModelId = 3 });
                dbContext.SaveChanges();

                // Define values
                StringValue stringValue = new StringValue { MetaDataAttributeId = 1, MinDocumentVersionId = 1, Value = "Jack" };
                IntValue intValue = new IntValue { MetaDataAttributeId = 2, MinDocumentVersionId = 1, Value = 25 };
                BoolValue boolValue = new BoolValue { MetaDataAttributeId = 3, MinDocumentVersionId = 2, Value = true };
                BoolValue boolValue2 = new BoolValue { MetaDataAttributeId = 3, MinDocumentVersionId = 3, Value = false };
                IntValue intValue2 = new IntValue { MetaDataAttributeId = 4, MinDocumentVersionId = 4, Value = 26 };

                // Add document version
                DocumentVersion documentVersion = new DocumentVersion();
                documentVersion.DocumentId = 1;
                documentVersion.UserId = 1;
                documentVersion.VersionMessage = "VersionMessage of document version 1 of document 1";
                documentVersion.StringValues = new List<StringValue>();
                documentVersion.StringValues.Add(stringValue);
                documentVersion.IntValues = new List<IntValue>();
                documentVersion.IntValues.Add(intValue);
                dbContext.Add(documentVersion);
                dbContext.SaveChanges();
                DocumentVersion documentVersion2 = new DocumentVersion(); // relates to second document
                documentVersion2.DocumentId = 2;
                documentVersion2.UserId = 1;
                documentVersion2.VersionMessage = "VersionMessage of document version 1 of document 2";
                documentVersion2.BoolValues = new List<BoolValue>();
                documentVersion2.BoolValues.Add(boolValue);
                dbContext.Add(documentVersion2);
                dbContext.SaveChanges();
                DocumentVersion documentVersion4 = new DocumentVersion(); // relates to 4 document
                documentVersion4.DocumentId = 3;
                documentVersion4.UserId = 1;
                documentVersion4.VersionMessage = "VersionMessage of document version 4 of document 4";
                documentVersion4.IntValues = new List<IntValue>();
                documentVersion4.IntValues.Add(intValue2);
                dbContext.Add(documentVersion4);
                dbContext.SaveChanges();

                // Add aggregate document
                dbContext.Add(new AggregateDocument { ChildDocumentVersionId = 2, MinParentDocumentVersionId = 1, AggregateMetaDataModelID = 1 });
                dbContext.SaveChanges();
                dbContext.Add(new AggregateDocument { ChildDocumentVersionId = 3, MinParentDocumentVersionId = 2, AggregateMetaDataModelID = 2 });
                dbContext.SaveChanges();

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 3", 3);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, userInformationServiceMock.Object);

                ValueDTO valueDTO2 = new ValueDTO();
                valueDTO2.AttributeId = 4;
                valueDTO2.Value = 44; // this value is not changed
                valueDTO2.TypeId = 5;

                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 3;
                documentVersionDTO.VersionMessage = "any thing";
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO2);

                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);

                documentVersionDTO.AddScans(images);

                // Act
                doc.UpdateVersion(documentVersionDTO);

                // Assert
                Document d = dbContext.Document.Where(s => s.ID == 3).Single();
                Assert.Equal(4, d.LatestVersionId);

                DocumentVersion dv = dbContext.DocumentVersion.Where(s => s.ID == 4).Include(m => m.BoolValues)
                    .Include(m => m.DateValues)
                    .Include(m => m.DecimalValues)
                    .Include(m => m.DoubleValues)
                    .Include(m => m.IntValues)
                    .Include(m => m.StringValues)
                    .Include(m => m.ChildDocumentVersions)
                    .Single();

                Assert.Empty(dv.DateValues);
                Assert.Empty(dv.DecimalValues);
                Assert.Empty(dv.DoubleValues);
                Assert.Single(dv.IntValues);
                Assert.Equal(44, dv.IntValues.ElementAt(0).Value);
                Assert.Equal(4, dv.IntValues.ElementAt(0).MinDocumentVersionId);
                Assert.Null(dv.IntValues.ElementAt(0).MaxDocumentVersionId);
                Assert.Empty(dv.StringValues);
                Assert.Empty(dv.ChildDocumentVersions);
                Assert.Equal(1,dv.UserId);

                Assert.Single(dbContext.AggregateDocument.Where(s => (s.MinParentDocumentVersionId == 5 && s.ChildDocumentVersionId == 4)).ToList());
                Assert.Single(dbContext.AggregateDocument.Where(s => (s.MinParentDocumentVersionId == 6 && s.ChildDocumentVersionId == 5)).ToList());
                DocumentVersion newDocument2 = dbContext.DocumentVersion.Where(s => (s.ID == 5)).Include(m => m.ChildDocumentVersions).Single();
                Assert.Equal(4, newDocument2.ChildDocumentVersions.ElementAt(0).ChildDocumentVersionId);
                Assert.Equal(2, newDocument2.DocumentId);
                DocumentVersion newDocument1 = dbContext.DocumentVersion.Where(s => (s.ID == 6)).Include(m => m.ChildDocumentVersions).Single();
                Assert.Equal(5, newDocument1.ChildDocumentVersions.ElementAt(0).ChildDocumentVersionId);
                Assert.Equal(1, newDocument1.DocumentId);

            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestUpdateVersionFunctionWithoutUpdateParents()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
                 .UseSqlite(connection)
                 .Options;
                // Create the schema in the database
                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(options);

                // Add document classes
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });
                dbContext.Add(new DocumentClass { ID = 2, DocumentClassName = "classB", UserId = 1 });

                // Define attributes
                MetaDataAttribute attr1 = new MetaDataAttribute { ID = 1, MetaDataAttributeName = "name", IsRequired = true, DataTypeID = 6 };  // string
                MetaDataAttribute attr2 = new MetaDataAttribute { ID = 2, MetaDataAttributeName = "age", IsRequired = false, DataTypeID = 5 };  // int
                MetaDataAttribute attr3 = new MetaDataAttribute { ID = 3, MetaDataAttributeName = "isEmployee", IsRequired = false, DataTypeID = 1 };  // bool
                MetaDataAttribute attr4 = new MetaDataAttribute { ID = 4, MetaDataAttributeName = "count", IsRequired = false, DataTypeID = 5 };  // int

                // Add the meta data model with children
                MetaDataModel mdl = new MetaDataModel();
                mdl.ID = 1;
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.UserId = 1;
                mdl.MetaDataAttributes = new List<MetaDataAttribute>();
                mdl.MetaDataAttributes.Add(attr1);
                mdl.MetaDataAttributes.Add(attr2);
                dbContext.Add(mdl);
                dbContext.SaveChanges();

                // Add the second meta data model without children or parents
                MetaDataModel mdl2 = new MetaDataModel();
                mdl2.ID = 2;
                mdl2.DocumentClassId = 1;
                mdl2.MetaDataModelName = "MetaDataModel2";
                mdl2.UserId = 1;
                mdl2.MetaDataAttributes = new List<MetaDataAttribute>();
                mdl2.MetaDataAttributes.Add(attr3);
                dbContext.Add(mdl2);
                dbContext.SaveChanges();

                // Add the third meta data model without children or parents
                MetaDataModel mdl3 = new MetaDataModel();
                mdl3.ID = 3;
                mdl3.DocumentClassId = 1;
                mdl3.MetaDataModelName = "MetaDataModel3";
                mdl3.UserId = 1;
                mdl3.MetaDataAttributes = new List<MetaDataAttribute>();
                mdl3.MetaDataAttributes.Add(attr4);
                dbContext.Add(mdl3);
                dbContext.SaveChanges();

                // Add aggregate meta data model
                dbContext.Add(new AggregateMetaDataModel { ID = 1, AggregateName = "first aggregate model", ParentMetadataModelId = 1, ChildMetadataModelId = 2 });
                dbContext.SaveChanges();
                dbContext.Add(new AggregateMetaDataModel { ID = 2, AggregateName = "second aggregate model", ParentMetadataModelId = 2, ChildMetadataModelId = 3 });
                dbContext.SaveChanges();

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.Add(new Document { ID = 3, Name = "document name 3", MetaDataModelId = 3 });
                dbContext.SaveChanges();

                // Define values
                StringValue stringValue = new StringValue { MetaDataAttributeId = 1, MinDocumentVersionId = 1, Value = "Jack" };
                IntValue intValue = new IntValue { MetaDataAttributeId = 2, MinDocumentVersionId = 1, Value = 25 };
                BoolValue boolValue = new BoolValue { MetaDataAttributeId = 3, MinDocumentVersionId = 2, Value = true };
                BoolValue boolValue2 = new BoolValue { MetaDataAttributeId = 3, MinDocumentVersionId = 3, Value = false };
                IntValue intValue2 = new IntValue { MetaDataAttributeId = 4, MinDocumentVersionId = 4, Value = 26 };

                // Add document version
                DocumentVersion documentVersion = new DocumentVersion();
                documentVersion.DocumentId = 1;
                documentVersion.UserId = 1;
                documentVersion.VersionMessage = "VersionMessage of document version 1 of document 1";
                documentVersion.StringValues = new List<StringValue>();
                documentVersion.StringValues.Add(stringValue);
                documentVersion.IntValues = new List<IntValue>();
                documentVersion.IntValues.Add(intValue);
                dbContext.Add(documentVersion);
                dbContext.SaveChanges();
                DocumentVersion documentVersion2 = new DocumentVersion(); // relates to second document
                documentVersion2.DocumentId = 2;
                documentVersion2.UserId = 1;
                documentVersion2.VersionMessage = "VersionMessage of document version 1 of document 2";
                documentVersion2.BoolValues = new List<BoolValue>();
                documentVersion2.BoolValues.Add(boolValue);
                dbContext.Add(documentVersion2);
                dbContext.SaveChanges();
                DocumentVersion documentVersion4 = new DocumentVersion(); // relates to 4 document
                documentVersion4.DocumentId = 3;
                documentVersion4.UserId = 1;
                documentVersion4.VersionMessage = "VersionMessage of document version 4 of document 4";
                documentVersion4.IntValues = new List<IntValue>();
                documentVersion4.IntValues.Add(intValue2);
                dbContext.Add(documentVersion4);
                dbContext.SaveChanges();

                // Add aggregate document
                dbContext.Add(new AggregateDocument { ChildDocumentVersionId = 2, MinParentDocumentVersionId = 1, AggregateMetaDataModelID = 1 });
                dbContext.SaveChanges();
                dbContext.Add(new AggregateDocument { ChildDocumentVersionId = 3, MinParentDocumentVersionId = 2, AggregateMetaDataModelID = 2 });
                dbContext.SaveChanges();

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 3", 3);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, userInformationServiceMock.Object);

                ValueDTO valueDTO2 = new ValueDTO();
                valueDTO2.AttributeId = 4;
                valueDTO2.Value = 44; // this value is not changed
                valueDTO2.TypeId = 5;

                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 3;
                documentVersionDTO.VersionMessage = "any thing";
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO2);

                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);

                documentVersionDTO.AddScans(images);

                // Act
                doc.UpdateVersion(documentVersionDTO, false);

                // Assert
                Document d = dbContext.Document.Where(s => s.ID == 3).Single();
                Assert.Equal(4, d.LatestVersionId);

                DocumentVersion dv = dbContext.DocumentVersion.Where(s => s.ID == 4).Include(m => m.BoolValues)
                    .Include(m => m.DateValues)
                    .Include(m => m.DecimalValues)
                    .Include(m => m.DoubleValues)
                    .Include(m => m.IntValues)
                    .Include(m => m.StringValues)
                    .Include(m => m.ChildDocumentVersions)
                    .Single();

                Assert.Empty(dv.DateValues);
                Assert.Empty(dv.DecimalValues);
                Assert.Empty(dv.DoubleValues);
                Assert.Single(dv.IntValues);
                Assert.Equal(44, dv.IntValues.ElementAt(0).Value);
                Assert.Equal(4, dv.IntValues.ElementAt(0).MinDocumentVersionId);
                Assert.Null(dv.IntValues.ElementAt(0).MaxDocumentVersionId);
                Assert.Empty(dv.StringValues);
                Assert.Empty(dv.ChildDocumentVersions);
                Assert.Equal(1,dv.UserId);

                Assert.Empty(dbContext.AggregateDocument.Where(s => (s.MinParentDocumentVersionId == 5 && s.ChildDocumentVersionId == 4)).ToList());
                Assert.Empty(dbContext.AggregateDocument.Where(s => (s.MinParentDocumentVersionId == 6 && s.ChildDocumentVersionId == 5)).ToList());
                Assert.Empty(dbContext.DocumentVersion.Where(s => (s.ID == 5)).Include(m => m.ChildDocumentVersions).ToList());
                Assert.Empty(dbContext.DocumentVersion.Where(s => (s.ID == 6)).Include(m => m.ChildDocumentVersions).ToList());

            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSoftDeleteDocumentFunctionWrongDocumentId()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);
                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.SoftDeleteDocument(10));
                Assert.Equal("Document NOT FOUND", ex.AttributeMessages.ElementAt(0)); // ToDo wrong message

            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSoftDeleteDocumentFunctionAlreadyDeletedDocument()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1, DeletedDate = DateTime.Now });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);
                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.SoftDeleteDocument(1));
                Assert.Equal("Document NOT FOUND", ex.AttributeMessages.ElementAt(0)); // ToDo wrong message

            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSoftDeleteDocumentFunction()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);
                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                // Act
                doc.SoftDeleteDocument(1);

                // Assert
                var docAfterDelete = dbContext.Document.Where(s => s.ID == 1).IgnoreQueryFilters().Single();
                Assert.NotEqual(DateTime.MinValue, docAfterDelete.DeletedDate);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetAttachmentByIdFunction()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
                 .UseSqlite(connection)
                 .Options;
                // Create the schema in the database
                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                }
                var dbContext = new DocumentDBContext(options);

                // Add document classes
                dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA", UserId = 1 });

                // Define attributes
                MetaDataAttribute attr1 = new MetaDataAttribute();
                attr1.ID = 1;
                attr1.MetaDataAttributeName = "name";
                attr1.IsRequired = true;
                attr1.DataTypeID = 6; // string
                MetaDataAttribute attr2 = new MetaDataAttribute();
                attr2.ID = 2;
                attr2.MetaDataAttributeName = "age";
                attr2.IsRequired = true;
                attr2.DataTypeID = 5; // int

                // Add the meta data model
                MetaDataModel mdl = new MetaDataModel();
                mdl.ID = 1;
                mdl.DocumentClassId = 1;
                mdl.MetaDataModelName = "MetaDataModel1";
                mdl.UserId = 1;
                mdl.MetaDataAttributes = new List<MetaDataAttribute>();
                mdl.MetaDataAttributes.Add(attr1);
                mdl.MetaDataAttributes.Add(attr2);
                dbContext.Add(mdl);
                dbContext.SaveChanges();

                // Add documents
                Document document1 = new Document();
                document1.Name = "document name 1";
                document1.MetaDataModelId = 1;
                dbContext.Add(document1);
                dbContext.SaveChanges();

                // Define values
                StringValue stringValue = new StringValue();
                stringValue.MetaDataAttributeId = 1;
                stringValue.MinDocumentVersionId = 1;
                stringValue.Value = "Jack";
                IntValue intValue = new IntValue();
                intValue.MetaDataAttributeId = 2;
                intValue.MinDocumentVersionId = 1;
                intValue.Value = 25;

                // Add document version
                DocumentVersion documentVersion = new DocumentVersion();
                documentVersion.DocumentId = 1;
                documentVersion.UserId = 1;
                documentVersion.VersionMessage = "VersionMessage of document version 1 of document 1";
                documentVersion.StringValues = new List<StringValue>();
                documentVersion.StringValues.Add(stringValue);
                documentVersion.IntValues = new List<IntValue>();
                documentVersion.IntValues.Add(intValue);
                dbContext.Add(documentVersion);
                dbContext.SaveChanges();

                //Update LatestVersionId of the added documents
                var doc1 = dbContext.Set<Document>().Where(s => s.Name == "document name 1").Single();
                doc1.LatestVersionId = 1;
                dbContext.Update(doc1);
                dbContext.SaveChanges();

                CompoundModel compoundModel = new CompoundModel();
                compoundModel.ID = 1;
                compoundModel.MetaDataModelID = 1;
                compoundModel.Caption = "Caption";
                compoundModel.IsRequired = true;
                dbContext.Add(compoundModel);
                dbContext.SaveChanges();

                Attachment attachment = new Attachment();
                attachment.CompoundModelID = 1;
                attachment.DocumentId = 1;
                attachment.Name = "photo attachment";
                dbContext.Add(attachment);
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);
                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                int id = 1;

                // Act
                var result = doc.GetAttachmentById(id);

                // Assert
                Assert.Equal("Caption", result.Caption);
                Assert.Equal(1, result.Id);

                // Act && Assert
                Assert.Throws<ValidatorException>(() => doc.GetAttachmentById(2));

            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddAttachmentFunction()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = true });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                var txtFile1 = GetFormFile("attachment1","txt");

                AttachmentPostDTO attachment = new AttachmentPostDTO();
                attachment.Id = 1;
                attachment.DocumentId = 1;
                attachment.Name = "attachment name";
                attachment.CompoundModelId = 1;
                attachment.AddAttachmentFile(txtFile1);

                //Act
                doc.AddAttachment(attachment);

                //Assert
                Document d = dbContext.Document.Where(s => s.ID == 1).Single();
                Assert.Equal("document name 1", d.Name);
                Assert.Equal(1, d.MetaDataModelId);
                Assert.Single(d.DocumentVersions);
                Assert.Single(d.Attachments);
                Assert.NotEqual(DateTime.MinValue, d.Attachments.ElementAt(0).AddedDate);
                Assert.Equal(1, d.Attachments.ElementAt(0).CompoundModelID);
                Assert.Equal("application/txt", d.Attachments.ElementAt(0).ContentType);
                Assert.Equal(1, d.LatestVersionId);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddAttachmentFunctionDuplicateName()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = true });
                dbContext.SaveChanges();
                dbContext.Add(new CompoundModel { ID = 2, MetaDataModelID = 1, Caption = "Caption2", IsRequired = true });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                var txtFile1 = GetFormFile("attachment1", "txt");

                AttachmentPostDTO attachment = new AttachmentPostDTO();
                attachment.Id = 1;
                attachment.DocumentId = 1;
                attachment.CompoundModelId = 1;
                attachment.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment);

                AttachmentPostDTO duplicateAttachment = new AttachmentPostDTO();
                duplicateAttachment.Id = 2;
                duplicateAttachment.DocumentId = 1;
                duplicateAttachment.CompoundModelId = 1;
                duplicateAttachment.AddAttachmentFile(txtFile1);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.AddAttachment(duplicateAttachment));
                Assert.Equal("Attachment Name Existed Before attachment1", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddAttachmentFunctionWrongDocument()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = true });
                dbContext.SaveChanges();
                dbContext.Add(new CompoundModel { ID = 2, MetaDataModelID = 1, Caption = "Caption2", IsRequired = true });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                var txtFile1 = GetFormFile("attachment1", "txt");

                AttachmentPostDTO attachment = new AttachmentPostDTO();
                attachment.Id = 1;
                attachment.DocumentId = 3;
                attachment.CompoundModelId = 1;
                attachment.AddAttachmentFile(txtFile1);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.AddAttachment(attachment));
                Assert.Equal("Document NOT FOUND 3", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddAttachmentFunctionDuplicateCompoundModel()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = true });
                dbContext.SaveChanges();
                dbContext.Add(new CompoundModel { ID = 2, MetaDataModelID = 1, Caption = "Caption2", IsRequired = true });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, userInformationServiceMock.Object);

                var txtFile1 = GetFormFile("attachment1", "txt");

                AttachmentPostDTO attachment = new AttachmentPostDTO();
                attachment.Id = 1;
                attachment.DocumentId = 1;
                attachment.CompoundModelId = 1;
                attachment.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment);

                txtFile1 = GetFormFile("attachment2", "txt");

                AttachmentPostDTO attachment2 = new AttachmentPostDTO();
                attachment2.Id = 2;
                attachment2.DocumentId = 1;
                attachment2.CompoundModelId = 1;
                attachment2.AddAttachmentFile(txtFile1);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.AddAttachment(attachment2));
                Assert.Equal("Attachment Compound Model Id Existed Before", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestAddAttachmentFunctionNullCompoundModel()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = true });
                dbContext.SaveChanges();
                dbContext.Add(new CompoundModel { ID = 2, MetaDataModelID = 1, Caption = "Caption2", IsRequired = true });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                var txtFile1 = GetFormFile("attachment1", "txt");

                AttachmentPostDTO attachment = new AttachmentPostDTO();
                attachment.Id = 1;
                attachment.DocumentId = 1;
                // attachment.CompoundModelId = 1;
                attachment.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment);

                txtFile1 = GetFormFile("attachment", "txt");

                AttachmentPostDTO attachment2 = new AttachmentPostDTO();
                attachment2.Id = 2;
                attachment2.DocumentId = 1;
                //attachment2.CompoundModelId = 1;
                attachment2.AddAttachmentFile(txtFile1);

                // Act && Assert
                doc.AddAttachment(attachment2); // no exception
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestUpdateAttachmentFunction()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = true });
                dbContext.SaveChanges();
                dbContext.Add(new CompoundModel { ID = 2, MetaDataModelID = 1, Caption = "Caption2", IsRequired = true });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                var txtFile1 = GetFormFile("attachment1", "txt");

                AttachmentPostDTO attachment = new AttachmentPostDTO();
                attachment.Id = 1;
                attachment.DocumentId = 1;
                attachment.CompoundModelId = 1;
                attachment.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment);

                txtFile1 = GetFormFile("attachment2", "txt");

                AttachmentPostDTO updateAttachment = new AttachmentPostDTO();
                updateAttachment.Id = 1;
                updateAttachment.DocumentId = 1;
                updateAttachment.CompoundModelId = 1;
                updateAttachment.AddAttachmentFile(txtFile1);

                // Act
                doc.UpdateAttachment(updateAttachment);

                // Assert
                Document d = dbContext.Document.Where(s => s.ID == 1).Single();
                Assert.Equal("document name 1", d.Name);
                Assert.Equal(1, d.MetaDataModelId);
                Assert.Single(d.DocumentVersions);
                Assert.Single(d.Attachments);
                Assert.NotEqual(DateTime.MinValue, d.Attachments.ElementAt(0).AddedDate);
                Assert.Equal(1, d.Attachments.ElementAt(0).CompoundModelID);
                Assert.Equal("attachment2", d.Attachments.ElementAt(0).Name);
                Assert.Equal("application/txt", d.Attachments.ElementAt(0).ContentType);
                Assert.NotEqual(DateTime.MinValue, d.Attachments.ElementAt(0).ModifiedDate);
                Assert.Equal(1, d.LatestVersionId);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestUpdateAttachmentFunctionDuplicateName()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = true });
                dbContext.SaveChanges();
                dbContext.Add(new CompoundModel { ID = 2, MetaDataModelID = 1, Caption = "Caption2", IsRequired = true });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                var txtFile1 = GetFormFile("attachment1", "txt");

                AttachmentPostDTO attachment = new AttachmentPostDTO();
                attachment.Id = 1;
                attachment.DocumentId = 1;
                attachment.CompoundModelId = 1;
                attachment.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment);

                var txtFile2 = GetFormFile("attachment2", "txt");

                AttachmentPostDTO attachment2 = new AttachmentPostDTO();
                attachment2.Id = 2;
                attachment2.DocumentId = 1;
                attachment2.CompoundModelId = 2;
                attachment2.AddAttachmentFile(txtFile2);
                doc.AddAttachment(attachment2);

                AttachmentPostDTO updateAttachment = new AttachmentPostDTO();
                updateAttachment.Id = 2;
                updateAttachment.DocumentId = 1;
                updateAttachment.CompoundModelId = 2;
                updateAttachment.AddAttachmentFile(txtFile1);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.UpdateAttachment(updateAttachment));
                Assert.Equal("Attachment Name Existed Before attachment1", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestUpdateAttachmentFunctionNullName()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = true });
                dbContext.SaveChanges();
                dbContext.Add(new CompoundModel { ID = 2, MetaDataModelID = 1, Caption = "Caption2", IsRequired = true });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                var txtFile1 = GetFormFile("attachment1", "txt");

                AttachmentPostDTO attachment = new AttachmentPostDTO();
                attachment.Id = 1;
                attachment.DocumentId = 1;
                attachment.CompoundModelId = 1;
                attachment.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment);

                txtFile1 = GetFormFile("attachment2", "txt");

                AttachmentPostDTO attachment2 = new AttachmentPostDTO();
                attachment2.Id = 2;
                attachment2.DocumentId = 1;
                attachment2.CompoundModelId = 2;
                attachment2.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment2);

                txtFile1 = GetFormFile("", "txt");

                AttachmentPostDTO updateAttachment = new AttachmentPostDTO();
                updateAttachment.Id = 1;
                updateAttachment.DocumentId = 1;
                updateAttachment.CompoundModelId = 1;
                updateAttachment.AddAttachmentFile(txtFile1);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.UpdateAttachment(updateAttachment));
                Assert.Equal("Attachment Name Is Null Or Empty", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestUpdateAttachmentFunctionWrongAttachmentId()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = true });
                dbContext.SaveChanges();
                dbContext.Add(new CompoundModel { ID = 2, MetaDataModelID = 1, Caption = "Caption2", IsRequired = true });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                var txtFile1 = GetFormFile("attachment1", "txt");

                AttachmentPostDTO attachment = new AttachmentPostDTO();
                attachment.Id = 1;
                attachment.DocumentId = 1;
                attachment.CompoundModelId = 1;
                attachment.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment);


                AttachmentPostDTO updateAttachment = new AttachmentPostDTO();
                updateAttachment.Id = 5;
                updateAttachment.DocumentId = 1;
                updateAttachment.CompoundModelId = 1;
                updateAttachment.AddAttachmentFile(txtFile1);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.UpdateAttachment(updateAttachment));
                Assert.Equal("Attachment NOT FOUND", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetAttachmentByIdFunction2()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = true });
                dbContext.SaveChanges();
                dbContext.Add(new CompoundModel { ID = 2, MetaDataModelID = 1, Caption = "Caption2", IsRequired = true });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                var txtFile1 = GetFormFile("attachment1", "txt");

                AttachmentPostDTO attachment = new AttachmentPostDTO();
                attachment.Id = 1;
                attachment.DocumentId = 1;
                attachment.CompoundModelId = 1;
                attachment.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment);

                // Act
                AttachmentGetDTO result = doc.GetAttachmentById(1);

                // Assert
                Assert.NotEqual(DateTime.MinValue, result.AddedDate);
                Assert.Equal(1, result.CompoundModelId);
                Assert.Equal("attachment1", result.Name);
                Assert.Equal("application/txt", result.ContentType);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetAttachmentByIdFunctionWrongId()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = true });
                dbContext.SaveChanges();
                dbContext.Add(new CompoundModel { ID = 2, MetaDataModelID = 1, Caption = "Caption2", IsRequired = true });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                var txtFile1 = GetFormFile("attachment1", "txt");

                AttachmentPostDTO attachment = new AttachmentPostDTO();
                attachment.Id = 1;
                attachment.DocumentId = 1;
                attachment.CompoundModelId = 1;
                attachment.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.GetAttachmentById(10));
                Assert.Equal("Attachment NOT FOUND", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetAttachmentsByDocumentIdFunction()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = true });
                dbContext.SaveChanges();
                dbContext.Add(new CompoundModel { ID = 2, MetaDataModelID = 1, Caption = "Caption2", IsRequired = true });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                var txtFile1 = GetFormFile("attachment1","txt");

                AttachmentPostDTO attachment = new AttachmentPostDTO();
                attachment.Id = 1;
                attachment.DocumentId = 1;
                attachment.CompoundModelId = 1;
                attachment.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment);

                txtFile1 = GetFormFile("attachment2", "txt");

                AttachmentPostDTO attachment2 = new AttachmentPostDTO();
                attachment2.Id = 2;
                attachment2.DocumentId = 1;
                attachment2.CompoundModelId = 2;
                attachment2.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment2);

                // Act
                var result = doc.GetAttachmentsByDocumentId(1);

                // Assert
                Assert.Equal(2, result.Count());

                Assert.Equal("attachment1", result.ElementAt(0).Name);
                Assert.Equal("Caption", result.ElementAt(0).Caption);
                Assert.Equal("attachment2", result.ElementAt(1).Name);
                Assert.Equal("Caption2", result.ElementAt(1).Caption);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestDeleteAttachmentFromDocumentFunction()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = false });
                dbContext.SaveChanges();
                dbContext.Add(new CompoundModel { ID = 2, MetaDataModelID = 1, Caption = "Caption2", IsRequired = true });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                var txtFile1 = GetFormFile("attachment1", "txt");

                AttachmentPostDTO attachment = new AttachmentPostDTO();
                attachment.Id = 1;
                attachment.DocumentId = 1;
                attachment.CompoundModelId = 1;
                attachment.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment);

                txtFile1 = GetFormFile("attachment2", "txt");


                AttachmentPostDTO attachment2 = new AttachmentPostDTO();
                attachment2.Id = 2;
                attachment2.DocumentId = 1;
                attachment2.CompoundModelId = 2;
                attachment2.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment2);

                // Act
                doc.DeleteAttachment(1);

                // Assert
                Document d = dbContext.Document.Where(s => s.ID == 1).Single();
                Assert.Single(d.Attachments);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestDeleteAttachmentFromDocumentFunctionNullCompound()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = false });
                dbContext.SaveChanges();
                dbContext.Add(new CompoundModel { ID = 2, MetaDataModelID = 1, Caption = "Caption2", IsRequired = true });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                var txtFile1 = GetFormFile("attachment1", "txt");

                AttachmentPostDTO attachment = new AttachmentPostDTO();
                attachment.Id = 1;
                attachment.DocumentId = 1;
                //attachment.CompoundModelId = 1;
                attachment.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment);

                txtFile1 = GetFormFile("attachment2", "txt");

                AttachmentPostDTO attachment2 = new AttachmentPostDTO();
                attachment2.Id = 2;
                attachment2.DocumentId = 1;
                attachment2.CompoundModelId = 2;
                attachment2.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment2);

                // Act
                doc.DeleteAttachment(1);

                // Assert
                Document d = dbContext.Document.Where(s => s.ID == 1).Single();
                Assert.Single(d.Attachments);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestDeleteAttachmentFromDocumentFunctionNotExistedId()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = false });
                dbContext.SaveChanges();
                dbContext.Add(new CompoundModel { ID = 2, MetaDataModelID = 1, Caption = "Caption2", IsRequired = true });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                var txtFile1 = GetFormFile("attachment1", "txt");

                AttachmentPostDTO attachment = new AttachmentPostDTO();
                attachment.Id = 1;
                attachment.DocumentId = 1;
                attachment.CompoundModelId = 1;
                attachment.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment);

                txtFile1 = GetFormFile("attachment2", "txt");

                AttachmentPostDTO attachment2 = new AttachmentPostDTO();
                attachment2.Id = 2;
                attachment2.DocumentId = 1;
                attachment2.CompoundModelId = 2;
                attachment2.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment2);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.DeleteAttachment(10));
                Assert.Equal("Attachment NOT FOUND", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestDeleteAttachmentFromDocumentFunctionRequired()
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

                // Add meta data model
                AddFirstDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = true });
                dbContext.SaveChanges();
                dbContext.Add(new CompoundModel { ID = 2, MetaDataModelID = 1, Caption = "Caption2", IsRequired = true });
                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();

                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);


                var txtFile1 = GetFormFile("attachment1", "txt");

                AttachmentPostDTO attachment = new AttachmentPostDTO();
                attachment.Id = 1;
                attachment.DocumentId = 1;
                attachment.CompoundModelId = 1;
                attachment.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment);

                txtFile1 = GetFormFile("attachment2", "txt");

                AttachmentPostDTO attachment2 = new AttachmentPostDTO();
                attachment2.Id = 2;
                attachment2.DocumentId = 1;
                attachment2.CompoundModelId = 2;
                attachment2.AddAttachmentFile(txtFile1);
                doc.AddAttachment(attachment2);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.DeleteAttachment(1));
                Assert.Equal("Attachment Is Required", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetDocumentHistory()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                MetaDataModel model = new MetaDataModel();
                model.ID = 1;
                model.MetaDataModelName = "Model 1";
                model.UserId = 1;
                model.DocumentClassId = 1;

                dbContext.Add(model);
                dbContext.SaveChanges();

                // add document
                Document doc = new Document();
                doc.MetaDataModelId = 1;
                doc.ID = 1;
                doc.Name = "DOC 1";

                DocumentVersion v1 = new DocumentVersion();
                v1.ID = 1;
                v1.VersionMessage = "version 1 of DOC 1";
                v1.AddedDate = new DateTime(2019, 7, 25);
                v1.DocumentId = 1;
                v1.UserId = 1;

                DocumentVersion v2 = new DocumentVersion();
                v2.ID = 2;
                v2.VersionMessage = "Version 2 of DOC 1";
                v2.AddedDate = new DateTime(2019, 6, 25);
                v2.DocumentId = 1;
                v2.UserId = 1;

                DocumentVersion v3 = new DocumentVersion();
                v3.ID = 3;
                v3.VersionMessage = "version 3 of DOc 1";
                v3.AddedDate = new DateTime(2020, 5, 5);
                v3.DocumentId = 1;
                v3.UserId = 1;

                doc.DocumentVersions = new List<DocumentVersion>();
                doc.DocumentVersions.Add(v1);
                doc.DocumentVersions.Add(v2);
                doc.DocumentVersions.Add(v3);

                dbContext.Add(doc);
                dbContext.Add(v1);
                dbContext.Add(v2);
                dbContext.Add(v3);

                dbContext.SaveChanges();

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });

                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService docService = new DocumentService(dbContext, logger, localizer, null, null);

                // Act
                List<dynamic> docVersions = docService.GetDocumentHistory(1);

                // Assert
                Assert.Equal(3, docVersions.Count());
                Assert.Equal(docVersions[0].GetType().GetProperty("VersionId").GetValue(docVersions[0], null), 1);
                Assert.Equal(docVersions[0].GetType().GetProperty("VersionMessage").GetValue(docVersions[0], null), "version 1 of DOC 1");
                Assert.Equal(docVersions[0].GetType().GetProperty("DocumentId").GetValue(docVersions[0], null), 1);
                Assert.Equal(docVersions[0].GetType().GetProperty("DocumentName").GetValue(docVersions[0], null), "DOC 1");
                Assert.Equal(docVersions[0].GetType().GetProperty("AddedDate").GetValue(docVersions[0], null), new DateTime(2019, 7, 25));

                Assert.Equal(docVersions[1].GetType().GetProperty("VersionId").GetValue(docVersions[1], null), 2);
                Assert.Equal(docVersions[1].GetType().GetProperty("VersionMessage").GetValue(docVersions[1], null), "Version 2 of DOC 1");
                Assert.Equal(docVersions[1].GetType().GetProperty("DocumentId").GetValue(docVersions[1], null), 1);
                Assert.Equal(docVersions[1].GetType().GetProperty("DocumentName").GetValue(docVersions[1], null), "DOC 1");
                Assert.Equal(docVersions[1].GetType().GetProperty("AddedDate").GetValue(docVersions[1], null), new DateTime(2019, 6, 25));

                Assert.Equal(docVersions[2].GetType().GetProperty("VersionId").GetValue(docVersions[2], null), 3);
                Assert.Equal(docVersions[2].GetType().GetProperty("VersionMessage").GetValue(docVersions[2], null), "version 3 of DOc 1");
                Assert.Equal(docVersions[2].GetType().GetProperty("DocumentId").GetValue(docVersions[2], null), 1);
                Assert.Equal(docVersions[2].GetType().GetProperty("DocumentName").GetValue(docVersions[2], null), "DOC 1");
                Assert.Equal(docVersions[2].GetType().GetProperty("AddedDate").GetValue(docVersions[2], null), new DateTime(2020, 5, 5));

                ValidatorException ex = Assert.Throws<ValidatorException>(() => docService.GetDocumentHistory(12));
                Assert.Equal("Document not found", ex.AttributeMessages.ElementAt(0));

            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetDocumentsScanByVersionIds()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;
                // Add scans
                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);
                var imageFile2 = new Mock<IFormFile>();
                imageFile2.Setup(f => f.Length).Returns(1);
                imageFile2.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile2.Object);
                documentDTO.AddDocumentScans(images);

                // Add second document
                // Initialize the input document
                // Define values
                ValueDTO valueDTO3 = new ValueDTO { AttributeId = 1, Value = "Sally" };
                ValueDTO valueDTO4 = new ValueDTO { AttributeId = 2, Value = 29 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO2 = new DocumentVersionPostDTO();
                documentVersionDTO2.VersionMessage = "VersionMessage of document version 2";
                
                documentVersionDTO2.DocumentId = 2;
                documentVersionDTO2.Values = new List<ValueDTO>();
                documentVersionDTO2.Values.Add(valueDTO3);
                documentVersionDTO2.Values.Add(valueDTO4);
                // Define document
                DocumentPostDTO documentDTO2 = new DocumentPostDTO();
                
                documentDTO2.Id = 2;
                documentDTO2.MetadataModelId = 1;
                documentDTO2.DocumentVersion = documentVersionDTO2;
                // Add scans
                documentDTO2.AddDocumentScans(images);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, userInformationServiceMock.Object);

                doc.AddDocument(documentDTO);
                doc.AddDocument(documentDTO2);

                List<int> versionIds = new List<int>();
                versionIds.Add(1);
                versionIds.Add(2);

                // Act
                var result = doc.GetDocumentsScanByVersionIds(versionIds);

                // Assert
                Assert.Equal(2, result.Count());

                Assert.Equal(result[0].GetType().GetProperty("versionId").GetValue(result[0], null), 1);
                var imgs = result[0].GetType().GetProperty("imgs").GetValue(result[0], null);
                Assert.Equal(imgs[0], "/api/document/GetDocumentScan?imageId=1");
                Assert.Equal(imgs[1], "/api/document/GetDocumentScan?imageId=2");

                Assert.Equal(result[1].GetType().GetProperty("versionId").GetValue(result[1], null), 2);
                var imgs2 = result[1].GetType().GetProperty("imgs").GetValue(result[1], null);
                Assert.Equal(imgs2[0], "/api/document/GetDocumentScan?imageId=3");
                Assert.Equal(imgs2[1], "/api/document/GetDocumentScan?imageId=4");
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetDocumentsScanByVersionIds_NotExistedVersionID()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;
                // Add scans
                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);
                var imageFile2 = new Mock<IFormFile>();
                imageFile2.Setup(f => f.Length).Returns(1);
                imageFile2.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile2.Object);
                documentDTO.AddDocumentScans(images);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, userInformationServiceMock.Object);

                doc.AddDocument(documentDTO);

                List<int> versionIds = new List<int>();
                versionIds.Add(1);
                versionIds.Add(2);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.GetDocumentsScanByVersionIds(versionIds));
                Assert.Equal("Invalid version id", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetDocumentsScanByVersionIds_NotExistedVersionID_documentWithoutImages()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                documentVersionDTO.DocumentScans = new List<DocumentScanDTO>();
                documentVersionDTO.DocumentScans.Add(new DocumentScanDTO
                {
                    Name = "DocScan",
                    ContentType = "PNG",
                    ScanImage = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 }
                });
                

                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, userInformationServiceMock.Object);

                doc.AddDocument(documentDTO);

                List<int> versionIds = new List<int>();
                versionIds.Add(2);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.GetDocumentsScanByVersionIds(versionIds));
                Assert.Equal("Invalid version id", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetDocumentsScanByVersionIds_EmptyInput()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                List<int> versionIds = new List<int>();

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.GetDocumentsScanByVersionIds(versionIds));
                Assert.Equal("No Documents selected", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestGetDocumentsScanByVersionIds_NullInput()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, null, null);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.GetDocumentsScanByVersionIds(null));
                Assert.Equal("No Documents selected", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

#if false

        [Fact]
        public void TestSendDocumentScansEmailNullMail()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

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

                DocumentService doc = new DocumentService(dbContext, logger, localizer, mailService,null);      

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.SendDocumentScansEmail(null));
                Assert.Empty(ex.AttributeMessages);
                Assert.Equal("Exception of type 'DM.Service.ServiceModels.ValidatorException' was thrown.", ex.Message);

            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSendDocumentScansEmailRecieverEmailsNull()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;
                // Add scans
                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);
                var imageFile2 = new Mock<IFormFile>();
                imageFile2.Setup(f => f.Length).Returns(1);
                imageFile2.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile2.Object);
                documentDTO.AddDocumentScans(images);

                // Add second document
                // Initialize the input document
                // Define values
                ValueDTO valueDTO3 = new ValueDTO { AttributeId = 1, Value = "Sally" };
                ValueDTO valueDTO4 = new ValueDTO { AttributeId = 2, Value = 29 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO2 = new DocumentVersionPostDTO();
                documentVersionDTO2.VersionMessage = "VersionMessage of document version 2";
                
                documentVersionDTO2.DocumentId = 2;
                documentVersionDTO2.Values = new List<ValueDTO>();
                documentVersionDTO2.Values.Add(valueDTO3);
                documentVersionDTO2.Values.Add(valueDTO4);
                // Define document
                DocumentPostDTO documentDTO2 = new DocumentPostDTO();
                
                documentDTO2.Id = 2;
                documentDTO2.MetadataModelId = 1;
                documentDTO2.DocumentVersion = documentVersionDTO2;
                // Add scans
                documentDTO2.AddDocumentScans(images);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

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

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, mailService, userInformationServiceMock.Object);

                doc.AddDocument(documentDTO);
                doc.AddDocument(documentDTO2);

                DocumentScanEmail mail = new DocumentScanEmail();
                mail.Subject = "Email Subject";
                mail.RecieverEmails = null;
                mail.SenderName = "Test Sender";
                mail.EmailBody = "Email Body";
                mail.DocumentVersionIds = new List<int>();
                mail.DocumentVersionIds.Add(1);
                mail.DocumentVersionIds.Add(2);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.SendDocumentScansEmail(mail));
                Assert.Empty(ex.AttributeMessages);
                Assert.Equal("Exception of type 'DM.Service.ServiceModels.ValidatorException' was thrown.", ex.Message);

            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSendDocumentScansEmailRecieverEmailsEmpty()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;
                // Add scans
                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);
                var imageFile2 = new Mock<IFormFile>();
                imageFile2.Setup(f => f.Length).Returns(1);
                imageFile2.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile2.Object);
                documentDTO.AddDocumentScans(images);

                // Add second document
                // Initialize the input document
                // Define values
                ValueDTO valueDTO3 = new ValueDTO { AttributeId = 1, Value = "Sally" };
                ValueDTO valueDTO4 = new ValueDTO { AttributeId = 2, Value = 29 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO2 = new DocumentVersionPostDTO();
                documentVersionDTO2.VersionMessage = "VersionMessage of document version 2";
                documentVersionDTO2.DocumentId = 2;
                documentVersionDTO2.Values = new List<ValueDTO>();
                documentVersionDTO2.Values.Add(valueDTO3);
                documentVersionDTO2.Values.Add(valueDTO4);
                // Define document
                DocumentPostDTO documentDTO2 = new DocumentPostDTO();
                
                documentDTO2.Id = 2;
                documentDTO2.MetadataModelId = 1;
                documentDTO2.DocumentVersion = documentVersionDTO2;
                // Add scans
                documentDTO2.AddDocumentScans(images);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

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

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, mailService, userInformationServiceMock.Object);

                doc.AddDocument(documentDTO);
                doc.AddDocument(documentDTO2);

                DocumentScanEmail mail = new DocumentScanEmail();
                mail.Subject = "Email Subject";
                mail.RecieverEmails = new List<string>();
                mail.SenderName = "Test Sender";
                mail.EmailBody = "Email Body";
                mail.DocumentVersionIds = new List<int>();
                mail.DocumentVersionIds.Add(1);
                mail.DocumentVersionIds.Add(2);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.SendDocumentScansEmail(mail));
                Assert.Empty(ex.AttributeMessages);
                Assert.Equal("Exception of type 'DM.Service.ServiceModels.ValidatorException' was thrown.", ex.Message);

            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSendDocumentScansEmailDocumentVersionIdsNull()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;
                // Add scans
                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);
                var imageFile2 = new Mock<IFormFile>();
                imageFile2.Setup(f => f.Length).Returns(1);
                imageFile2.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile2.Object);
                documentDTO.AddDocumentScans(images);

                // Add second document
                // Initialize the input document
                // Define values
                ValueDTO valueDTO3 = new ValueDTO { AttributeId = 1, Value = "Sally" };
                ValueDTO valueDTO4 = new ValueDTO { AttributeId = 2, Value = 29 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO2 = new DocumentVersionPostDTO();
                documentVersionDTO2.VersionMessage = "VersionMessage of document version 2";
                
                documentVersionDTO2.DocumentId = 2;
                documentVersionDTO2.Values = new List<ValueDTO>();
                documentVersionDTO2.Values.Add(valueDTO3);
                documentVersionDTO2.Values.Add(valueDTO4);
                // Define document
                DocumentPostDTO documentDTO2 = new DocumentPostDTO();
                
                documentDTO2.Id = 2;
                documentDTO2.MetadataModelId = 1;
                documentDTO2.DocumentVersion = documentVersionDTO2;
                // Add scans
                documentDTO2.AddDocumentScans(images);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

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

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, mailService, userInformationServiceMock.Object);

                doc.AddDocument(documentDTO);
                doc.AddDocument(documentDTO2);

                DocumentScanEmail mail = new DocumentScanEmail();
                mail.Subject = "Email Subject";
                mail.RecieverEmails = new List<string>();
                mail.RecieverEmails.Add("r.hussien@lit-co.net");
                mail.SenderName = "Test Sender";
                mail.EmailBody = "Email Body";
                //mail.DocumentVersionIds = new List<int>();
                //mail.DocumentVersionIds.Add(1);
                //mail.DocumentVersionIds.Add(2);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.SendDocumentScansEmail(mail));
                Assert.Empty(ex.AttributeMessages);
                Assert.Equal("Exception of type 'DM.Service.ServiceModels.ValidatorException' was thrown.", ex.Message);

            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSendDocumentScansEmailDocumentVersionIdsEmpty()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;
                // Add scans
                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);
                var imageFile2 = new Mock<IFormFile>();
                imageFile2.Setup(f => f.Length).Returns(1);
                imageFile2.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile2.Object);
                documentDTO.AddDocumentScans(images);

                // Add second document
                // Initialize the input document
                // Define values
                ValueDTO valueDTO3 = new ValueDTO { AttributeId = 1, Value = "Sally" };
                ValueDTO valueDTO4 = new ValueDTO { AttributeId = 2, Value = 29 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO2 = new DocumentVersionPostDTO();
                documentVersionDTO2.VersionMessage = "VersionMessage of document version 2";
                
                documentVersionDTO2.DocumentId = 2;
                documentVersionDTO2.Values = new List<ValueDTO>();
                documentVersionDTO2.Values.Add(valueDTO3);
                documentVersionDTO2.Values.Add(valueDTO4);
                // Define document
                DocumentPostDTO documentDTO2 = new DocumentPostDTO();
                
                documentDTO2.Id = 2;
                documentDTO2.MetadataModelId = 1;
                documentDTO2.DocumentVersion = documentVersionDTO2;
                // Add scans
                documentDTO2.AddDocumentScans(images);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

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

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, mailService, userInformationServiceMock.Object);

                doc.AddDocument(documentDTO);
                doc.AddDocument(documentDTO2);

                DocumentScanEmail mail = new DocumentScanEmail();
                mail.Subject = "Email Subject";
                mail.RecieverEmails = new List<string>();
                mail.RecieverEmails.Add("r.hussien@lit-co.net");
                mail.SenderName = "Test Sender";
                mail.EmailBody = "Email Body";
                mail.DocumentVersionIds = new List<int>();
                //mail.DocumentVersionIds.Add(1);
                //mail.DocumentVersionIds.Add(2);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.SendDocumentScansEmail(mail));
                Assert.Empty(ex.AttributeMessages);
                Assert.Equal("Exception of type 'DM.Service.ServiceModels.ValidatorException' was thrown.", ex.Message);

            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSendDocumentScansEmailWrongServer()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;
                // Add scans
                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.ContentType).Returns("application/png");
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);
                var imageFile2 = new Mock<IFormFile>();
                imageFile2.Setup(f => f.Length).Returns(1);
                imageFile2.Setup(f => f.ContentType).Returns("application/png");
                imageFile2.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile2.Object);
                documentDTO.AddDocumentScans(images);

                // Add second document
                // Initialize the input document
                // Define values
                ValueDTO valueDTO3 = new ValueDTO { AttributeId = 1, Value = "Sally" };
                ValueDTO valueDTO4 = new ValueDTO { AttributeId = 2, Value = 29 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO2 = new DocumentVersionPostDTO();
                documentVersionDTO2.VersionMessage = "VersionMessage of document version 2";
                
                documentVersionDTO2.DocumentId = 2;
                documentVersionDTO2.Values = new List<ValueDTO>();
                documentVersionDTO2.Values.Add(valueDTO3);
                documentVersionDTO2.Values.Add(valueDTO4);
                // Define document
                DocumentPostDTO documentDTO2 = new DocumentPostDTO();
                
                documentDTO2.Id = 2;
                documentDTO2.MetadataModelId = 1;
                documentDTO2.DocumentVersion = documentVersionDTO2;
                // Add scans
                documentDTO2.AddDocumentScans(images);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

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

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, mailService, userInformationServiceMock.Object);

                doc.AddDocument(documentDTO);
                doc.AddDocument(documentDTO2);

                DocumentScanEmail mail = new DocumentScanEmail();
                mail.Subject = "Email Subject";
                mail.RecieverEmails = new List<string>();
                mail.RecieverEmails.Add("r.hussien@lit-co.net");
                mail.SenderName = "Test Sender";
                mail.EmailBody = "Email Body";
                mail.DocumentVersionIds = new List<int>();
                mail.DocumentVersionIds.Add(1);
                mail.DocumentVersionIds.Add(2);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.SendDocumentScansEmail(mail));
                Assert.Equal("An error happened when trying to send the email, please report to the 'Admin'.", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSendDocumentScansEmailWrongPort()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;
                // Add scans
                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.ContentType).Returns("application/png");
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);
                var imageFile2 = new Mock<IFormFile>();
                imageFile2.Setup(f => f.Length).Returns(1);
                imageFile2.Setup(f => f.ContentType).Returns("application/png");
                imageFile2.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile2.Object);
                documentDTO.AddDocumentScans(images);

                // Add second document
                // Initialize the input document
                // Define values
                ValueDTO valueDTO3 = new ValueDTO { AttributeId = 1, Value = "Sally" };
                ValueDTO valueDTO4 = new ValueDTO { AttributeId = 2, Value = 29 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO2 = new DocumentVersionPostDTO();
                documentVersionDTO2.VersionMessage = "VersionMessage of document version 2";
                
                documentVersionDTO2.DocumentId = 2;
                documentVersionDTO2.Values = new List<ValueDTO>();
                documentVersionDTO2.Values.Add(valueDTO3);
                documentVersionDTO2.Values.Add(valueDTO4);
                // Define document
                DocumentPostDTO documentDTO2 = new DocumentPostDTO();
                
                documentDTO2.Id = 2;
                documentDTO2.MetadataModelId = 1;
                documentDTO2.DocumentVersion = documentVersionDTO2;
                // Add scans
                documentDTO2.AddDocumentScans(images);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

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

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, mailService, userInformationServiceMock.Object);

                doc.AddDocument(documentDTO);
                doc.AddDocument(documentDTO2);

                DocumentScanEmail mail = new DocumentScanEmail();
                mail.Subject = "Email Subject";
                mail.RecieverEmails = new List<string>();
                mail.RecieverEmails.Add("r.hussien@lit-co.net");
                mail.SenderName = "Test Sender";
                mail.EmailBody = "Email Body";
                mail.DocumentVersionIds = new List<int>();
                mail.DocumentVersionIds.Add(1);
                mail.DocumentVersionIds.Add(2);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.SendDocumentScansEmail(mail));
                Assert.Equal("An error happened when trying to send the email, please report to the 'Admin'.", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSendDocumentScansEmailWrongEmail()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;
                // Add scans
                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.ContentType).Returns("application/png");
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);
                var imageFile2 = new Mock<IFormFile>();
                imageFile2.Setup(f => f.Length).Returns(1);
                imageFile2.Setup(f => f.ContentType).Returns("application/png");
                imageFile2.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile2.Object);
                documentDTO.AddDocumentScans(images);

                // Add second document
                // Initialize the input document
                // Define values
                ValueDTO valueDTO3 = new ValueDTO { AttributeId = 1, Value = "Sally" };
                ValueDTO valueDTO4 = new ValueDTO { AttributeId = 2, Value = 29 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO2 = new DocumentVersionPostDTO();
                documentVersionDTO2.VersionMessage = "VersionMessage of document version 2";
                
                documentVersionDTO2.DocumentId = 2;
                documentVersionDTO2.Values = new List<ValueDTO>();
                documentVersionDTO2.Values.Add(valueDTO3);
                documentVersionDTO2.Values.Add(valueDTO4);
                // Define document
                DocumentPostDTO documentDTO2 = new DocumentPostDTO();
                
                documentDTO2.Id = 2;
                documentDTO2.MetadataModelId = 1;
                documentDTO2.DocumentVersion = documentVersionDTO2;
                // Add scans
                documentDTO2.AddDocumentScans(images);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

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

                MailService mailService = new MailService(dbContext, configuration, null);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, mailService, userInformationServiceMock.Object);

                doc.AddDocument(documentDTO);
                doc.AddDocument(documentDTO2);

                DocumentScanEmail mail = new DocumentScanEmail();
                mail.Subject = "Email Subject";
                mail.RecieverEmails = new List<string>();
                mail.RecieverEmails.Add("r.hussien@lit-co.net");
                mail.SenderName = "Test Sender";
                mail.EmailBody = "Email Body";
                mail.DocumentVersionIds = new List<int>();
                mail.DocumentVersionIds.Add(1);
                mail.DocumentVersionIds.Add(2);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.SendDocumentScansEmail(mail));
                Assert.Equal("An error happened when trying to send the email, please report to the 'Admin'.", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSendDocumentScansEmailWrongPswd()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);
                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;
                // Add scans
                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.ContentType).Returns("application/png");
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);
                var imageFile2 = new Mock<IFormFile>();
                imageFile2.Setup(f => f.Length).Returns(1);
                imageFile2.Setup(f => f.ContentType).Returns("application/png");
                imageFile2.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile2.Object);
                documentDTO.AddDocumentScans(images);

                // Add second document
                // Initialize the input document
                // Define values
                ValueDTO valueDTO3 = new ValueDTO { AttributeId = 1, Value = "Sally" };
                ValueDTO valueDTO4 = new ValueDTO { AttributeId = 2, Value = 29 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO2 = new DocumentVersionPostDTO();
                documentVersionDTO2.VersionMessage = "VersionMessage of document version 2";
                
                documentVersionDTO2.DocumentId = 2;
                documentVersionDTO2.Values = new List<ValueDTO>();
                documentVersionDTO2.Values.Add(valueDTO3);
                documentVersionDTO2.Values.Add(valueDTO4);
                // Define document
                DocumentPostDTO documentDTO2 = new DocumentPostDTO();
                
                documentDTO2.Id = 2;
                documentDTO2.MetadataModelId = 1;
                documentDTO2.DocumentVersion = documentVersionDTO2;
                // Add scans
                documentDTO2.AddDocumentScans(images);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

                var inMemorySettings = new Dictionary<string, string>
                {
                    {"SMTP:Server", "mail.lit-co.net"},
                    {"SMTP:Port", "587"},
                    {"SMTP:Email", "a.mansour@lit-co.net"},
                    {"SMTP:Password", "22pXXrNb7v1JjS"},
                    //...populate as needed for the test
                };

                IConfiguration configuration = new ConfigurationBuilder()
                    .AddInMemoryCollection(inMemorySettings)
                    .Build();

                MailService mailService = new MailService(dbContext, configuration, GetMailServiceLocalizerObject());

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, mailService, userInformationServiceMock.Object);

                doc.AddDocument(documentDTO);
                doc.AddDocument(documentDTO2);

                DocumentScanEmail mail = new DocumentScanEmail();
                mail.Subject = "Email Subject";
                mail.RecieverEmails = new List<string>();
                mail.RecieverEmails.Add("r.hussien@lit-co.net");
                mail.SenderName = "Test Sender";
                mail.EmailBody = "Email Body";
                mail.DocumentVersionIds = new List<int>();
                mail.DocumentVersionIds.Add(1);
                mail.DocumentVersionIds.Add(2);

                // Act && Assert
                ValidatorException ex = Assert.Throws<ValidatorException>(() => doc.SendDocumentScansEmail(mail));
                Assert.Equal("An error happened when trying to send the email, please report to the 'Admin'.", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSendDocumentScansEmail()
        {
            // Arrange
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                 .EnableSensitiveDataLogging()
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

                // Add metadata models
                AddFirstDefaultMetaDataModel(dbContext);

                // Initialize the input document
                // Define values
                ValueDTO valueDTO1 = new ValueDTO { AttributeId = 1, Value = "Mary" };
                ValueDTO valueDTO2 = new ValueDTO { AttributeId = 2, Value = 25 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.VersionMessage = "VersionMessage of document version 1";
                
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO1);
                documentVersionDTO.Values.Add(valueDTO2);

                // Define document
                DocumentPostDTO documentDTO = new DocumentPostDTO();
                
                documentDTO.Id = 1;
                documentDTO.MetadataModelId = 1;
                documentDTO.DocumentVersion = documentVersionDTO;
                // Add scans
                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.ContentType).Returns("application/png");
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);
                var imageFile2 = new Mock<IFormFile>();
                imageFile2.Setup(f => f.Length).Returns(1);
                imageFile2.Setup(f => f.ContentType).Returns("application/png");
                imageFile2.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile2.Object);
                documentDTO.AddDocumentScans(images);

                // Add second document
                // Initialize the input document
                // Define values
                ValueDTO valueDTO3 = new ValueDTO { AttributeId = 1, Value = "Sally" };
                ValueDTO valueDTO4 = new ValueDTO { AttributeId = 2, Value = 29 };
                // Define document version
                DocumentVersionPostDTO documentVersionDTO2 = new DocumentVersionPostDTO();
                documentVersionDTO2.VersionMessage = "VersionMessage of document version 2";
                
                documentVersionDTO2.DocumentId = 2;
                documentVersionDTO2.Values = new List<ValueDTO>();
                documentVersionDTO2.Values.Add(valueDTO3);
                documentVersionDTO2.Values.Add(valueDTO4);

                // Define document
                DocumentPostDTO documentDTO2 = new DocumentPostDTO();
                
                documentDTO2.Id = 2;
                documentDTO2.MetadataModelId = 1;
                documentDTO2.DocumentVersion = documentVersionDTO2;
                // Add scans
                documentDTO2.AddDocumentScans(images);

                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentService> logger = loggerFactory.CreateLogger<DocumentService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentService>(factory);

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

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentService doc = new DocumentService(dbContext, logger, localizer, mailService, userInformationServiceMock.Object);

                doc.AddDocument(documentDTO);
                doc.AddDocument(documentDTO2);

                DocumentScanEmail mail = new DocumentScanEmail();
                mail.Subject = "Email Subject";
                mail.RecieverEmails = new List<string>();
                mail.RecieverEmails.Add("r.hussien@lit-co.net");
                mail.SenderName = "Test Sender";
                mail.EmailBody = "Email Body";
                mail.DocumentVersionIds = new List<int>();
                mail.DocumentVersionIds.Add(1);
                mail.DocumentVersionIds.Add(2);

                // Act
                doc.SendDocumentScansEmail(mail);

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
#endif
    }

}
