using DM.Domain.Models;
using DM.Repository.Contexts;
using DM.Service.ServiceModels;
using DM.Service.ServiceModels.DocumentClassDTO;
using DM.Service.ServiceModels.DocumentDTO;
using DM.Service.ServiceModels.DocumentSetDTO;
using DM.Service.ServiceModels.MetaDataModelDTO;
using DM.Service.Services;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

using System.Linq;
using System.Collections.Generic;

using Xunit;
using DM.Service.Utils;
using Moq;
using Microsoft.Data.Sqlite;

namespace DM.UnitTest.ServiceUT
{
    public class DocumentSetTests
    {
        [Fact]
        public void AddDocumentsToDocumentSetTest()
        {
            //Arrange
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                //Arrange
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                .UseSqlite(connection)
                .Options;

                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                    var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                ILogger<DocumentService> logger2 = loggerFactory.CreateLogger<DocumentService>();
                var localizer2 = new StringLocalizer<DocumentService>(factory);
                DocumentService doc = new DocumentService(context, logger2, localizer2, null, userInformationServiceMock.Object);

                ILogger<DocumentClassService> logger3 = loggerFactory.CreateLogger<DocumentClassService>();
                var localizer3 = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService doc_class = new DocumentClassService(context, logger3, localizer3, userInformationServiceMock.Object);

                DocumentClassDTO class_dto = new DocumentClassDTO();
                class_dto.DocumentClassName = "ClassSet";
                class_dto.UserName = "Sam";
                doc_class.AddDocumentClass(class_dto);

                ILogger<MetaDataModelService> logger4 = loggerFactory.CreateLogger<MetaDataModelService>();
                var localizer4 = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(context, logger4, localizer4, userInformationServiceMock.Object);

                MetaDataModelDTO meta_dto = new MetaDataModelDTO();
                meta_dto.MetaDataModelName = "Model3";
                meta_dto.DocumentClassId = 1;

                //MetaDataAttributeService attr = new MetaDataAttributeService(uow);
                MetaDataAttributeDTO attr_dto = new MetaDataAttributeDTO();
                attr_dto.MetaDataAttributeName = "salary";
                attr_dto.IsRequired = true;
                attr_dto.DataTypeID = 5;

                meta_dto.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                meta_dto.MetaDataAttributes.Add(attr_dto);
                // meta_dto.AggregateMetaDataModelsParts = new List<AggregateMetaDataModelDTO>();
                meta.AddMetaDataModel(meta_dto);

                DocumentPostDTO documentDto = new DocumentPostDTO();
                documentDto.MetadataModelId = 1;

                ValueDTO int_dto = new ValueDTO();
                int_dto.AttributeId = 1;
                int_dto.Value = 225;
                documentDto.DocumentVersion = new DocumentVersionPostDTO();
                documentDto.DocumentVersion.Values = new List<ValueDTO>();
                documentDto.DocumentVersion.Values.Add(int_dto);
                documentDto.DocumentVersion.VersionMessage = "test";
                documentDto.DocumentVersion.DocumentScans = new List<DocumentScanDTO>();
                documentDto.DocumentVersion.DocumentScans.Add(new DocumentScanDTO
                {
                    Name = "DocScan",
                    ContentType = "PNG",
                    ScanImage = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 }
                });


                doc.AddDocument(documentDto);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);
                List<int> docs = new List<int> { 1 };
                //Act
                doc_set.AddDocumentsToDocumentSet(docs, 1);
                context.SaveChanges();
            }
                //Assert
                using (var context = new DocumentDBContext(options))
                {
                    var loggerFactory = LoggerFactory.Create(builder =>
                    {
                        builder
                            .AddFilter("Microsoft", LogLevel.Warning)
                            .AddFilter("System", LogLevel.Warning)
                            .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                    });
                    ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                    var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                    var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                    var localizer = new StringLocalizer<DocumentSetService>(factory);
                    DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, null);
                    List<DocumentSetGetDTO> sets = doc_set.GetAllDocumentSets().ToList();
                    Assert.Single(sets);
                    Assert.Equal("SetOne", sets[0].Name);
                    DocumentSetGetDTO currentSet = doc_set.GetDocumentSetByID(1);
                    Assert.Single(currentSet.AttachedDocuments);
                    Assert.Contains("Model3", currentSet.AttachedDocuments[0].DocumentName);
                }
            }
            finally
            {
                connection.Close();
            }
        }
        [Fact]
        public void AddDocumentToDocumentSetTestDocumentSetNotAvailable()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
    .UseInMemoryDatabase(databaseName: "add_write_to_database2")
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
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                ILogger<DocumentService> logger2 = loggerFactory.CreateLogger<DocumentService>();
                var localizer2 = new StringLocalizer<DocumentService>(factory);
                DocumentService doc = new DocumentService(context, logger2, localizer2, null, userInformationServiceMock.Object);

                ILogger<DocumentClassService> logger3 = loggerFactory.CreateLogger<DocumentClassService>();
                var localizer3 = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService doc_class = new DocumentClassService(context, logger3, localizer3, userInformationServiceMock.Object);

                DocumentClassDTO class_dto = new DocumentClassDTO();
                class_dto.DocumentClassName = "ClassSet";
                class_dto.UserName = "Sam";
                doc_class.AddDocumentClass(class_dto);

                ILogger<MetaDataModelService> logger4 = loggerFactory.CreateLogger<MetaDataModelService>();
                var localizer4 = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(context, logger4, localizer4, userInformationServiceMock.Object);

                MetaDataModelDTO meta_dto = new MetaDataModelDTO();
                meta_dto.MetaDataModelName = "Model3";
                meta_dto.DocumentClassId = 1;

                List<DataType> dtList = new List<DataType>();
                DataType dt = new DataType();
                dt.DataTypeName = "bool";
                dtList.Add(dt);
                DataType dt2 = new DataType();
                dt2.DataTypeName = "date";
                dtList.Add(dt2);
                DataType dt3 = new DataType();
                dt3.DataTypeName = "decimal";
                dtList.Add(dt3);
                DataType dt4 = new DataType();
                dt4.DataTypeName = "double";
                dtList.Add(dt4);
                DataType dt5 = new DataType();
                dt5.DataTypeName = "int";
                dtList.Add(dt5);
                DataType dt6 = new DataType();
                dt6.DataTypeName = "string";
                dtList.Add(dt6);

                context.DataType.AddRange(dtList);
                context.SaveChanges();

                //MetaDataAttributeService attr = new MetaDataAttributeService(uow);
                MetaDataAttributeDTO attr_dto = new MetaDataAttributeDTO();
                attr_dto.MetaDataAttributeName = "salary";
                attr_dto.IsRequired = true;
                attr_dto.DataTypeID = 5;

                meta_dto.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                meta_dto.MetaDataAttributes.Add(attr_dto);
                //meta_dto.AggregateMetaDataModelsParts = new List<AggregateMetaDataModelDTO>();
                meta.AddMetaDataModel(meta_dto);

                DocumentPostDTO documentDto = new DocumentPostDTO();
                documentDto.MetadataModelId = 1;

                ValueDTO int_dto = new ValueDTO();
                int_dto.AttributeId = 1;
                int_dto.Value = 225;
                documentDto.DocumentVersion = new DocumentVersionPostDTO();
                documentDto.DocumentVersion.Values = new List<ValueDTO>();
                documentDto.DocumentVersion.Values.Add(int_dto);
                documentDto.DocumentVersion.DocumentScans = new List<DocumentScanDTO>();
                documentDto.DocumentVersion.DocumentScans.Add(new DocumentScanDTO
                {
                    Name = "DocScan",
                    ContentType = "PNG",
                    ScanImage = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 }
                });
                doc.AddDocument(documentDto);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);

                List<int> docs = new List<int> { 1 };

                //Act+Assert
                Assert.Throws<ValidatorException>(() => doc_set.AddDocumentsToDocumentSet(docs, 2));
            }
        }
        [Fact]
        public void AddDocumentToDocumentSetTestDocumentNotAvailable()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
    .UseInMemoryDatabase(databaseName: "add_write_to_database3")
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
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                ILogger<DocumentService> logger2 = loggerFactory.CreateLogger<DocumentService>();
                var localizer2 = new StringLocalizer<DocumentService>(factory);
                DocumentService doc = new DocumentService(context, logger2, localizer2, null, userInformationServiceMock.Object);

                ILogger<DocumentClassService> logger3 = loggerFactory.CreateLogger<DocumentClassService>();
                var localizer3 = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService doc_class = new DocumentClassService(context, logger3, localizer3, userInformationServiceMock.Object);

                DocumentClassDTO class_dto = new DocumentClassDTO();
                class_dto.DocumentClassName = "ClassSet";
                class_dto.UserName = "Sam";
                doc_class.AddDocumentClass(class_dto);

                List<DataType> dtList = new List<DataType>();
                DataType dt = new DataType();
                dt.DataTypeName = "bool";
                dtList.Add(dt);
                DataType dt2 = new DataType();
                dt2.DataTypeName = "date";
                dtList.Add(dt2);
                DataType dt3 = new DataType();
                dt3.DataTypeName = "decimal";
                dtList.Add(dt3);
                DataType dt4 = new DataType();
                dt4.DataTypeName = "double";
                dtList.Add(dt4);
                DataType dt5 = new DataType();
                dt5.DataTypeName = "int";
                dtList.Add(dt5);
                DataType dt6 = new DataType();
                dt6.DataTypeName = "string";
                dtList.Add(dt6);

                context.DataType.AddRange(dtList);
                context.SaveChanges();

                ILogger<MetaDataModelService> logger4 = loggerFactory.CreateLogger<MetaDataModelService>();
                var localizer4 = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(context, logger4, localizer4, userInformationServiceMock.Object);

                MetaDataModelDTO meta_dto = new MetaDataModelDTO();
                meta_dto.MetaDataModelName = "Model3";
                meta_dto.DocumentClassId = 1;

                //MetaDataAttributeService attr = new MetaDataAttributeService(uow);
                MetaDataAttributeDTO attr_dto = new MetaDataAttributeDTO();
                attr_dto.MetaDataAttributeName = "salary";
                attr_dto.IsRequired = true;
                attr_dto.DataTypeID = 5;

                meta_dto.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                meta_dto.MetaDataAttributes.Add(attr_dto);
                //   meta_dto.AggregateMetaDataModelsParts = new List<AggregateMetaDataModelDTO>();
                meta.AddMetaDataModel(meta_dto);

                DocumentPostDTO documentDto = new DocumentPostDTO();
                documentDto.MetadataModelId = 1;

                ValueDTO int_dto = new ValueDTO();
                int_dto.AttributeId = 1;
                int_dto.Value = 225;
                documentDto.DocumentVersion = new DocumentVersionPostDTO();
                documentDto.DocumentVersion.Values = new List<ValueDTO>();
                documentDto.DocumentVersion.Values.Add(int_dto);
                documentDto.DocumentVersion.DocumentScans = new List<DocumentScanDTO>();
                documentDto.DocumentVersion.DocumentScans.Add(new DocumentScanDTO
                {
                    Name = "DocScan",
                    ContentType = "PNG",
                    ScanImage = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 }
                });

                doc.AddDocument(documentDto);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);
                List<int> docs = new List<int> { 2 };

                //Act+Assert
                Assert.Throws<ValidatorException>(() => doc_set.AddDocumentsToDocumentSet(docs, 1));
            }
        }
        [Fact]
        public void AddDocumentToDocumentSetTestDocumentAlreadyAdded()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
    .UseInMemoryDatabase(databaseName: "add_write_to_database4")
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
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                ILogger<DocumentService> logger2 = loggerFactory.CreateLogger<DocumentService>();
                var localizer2 = new StringLocalizer<DocumentService>(factory);
                DocumentService doc = new DocumentService(context, logger2, localizer2, null, userInformationServiceMock.Object);

                ILogger<DocumentClassService> logger3 = loggerFactory.CreateLogger<DocumentClassService>();
                var localizer3 = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService doc_class = new DocumentClassService(context, logger3, localizer3, userInformationServiceMock.Object);

                DocumentClassDTO class_dto = new DocumentClassDTO();
                class_dto.DocumentClassName = "ClassSet";
                class_dto.UserName = "Sam";
                doc_class.AddDocumentClass(class_dto);

                List<DataType> dtList = new List<DataType>();
                DataType dt = new DataType();
                dt.DataTypeName = "bool";
                dtList.Add(dt);
                DataType dt2 = new DataType();
                dt2.DataTypeName = "date";
                dtList.Add(dt2);
                DataType dt3 = new DataType();
                dt3.DataTypeName = "decimal";
                dtList.Add(dt3);
                DataType dt4 = new DataType();
                dt4.DataTypeName = "double";
                dtList.Add(dt4);
                DataType dt5 = new DataType();
                dt5.DataTypeName = "int";
                dtList.Add(dt5);
                DataType dt6 = new DataType();
                dt6.DataTypeName = "string";
                dtList.Add(dt6);

                context.DataType.AddRange(dtList);
                context.SaveChanges();

                ILogger<MetaDataModelService> logger4 = loggerFactory.CreateLogger<MetaDataModelService>();
                var localizer4 = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(context, logger4, localizer4, userInformationServiceMock.Object);

                MetaDataModelDTO meta_dto = new MetaDataModelDTO();
                meta_dto.MetaDataModelName = "Model3";
                meta_dto.DocumentClassId = 1;

                //MetaDataAttributeService attr = new MetaDataAttributeService(uow);
                MetaDataAttributeDTO attr_dto = new MetaDataAttributeDTO();
                attr_dto.MetaDataAttributeName = "salary";
                attr_dto.IsRequired = true;
                attr_dto.DataTypeID = 5;

                meta_dto.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                meta_dto.MetaDataAttributes.Add(attr_dto);
                meta.AddMetaDataModel(meta_dto);

                DocumentPostDTO documentDto = new DocumentPostDTO();
                documentDto.MetadataModelId = 1;

                ValueDTO int_dto = new ValueDTO();
                int_dto.AttributeId = 1;
                int_dto.Value = 225;
                documentDto.DocumentVersion = new DocumentVersionPostDTO();
                documentDto.DocumentVersion.Values = new List<ValueDTO>();
                documentDto.DocumentVersion.Values.Add(int_dto);
                documentDto.DocumentVersion.DocumentScans = new List<DocumentScanDTO>();
                documentDto.DocumentVersion.DocumentScans.Add(new DocumentScanDTO
                {
                    Name = "DocScan",
                    ContentType = "PNG",
                    ScanImage = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 }
                });

                doc.AddDocument(documentDto);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);
                List<int> docs = new List<int> { 1 };
                doc_set.AddDocumentsToDocumentSet(docs, 1);

                //Act+Assert
                Assert.Throws<ValidatorException>(() => doc_set.AddDocumentsToDocumentSet(docs, 1));
            }
        }

        [Fact]
        public void GetAllDocumentSetsTest()
        {
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                //Arrange
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                .UseSqlite(connection)
                .Options;

                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                    var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);
                DocumentSetPostDTO dto2 = new DocumentSetPostDTO();
                dto2.Name = "SetTwo";
                doc_set.AddDocumentSet(dto2);
            }
                using (var context = new DocumentDBContext(options))
                {
                    var loggerFactory = LoggerFactory.Create(builder =>
                    {
                        builder
                            .AddFilter("Microsoft", LogLevel.Warning)
                            .AddFilter("System", LogLevel.Warning)
                            .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                    });
                    ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                    var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                    var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                    var localizer = new StringLocalizer<DocumentSetService>(factory);
                    DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, null);

                    //Act
                    List<DocumentSetGetDTO> sets = doc_set.GetAllDocumentSets().ToList();
                    //Assert
                    Assert.Equal(2, sets.Count());
                    Assert.Equal("SetOne", sets[0].Name);
                    Assert.Equal(1, sets[0].Id);
                    Assert.Equal("SetTwo", sets[1].Name);
                    Assert.Equal(2, sets[1].Id);
                }
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void GetDocumentSetByIdTest()
        {
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                //Arrange
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                .UseSqlite(connection)
                .Options;

                int id = 1;

                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                    var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);
                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);
                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);

                ILogger<DocumentService> logger2 = loggerFactory.CreateLogger<DocumentService>();
                var localizer2 = new StringLocalizer<DocumentService>(factory);
                DocumentService doc = new DocumentService(context, logger2, localizer2, null, userInformationServiceMock.Object);

                ILogger<DocumentClassService> logger3 = loggerFactory.CreateLogger<DocumentClassService>();
                var localizer3 = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService doc_class = new DocumentClassService(context, logger3, localizer3, userInformationServiceMock.Object);

                DocumentClassDTO class_dto = new DocumentClassDTO();
                class_dto.DocumentClassName = "ClassSet";
                class_dto.UserName = "Sam";
                doc_class.AddDocumentClass(class_dto);

                ILogger<MetaDataModelService> logger4 = loggerFactory.CreateLogger<MetaDataModelService>();
                var localizer4 = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(context, logger4, localizer4, userInformationServiceMock.Object);

                MetaDataModelDTO meta_dto = new MetaDataModelDTO();
                meta_dto.MetaDataModelName = "Model3";
                meta_dto.DocumentClassId = 1;

                //MetaDataAttributeService attr = new MetaDataAttributeService(uow);
                MetaDataAttributeDTO attr_dto = new MetaDataAttributeDTO();
                attr_dto.MetaDataAttributeName = "salary";
                attr_dto.IsRequired = true;
                attr_dto.DataTypeID = 5;

                meta_dto.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                meta_dto.MetaDataAttributes.Add(attr_dto);
                //meta_dto.AggregateMetaDataModelsParts = new List<AggregateMetaDataModelDTO>();
                meta.AddMetaDataModel(meta_dto);

                DocumentPostDTO documentDto = new DocumentPostDTO();
                documentDto.MetadataModelId = 1;

                ValueDTO int_dto = new ValueDTO();
                int_dto.AttributeId = 1;
                int_dto.Value = 225;
                documentDto.DocumentVersion = new DocumentVersionPostDTO();
                documentDto.DocumentVersion.Values = new List<ValueDTO>();
                documentDto.DocumentVersion.Values.Add(int_dto);
                documentDto.DocumentVersion.VersionMessage = "test";
                documentDto.DocumentVersion.DocumentScans = new List<DocumentScanDTO>();
                documentDto.DocumentVersion.DocumentScans.Add(new DocumentScanDTO
                {
                    Name = "DocScan",
                    ContentType = "PNG",
                    ScanImage = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 }
                });

                doc.AddDocument(documentDto);
                List<int> docs = new List<int> { 1 };
                doc_set.AddDocumentsToDocumentSet(docs, 1);

                DocumentSetPostDTO dto2 = new DocumentSetPostDTO();
                dto2.Name = "SetTwo";
                doc_set.AddDocumentSet(dto2);

                doc_set.AddRecursiveDocumentSet(1, 2);
            }
                using (var context = new DocumentDBContext(options))
                {
                    var loggerFactory = LoggerFactory.Create(builder =>
                    {
                        builder
                            .AddFilter("Microsoft", LogLevel.Warning)
                            .AddFilter("System", LogLevel.Warning)
                            .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                    });
                    ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                    var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                    var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                    var localizer = new StringLocalizer<DocumentSetService>(factory);
                    DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, null);
                    //Act
                    DocumentSetGetDTO document_set = doc_set.GetDocumentSetByID(id);
                    //Assert
                    Assert.Equal("SetOne", document_set.Name);
                    Assert.Single(document_set.AttachedDocuments);
                    Assert.Contains("Model3", document_set.AttachedDocuments[0].DocumentName);
                    Assert.Single(document_set.ChildrenDocumentSets);
                    Assert.Equal("SetTwo", document_set.ChildrenDocumentSets[0].Name);
                }
            }
            finally
            {
                connection.Close();
            }
        }
        [Fact]
        public void GetDocumentSetByIdTestThrowsException()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
    .UseInMemoryDatabase(databaseName: "add_to_database2")
    .Options;

            int id = 3;

            using (var context = new DocumentDBContext(options))
            {
                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);
                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);
                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);
                DocumentSetPostDTO dto2 = new DocumentSetPostDTO();
                dto2.Name = "SetTwo";
                doc_set.AddDocumentSet(dto2);
            }
            using (var context = new DocumentDBContext(options))
            {
                var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);
                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, null);
                //Act+Assert
                Assert.Throws<ValidatorException>(() => doc_set.GetDocumentSetByID(id));
            }
        }

        [Fact]
        public void AddDocumentSetTest()
        {
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                //Arrange
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                .UseSqlite(connection)
                .Options;

                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                    var loggerFactory = LoggerFactory.Create(builder =>
                    {
                        builder
                            .AddFilter("Microsoft", LogLevel.Warning)
                            .AddFilter("System", LogLevel.Warning)
                            .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                    });
                    ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                    var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                    var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                    var localizer = new StringLocalizer<DocumentSetService>(factory);

                    var userInformationServiceMock = new Mock<IUserInformationService>();
                    userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                    DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                    DocumentSetPostDTO dto = new DocumentSetPostDTO();
                    dto.Name = "SetOne";
                    //Act
                    doc_set.AddDocumentSet(dto);
                }
                using (var context = new DocumentDBContext(options))
                {
                    var loggerFactory = LoggerFactory.Create(builder =>
                    {
                        builder
                            .AddFilter("Microsoft", LogLevel.Warning)
                            .AddFilter("System", LogLevel.Warning)
                            .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                    });
                    ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                    var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                    var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                    var localizer = new StringLocalizer<DocumentSetService>(factory);
                    DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, null);
                    //Assert
                    List<DocumentSetGetDTO> document_sets = doc_set.GetAllDocumentSets().ToList();
                    Assert.Single(document_sets);
                    Assert.Equal("SetOne", document_sets[0].Name);
                }
            }
            finally
            {
                connection.Close();
            }
        }
        [Fact]
        public void AddDocumentSetWithParentTest()
        {
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                //Arrange
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                .UseSqlite(connection)
                .Options;

                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                    var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                DocumentSetPostDTO parentDTO = new DocumentSetPostDTO();
                parentDTO.Name = "SetOne";
                doc_set.AddDocumentSet(parentDTO);
                //Act
                DocumentSetPostDTO newSet = new DocumentSetPostDTO();
                newSet.Name = "ChildSet";
                newSet.ParentDocumentSet = 1;
                doc_set.AddDocumentSet(newSet);
            }
                using (var context = new DocumentDBContext(options))
                {
                    var loggerFactory = LoggerFactory.Create(builder =>
                    {
                        builder
                            .AddFilter("Microsoft", LogLevel.Warning)
                            .AddFilter("System", LogLevel.Warning)
                            .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                    });
                    ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                    var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                    var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                    var localizer = new StringLocalizer<DocumentSetService>(factory);
                    DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, null);
                    //Assert
                    List<DocumentSetGetDTO> document_sets = doc_set.GetAllDocumentSets().ToList();
                    Assert.Equal(2, document_sets.Count);
                    Assert.Equal("SetOne", document_sets[0].Name);
                    Assert.Equal("ChildSet", document_sets[1].Name);
                    List<DocumentSet> list = context.RecursiveDocumentSet.Where(e => e.ParentDocumentSetId == 1).Select(e => e.ChildDocumentSet).ToList();
                    Assert.Single(list);
                    Assert.Equal("ChildSet", list[0].Name);
                }
            }
            finally
            {
                connection.Close();
            }
        }


        [Fact]
        public void AddDocumentSetTestDocumentSetAlreadyAddedException()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
    .UseInMemoryDatabase(databaseName: "add_to_databaseX")
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
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);
                //Act
                Assert.Throws<ValidatorException>(() => doc_set.AddDocumentSet(dto));
            }
        }


        [Fact]
        public void DeleteDocumentSetTest()
        {
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                //Arrange
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                .UseSqlite(connection)
                .Options;

                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                    var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                ILogger<DocumentService> logger2 = loggerFactory.CreateLogger<DocumentService>();
                var localizer2 = new StringLocalizer<DocumentService>(factory);

                DocumentService doc = new DocumentService(context, logger2, localizer2, null, userInformationServiceMock.Object);

                ILogger<DocumentClassService> logger3 = loggerFactory.CreateLogger<DocumentClassService>();
                var localizer3 = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService doc_class = new DocumentClassService(context, logger3, localizer3, userInformationServiceMock.Object);

                DocumentClassDTO class_dto = new DocumentClassDTO();
                class_dto.DocumentClassName = "ClassA";
                doc_class.AddDocumentClass(class_dto);

                ILogger<MetaDataModelService> logger4 = loggerFactory.CreateLogger<MetaDataModelService>();
                var localizer4 = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(context, logger4, localizer4, userInformationServiceMock.Object);

                MetaDataModelDTO meta_dto = new MetaDataModelDTO();
                meta_dto.MetaDataModelName = "ModelA";
                meta_dto.DocumentClassId = 1;

                //MetaDataAttributeService attr = new MetaDataAttributeService(uow);
                MetaDataAttributeDTO attr_dto = new MetaDataAttributeDTO();
                attr_dto.MetaDataAttributeName = "age";
                attr_dto.IsRequired = true;
                attr_dto.DataTypeID = 5;

                meta_dto.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                meta_dto.MetaDataAttributes.Add(attr_dto);
                // meta_dto.AggregateMetaDataModelsParts = new List<AggregateMetaDataModelDTO>();
                meta.AddMetaDataModel(meta_dto);

                DocumentPostDTO documentDto = new DocumentPostDTO();
                documentDto.MetadataModelId = 1;
                

                ValueDTO int_dto = new ValueDTO();
                int_dto.AttributeId = 1;
                int_dto.Value = 18;
                documentDto.DocumentVersion = new DocumentVersionPostDTO();
                documentDto.DocumentVersion.Values = new List<ValueDTO>();
                documentDto.DocumentVersion.Values.Add(int_dto);
                documentDto.DocumentVersion.VersionMessage = "test";
                documentDto.DocumentVersion.DocumentScans = new List<DocumentScanDTO>();
                documentDto.DocumentVersion.DocumentScans.Add(new DocumentScanDTO
                {
                    Name = "DocScan",
                    ContentType = "PNG",
                    ScanImage = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 }
                });

                doc.AddDocument(documentDto);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);

                DocumentSetPostDTO dto2 = new DocumentSetPostDTO();
                dto2.Name = "SetTwo";
                doc_set.AddDocumentSet(dto2);
                List<int> docs = new List<int> { 1 };

                doc_set.AddDocumentsToDocumentSet(docs, 1);
                doc_set.AddDocumentsToDocumentSet(docs, 2);
                doc_set.AddRecursiveDocumentSet(1, 2);
                //list before
                List<DocumentSetGetDTO> sets = doc_set.GetAllDocumentSets().ToList();
                Assert.Equal(2, sets.Count());
                DocumentSetGetDTO first_set = doc_set.GetDocumentSetByID(1);
                Assert.Single(first_set.AttachedDocuments);
                Assert.Single(first_set.ChildrenDocumentSets);
                Assert.True(context.DocumentSet_Document.Any(p => p.DocumentSetId == 1));
                Assert.True(context.RecursiveDocumentSet.Any(p => p.ParentDocumentSetId == 1 || p.ChildDocumentSetId == 1));
                //Act
                doc_set.DeleteDocumentSet(1);
            }
                //Assert
                using (var context = new DocumentDBContext(options))
                {
                    var loggerFactory = LoggerFactory.Create(builder =>
                    {
                        builder
                            .AddFilter("Microsoft", LogLevel.Warning)
                            .AddFilter("System", LogLevel.Warning)
                            .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                    });
                    ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                    var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                    var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                    var localizer = new StringLocalizer<DocumentSetService>(factory);
                    DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, null);
                    //list after
                    List<DocumentSetGetDTO> sets = doc_set.GetAllDocumentSets().ToList();
                    Assert.Single(sets);
                    Assert.Equal(2, sets[0].Id);
                    Assert.False(context.DocumentSet_Document.Any(p => p.DocumentSetId == 1));
                    Assert.False(context.RecursiveDocumentSet.Any(p => p.ParentDocumentSetId == 1 || p.ChildDocumentSetId == 1));
                }
            }
            finally
            {
                connection.Close();
            }
        }
        [Fact]
        public void DeleteDocumentSetTestSetNotFoundException()
        {
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                //Arrange
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                .UseSqlite(connection)
                .Options;

                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                    var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                    ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                    var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                    var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                    var localizer = new StringLocalizer<DocumentSetService>(factory);

                    var userInformationServiceMock = new Mock<IUserInformationService>();
                    userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                    DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                    ILogger<DocumentService> logger2 = loggerFactory.CreateLogger<DocumentService>();
                    var localizer2 = new StringLocalizer<DocumentService>(factory);
                    DocumentService doc = new DocumentService(context, logger2, localizer2, null, userInformationServiceMock.Object);

                    ILogger<DocumentClassService> logger3 = loggerFactory.CreateLogger<DocumentClassService>();
                    var localizer3 = new StringLocalizer<DocumentClassService>(factory);
                    DocumentClassService doc_class = new DocumentClassService(context, logger3, localizer3, userInformationServiceMock.Object);

                    DocumentClassDTO class_dto = new DocumentClassDTO();
                    class_dto.DocumentClassName = "ClassA";
                    doc_class.AddDocumentClass(class_dto);

                    ILogger<MetaDataModelService> logger4 = loggerFactory.CreateLogger<MetaDataModelService>();
                    var localizer4 = new StringLocalizer<MetaDataModelService>(factory);
                    MetaDataModelService meta = new MetaDataModelService(context, logger4, localizer4, userInformationServiceMock.Object);

                    MetaDataModelDTO meta_dto = new MetaDataModelDTO();
                    meta_dto.MetaDataModelName = "ModelA";
                    meta_dto.DocumentClassId = 1;

                    //MetaDataAttributeService attr = new MetaDataAttributeService(uow);
                    MetaDataAttributeDTO attr_dto = new MetaDataAttributeDTO();
                    attr_dto.MetaDataAttributeName = "age";
                    attr_dto.IsRequired = true;
                    attr_dto.DataTypeID = 5;

                    meta_dto.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                    meta_dto.MetaDataAttributes.Add(attr_dto);
                    // meta_dto.AggregateMetaDataModelsParts = new List<AggregateMetaDataModelDTO>();
                    meta.AddMetaDataModel(meta_dto);

                    DocumentPostDTO documentDto = new DocumentPostDTO();
                    documentDto.MetadataModelId = 1;


                    ValueDTO int_dto = new ValueDTO();
                    int_dto.AttributeId = 1;
                    int_dto.Value = 18;
                    documentDto.DocumentVersion = new DocumentVersionPostDTO();
                    documentDto.DocumentVersion.Values = new List<ValueDTO>();
                    documentDto.DocumentVersion.Values.Add(int_dto);
                    documentDto.DocumentVersion.VersionMessage = "test";
                    documentDto.DocumentVersion.DocumentScans = new List<DocumentScanDTO>();
                    documentDto.DocumentVersion.DocumentScans.Add(new DocumentScanDTO
                    {
                        Name = "DocScan",
                        ContentType = "PNG",
                        ScanImage = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 }
                    });

                    doc.AddDocument(documentDto);

                    DocumentSetPostDTO dto = new DocumentSetPostDTO();
                    dto.Name = "SetOne";
                    doc_set.AddDocumentSet(dto);

                    DocumentSetPostDTO dto2 = new DocumentSetPostDTO();
                    dto2.Name = "SetTwo";
                    doc_set.AddDocumentSet(dto2);
                    List<int> docs = new List<int> { 1 };

                    doc_set.AddDocumentsToDocumentSet(docs, 1);
                    doc_set.AddDocumentsToDocumentSet(docs, 2);
                    doc_set.AddRecursiveDocumentSet(1, 2);
                    //list before
                    List<DocumentSetGetDTO> sets = doc_set.GetAllDocumentSets().ToList();
                    Assert.Equal(2, sets.Count());
                    DocumentSetGetDTO first_set = doc_set.GetDocumentSetByID(1);
                    Assert.Single(first_set.AttachedDocuments);
                    Assert.Single(first_set.ChildrenDocumentSets);
                    Assert.True(context.DocumentSet_Document.Any(p => p.DocumentSetId == 1));
                    Assert.True(context.RecursiveDocumentSet.Any(p => p.ParentDocumentSetId == 1 || p.ChildDocumentSetId == 1));
                    //Act
                    Assert.Throws<ValidatorException>(() => doc_set.DeleteDocumentSet(3));
                }
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void RemoveDocumentFromDocumentSetTest()
        {
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                //Arrange
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                .UseSqlite(connection)
                .Options;

                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                    var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);
                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);
                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                ILogger<DocumentService> logger2 = loggerFactory.CreateLogger<DocumentService>();
                var localizer2 = new StringLocalizer<DocumentService>(factory);
                DocumentService doc = new DocumentService(context, logger2, localizer2, null, userInformationServiceMock.Object);

                ILogger<DocumentClassService> logger3 = loggerFactory.CreateLogger<DocumentClassService>();
                var localizer3 = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService doc_class = new DocumentClassService(context, logger3, localizer3, userInformationServiceMock.Object);

                DocumentClassDTO class_dto = new DocumentClassDTO();
                class_dto.Id = 1;
                class_dto.AddedDate = System.DateTime.Now;

                //   TODO: should be added to the original dto
                //class_dto.ModifiedDate = System.DateTime.Now;
                class_dto.DocumentClassName = "ClassA";
                doc_class.AddDocumentClass(class_dto);

                ILogger<MetaDataModelService> logger4 = loggerFactory.CreateLogger<MetaDataModelService>();
                var localizer4 = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(context, logger4, localizer4, userInformationServiceMock.Object);

                MetaDataModelDTO meta_dto = new MetaDataModelDTO();
                meta_dto.MetaDataModelName = "ModelA";
                meta_dto.DocumentClassId = 1;

                MetaDataAttributeDTO attr_dto = new MetaDataAttributeDTO();
                attr_dto.MetaDataAttributeName = "age";
                attr_dto.IsRequired = true;
                attr_dto.DataTypeID = 5;

                meta_dto.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                meta_dto.MetaDataAttributes.Add(attr_dto);
                // meta_dto.AggregateMetaDataModelsParts = new List<AggregateMetaDataModelDTO>();
                meta.AddMetaDataModel(meta_dto);

                DocumentPostDTO documentDto = new DocumentPostDTO();
                documentDto.MetadataModelId = 1;

                ValueDTO int_dto = new ValueDTO();
                int_dto.AttributeId = 1;
                int_dto.Value = 18;
                documentDto.DocumentVersion = new DocumentVersionPostDTO();
                documentDto.DocumentVersion.Values = new List<ValueDTO>();
                documentDto.DocumentVersion.Values.Add(int_dto);
                documentDto.DocumentVersion.VersionMessage = "test";
                documentDto.DocumentVersion.DocumentScans = new List<DocumentScanDTO>();
                documentDto.DocumentVersion.DocumentScans.Add(new DocumentScanDTO
                {
                    Name = "DocScan",
                    ContentType = "PNG",
                    ScanImage = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 }
                });
                doc.AddDocument(documentDto);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);
                DocumentSetPostDTO dto2 = new DocumentSetPostDTO();
                dto2.Name = "SetTwo";
                doc_set.AddDocumentSet(dto2);
                List<int> docs = new List<int> { 1 };

                doc_set.AddDocumentsToDocumentSet(docs, 1);
                doc_set.AddDocumentsToDocumentSet(docs, 2);
                //list before
                List<DocumentSetGetDTO> sets = doc_set.GetAllDocumentSets().ToList();
                Assert.Equal(2, sets.Count());
                Assert.Equal(1, sets[0].Id);
                Assert.Equal(2, sets[1].Id);
                DocumentSetGetDTO setTwo = doc_set.GetDocumentSetByID(2);
                Assert.Single(setTwo.AttachedDocuments);
                //Act
                doc_set.RemoveDocumentFromDocumentSet(1, 2);
            }
                //Assert
                using (var context = new DocumentDBContext(options))
                {
                    var loggerFactory = LoggerFactory.Create(builder =>
                    {
                        builder
                            .AddFilter("Microsoft", LogLevel.Warning)
                            .AddFilter("System", LogLevel.Warning)
                            .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                    });
                    ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                    var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                    var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                    var localizer = new StringLocalizer<DocumentSetService>(factory);
                    DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, null);
                    //list after
                    List<DocumentSetGetDTO> sets = doc_set.GetAllDocumentSets().ToList();
                    Assert.Equal(2, sets.Count());
                    DocumentSetGetDTO set_two = doc_set.GetDocumentSetByID(2);
                    Assert.Empty(set_two.AttachedDocuments);
                }
            }
            finally
            {
                connection.Close();
            }
        }
        [Fact]
        public void RemoveDocumentFromDocumentSetTestNotFoundException()
        {
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                //Arrange
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                .UseSqlite(connection)
                .Options;

                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                    var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                    ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                    var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                    var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                    var localizer = new StringLocalizer<DocumentSetService>(factory);
                    var userInformationServiceMock = new Mock<IUserInformationService>();
                    userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);
                    DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                    ILogger<DocumentService> logger2 = loggerFactory.CreateLogger<DocumentService>();
                    var localizer2 = new StringLocalizer<DocumentService>(factory);
                    DocumentService doc = new DocumentService(context, logger2, localizer2, null, userInformationServiceMock.Object);

                    ILogger<DocumentClassService> logger3 = loggerFactory.CreateLogger<DocumentClassService>();
                    var localizer3 = new StringLocalizer<DocumentClassService>(factory);
                    DocumentClassService doc_class = new DocumentClassService(context, logger3, localizer3, userInformationServiceMock.Object);

                    DocumentClassDTO class_dto = new DocumentClassDTO();
                    class_dto.Id = 1;
                    class_dto.AddedDate = System.DateTime.Now;
                    //class_dto.ModifiedDate = System.DateTime.Now;
                    class_dto.DocumentClassName = "ClassA";
                    doc_class.AddDocumentClass(class_dto);

                    ILogger<MetaDataModelService> logger4 = loggerFactory.CreateLogger<MetaDataModelService>();
                    var localizer4 = new StringLocalizer<MetaDataModelService>(factory);
                    MetaDataModelService meta = new MetaDataModelService(context, logger4, localizer4, userInformationServiceMock.Object);

                    MetaDataModelDTO meta_dto = new MetaDataModelDTO();
                    meta_dto.MetaDataModelName = "ModelA";
                    meta_dto.DocumentClassId = 1;

                    MetaDataAttributeDTO attr_dto = new MetaDataAttributeDTO();
                    attr_dto.MetaDataAttributeName = "age";
                    attr_dto.IsRequired = true;
                    attr_dto.DataTypeID = 5;

                    meta_dto.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                    meta_dto.MetaDataAttributes.Add(attr_dto);
                    //meta_dto.AggregateMetaDataModelsParts = new List<AggregateMetaDataModelDTO>();
                    meta.AddMetaDataModel(meta_dto);

                    DocumentPostDTO documentDto = new DocumentPostDTO();
                    documentDto.MetadataModelId = 1;


                    ValueDTO int_dto = new ValueDTO();
                    int_dto.AttributeId = 1;
                    int_dto.Value = 18;
                    documentDto.DocumentVersion = new DocumentVersionPostDTO();
                    documentDto.DocumentVersion.Values = new List<ValueDTO>();
                    documentDto.DocumentVersion.Values.Add(int_dto);
                    documentDto.DocumentVersion.VersionMessage = "test";
                    documentDto.DocumentVersion.DocumentScans = new List<DocumentScanDTO>();
                    documentDto.DocumentVersion.DocumentScans.Add(new DocumentScanDTO
                    {
                        Name = "DocScan",
                        ContentType = "PNG",
                        ScanImage = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 }
                    });

                    doc.AddDocument(documentDto);

                    DocumentSetPostDTO dto = new DocumentSetPostDTO();
                    dto.Name = "SetOne";
                    doc_set.AddDocumentSet(dto);
                    DocumentSetPostDTO dto2 = new DocumentSetPostDTO();
                    dto2.Name = "SetTwo";
                    doc_set.AddDocumentSet(dto2);
                    List<int> docs = new List<int> { 1 };

                    doc_set.AddDocumentsToDocumentSet(docs, 2);
                    //list before
                    List<DocumentSetGetDTO> sets = doc_set.GetAllDocumentSets().ToList();
                    Assert.Equal(2, sets.Count());
                    Assert.Equal(1, sets[0].Id);
                    Assert.Equal(2, sets[1].Id);
                    DocumentSetGetDTO setOne = doc_set.GetDocumentSetByID(1);
                    Assert.Empty(setOne.AttachedDocuments);
                    DocumentSetGetDTO setTwo = doc_set.GetDocumentSetByID(2);
                    Assert.Single(setTwo.AttachedDocuments);
                    //Act+Assert
                    Assert.Throws<ValidatorException>(() => doc_set.RemoveDocumentFromDocumentSet(1, 1));
                }
            }
            finally
            {
                connection.Close();
            }

        }

        [Fact]
        public void AddRecursiveDocumentSetTest()
        {
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                //Arrange
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                .UseSqlite(connection)
                .Options;

                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                    var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                ILogger<DocumentService> logger2 = loggerFactory.CreateLogger<DocumentService>();
                var localizer2 = new StringLocalizer<DocumentService>(factory);
                DocumentService doc = new DocumentService(context, logger2, localizer2, null, userInformationServiceMock.Object);

                ILogger<DocumentClassService> logger3 = loggerFactory.CreateLogger<DocumentClassService>();
                var localizer3 = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService doc_class = new DocumentClassService(context, logger3, localizer3, userInformationServiceMock.Object);

                DocumentClassDTO class_dto = new DocumentClassDTO();
                class_dto.Id = 1;
                class_dto.AddedDate = System.DateTime.Now;
                //class_dto.ModifiedDate = System.DateTime.Now;
                class_dto.DocumentClassName = "ClassA";
                doc_class.AddDocumentClass(class_dto);

                ILogger<MetaDataModelService> logger4 = loggerFactory.CreateLogger<MetaDataModelService>();
                var localizer4 = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(context, logger4, localizer4, userInformationServiceMock.Object);

                MetaDataModelDTO meta_dto = new MetaDataModelDTO();
                meta_dto.MetaDataModelName = "ModelA";
                meta_dto.DocumentClassId = 1;

                MetaDataAttributeDTO attr_dto = new MetaDataAttributeDTO();
                attr_dto.MetaDataAttributeName = "age";
                attr_dto.IsRequired = true;
                attr_dto.DataTypeID = 5;
                meta_dto.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                meta_dto.MetaDataAttributes.Add(attr_dto);
                //meta_dto.AggregateMetaDataModelsParts = new List<AggregateMetaDataModelDTO>();
                meta.AddMetaDataModel(meta_dto);

                DocumentPostDTO documentDto = new DocumentPostDTO();
                documentDto.MetadataModelId = 1;
                ValueDTO int_dto = new ValueDTO();
                int_dto.AttributeId = 1;
                int_dto.Value = 18;
                documentDto.DocumentVersion = new DocumentVersionPostDTO();
                documentDto.DocumentVersion.Values = new List<ValueDTO>();
                documentDto.DocumentVersion.Values.Add(int_dto);
                documentDto.DocumentVersion.VersionMessage = "test";
                documentDto.DocumentVersion.DocumentScans = new List<DocumentScanDTO>();
                documentDto.DocumentVersion.DocumentScans.Add(new DocumentScanDTO
                {
                    Name = "DocScan",
                    ContentType = "PNG",
                    ScanImage = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 }
                });


                doc.AddDocument(documentDto);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);
                DocumentSetPostDTO dto2 = new DocumentSetPostDTO();
                dto2.Name = "SetTwo";
                doc_set.AddDocumentSet(dto2);
                DocumentSetGetDTO setOne = doc_set.GetDocumentSetByID(1);
                Assert.Empty(setOne.ChildrenDocumentSets);

                //Act
                doc_set.AddRecursiveDocumentSet(1, 2);
            }
                //Assert
                using (var context = new DocumentDBContext(options))
                {
                    var loggerFactory = LoggerFactory.Create(builder =>
                    {
                        builder
                            .AddFilter("Microsoft", LogLevel.Warning)
                            .AddFilter("System", LogLevel.Warning)
                            .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                    });
                    ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                    var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                    var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                    var localizer = new StringLocalizer<DocumentSetService>(factory);
                    DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, null);
                    //list after
                    List<DocumentSetGetDTO> sets = doc_set.GetAllDocumentSets().ToList();
                    Assert.Equal(2, sets.Count());
                    Assert.Equal(1, sets[0].Id);
                    Assert.Equal(2, sets[1].Id);
                    DocumentSetGetDTO setOne = doc_set.GetDocumentSetByID(1);
                    Assert.Single(setOne.ChildrenDocumentSets);
                    Assert.Equal(2, setOne.ChildrenDocumentSets[0].Id);
                }
            }
            finally
            {
                connection.Close();
            }
        }
        [Fact]
        public void AddRecursiveDocumentSetTestAlreadyAddedException()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
                        .UseInMemoryDatabase(databaseName: "add_recursive_dset_database2")
                        .ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning))
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
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                ILogger<DocumentService> logger2 = loggerFactory.CreateLogger<DocumentService>();
                var localizer2 = new StringLocalizer<DocumentService>(factory);
                DocumentService doc = new DocumentService(context, logger2, localizer2, null, userInformationServiceMock.Object);

                ILogger<DocumentClassService> logger3 = loggerFactory.CreateLogger<DocumentClassService>();
                var localizer3 = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService doc_class = new DocumentClassService(context, logger3, localizer3, userInformationServiceMock.Object);

                DocumentClassDTO class_dto = new DocumentClassDTO();
                class_dto.Id = 1;
                class_dto.AddedDate = System.DateTime.Now;
                //class_dto.ModifiedDate = System.DateTime.Now;
                class_dto.DocumentClassName = "ClassA";
                doc_class.AddDocumentClass(class_dto);

                List<DataType> dtList = new List<DataType>();
                DataType dt = new DataType();
                dt.DataTypeName = "bool";
                dtList.Add(dt);
                DataType dt2 = new DataType();
                dt2.DataTypeName = "date";
                dtList.Add(dt2);
                DataType dt3 = new DataType();
                dt3.DataTypeName = "decimal";
                dtList.Add(dt3);
                DataType dt4 = new DataType();
                dt4.DataTypeName = "double";
                dtList.Add(dt4);
                DataType dt5 = new DataType();
                dt5.DataTypeName = "int";
                dtList.Add(dt5);
                DataType dt6 = new DataType();
                dt6.DataTypeName = "string";
                dtList.Add(dt6);

                context.DataType.AddRange(dtList);
                context.SaveChanges();

                ILogger<MetaDataModelService> logger4 = loggerFactory.CreateLogger<MetaDataModelService>();
                var localizer4 = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(context, logger4, localizer4, userInformationServiceMock.Object);

                MetaDataModelDTO meta_dto = new MetaDataModelDTO();
                meta_dto.MetaDataModelName = "ModelA";
                meta_dto.DocumentClassId = 1;

                MetaDataAttributeDTO attr_dto = new MetaDataAttributeDTO();
                attr_dto.MetaDataAttributeName = "age";
                attr_dto.IsRequired = true;
                attr_dto.DataTypeID = 5;
                meta_dto.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                meta_dto.MetaDataAttributes.Add(attr_dto);
                //  meta_dto.AggregateMetaDataModelsParts = new List<AggregateMetaDataModelDTO>();
                meta.AddMetaDataModel(meta_dto);

                DocumentPostDTO documentDto = new DocumentPostDTO();
                documentDto.MetadataModelId = 1;
                ValueDTO int_dto = new ValueDTO();
                int_dto.AttributeId = 1;
                int_dto.Value = 18;
                documentDto.DocumentVersion = new DocumentVersionPostDTO();
                documentDto.DocumentVersion.Values = new List<ValueDTO>();
                documentDto.DocumentVersion.Values.Add(int_dto);
                documentDto.DocumentVersion.DocumentScans = new List<DocumentScanDTO>();
                documentDto.DocumentVersion.DocumentScans.Add(new DocumentScanDTO
                {
                    Name = "DocScan",
                    ContentType = "PNG",
                    ScanImage = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 }
                });


                doc.AddDocument(documentDto);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);
                DocumentSetPostDTO dto2 = new DocumentSetPostDTO();
                dto2.Name = "SetTwo";
                doc_set.AddDocumentSet(dto2);
                DocumentSetGetDTO setOne = doc_set.GetDocumentSetByID(1);
                Assert.Empty(setOne.ChildrenDocumentSets);
                doc_set.AddRecursiveDocumentSet(1, 2);

                //Act
                Assert.Throws<ValidatorException>(() => doc_set.AddRecursiveDocumentSet(1, 2));
            }
        }
        [Fact]
        public void AddRecursiveDocumentSetTestParentSetNotFoundException()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
                        .UseInMemoryDatabase(databaseName: "add_recursive_dset_database3")
                        .ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning))
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
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                ILogger<DocumentService> logger2 = loggerFactory.CreateLogger<DocumentService>();
                var localizer2 = new StringLocalizer<DocumentService>(factory);
                DocumentService doc = new DocumentService(context, logger2, localizer2, null, userInformationServiceMock.Object);

                ILogger<DocumentClassService> logger3 = loggerFactory.CreateLogger<DocumentClassService>();
                var localizer3 = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService doc_class = new DocumentClassService(context, logger3, localizer3, userInformationServiceMock.Object);

                DocumentClassDTO class_dto = new DocumentClassDTO();
                class_dto.Id = 1;
                class_dto.AddedDate = System.DateTime.Now;
                //class_dto.ModifiedDate = System.DateTime.Now;
                class_dto.DocumentClassName = "ClassA";
                doc_class.AddDocumentClass(class_dto);

                List<DataType> dtList = new List<DataType>();
                DataType dt = new DataType();
                dt.DataTypeName = "bool";
                dtList.Add(dt);
                DataType dt2 = new DataType();
                dt2.DataTypeName = "date";
                dtList.Add(dt2);
                DataType dt3 = new DataType();
                dt3.DataTypeName = "decimal";
                dtList.Add(dt3);
                DataType dt4 = new DataType();
                dt4.DataTypeName = "double";
                dtList.Add(dt4);
                DataType dt5 = new DataType();
                dt5.DataTypeName = "int";
                dtList.Add(dt5);
                DataType dt6 = new DataType();
                dt6.DataTypeName = "string";
                dtList.Add(dt6);

                context.DataType.AddRange(dtList);
                context.SaveChanges();

                ILogger<MetaDataModelService> logger4 = loggerFactory.CreateLogger<MetaDataModelService>();
                var localizer4 = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(context, logger4, localizer4, userInformationServiceMock.Object);

                MetaDataModelDTO meta_dto = new MetaDataModelDTO();
                meta_dto.MetaDataModelName = "ModelA";
                meta_dto.DocumentClassId = 1;

                MetaDataAttributeDTO attr_dto = new MetaDataAttributeDTO();
                attr_dto.MetaDataAttributeName = "age";
                attr_dto.IsRequired = true;
                attr_dto.DataTypeID = 5;
                meta_dto.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                meta_dto.MetaDataAttributes.Add(attr_dto);
                //meta_dto.AggregateMetaDataModelsParts = new List<AggregateMetaDataModelDTO>();
                meta.AddMetaDataModel(meta_dto);

                DocumentPostDTO documentDto = new DocumentPostDTO();
                documentDto.MetadataModelId = 1;

                ValueDTO int_dto = new ValueDTO();
                int_dto.AttributeId = 1;
                int_dto.Value = 18;
                documentDto.DocumentVersion = new DocumentVersionPostDTO();
                documentDto.DocumentVersion.Values = new List<ValueDTO>();
                documentDto.DocumentVersion.Values.Add(int_dto);
                documentDto.DocumentVersion.DocumentScans = new List<DocumentScanDTO>();
                documentDto.DocumentVersion.DocumentScans.Add(new DocumentScanDTO
                {
                    Name = "DocScan",
                    ContentType = "PNG",
                    ScanImage = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 }
                });


                doc.AddDocument(documentDto);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);
                DocumentSetPostDTO dto2 = new DocumentSetPostDTO();
                dto2.Name = "SetTwo";
                doc_set.AddDocumentSet(dto2);
                DocumentSetGetDTO setOne = doc_set.GetDocumentSetByID(1);
                Assert.Empty(setOne.ChildrenDocumentSets);
                doc_set.AddRecursiveDocumentSet(1, 2);

                //Act
                Assert.Throws<ValidatorException>(() => doc_set.AddRecursiveDocumentSet(3, 2));
            }
        }
        [Fact]
        public void AddRecursiveDocumentSetTestChildSetNotFoundException()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
                        .UseInMemoryDatabase(databaseName: "add_recursive_dset_database4")
                        .ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning))
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
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);

                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);

                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                ILogger<DocumentService> logger2 = loggerFactory.CreateLogger<DocumentService>();
                var localizer2 = new StringLocalizer<DocumentService>(factory);
                DocumentService doc = new DocumentService(context, logger2, localizer2, null, userInformationServiceMock.Object);

                ILogger<DocumentClassService> logger3 = loggerFactory.CreateLogger<DocumentClassService>();
                var localizer3 = new StringLocalizer<DocumentClassService>(factory);
                DocumentClassService doc_class = new DocumentClassService(context, logger3, localizer3, userInformationServiceMock.Object);

                DocumentClassDTO class_dto = new DocumentClassDTO();
                class_dto.Id = 1;
                class_dto.AddedDate = System.DateTime.Now;
                //class_dto.ModifiedDate = System.DateTime.Now;
                class_dto.DocumentClassName = "ClassA";
                doc_class.AddDocumentClass(class_dto);

                List<DataType> dtList = new List<DataType>();
                DataType dt = new DataType();
                dt.DataTypeName = "bool";
                dtList.Add(dt);
                DataType dt2 = new DataType();
                dt2.DataTypeName = "date";
                dtList.Add(dt2);
                DataType dt3 = new DataType();
                dt3.DataTypeName = "decimal";
                dtList.Add(dt3);
                DataType dt4 = new DataType();
                dt4.DataTypeName = "double";
                dtList.Add(dt4);
                DataType dt5 = new DataType();
                dt5.DataTypeName = "int";
                dtList.Add(dt5);
                DataType dt6 = new DataType();
                dt6.DataTypeName = "string";
                dtList.Add(dt6);

                context.DataType.AddRange(dtList);
                context.SaveChanges();

                ILogger<MetaDataModelService> logger4 = loggerFactory.CreateLogger<MetaDataModelService>();
                var localizer4 = new StringLocalizer<MetaDataModelService>(factory);
                MetaDataModelService meta = new MetaDataModelService(context, logger4, localizer4, userInformationServiceMock.Object);

                MetaDataModelDTO meta_dto = new MetaDataModelDTO();
                meta_dto.MetaDataModelName = "ModelA";
                meta_dto.DocumentClassId = 1;

                MetaDataAttributeDTO attr_dto = new MetaDataAttributeDTO();
                attr_dto.MetaDataAttributeName = "age";
                attr_dto.IsRequired = true;
                attr_dto.DataTypeID = 5;
                meta_dto.MetaDataAttributes = new List<MetaDataAttributeDTO>();
                meta_dto.MetaDataAttributes.Add(attr_dto);
                //  meta_dto.AggregateMetaDataModelsParts = new List<AggregateMetaDataModelDTO>();
                meta.AddMetaDataModel(meta_dto);

                DocumentPostDTO documentDto = new DocumentPostDTO();
                documentDto.MetadataModelId = 1;

                ValueDTO int_dto = new ValueDTO();
                int_dto.AttributeId = 1;
                int_dto.Value = 18;
                documentDto.DocumentVersion = new DocumentVersionPostDTO();
                documentDto.DocumentVersion.Values = new List<ValueDTO>();
                documentDto.DocumentVersion.Values.Add(int_dto);
                documentDto.DocumentVersion.DocumentScans = new List<DocumentScanDTO>();
                documentDto.DocumentVersion.DocumentScans.Add(new DocumentScanDTO
                {
                    Name = "DocScan",
                    ContentType = "PNG",
                    ScanImage = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 }
                });

                doc.AddDocument(documentDto);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);
                DocumentSetPostDTO dto2 = new DocumentSetPostDTO();
                dto2.Name = "SetTwo";
                doc_set.AddDocumentSet(dto2);
                DocumentSetGetDTO setOne = doc_set.GetDocumentSetByID(1);
                Assert.Empty(setOne.ChildrenDocumentSets);
                doc_set.AddRecursiveDocumentSet(1, 2);

                //Act
                Assert.Throws<ValidatorException>(() => doc_set.AddRecursiveDocumentSet(1, 3));
            }
        }
        [Fact]
        public void RemoveDocumentSetFromDocumentSetTest()
        {
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                //Arrange
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                .UseSqlite(connection)
                .Options;

                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                    var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);
                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);
                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);

                DocumentSetPostDTO dto2 = new DocumentSetPostDTO();
                dto2.Name = "SetTwo";
                doc_set.AddDocumentSet(dto2);

                doc_set.AddRecursiveDocumentSet(1, 2);

                DocumentSetGetDTO setOne = doc_set.GetDocumentSetByID(1);
                Assert.Single(setOne.ChildrenDocumentSets);
                Assert.Equal(2, setOne.ChildrenDocumentSets[0].Id);

                //Act
                doc_set.RemoveDocumentSetFromDocumentSet(1, 2);
            }
                //Assert
                using (var context = new DocumentDBContext(options))
                {
                    var loggerFactory = LoggerFactory.Create(builder =>
                    {
                        builder
                            .AddFilter("Microsoft", LogLevel.Warning)
                            .AddFilter("System", LogLevel.Warning)
                            .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                    });
                    ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                    var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                    var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                    var localizer = new StringLocalizer<DocumentSetService>(factory);
                    DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, null);

                    //list after
                    List<DocumentSetGetDTO> sets = doc_set.GetAllDocumentSets().ToList();
                    Assert.Equal(2, sets.Count());
                    DocumentSetGetDTO setOne = doc_set.GetDocumentSetByID(1);
                    Assert.Empty(setOne.ChildrenDocumentSets);
                }
            }
            finally
            {
                connection.Close();
            }
        }
        [Fact]
        public void RemoveDocumentSetFromDocumentSetTestSetDoesnotContainSetException()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
                        .UseInMemoryDatabase(databaseName: "remove_dset_from_dset_database2")
                        .ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning))
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
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);
                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);
                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);

                DocumentSetPostDTO dto2 = new DocumentSetPostDTO();
                dto2.Name = "SetTwo";
                doc_set.AddDocumentSet(dto2);

                DocumentSetGetDTO setOne = doc_set.GetDocumentSetByID(1);
                Assert.Empty(setOne.ChildrenDocumentSets);

                //Act
                Assert.Throws<ValidatorException>(() => doc_set.RemoveDocumentSetFromDocumentSet(1, 2));
            }
        }
        [Fact]
        public void UpdateName()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
                        .UseInMemoryDatabase(databaseName: "remove_dset_from_dset_database3")
                        .ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning))
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
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);
                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);
                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);

                DocumentSetGetDTO getDTO = doc_set.GetDocumentSetByID(1);
                DocumentSet st = context.DocumentSet.Single(e => e.ID == getDTO.Id);

                DocumentSetPostDTO updatedDto = new DocumentSetPostDTO();
                updatedDto.Id = st.ID;
                updatedDto.Name = "mySet";

                //Act
                doc_set.UpdateDocumentSetName(updatedDto);
                //Assert
                DocumentSetGetDTO newSet = doc_set.GetDocumentSetByID(1);
                Assert.Equal("mySet", newSet.Name);
            }
        }
        [Fact]
        public void UpdateNameSetNotFoundException()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
                        .UseInMemoryDatabase(databaseName: "remove_dset_from_dset_database4")
                        .ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning))
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
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);
                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);
                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);

                DocumentSetPostDTO dto2 = new DocumentSetPostDTO();
                dto2.Id = 3;

                //Act+Assert
                Assert.Throws<ValidatorException>(() => doc_set.UpdateDocumentSetName(dto2));
            }
        }
        [Fact]
        public void UpdateNameSetNameExistedBeforeException()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
                        .UseInMemoryDatabase(databaseName: "remove_dset_from_dset_database5")
                        .ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning))
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
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);
                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);
                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);
                DocumentSetPostDTO dto3 = new DocumentSetPostDTO();
                dto3.Name = "Set2";
                doc_set.AddDocumentSet(dto3);

                DocumentSetGetDTO dto2 = doc_set.GetDocumentSetByID(1);
                DocumentSet st = context.DocumentSet.Single(e => e.ID == dto2.Id);

                DocumentSetPostDTO updatedDto = new DocumentSetPostDTO();
                updatedDto.Id = st.ID;
                updatedDto.Name = "Set2";

                //Act+Assert
                Assert.Throws<ValidatorException>(() => doc_set.UpdateDocumentSetName(updatedDto));
            }
        }
        [Fact]
        public void UpdateNameSetNameEmptyException()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
                        .UseInMemoryDatabase(databaseName: "remove_dset_from_dset_database6")
                        .ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning))
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
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);
                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);
                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);
                DocumentSetPostDTO dto3 = new DocumentSetPostDTO();
                dto3.Name = "Set2";
                doc_set.AddDocumentSet(dto3);

                DocumentSetPostDTO updatedDto = new DocumentSetPostDTO();

                //Act+Assert
                Assert.Throws<ValidatorException>(() => doc_set.UpdateDocumentSetName(updatedDto));
            }
        }
        [Fact]
        public void GetAllSetsExcludingSetsOfParent()
        {
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            try
            {
                //Arrange
                var options = new DbContextOptionsBuilder<DocumentDBContext>()
                .UseSqlite(connection)
                .Options;

                using (var context = new DocumentDBContext(options))
                {
                    context.Database.EnsureCreated();
                    var loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder
                        .AddFilter("Microsoft", LogLevel.Warning)
                        .AddFilter("System", LogLevel.Warning)
                        .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug);
                });
                    ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                    var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                    var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                    var localizer = new StringLocalizer<DocumentSetService>(factory);
                    var userInformationServiceMock = new Mock<IUserInformationService>();
                    userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);
                    DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                    DocumentSetPostDTO dto = new DocumentSetPostDTO();
                    dto.Name = "SetOne";
                    doc_set.AddDocumentSet(dto);
                    DocumentSetPostDTO dto2 = new DocumentSetPostDTO();
                    dto2.Name = "Set2";
                    doc_set.AddDocumentSet(dto2);
                    DocumentSetPostDTO dto3 = new DocumentSetPostDTO();
                    dto3.Name = "Set3";
                    dto3.ParentDocumentSet = 2;
                    doc_set.AddDocumentSet(dto3);

                    //Act
                    List<DocumentSetGetDTO> list = doc_set.GetAllSetsExcludingSetsOfParent(3).ToList();
                    //Assert
                    Assert.Single(list);
                    Assert.Equal("SetOne", list[0].Name);
                }
            }
            finally
            {
                connection.Close();
            }
        }
        [Fact]
        public void GetAllSetsExcludingSetsOfParentThrowsNotFoundException()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<DocumentDBContext>()
                        .UseInMemoryDatabase(databaseName: "get_dsets_NotIN_dset_database2")
                        .ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning))
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
                ILogger<DocumentSetService> logger = loggerFactory.CreateLogger<DocumentSetService>();
                var opt = Options.Create(new LocalizationOptions());  // you should not need any params here if using a StringLocalizer<T>
                var factory = new ResourceManagerStringLocalizerFactory(opt, loggerFactory);
                var localizer = new StringLocalizer<DocumentSetService>(factory);
                var userInformationServiceMock = new Mock<IUserInformationService>();
                userInformationServiceMock.Setup(m => m.GetUserID()).Returns(1);
                DocumentSetService doc_set = new DocumentSetService(context, logger, localizer, userInformationServiceMock.Object);

                DocumentSetPostDTO dto = new DocumentSetPostDTO();
                dto.Name = "SetOne";
                doc_set.AddDocumentSet(dto);
                DocumentSetPostDTO dto2 = new DocumentSetPostDTO();
                dto2.Name = "Set2";
                doc_set.AddDocumentSet(dto2);
                DocumentSetPostDTO dto3 = new DocumentSetPostDTO();
                dto3.Name = "Set3";
                dto3.ParentDocumentSet = 2;
                doc_set.AddDocumentSet(dto3);

                //Act+Assert
                Assert.Throws<ValidatorException>(() => doc_set.GetAllSetsExcludingSetsOfParent(4));
            }
        }
    }
}
