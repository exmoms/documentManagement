using DM.Domain.Models;
using DM.Repository.Contexts;
using DM.Service.Services;
using DM.Service.ServiceModels.SerachModels;

using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Linq;

using Xunit;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using DM.Service.ServiceModels.DocumentDTO;
using Microsoft.AspNetCore.Http;
using Moq;
using System.IO;
using DM.Service.Utils;
using DM.Service.ServiceModels;

namespace DM.UnitTest.ServiceUT
{
    public class SearchServiceTest
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
            MetaDataAttribute attr3 = new MetaDataAttribute { ID = 4, MetaDataAttributeName = "salary", IsRequired = false, DataTypeID = 5 };  // int

            // Add the meta data model with children
            MetaDataModel mdl = new MetaDataModel();
            mdl.ID = 1;
            mdl.DocumentClassId = 1;
            mdl.MetaDataModelName = "MetaDataModel1";
            mdl.UserId = 1;
            mdl.MetaDataAttributes = new List<MetaDataAttribute>();
            mdl.MetaDataAttributes.Add(attr1);
            mdl.MetaDataAttributes.Add(attr2);
            mdl.MetaDataAttributes.Add(attr3);
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

        void AddThirdDefaultMetaDataModel(DocumentDBContext dbcontext)
        {
            // Define attributes
            MetaDataAttribute attr1 = new MetaDataAttribute { ID = 5, MetaDataAttributeName = "departnmentName", IsRequired = true, DataTypeID = 6 };  // string
            MetaDataAttribute attr2 = new MetaDataAttribute { ID = 6, MetaDataAttributeName = "numerOfEmployee", IsRequired = false, DataTypeID = 5 };  // int

            // Add the meta data model with children
            MetaDataModel mdl = new MetaDataModel();
            mdl.ID = 3;
            mdl.DocumentClassId = 2;
            mdl.MetaDataModelName = "MetaDataModel3";
            mdl.UserId = 1;
            mdl.MetaDataAttributes = new List<MetaDataAttribute>();
            mdl.MetaDataAttributes.Add(attr1);
            mdl.MetaDataAttributes.Add(attr2);
            dbcontext.Add(mdl);
            dbcontext.SaveChanges();
        }

        void AddFourthDefaultMetaDataModel(DocumentDBContext dbcontext)
        {
            // Define attributes
            MetaDataAttribute attr1 = new MetaDataAttribute { ID = 7, MetaDataAttributeName = "name", IsRequired = true, DataTypeID = 6 };  // string
            MetaDataAttribute attr2 = new MetaDataAttribute { ID = 8, MetaDataAttributeName = "last name", IsRequired = false, DataTypeID = 6 };  // string
            MetaDataAttribute attr3 = new MetaDataAttribute { ID = 9, MetaDataAttributeName = "desc", IsRequired = false, DataTypeID = 6 };  // string

            // Add the meta data model with children
            MetaDataModel mdl = new MetaDataModel();
            mdl.ID = 4;
            mdl.DocumentClassId = 1;
            mdl.MetaDataModelName = "MetaDataModel4";
            mdl.UserId = 1;
            mdl.MetaDataAttributes = new List<MetaDataAttribute>();
            mdl.MetaDataAttributes.Add(attr1);
            mdl.MetaDataAttributes.Add(attr2);
            mdl.MetaDataAttributes.Add(attr3);
            dbcontext.Add(mdl);
            dbcontext.SaveChanges();
        }

        void AddFirstDefaultDocumentVersionOfFirstMetaModel(DocumentDBContext dbcontext)
        {
            // Define values
            StringValue stringValue = new StringValue { MetaDataAttributeId = 1, MinDocumentVersionId = 1, Value = "Jack is going to play football" , NormalizedValue = "Jack is going to play football" };
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

        void AddSecondDefaultDocumentVersionOfFirstMetaModel(DocumentDBContext dbcontext)
        {
            // Define values
            StringValue stringValue2 = new StringValue { MetaDataAttributeId = 1, MinDocumentVersionId = 6, Value = "Jack3" };
            IntValue intValue2 = new IntValue { MetaDataAttributeId = 2, MinDocumentVersionId = 5, Value = 28 };
            IntValue intValue22 = new IntValue { MetaDataAttributeId = 4, MinDocumentVersionId = 5, Value = 25 };

            // Add document version
            DocumentVersion documentVersion2 = new DocumentVersion();
            documentVersion2.ID = 6;
            documentVersion2.DocumentId = 5;
            documentVersion2.UserId = 1;
            documentVersion2.VersionMessage = "VersionMessage of document version 6 of document 5";
            documentVersion2.StringValues = new List<StringValue>();
            documentVersion2.StringValues.Add(stringValue2);
            documentVersion2.IntValues = new List<IntValue>();
            documentVersion2.IntValues.Add(intValue2);
            documentVersion2.IntValues.Add(intValue22);
            dbcontext.Add(documentVersion2);
            dbcontext.SaveChanges();
        }
        void AddFirstArabicDefaultDocumentVersionOfFirstMetaModel(DocumentDBContext dbcontext)
        {
            string normalizedValue1 = ArabicNormalizer.Normalize("احمد");
            string normalizedValue2 = ArabicNormalizer.Normalize("لؤي أنا نفسُ");
            string normalizedValue3 = ArabicNormalizer.Normalize("لؤلؤة ساحرة فيّ البحر هادئ قائلاً");
            // Define values
            StringValue stringValue = new StringValue { MetaDataAttributeId = 7, MinDocumentVersionId = 6, Value = "احمد" ,NormalizedValue = normalizedValue1};
            StringValue stringValue2 = new StringValue { MetaDataAttributeId = 8, MinDocumentVersionId = 6, Value = "لؤي أنا نفسُ",NormalizedValue = normalizedValue2 };
            StringValue stringValue3 = new StringValue { MetaDataAttributeId = 9, MinDocumentVersionId = 6, Value = "لؤلؤة ساحرة فيّ البحر هادئ قائلاً",NormalizedValue = normalizedValue3 };

            // Add document version
            DocumentVersion documentVersion = new DocumentVersion();
            documentVersion.ID = 6;
            documentVersion.DocumentId = 1;
            documentVersion.UserId = 1;
            documentVersion.VersionMessage = "VersionMessage of document version 1 of document 1";
            documentVersion.StringValues = new List<StringValue>();
            documentVersion.StringValues.Add(stringValue);
            documentVersion.StringValues.Add(stringValue2);
            documentVersion.StringValues.Add(stringValue3);
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

        void AddFirstDefaultDocumentVersionOfThirdMetaModel(DocumentDBContext dbcontext)
        {
            // Define values
            StringValue stringValue = new StringValue { MetaDataAttributeId = 4, MinDocumentVersionId = 1, Value = "Jacki" };
            IntValue intValue = new IntValue { MetaDataAttributeId = 5, MinDocumentVersionId = 1, Value = 25 };

            // Add document version
            DocumentVersion documentVersion = new DocumentVersion();
            documentVersion.ID = 5;
            documentVersion.DocumentId = 3;
            documentVersion.UserId = 1;
            documentVersion.VersionMessage = "VersionMessage of document version 1 of document 1";
            documentVersion.StringValues = new List<StringValue>();
            documentVersion.StringValues.Add(stringValue);
            documentVersion.IntValues = new List<IntValue>();
            documentVersion.IntValues.Add(intValue);
            dbcontext.Add(documentVersion);
        }
        void UpdateLatestVersionId(DocumentDBContext dbcontext, string documentName, int newLatestVersion)
        {
            var doc = dbcontext.Set<Document>().Where(s => s.Name == documentName).Single();
            doc.LatestVersionId = newLatestVersion;
            dbcontext.Update(doc);
            dbcontext.SaveChanges();
        }

        [Fact]
        public void TestSearchForDocumentsByValuesFunctionArabic()
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
                AddFourthDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "المستند القيّم جداً", MetaDataModelId = 4 });
                dbContext.Add(new Document { ID = 2, Name = "سما يسمو مجدي يهوى", MetaDataModelId = 4 });
                dbContext.Add(new Document { ID = 3, Name = "document name 3", MetaDataModelId = 2, DeletedDate = DateTime.Now }); // will not present in the getter
                dbContext.Add(new Document { ID = 4, Name = "document name 4", MetaDataModelId = 2, IsArchived = true }); // will not present in the getter
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstArabicDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "المستند القيّم جداً", 6);

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                // 1.
                List<ValueSearch> values = new List<ValueSearch>();
                values.Add(new ValueSearch { AttributeId = 8, MinValue = "لؤي", TypeId = 6 });
                ValuesSearchFilter f = new ValuesSearchFilter()
                {
                    Values = values
                };
                // 2.
                List<ValueSearch> values2 = new List<ValueSearch>();
                values2.Add(new ValueSearch { AttributeId = 8, MinValue = "لوى", TypeId = 6 });
                ValuesSearchFilter f2 = new ValuesSearchFilter()
                {
                    Values = values2
                };
                //3.
                List<ValueSearch> values3 = new List<ValueSearch>();
                values3.Add(new ValueSearch { AttributeId = 8, MinValue = "لو", TypeId = 6 });
                ValuesSearchFilter f3 = new ValuesSearchFilter()
                {
                    Values = values3
                };
                //4.
                List<ValueSearch> values4 = new List<ValueSearch>();
                values4.Add(new ValueSearch { AttributeId = 8, MinValue = "لؤ", TypeId = 6 });
                ValuesSearchFilter f4 = new ValuesSearchFilter()
                {
                    Values = values4
                };
                //5.
                List<ValueSearch> values5 = new List<ValueSearch>();
                values5.Add(new ValueSearch { AttributeId = 8, MinValue = "جداً", TypeId = 6 });
                ValuesSearchFilter f5 = new ValuesSearchFilter()
                {
                    Values = values5
                };

                //Act
                List<SearchResult> searchResult = ss.SearchForDocumentsByValues(f);
                List<SearchResult> searchResult2 = ss.SearchForDocumentsByValues(f2);
                List<SearchResult> searchResult3 = ss.SearchForDocumentsByValues(f3);
                List<SearchResult> searchResult4 = ss.SearchForDocumentsByValues(f4);
                List<SearchResult> searchResult5 = ss.SearchForDocumentsByValues(f5);

                //Assert
                //1.
                Assert.Single(searchResult);
                // first result
                SearchResult res1 = searchResult.ElementAt(0);
                Assert.Equal("المستند القيّم جداً", res1.DocumentName);
                Assert.Equal(1, res1.DocumentId);
                Assert.Equal(6, res1.LatestVersion);
                Assert.Single(res1.Values);
                object valuesObject1 = res1.Values.ElementAt(0);
                var nameProperty1 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("last name", nameProperty1.GetValue(valuesObject1, null));
                var nameProperty2 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal("لؤي أنا نفسُ", nameProperty2.GetValue(valuesObject1, null));

                // 2.
                Assert.Single(searchResult2);
                // first result
                res1 = searchResult2.ElementAt(0);
                Assert.Equal("المستند القيّم جداً", res1.DocumentName);
                Assert.Equal(1, res1.DocumentId);
                Assert.Equal(6, res1.LatestVersion);
                Assert.Single(res1.Values);
                valuesObject1 = res1.Values.ElementAt(0);
                nameProperty1 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("last name", nameProperty1.GetValue(valuesObject1, null));
                nameProperty2 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal("لؤي أنا نفسُ", nameProperty2.GetValue(valuesObject1, null));

                //3.
                Assert.Single(searchResult3);
                // first result
                res1 = searchResult3.ElementAt(0);
                Assert.Equal("المستند القيّم جداً", res1.DocumentName);
                Assert.Equal(1, res1.DocumentId);
                Assert.Equal(6, res1.LatestVersion);
                Assert.Single(res1.Values);
                valuesObject1 = res1.Values.ElementAt(0);
                nameProperty1 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("last name", nameProperty1.GetValue(valuesObject1, null));
                nameProperty2 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal("لؤي أنا نفسُ", nameProperty2.GetValue(valuesObject1, null));

                //4.
                Assert.Single(searchResult4);
                // first result
                res1 = searchResult4.ElementAt(0);
                Assert.Equal("المستند القيّم جداً", res1.DocumentName);
                Assert.Equal(1, res1.DocumentId);
                Assert.Equal(6, res1.LatestVersion);
                Assert.Single(res1.Values);
                valuesObject1 = res1.Values.ElementAt(0);
                nameProperty1 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("last name", nameProperty1.GetValue(valuesObject1, null));
                nameProperty2 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal("لؤي أنا نفسُ", nameProperty2.GetValue(valuesObject1, null));

                //5.
                Assert.Empty(searchResult5);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByValuesFunction()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = true });
                dbContext.SaveChanges();
                dbContext.Add(new Attachment { CompoundModelID = 1, DocumentId = 1, Name = "photo attachment" });
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                List<ValueSearch> values = new List<ValueSearch>();
                ValueSearch value = new ValueSearch { AttributeId = 2, MinValue = 23, MaxValue = 29, TypeId = 5 };
                values.Add(value);

                ValuesSearchFilter f = new ValuesSearchFilter()
                {
                    Values = values
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByValues(f);

                //Assert
                Assert.Equal(2, result.Count());

                // first result
                SearchResult res1 = result.ElementAt(0);
                Assert.Equal("document name 1", res1.DocumentName);
                Assert.Equal(1, res1.DocumentId);
                Assert.Equal(1, res1.LatestVersion);
                Assert.Single(res1.Values);
                object valuesObject1 = res1.Values.ElementAt(0);
                var nameProperty1 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("age", nameProperty1.GetValue(valuesObject1, null));
                var nameProperty2 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal(25, nameProperty2.GetValue(valuesObject1, null));

                // second result
                SearchResult res2 = result.ElementAt(1);
                Assert.Equal("document name 5", res2.DocumentName);
                Assert.Equal(5, res2.DocumentId);
                Assert.Equal(6, res2.LatestVersion);
                Assert.Single(res2.Values);
                object valuesObject2 = res2.Values.ElementAt(0);
                var nameProperty21 = valuesObject2.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("age", nameProperty21.GetValue(valuesObject2, null));
                var nameProperty22 = valuesObject2.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal(28, nameProperty22.GetValue(valuesObject2, null));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByValuesFunctionValueExistedInOldVersion()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 2 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                // update version of a document
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
                valueDTO2.AttributeId = 2;
                valueDTO2.Value = 11;
                valueDTO2.TypeId = 5;

                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "any thing";
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO2);

                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);
                documentVersionDTO.AddScans(images);

                doc.UpdateVersion(documentVersionDTO, false);


                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                List<ValueSearch> values = new List<ValueSearch>();
                ValueSearch value = new ValueSearch { AttributeId = 2, MinValue = 23, MaxValue = 29, TypeId = 5 };
                values.Add(value);

                ValuesSearchFilter filter = new ValuesSearchFilter()
                {
                    Values = values
                };

                //Act
                var result = ss.SearchForDocumentsByValues(filter);

                //Assert    
                Assert.Empty(result);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByValuesFunctionNullTypeId()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = true });
                dbContext.SaveChanges();
                dbContext.Add(new Attachment { CompoundModelID = 1, DocumentId = 1, Name = "photo attachment" });
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                List<ValueSearch> values = new List<ValueSearch>();
                ValueSearch value = new ValueSearch { AttributeId = 2, MinValue = 23, MaxValue = 29};
                values.Add(value);

                ValuesSearchFilter f = new ValuesSearchFilter()
                {
                    Values = values
                };

                //Assert && Act
                ValidatorException ex = Assert.Throws<ValidatorException>(() => ss.SearchForDocumentsByValues(f));
                Assert.Equal("Invalid data type.", ex.AttributeMessages.ElementAt(0));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByValuesFunctionNullAttributeId()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = true });
                dbContext.SaveChanges();
                dbContext.Add(new Attachment { CompoundModelID = 1, DocumentId = 1, Name = "photo attachment" });
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                List<ValueSearch> values = new List<ValueSearch>();
                ValueSearch value = new ValueSearch { MinValue = 23, MaxValue = 29, TypeId = 5 };
                values.Add(value);

                ValuesSearchFilter f = new ValuesSearchFilter()
                {
                    Values = values
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByValues(f);

                //Assert
                Assert.Empty(result);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByValuesFunction2()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = true });
                dbContext.SaveChanges();
                dbContext.Add(new Attachment { CompoundModelID = 1, DocumentId = 1, Name = "photo attachment" });
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                List<ValueSearch> values = new List<ValueSearch>();
                ValueSearch value = new ValueSearch { AttributeId = 2, MinValue = 25, MaxValue = 25, TypeId = 5 };
                values.Add(value);

                ValuesSearchFilter f = new ValuesSearchFilter()
                {
                    Values = values
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByValues(f);

                //Assert
                Assert.Single(result);

                // first result
                SearchResult res1 = result.ElementAt(0);
                Assert.Equal("document name 1", res1.DocumentName);
                Assert.Equal(1, res1.DocumentId);
                Assert.Equal(1, res1.LatestVersion);
                Assert.Single(res1.Values);
                object valuesObject1 = res1.Values.ElementAt(0);
                var nameProperty1 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("age", nameProperty1.GetValue(valuesObject1, null));
                var nameProperty2 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal(25, nameProperty2.GetValue(valuesObject1, null));

            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByValuesFunction3()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);

                // Define values
                StringValue stringValue2 = new StringValue { MetaDataAttributeId = 1, MinDocumentVersionId = 6, Value = "Jack3" };
                IntValue intValue2 = new IntValue { MetaDataAttributeId = 2, MinDocumentVersionId = 5, Value = 25 };
                IntValue intValue22 = new IntValue { MetaDataAttributeId = 4, MinDocumentVersionId = 5, Value = 27 };

                // Add document version
                DocumentVersion documentVersion2 = new DocumentVersion();
                documentVersion2.ID = 6;
                documentVersion2.DocumentId = 5;
                documentVersion2.UserId = 1;
                documentVersion2.VersionMessage = "VersionMessage of document version 1 of document 1";
                documentVersion2.StringValues = new List<StringValue>();
                documentVersion2.StringValues.Add(stringValue2);
                documentVersion2.IntValues = new List<IntValue>();
                documentVersion2.IntValues.Add(intValue2);
                documentVersion2.IntValues.Add(intValue22);
                dbContext.Add(documentVersion2);
                dbContext.SaveChanges();

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add compound model
                dbContext.Add(new CompoundModel { ID = 1, MetaDataModelID = 1, Caption = "Caption", IsRequired = true });
                dbContext.SaveChanges();
                dbContext.Add(new Attachment { CompoundModelID = 1, DocumentId = 1, Name = "photo attachment" });
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                List<ValueSearch> values = new List<ValueSearch>();
                values.Add(new ValueSearch { AttributeId = 2, MinValue = 23, TypeId = 5 });
                values.Add(new ValueSearch { AttributeId = 4, MinValue = 26, MaxValue = 35, TypeId = 5 });

                ValuesSearchFilter f = new ValuesSearchFilter()
                {
                    Values = values
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByValues(f);

                //Assert
                Assert.Single(result);

                // first result
                SearchResult res1 = result.ElementAt(0);
                Assert.Equal("document name 5", res1.DocumentName);
                Assert.Equal(5, res1.DocumentId);
                Assert.Equal(6, res1.LatestVersion);
                Assert.Equal(2, res1.Values.Count());
                object valuesObject1 = res1.Values.ElementAt(0);
                var nameProperty1 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("age", nameProperty1.GetValue(valuesObject1, null));
                var nameProperty2 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal(25, nameProperty2.GetValue(valuesObject1, null));

                object valuesObject2 = res1.Values.ElementAt(1);
                var nameProperty21 = valuesObject2.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("salary", nameProperty21.GetValue(valuesObject2, null));
                var nameProperty22 = valuesObject2.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal(27, nameProperty22.GetValue(valuesObject2, null));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByValuesFunctionIncludeOnlySpecificDocumentSet()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 1, Name = "document set 1", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                DocumentSet_Document doc_doc_set = new DocumentSet_Document
                {
                    DocumentId = 1,
                    DocumentSetId = 1
                };
                dbContext.DocumentSet_Document.Add(doc_doc_set);
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                List<ValueSearch> values = new List<ValueSearch>();
                ValueSearch value = new ValueSearch { AttributeId = 2, MinValue = 23, MaxValue = 29, TypeId = 5 };
                values.Add(value);

                ValuesSearchFilter f = new ValuesSearchFilter()
                {
                    Values = values,
                    SetId = 1
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByValues(f);

                //Assert
                Assert.Single(result);

                // first result
                SearchResult res1 = result.ElementAt(0);
                Assert.Equal("document name 1", res1.DocumentName);
                Assert.Equal(1, res1.DocumentId);
                Assert.Equal(1, res1.LatestVersion);
                Assert.Single(res1.Values);
                object valuesObject1 = res1.Values.ElementAt(0);
                var nameProperty1 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("age", nameProperty1.GetValue(valuesObject1, null));
                var nameProperty2 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal(25, nameProperty2.GetValue(valuesObject1, null));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByValuesFunctionIncludeOnlySpecificDocumentSetNotExisted()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 1, Name = "document set 1", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                DocumentSet_Document doc_doc_set = new DocumentSet_Document
                {
                    DocumentId = 1,
                    DocumentSetId = 1
                };
                dbContext.DocumentSet_Document.Add(doc_doc_set);
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                List<ValueSearch> values = new List<ValueSearch>();
                ValueSearch value = new ValueSearch { AttributeId = 2, MinValue = 23, MaxValue = 29, TypeId = 5 };
                values.Add(value);

                ValuesSearchFilter f = new ValuesSearchFilter()
                {
                    Values = values,
                    SetId = 5
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByValues(f);

                //Assert
                Assert.Empty(result);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByValuesFunctionExcludeSpecificDocumentSet()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 1, Name = "document set 1", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 1, DocumentSetId = 1 });
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                List<ValueSearch> values = new List<ValueSearch>();
                ValueSearch value = new ValueSearch { AttributeId = 2, MinValue = 23, MaxValue = 29, TypeId = 5 };
                values.Add(value);

                ValuesSearchFilter f = new ValuesSearchFilter()
                {
                    Values = values,
                    SetIdExclude = 1
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByValues(f);

                //Assert
                Assert.Single(result);

                // second result
                SearchResult res2 = result.ElementAt(0);
                Assert.Equal("document name 5", res2.DocumentName);
                Assert.Equal(5, res2.DocumentId);
                Assert.Equal(6, res2.LatestVersion);
                Assert.Single(res2.Values);
                object valuesObject2 = res2.Values.ElementAt(0);
                var nameProperty21 = valuesObject2.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("age", nameProperty21.GetValue(valuesObject2, null));
                var nameProperty22 = valuesObject2.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal(28, nameProperty22.GetValue(valuesObject2, null));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByValuesFunctionExcludeSpecificDocumentSetNotExisted()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 1, Name = "document set 1", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 1, DocumentSetId = 1 });
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                List<ValueSearch> values = new List<ValueSearch>();
                ValueSearch value = new ValueSearch { AttributeId = 2, MinValue = 23, MaxValue = 29, TypeId = 5 };
                values.Add(value);

                ValuesSearchFilter f = new ValuesSearchFilter()
                {
                    Values = values,
                    SetIdExclude = 5
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByValues(f);

                //Assert
                Assert.Equal(2, result.Count());

                // first result
                SearchResult res1 = result.ElementAt(0);
                Assert.Equal("document name 1", res1.DocumentName);
                Assert.Equal(1, res1.DocumentId);
                Assert.Equal(1, res1.LatestVersion);
                Assert.Single(res1.Values);
                object valuesObject1 = res1.Values.ElementAt(0);
                var nameProperty1 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("age", nameProperty1.GetValue(valuesObject1, null));
                var nameProperty2 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal(25, nameProperty2.GetValue(valuesObject1, null));

                // second result
                SearchResult res2 = result.ElementAt(1);
                Assert.Equal("document name 5", res2.DocumentName);
                Assert.Equal(5, res2.DocumentId);
                Assert.Equal(6, res2.LatestVersion);
                Assert.Single(res2.Values);
                object valuesObject2 = res2.Values.ElementAt(0);
                var nameProperty21 = valuesObject2.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("age", nameProperty21.GetValue(valuesObject2, null));
                var nameProperty22 = valuesObject2.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal(28, nameProperty22.GetValue(valuesObject2, null));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByValuesFunctionIncludeAndExcludeSpecificDocumentSet()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 1, Name = "document set 1", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 1, DocumentSetId = 1 });
                dbContext.SaveChanges();

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 2, Name = "document set 2", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 5, DocumentSetId = 2 });
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                List<ValueSearch> values = new List<ValueSearch>();
                ValueSearch value = new ValueSearch { AttributeId = 2, MinValue = 23, MaxValue = 29, TypeId = 5 };
                values.Add(value);

                ValuesSearchFilter f = new ValuesSearchFilter()
                {
                    Values = values,
                    SetIdExclude = 1,
                    SetId = 2
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByValues(f);

                //Assert
                Assert.Single(result);

                // second result
                SearchResult res2 = result.ElementAt(0);
                Assert.Equal("document name 5", res2.DocumentName);
                Assert.Equal(5, res2.DocumentId);
                Assert.Equal(6, res2.LatestVersion);
                Assert.Single(res2.Values);
                object valuesObject2 = res2.Values.ElementAt(0);
                var nameProperty21 = valuesObject2.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("age", nameProperty21.GetValue(valuesObject2, null));
                var nameProperty22 = valuesObject2.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal(28, nameProperty22.GetValue(valuesObject2, null));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByValuesFunctionIncludeAndExcludeSameSpecificDocumentSet()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 1, Name = "document set 1", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 1, DocumentSetId = 1 });
                dbContext.SaveChanges();

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 2, Name = "document set 2", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 5, DocumentSetId = 2 });
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                List<ValueSearch> values = new List<ValueSearch>();
                ValueSearch value = new ValueSearch { AttributeId = 2, MinValue = 23, MaxValue = 29, TypeId = 5 };
                values.Add(value);

                ValuesSearchFilter f = new ValuesSearchFilter()
                {
                    Values = values,
                    SetIdExclude = 1,
                    SetId = 1
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByValues(f);

                //Assert
                Assert.Empty(result);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByValuesFunctionNullFilter()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 1, Name = "document set 1", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 1, DocumentSetId = 1 });
                dbContext.SaveChanges();

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 2, Name = "document set 2", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 5, DocumentSetId = 2 });
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByValues(null);

                //Assert
                Assert.Empty(result);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByValuesFunctionNullValuesFilter()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 1, Name = "document set 1", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 1, DocumentSetId = 1 });
                dbContext.SaveChanges();

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 2, Name = "document set 2", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 5, DocumentSetId = 2 });
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                ValuesSearchFilter f = new ValuesSearchFilter()
                {
                    SetIdExclude = 1,
                    SetId = 2
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByValues(f);

                //Assert
                Assert.Empty(result);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByValuesFunctionEmptyValuesFilter()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 1, Name = "document set 1", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 1, DocumentSetId = 1 });
                dbContext.SaveChanges();

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 2, Name = "document set 2", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 5, DocumentSetId = 2 });
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                ValuesSearchFilter f = new ValuesSearchFilter()
                {
                    Values = new List<ValueSearch>(),
                    SetIdExclude = 1,
                    SetId = 2
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByValues(f);

                //Assert
                Assert.Empty(result);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByValuesFunctionNoDocumentVersion()
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

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                List<ValueSearch> values = new List<ValueSearch>();
                ValueSearch value = new ValueSearch { AttributeId = 6, MinValue = 25.0, TypeId = 4 };
                values.Add(value);

                ValuesSearchFilter f = new ValuesSearchFilter()
                {
                    Values = values
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByValues(f);

                //Assert
                Assert.Empty(result);
                //Assert
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchByTextFunctionArabic()
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
                AddFourthDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "المستند القيّم جداً", MetaDataModelId = 4 });
                dbContext.Add(new Document { ID = 2, Name = "سما يسمو مجدي يهوى", MetaDataModelId = 4 });
                dbContext.Add(new Document { ID = 3, Name = "document name 3", MetaDataModelId = 2, DeletedDate = DateTime.Now }); // will not present in the getter
                dbContext.Add(new Document { ID = 4, Name = "document name 4", MetaDataModelId = 2, IsArchived = true }); // will not present in the getter
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstArabicDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "المستند القيّم جداً", 6);

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                // 1.
                FreeTxtSearchFilter f = new FreeTxtSearchFilter()
                {
                    Text = "لؤي"
                };
                // 2.
                FreeTxtSearchFilter f2 = new FreeTxtSearchFilter()
                {
                    Text = "لوى"
                };
                //3.
                FreeTxtSearchFilter f3 = new FreeTxtSearchFilter()
                {
                    Text = "لو"
                };
                //4.
                FreeTxtSearchFilter f4 = new FreeTxtSearchFilter()
                {
                    Text = "لؤ"
                };
                //5.
                FreeTxtSearchFilter f5 = new FreeTxtSearchFilter()
                {
                    Text = "جداً"
                };

                //Act
                List<SearchResult> searchResult = ss.SearchForDocumentsByFreeText(f);
                List<SearchResult> searchResult2 = ss.SearchForDocumentsByFreeText(f2);
                List<SearchResult> searchResult3 = ss.SearchForDocumentsByFreeText(f3);
                List<SearchResult> searchResult4 = ss.SearchForDocumentsByFreeText(f4);
                List<SearchResult> searchResult5 = ss.SearchForDocumentsByFreeText(f5);

                //Assert
                //1.
                Assert.Single(searchResult);
                // first result
                SearchResult res1 = searchResult.ElementAt(0);
                Assert.Equal("المستند القيّم جداً", res1.DocumentName);
                Assert.Equal(1, res1.DocumentId);
                Assert.Equal(6, res1.LatestVersion);
                Assert.Single(res1.Values);
                object valuesObject1 = res1.Values.ElementAt(0);
                var nameProperty1 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("last name", nameProperty1.GetValue(valuesObject1, null));
                var nameProperty2 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal("لؤي أنا نفسُ", nameProperty2.GetValue(valuesObject1, null));

                //2.
                Assert.Single(searchResult2);
                // first result
                res1 = searchResult2.ElementAt(0);
                Assert.Equal("المستند القيّم جداً", res1.DocumentName);
                Assert.Equal(1, res1.DocumentId);
                Assert.Equal(6, res1.LatestVersion);
                Assert.Single(res1.Values);
                valuesObject1 = res1.Values.ElementAt(0);
                nameProperty1 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("last name", nameProperty1.GetValue(valuesObject1, null));
                nameProperty2 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal("لؤي أنا نفسُ", nameProperty2.GetValue(valuesObject1, null));

                //3.
                Assert.Single(searchResult3);
                // first result
                res1 = searchResult3.ElementAt(0);
                Assert.Equal("المستند القيّم جداً", res1.DocumentName);
                Assert.Equal(1, res1.DocumentId);
                Assert.Equal(6, res1.LatestVersion);
                Assert.Equal(2,res1.Values.Count());
                valuesObject1 = res1.Values.ElementAt(0);
                nameProperty1 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("desc", nameProperty1.GetValue(valuesObject1, null));
                nameProperty2 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal("لؤلؤة ساحرة فيّ البحر هادئ قائلاً", nameProperty2.GetValue(valuesObject1, null));
                valuesObject1 = res1.Values.ElementAt(1);
                nameProperty1 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("last name", nameProperty1.GetValue(valuesObject1, null));
                nameProperty2 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal("لؤي أنا نفسُ", nameProperty2.GetValue(valuesObject1, null));

                //4.
                Assert.Single(searchResult4);
                // first result
                res1 = searchResult4.ElementAt(0);
                Assert.Equal("المستند القيّم جداً", res1.DocumentName);
                Assert.Equal(1, res1.DocumentId);
                Assert.Equal(6, res1.LatestVersion);
                Assert.Equal(2, res1.Values.Count());
                valuesObject1 = res1.Values.ElementAt(0);
                nameProperty1 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("desc", nameProperty1.GetValue(valuesObject1, null));
                nameProperty2 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal("لؤلؤة ساحرة فيّ البحر هادئ قائلاً", nameProperty2.GetValue(valuesObject1, null));
                valuesObject1 = res1.Values.ElementAt(1);
                nameProperty1 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("last name", nameProperty1.GetValue(valuesObject1, null));
                nameProperty2 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal("لؤي أنا نفسُ", nameProperty2.GetValue(valuesObject1, null));

                //5.
                Assert.Empty(searchResult5); // The search is searching the attributes.
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchByTextFunctionIncludeOnlySpecificDocumentSet()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 1, Name = "document set 1", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                DocumentSet_Document doc_doc_set = new DocumentSet_Document
                {
                    DocumentId = 1,
                    DocumentSetId = 1
                };
                dbContext.DocumentSet_Document.Add(doc_doc_set);
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                FreeTxtSearchFilter filter = new FreeTxtSearchFilter()
                {
                    Text = "25",
                    SetId = 1
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByFreeText(filter);

                //Assert
                Assert.Single(result);

                // first result
                SearchResult res1 = result.ElementAt(0);
                Assert.Equal("document name 1", res1.DocumentName);
                Assert.Equal(1, res1.DocumentId);
                Assert.Equal(1, res1.LatestVersion);
                Assert.Single(res1.Values);
                object valuesObject1 = res1.Values.ElementAt(0);
                var nameProperty1 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("age", nameProperty1.GetValue(valuesObject1, null));
                var nameProperty2 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal(25, nameProperty2.GetValue(valuesObject1, null));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchByTextFunctionIncludeOnlySpecificDocumentSetNotExisted()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 1, Name = "document set 1", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                DocumentSet_Document doc_doc_set = new DocumentSet_Document
                {
                    DocumentId = 1,
                    DocumentSetId = 1
                };
                dbContext.DocumentSet_Document.Add(doc_doc_set);
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                FreeTxtSearchFilter filter = new FreeTxtSearchFilter()
                {
                    Text = "25",
                    SetId = 5
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByFreeText(filter);

                //Assert
                Assert.Empty(result);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByFreeTextFunctionExcludeSpecificDocumentSet()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 1, Name = "document set 1", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 1, DocumentSetId = 1 });
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                FreeTxtSearchFilter f = new FreeTxtSearchFilter()
                {
                    Text = "28",
                    SetIdExclude = 1
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByFreeText(f);

                //Assert
                Assert.Single(result);

                // second result
                SearchResult res2 = result.ElementAt(0);
                Assert.Equal("document name 5", res2.DocumentName);
                Assert.Equal(5, res2.DocumentId);
                Assert.Equal(6, res2.LatestVersion);
                Assert.Single(res2.Values);
                object valuesObject2 = res2.Values.ElementAt(0);
                var nameProperty21 = valuesObject2.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("age", nameProperty21.GetValue(valuesObject2, null));
                var nameProperty22 = valuesObject2.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal(28, nameProperty22.GetValue(valuesObject2, null));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByFreeTextFunctionExcludeSpecificDocumentSetNotExisted()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 1, Name = "document set 1", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 1, DocumentSetId = 1 });
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                FreeTxtSearchFilter f = new FreeTxtSearchFilter()
                {
                    Text = "25",
                    SetIdExclude = 5
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByFreeText(f);

                //Assert
                Assert.Equal(2, result.Count());

                // first result
                SearchResult res1 = result.ElementAt(0);
                Assert.Equal("document name 1", res1.DocumentName);
                Assert.Equal(1, res1.DocumentId);
                Assert.Equal(1, res1.LatestVersion);
                Assert.Single(res1.Values);
                object valuesObject1 = res1.Values.ElementAt(0);
                var nameProperty1 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("age", nameProperty1.GetValue(valuesObject1, null));
                var nameProperty2 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal(25, nameProperty2.GetValue(valuesObject1, null));

                // second result
                SearchResult res2 = result.ElementAt(1);
                Assert.Equal("document name 5", res2.DocumentName);
                Assert.Equal(5, res2.DocumentId);
                Assert.Equal(6, res2.LatestVersion);
                Assert.Single(res2.Values);
                object valuesObject2 = res2.Values.ElementAt(0);
                var nameProperty21 = valuesObject2.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("salary", nameProperty21.GetValue(valuesObject2, null));
                var nameProperty22 = valuesObject2.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal(25, nameProperty22.GetValue(valuesObject2, null));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByFreeTextFunctionIncludeAndExcludeSpecificDocumentSet()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 1, Name = "document set 1", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 1, DocumentSetId = 1 });
                dbContext.SaveChanges();

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 2, Name = "document set 2", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 5, DocumentSetId = 2 });
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                FreeTxtSearchFilter f = new FreeTxtSearchFilter()
                {
                    Text = "25",
                    SetIdExclude = 1,
                    SetId = 2
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByFreeText(f);

                //Assert
                Assert.Single(result);

                // second result
                SearchResult res2 = result.ElementAt(0);
                Assert.Equal("document name 5", res2.DocumentName);
                Assert.Equal(5, res2.DocumentId);
                Assert.Equal(6, res2.LatestVersion);
                Assert.Single(res2.Values);
                object valuesObject2 = res2.Values.ElementAt(0);
                var nameProperty21 = valuesObject2.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("salary", nameProperty21.GetValue(valuesObject2, null));
                var nameProperty22 = valuesObject2.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal(25, nameProperty22.GetValue(valuesObject2, null));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByFreeTextFunctionIncludeAndExcludeSameSpecificDocumentSet()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 1, Name = "document set 1", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 1, DocumentSetId = 1 });
                dbContext.SaveChanges();

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 2, Name = "document set 2", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 5, DocumentSetId = 2 });
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                FreeTxtSearchFilter f = new FreeTxtSearchFilter()
                {
                    Text = "25",
                    SetIdExclude = 1,
                    SetId = 1
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByFreeText(f);

                //Assert
                Assert.Empty(result);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByFreeTextFunctionNullFilter()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 1, Name = "document set 1", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 1, DocumentSetId = 1 });
                dbContext.SaveChanges();

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 2, Name = "document set 2", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 5, DocumentSetId = 2 });
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByFreeText(null);

                //Assert
                Assert.Empty(result);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByFreeTextFunctionNullTextFilter()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 1, Name = "document set 1", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 1, DocumentSetId = 1 });
                dbContext.SaveChanges();

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 2, Name = "document set 2", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 5, DocumentSetId = 2 });
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                FreeTxtSearchFilter f = new FreeTxtSearchFilter()
                {
                    SetIdExclude = 1,
                    SetId = 2
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByFreeText(f);

                //Assert
                Assert.Empty(result);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByFreeTextFunctionEmptyValuesFilter()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 1 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfFirstMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);
                UpdateLatestVersionId(dbContext, "document name 5", 6);

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 1, Name = "document set 1", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 1, DocumentSetId = 1 });
                dbContext.SaveChanges();

                // Add document set
                dbContext.DocumentSet.Add(new DocumentSet { ID = 2, Name = "document set 2", UserId = 1 });
                dbContext.SaveChanges();

                // Add document to document set
                dbContext.DocumentSet_Document.Add(new DocumentSet_Document { DocumentId = 5, DocumentSetId = 2 });
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                FreeTxtSearchFilter f = new FreeTxtSearchFilter()
                {
                    Text = "",
                    SetIdExclude = 1,
                    SetId = 2
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByFreeText(f);

                //Assert
                Assert.Empty(result);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByFreeTextFunctionNoDocumentVersion()
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

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                FreeTxtSearchFilter f = new FreeTxtSearchFilter()
                {
                    Text = "25"
                };

                //Act
                List<SearchResult> result = ss.SearchForDocumentsByFreeText(f);

                //Assert
                Assert.Empty(result);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchByTextFunction()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 2 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                FreeTxtSearchFilter filter = new FreeTxtSearchFilter()
                {
                    Text = "footBall jack" // to test case sensitive and unordered words
                };
                FreeTxtSearchFilter filter2 = new FreeTxtSearchFilter()
                {
                    Text = "Jack" // normal word
                };
                FreeTxtSearchFilter filter3 = new FreeTxtSearchFilter()
                {
                    Text = "document name 2" // search for specific document name
                };
                FreeTxtSearchFilter filter4 = new FreeTxtSearchFilter()
                {
                    Text = "document name" // search for part of document name
                };
                FreeTxtSearchFilter filter5 = new FreeTxtSearchFilter()
                {
                    Text = "docum" // search for part of word
                };

                //Act
                var resultCaseSensitive = ss.SearchForDocumentsByFreeText(filter);
                var searchResult = ss.SearchForDocumentsByFreeText(filter2);
                var searchResultDocumentName = ss.SearchForDocumentsByFreeText(filter3);
                var searchResultPartOfDocumentName = ss.SearchForDocumentsByFreeText(filter4);
                var searchResultPartOfWord = ss.SearchForDocumentsByFreeText(filter5);

                //Assert              
                Assert.Single(searchResult);
                Assert.Equal("document name 1", searchResult.ElementAt(0).DocumentName);

                // the return result should not be case sensitive
                Assert.Single(resultCaseSensitive);
                Assert.Equal("document name 1", resultCaseSensitive.ElementAt(0).DocumentName);

                Assert.Empty(searchResultDocumentName);
                Assert.Empty(searchResultPartOfDocumentName);
                Assert.Empty(searchResultPartOfWord);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchByTextFunctionTextExistedInValueAndDocName()
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
                dbContext.Add(new Document { ID = 2, Name = "Jack", MetaDataModelId = 2 });
                dbContext.Add(new Document { ID = 3, Name = "document name 3", MetaDataModelId = 2, DeletedDate = DateTime.Now }); // will not present in the getter
                dbContext.Add(new Document { ID = 4, Name = "document name 4", MetaDataModelId = 2, IsArchived = true }); // will not present in the getter
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 2 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "Jack", 2);

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                FreeTxtSearchFilter filter = new FreeTxtSearchFilter()
                {
                    Text = "Jack" // normal word
                };

                //Act
                var searchResult = ss.SearchForDocumentsByFreeText(filter);

                //Assert              
                Assert.Single(searchResult);

                SearchResult res1 = searchResult.ElementAt(0);
                Assert.Equal("document name 1", res1.DocumentName);
                Assert.Equal(1, res1.DocumentId);
                Assert.Equal(1, res1.LatestVersion);
                Assert.Single(res1.Values);
                object valuesObject1 = res1.Values.ElementAt(0);
                var nameProperty1 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("name", nameProperty1.GetValue(valuesObject1, null));
                var nameProperty2 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal("Jack is going to play football", nameProperty2.GetValue(valuesObject1, null));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchByTextFunctionTextExistedInValueAndDocName2()
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
                dbContext.Add(new Document { ID = 1, Name = "Jack", MetaDataModelId = 1 });
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.Add(new Document { ID = 3, Name = "document name 3", MetaDataModelId = 2, DeletedDate = DateTime.Now }); // will not present in the getter
                dbContext.Add(new Document { ID = 4, Name = "document name 4", MetaDataModelId = 2, IsArchived = true }); // will not present in the getter
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 2 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "Jack", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                FreeTxtSearchFilter filter = new FreeTxtSearchFilter()
                {
                    Text = "Jack" // normal word
                };

                //Act
                var searchResult = ss.SearchForDocumentsByFreeText(filter);

                //Assert              
                // first result
                SearchResult res1 = searchResult.ElementAt(0);
                Assert.Equal("Jack", res1.DocumentName);
                Assert.Equal(1, res1.DocumentId);
                Assert.Equal(1, res1.LatestVersion);
                Assert.Single(res1.Values);
                object valuesObject1 = res1.Values.ElementAt(0);
                var nameProperty1 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "MetaDataAttributeName").Single();
                Assert.Equal("name", nameProperty1.GetValue(valuesObject1, null));
                var nameProperty2 = valuesObject1.GetType().GetProperties().Where(p => p.Name == "Value").Single();
                Assert.Equal("Jack is going to play football", nameProperty2.GetValue(valuesObject1, null));
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchByTextFunctionValueExistedInOldVersion()
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
                dbContext.Add(new Document { ID = 5, Name = "document name 5", MetaDataModelId = 2 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddSecondDefaultDocumentVersionOfSecondMetaModel(dbContext);
                AddThirdDefaultDocumentVersionOfSecondMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 2", 2);

                // update version of a document
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
                valueDTO2.AttributeId = 1;
                valueDTO2.Value = "Layla is playing basketball";
                valueDTO2.TypeId = 6;

                DocumentVersionPostDTO documentVersionDTO = new DocumentVersionPostDTO();
                documentVersionDTO.DocumentId = 1;
                documentVersionDTO.VersionMessage = "any thing";
                documentVersionDTO.Values = new List<ValueDTO>();
                documentVersionDTO.Values.Add(valueDTO2);

                FormFileCollection images = new FormFileCollection();
                var imageFile1 = new Mock<IFormFile>();
                imageFile1.Setup(f => f.Length).Returns(1);
                imageFile1.Setup(f => f.CopyTo(It.IsAny<Stream>()));
                images.Add(imageFile1.Object);
                documentVersionDTO.AddScans(images);

                doc.UpdateVersion(documentVersionDTO, false);


                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                FreeTxtSearchFilter filter = new FreeTxtSearchFilter()
                {
                    Text = "Jack" // normal word
                };

                //Act
                var result = ss.SearchForDocumentsByFreeText(filter);

                //Assert
                Assert.Empty(result);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public void TestSearchForDocumentsByFreeTextFunctionInt()
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
                AddThirdDefaultMetaDataModel(dbContext);

                // Add documents
                dbContext.Add(new Document { ID = 1, Name = "document name 1", MetaDataModelId = 1 });
                dbContext.Add(new Document { ID = 2, Name = "document name 2", MetaDataModelId = 2 });
                dbContext.Add(new Document { ID = 3, Name = "document name 3", MetaDataModelId = 3 });
                dbContext.SaveChanges();

                // Add document versions
                AddFirstDefaultDocumentVersionOfFirstMetaModel(dbContext);
                AddFirstDefaultDocumentVersionOfThirdMetaModel(dbContext);

                //Update LatestVersionId of the added documents
                UpdateLatestVersionId(dbContext, "document name 1", 1);
                UpdateLatestVersionId(dbContext, "document name 3", 5);

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                FreeTxtSearchFilter filter = new FreeTxtSearchFilter()
                {
                    Text = "25"
                };

                //Act
                var result = ss.SearchForDocumentsByFreeText(filter);

                //Assert
                Assert.Equal(2, result.Count());

                // first result
            }
            finally
            {
                connection.Close();
            }
        }


        [Fact]
        public void SearchByFreeTextForOneFieldMatch()
        {
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


                MetaDataModel mdl = new MetaDataModel
                {
                    ID = 1,
                    DocumentClassId = 1,
                    MetaDataModelName = "Model A",
                    UserId = 1
                };

                MetaDataModel mdl2 = new MetaDataModel
                {
                    ID = 2,
                    DocumentClassId = 1,
                    MetaDataModelName = "Model B",
                    UserId = 1
                };

                MetaDataAttribute attr1 = new MetaDataAttribute { ID = 1, MetaDataAttributeName = "name", IsRequired = true, DataTypeID = 6 };  // string
                MetaDataAttribute attr2 = new MetaDataAttribute { ID = 2, MetaDataAttributeName = "name2", IsRequired = true, DataTypeID = 6 };  // string
                MetaDataAttribute attr3 = new MetaDataAttribute { ID = 3, MetaDataAttributeName = "name3", IsRequired = true, DataTypeID = 6 };  // string
                MetaDataAttribute attr4 = new MetaDataAttribute { ID = 4, MetaDataAttributeName = "int attr", IsRequired = true, DataTypeID = 5 };  // int


                mdl.MetaDataAttributes = new List<MetaDataAttribute>();
                mdl.MetaDataAttributes.Add(attr1);
                mdl.MetaDataAttributes.Add(attr2);
                dbContext.Add(mdl);

                mdl2.MetaDataAttributes = new List<MetaDataAttribute>();
                mdl2.MetaDataAttributes.Add(attr3);
                mdl2.MetaDataAttributes.Add(attr4);
                dbContext.Add(mdl2);

                //Add docmumet
                DocumentVersion ver1 = new DocumentVersion
                {
                    ID = 1,
                    VersionMessage = "hahahahah",
                    DocumentId = 1,
                    UserId = 1,
                    StringValues = new List<StringValue>()
                };
                ver1.StringValues.Add(new StringValue { MinDocumentVersionId = 1, MetaDataAttributeId = 1, Value = "hello hi good morning17" , NormalizedValue = "hello hi good morning17" });
                ver1.StringValues.Add(new StringValue { MinDocumentVersionId = 1, MetaDataAttributeId = 2, Value = "good all hi", NormalizedValue = "good all hi" });

                Document doc = new Document
                {
                    ID = 1,
                    MetaDataModelId = 1,
                    Name = "aaaa",
                    DocumentVersions = new List<DocumentVersion>()
                };
                doc.DocumentVersions.Add(ver1);

                DocumentVersion ver21 = new DocumentVersion
                {
                    ID = 2,
                    VersionMessage = "tttttt",
                    DocumentId = 2,
                    UserId = 1,
                    IntValues = new List<IntValue>(),
                    StringValues = new List<StringValue>()
                };
                ver21.StringValues.Add(new StringValue { MinDocumentVersionId = 2, MetaDataAttributeId = 3, Value = "hello hi aaaa good morning" , NormalizedValue = "hello hi aaaa good morning" });
                ver21.IntValues.Add(new IntValue { MinDocumentVersionId = 2, MetaDataAttributeId = 4, Value = 17 });

                Document doc2 = new Document
                {
                    ID = 2,
                    MetaDataModelId = 2,
                    Name = "aaa",
                    DocumentVersions = new List<DocumentVersion>()
                };
                doc2.DocumentVersions.Add(ver21);

                dbContext.Document.Add(doc);
                dbContext.Document.Add(doc2);
                dbContext.SaveChanges();
                doc.LatestVersionId = 1;
                doc2.LatestVersionId = 2;
                dbContext.SaveChanges();

                SearchService ss = new SearchService(dbContext, GetSearchServiceLocalizerObject());

                FreeTxtSearchFilter s1 = new FreeTxtSearchFilter()
                {
                    Text = "HI GOOD",
                    ModelId = 1
                };

                FreeTxtSearchFilter s2 = new FreeTxtSearchFilter()
                {
                    Text = "HI GOOD",
                    ClassId = 1
                };
                FreeTxtSearchFilter s3 = new FreeTxtSearchFilter()
                {
                    Text = "HI GOOD",
                    ClassId = 2
                };
                FreeTxtSearchFilter s4 = new FreeTxtSearchFilter()
                {
                    Text = "HI GOOD",
                    ModelId = 2
                };
                FreeTxtSearchFilter s5 = new FreeTxtSearchFilter()
                {
                    Text = "17"
                };
                FreeTxtSearchFilter s6 = new FreeTxtSearchFilter()
                {
                    Text = "aaaa"
                };
                FreeTxtSearchFilter s7 = new FreeTxtSearchFilter()
                {
                    Text = "aaaa",
                    ModelId = 1
                };
                FreeTxtSearchFilter s8 = new FreeTxtSearchFilter()
                {
                    Text = "aaaa good"
                };

                //Act
                var result = ss.SearchForDocumentsByFreeText(s1);
                var result2 = ss.SearchForDocumentsByFreeText(s2);
                var result3 = ss.SearchForDocumentsByFreeText(s3);
                var result4 = ss.SearchForDocumentsByFreeText(s4);
                var result5 = ss.SearchForDocumentsByFreeText(s5);
                var result6 = ss.SearchForDocumentsByFreeText(s6);
                var result7 = ss.SearchForDocumentsByFreeText(s7);
                var result8 = ss.SearchForDocumentsByFreeText(s8);

                //Assert
                Assert.Single(result);
                Assert.Equal(2, result2.Count());
                Assert.Empty(result3);
                Assert.Single(result4);
                Assert.Equal(2, result5.Count());
                Assert.Single(result6);
                Assert.Empty(result7);
                Assert.Single(result8);

            }
            finally
            {
                connection.Close();
            }
        }

        private StringLocalizer<SearchService> GetSearchServiceLocalizerObject()
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
            return new StringLocalizer<SearchService>(factory);
        }
    }
}
