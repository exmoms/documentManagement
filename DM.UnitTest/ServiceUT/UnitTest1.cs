using DM.Domain;
using DM.Service.ServiceModels;
using DM.Service.Services;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace DM.UnitTest.ServiceUT
{
    //public class UnitTest1
    //{
    //    [Theory(DisplayName = "getDocumentsByMetaDataModelName function")]
    //    [InlineData("aa")]
    //    public void Test1(string modelName)
    //    {
    //        //Arrange 

    //        var documentRepoMock = new Mock<IDocumentRepository>();

    //        MetaDataModel md = new MetaDataModel();
    //        md.MetaDataModelName = "ModelA";
    //        md.ID = 7;

    //        Document doc = new Document { ID = 1, MetaDataModelId = 7, MetaDataModel = md };

    //        List<DocumentVersion> documents = new List<DocumentVersion>();
    //        documents.Add(new DocumentVersion {ID = 1, DocumentId = 1 ,Document = doc});

    //        MetaDataAttribute mat = new MetaDataAttribute();
    //        mat.ID = 3;
    //        mat.MetaDataAttributeName = "age";

    //        List<NumberValue> nValues = new List<NumberValue>();
    //        nValues.Add(new NumberValue { DocumentVersionId = 1, Value = 13, MetaDataAttribute = mat, MetaDataAttributeId = 4 });

    //        List<StringValue> sValues = new List<StringValue>();

    //        documentRepoMock.Setup(p => p.getDocumentsByMetaDataModelName("aa")).Returns(documents);
    //        documentRepoMock.Setup(p => p.getNumberValuesByDocumentId(1)).Returns(nValues);
    //        documentRepoMock.Setup(p => p.getStringValuesByDocumentId(1)).Returns(sValues);


    //        DocumentService documentService = new DocumentService(documentRepoMock.Object);

    //        // Act
    //        List<DocumentDTO> result = (List < DocumentDTO > )documentService.getDocumentsByMetaDataModelName(modelName);

    //        // Assert
    //        documentRepoMock.Verify(m => m.getStringValuesByDocumentId(1), Times.Exactly(1));
    //        Assert.Single(result);
    //        Assert.Equal(7, result[0].metadataModelId);
    //        Assert.Equal(1, result[0].documentId);
    //        Assert.Equal("ModelA", result[0].metadataModelName);
    //        Assert.Equal("age", result[0].numberValues[0].attributeName);
    //        Assert.Equal(13, result[0].numberValues[0].value);

    //    }
    //}
}
