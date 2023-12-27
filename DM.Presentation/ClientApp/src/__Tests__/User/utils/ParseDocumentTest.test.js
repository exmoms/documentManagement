import React from "react";
import ReactDom from "react-dom";
import ParseDocument from "../../../utils/ParseDocument";
import { cleanup } from "@testing-library/react";
import { mount } from "enzyme";
import Form from "react-jsonschema-form";
import { shallow } from "enzyme";
import { act } from "react-dom/test-utils";
afterEach(cleanup);

describe("ParseDocument", () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
  it("tests the returned values when option = 1 and type = 1", () => {
    const ObjectMock = jest.spyOn(Object, "defineProperty")
    let schemaResult = {
        title: "title 1",
        type: "object",
        required: ["documentVersion","key"],
        properties: {
          metadataModelName: { type: "string", title: "Metadata Model Name" },
          addedDate: { type: "string", title: " Document Added Date" },
          key: { type: "boolean", title: "key" },
          latestVersion: { type: "number", title: "Latest Version" },
          versionMessage: { type: "string", title: "Version Message" },
          documentVersion: { type: "string", title: "New Version Message" },
          documentVersionAddedDate: {
            type: "string",
            title: "Document Version Added Date",
          }
        },
      };
      let ui_schemaResult = {"addedDate": {"ui:readonly": true}, "documentVersionAddedDate": {"ui:readonly": true}, "latestVersion": {"ui:readonly": true}, "metadataModelName": {"ui:readonly": true}, "versionMessage": {"ui:readonly": true}};
  
      let form_dataResult = {
        metadataModelName: "model A",
        addedDate: "16/2/2020",
        latestVersion: 1,
        key: "KeyValue",
        versionMessage: "message 1",
        documentVersionAddedDate: "16/2/2020",
      };
    let option = 1;
      let res={name:"title 1" , id: 1 ,metadataModelId :2 , metadataModelName: "model A" , addedDate: '16/2/2020' , modifiedDate: '16/2/2020' , latestVersion: 1, deletedDate: '16/2/2020' , documentVersion: {values : [{attributeName:"key" , attributeId :3 , isRequired : true , typeId:1 , value :"KeyValue"}],childrenDocuments : [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}] , documenetScans :["scan 1" , "scan 2"] , id: 4 , versionMessage :"message 1" , author:"author" , addedDate: '16/2/2020'}};
      let { schema, ui_schema, form_data, map } = ParseDocument(res ,option );
    expect(ObjectMock).toHaveBeenCalledTimes(3);
    //first call for ObjectMock
    expect(ObjectMock.mock.calls[0][0]).toStrictEqual({
        metadataModelName: { type: "string" , title: "Metadata Model Name" },
        addedDate: { type: "string", title: " Document Added Date" },
        key: { type: "boolean", title: "key" },
        latestVersion: { type: "number", title: "Latest Version" },
        documentVersion: { type: "string", title: "New Version Message" },
        documentVersionAddedDate: {
          title: "Document Version Added Date",
          "type": "string",
        } ,
        "versionMessage":  {
             "title": "Version Message",
              "type": "string",
            }
      });
      expect(ObjectMock.mock.calls[0][1]).toBe("documentVersion");
      expect(ObjectMock.mock.calls[0][2]).toStrictEqual({
        value: {
          type: "string",
          title: "New Version Message",
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });
      //second call for the mock
      expect(ObjectMock.mock.calls[1][0]).toStrictEqual({
        metadataModelName: { type: "string" , title: "Metadata Model Name" },
        addedDate: { type: "string", title: " Document Added Date" },
        key: { type: "boolean", title: "key" },
        latestVersion: { type: "number", title: "Latest Version" },
        versionMessage: { type: "string", title: "Version Message" },
        documentVersion: { type: "string", title: "New Version Message" },
        documentVersionAddedDate: {
          type: "string",
          title: "Document Version Added Date",
        },
        "versionMessage":  {
             "title": "Version Message",
              "type": "string",
            }
      });
      expect(ObjectMock.mock.calls[1][1]).toBe("key");
      expect(ObjectMock.mock.calls[1][2]).toStrictEqual({
        value: {
          type: "boolean",
          title: "key",
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });
       //third call for the mock
       expect(ObjectMock.mock.calls[2][0]).toStrictEqual(form_dataResult);
      expect(ObjectMock.mock.calls[2][1]).toBe("key");
      expect(ObjectMock.mock.calls[2][2]).toStrictEqual({"configurable": true, "enumerable": true, "value": "KeyValue", "writable": true});
     //expectations for the returned values 
     expect(schema).toStrictEqual(schemaResult);
     expect(ui_schema).toStrictEqual(ui_schemaResult);
     expect(form_data).toStrictEqual(form_dataResult);
     let mapRes = []
     mapRes["key"] = 3;
     expect(JSON.stringify(map)).toEqual(JSON.stringify(mapRes));
  });

  it("tests the returned values when option = 0", () => {
    const ObjectMock = jest.spyOn(Object, "defineProperty")
    let schemaResult = {
      title: "title 1",
      type: "object",
      required: ["key"],
      properties: {
        metadataModelName: { type: "string", title: "Metadata Model Name" },
        addedDate: { type: "string", title: " Document Added Date" },
        key: { type: "boolean", title: "key" },
        latestVersion: { type: "number", title: "Latest Version" },
        versionMessage: { type: "string", title: "Version Message" },
        documentVersionAddedDate: {
          type: "string",
          title: "Document Version Added Date",
        }
      },
    };
    let ui_schemaResult = {"addedDate": {"ui:readonly": true}, "documentVersionAddedDate": {"ui:readonly": true}, "latestVersion": {"ui:readonly": true}, "metadataModelName": {"ui:readonly": true}, "versionMessage": {"ui:readonly": true} , "key": {"ui:readonly": true}};

    let form_dataResult = {
      metadataModelName: "model A",
      addedDate: "16/2/2020",
      latestVersion: 1,
      key: "KeyValue",
      versionMessage: "message 1",
      documentVersionAddedDate: "16/2/2020",
    };
    let option = 0;
      let res={name:"title 1" , id: 1 ,metadataModelId :2 , metadataModelName: "model A" , addedDate: '16/2/2020' , modifiedDate: '16/2/2020' , latestVersion: 1, deletedDate: '16/2/2020' , documentVersion: {values : [{attributeName:"key" , attributeId :3 , isRequired : true , typeId:1 , value :"KeyValue"}],childrenDocuments : [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}] , documenetScans :["scan 1" , "scan 2"] , id: 4 , versionMessage :"message 1" , author:"author" , addedDate: '16/2/2020'}};
      let { schema, ui_schema, form_data, map } = ParseDocument(res ,option );
    expect(ObjectMock).toHaveBeenCalledTimes(3);
    //first call for ObjectMock
    expect(ObjectMock.mock.calls[0][0]).toStrictEqual(ui_schemaResult);
      expect(ObjectMock.mock.calls[0][1]).toBe("key");
      expect(ObjectMock.mock.calls[0][2]).toStrictEqual({
        value: { "ui:readonly": true },
        writable: true,
        enumerable: true,
        configurable: true,
      });
      //second call for the mock
      expect(ObjectMock.mock.calls[1][0]).toStrictEqual({
        metadataModelName: { type: "string", title: "Metadata Model Name" },
        addedDate: { type: "string", title: " Document Added Date" },
        key: { type: "boolean", title: "key" },
        latestVersion: { type: "number", title: "Latest Version" },
        versionMessage: { type: "string", title: "Version Message" },
        documentVersionAddedDate: {
          type: "string",
          title: "Document Version Added Date",
        }
      });
      expect(ObjectMock.mock.calls[1][1]).toBe("key");
      expect(ObjectMock.mock.calls[1][2]).toStrictEqual({
        value: {
          type: "boolean",
          title: "key",
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });
       //third call for the mock
       expect(ObjectMock.mock.calls[2][0]).toStrictEqual(form_dataResult);
      expect(ObjectMock.mock.calls[2][1]).toBe("key");
      expect(ObjectMock.mock.calls[2][2]).toStrictEqual({"configurable": true, "enumerable": true, "value": "KeyValue", "writable": true});
     //expectations for the returned values 
     expect(schema).toStrictEqual(schemaResult);
     expect(ui_schema).toStrictEqual(ui_schemaResult);
     expect(form_data).toStrictEqual(form_dataResult);
     let mapRes = []
     mapRes["key"] = 3;
     expect(JSON.stringify(map)).toEqual(JSON.stringify(mapRes));
  });
 
  it("tests the returned values when option = 1 and type = 2 and ui_schema.hasOwnProperty(name) is setting to false", () => {
    const ObjectMock = jest.spyOn(Object, "defineProperty")
    let schemaResult = {
      title: "title 1",
      type: "object",
      required: ["documentVersion","key"],
      properties: {
        metadataModelName: { type: "string", title: "Metadata Model Name" },
        addedDate: { type: "string", title: " Document Added Date" },
        key: { type: "string", title: "key" },
        latestVersion: { type: "number", title: "Latest Version" },
        versionMessage: { type: "string", title: "Version Message" },
        documentVersion: { type: "string", title: "New Version Message" },
        documentVersionAddedDate: {
          type: "string",
          title: "Document Version Added Date",
        }
      },
    };
    let ui_schemaResult = {"addedDate": {"ui:readonly": true}, "documentVersionAddedDate": {"ui:readonly": true}, "latestVersion": {"ui:readonly": true}, "metadataModelName": {"ui:readonly": true}, "versionMessage": {"ui:readonly": true} , "key": {"ui:widget": "date"}};

    let form_dataResult = {
      metadataModelName: "model A",
      addedDate: "16/2/2020",
      latestVersion: 1,
      key: "KeyValue",
      versionMessage: "message 1",
      documentVersionAddedDate: "16/2/2020",
    };
    let option = 1;
      let res={name:"title 1" , id: 1 ,metadataModelId :2 , metadataModelName: "model A" , addedDate: '16/2/2020' , modifiedDate: '16/2/2020' , latestVersion: 1, deletedDate: '16/2/2020' , documentVersion: {values : [{attributeName:"key" , attributeId :3 , isRequired : true , typeId:2 , value :"KeyValue"}],childrenDocuments : [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}] , documenetScans :["scan 1" , "scan 2"] , id: 4 , versionMessage :"message 1" , author:"author" , addedDate: '16/2/2020'}};
      let { schema, ui_schema, form_data, map } = ParseDocument(res ,option );
   //expectations for the returned values 
   expect(schema).toStrictEqual(schemaResult);
   expect(ui_schema).toStrictEqual(ui_schemaResult);
   expect(form_data).toStrictEqual(form_dataResult);
   let mapRes = []
   mapRes["key"] = 3;
   expect(JSON.stringify(map)).toEqual(JSON.stringify(mapRes));

      expect(ObjectMock).toHaveBeenCalledTimes(4);
    //first call for ObjectMock
    expect(ObjectMock.mock.calls[0][0]).toStrictEqual({
      metadataModelName: { type: "string", title: "Metadata Model Name" },
      addedDate: { type: "string", title: " Document Added Date" },
      key: { type: "string", title: "key" },
      latestVersion: { type: "number", title: "Latest Version" },
      versionMessage: { type: "string", title: "Version Message" },
      documentVersion: { type: "string", title: "New Version Message" },
      documentVersionAddedDate: {
        type: "string",
        title: "Document Version Added Date",
      }
    });
      expect(ObjectMock.mock.calls[0][1]).toBe("documentVersion");
      expect(ObjectMock.mock.calls[0][2]).toStrictEqual({
        value: {
          type: "string",
          title: "New Version Message",
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });
      //second call for the mock
      expect(ObjectMock.mock.calls[1][0]).toStrictEqual({
        metadataModelName: { type: "string", title: "Metadata Model Name" },
        addedDate: { type: "string", title: " Document Added Date" },
        key: { type: "string", title: "key" },
        latestVersion: { type: "number", title: "Latest Version" },
        versionMessage: { type: "string", title: "Version Message" },
        documentVersion: { type: "string", title: "New Version Message" },
        documentVersionAddedDate: {
          type: "string",
          title: "Document Version Added Date",
        }
      });
      expect(ObjectMock.mock.calls[1][1]).toBe("key");
      expect(ObjectMock.mock.calls[1][2]).toStrictEqual({
        value: {
          type: "string",
          title: "key",
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });
      //thirs call for the mock
      expect(ObjectMock.mock.calls[2][0]).toStrictEqual(ui_schemaResult);
      expect(ObjectMock.mock.calls[2][1]).toBe("key");
      expect(ObjectMock.mock.calls[2][2]).toStrictEqual({
        value: {
          "ui:widget": "date",
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });
       //fourth call for the mock
       expect(ObjectMock.mock.calls[3][0]).toStrictEqual(form_dataResult);
      expect(ObjectMock.mock.calls[3][1]).toBe("key");
      expect(ObjectMock.mock.calls[3][2]).toStrictEqual({"configurable": true, "enumerable": true, "value": "KeyValue", "writable": true});
     
  });
 
  it("tests the returned values when option = 0 and type == 2 and ui_schema.hasOwnProperty(name) is setting to true", () => {
    const ObjectMock = jest.spyOn(Object, "defineProperty")
    let schemaResult = {
      title: "title 1",
      type: "object",
      required: ["key"],
      properties: {
        metadataModelName: { type: "string", title: "Metadata Model Name" },
        addedDate: { type: "string", title: " Document Added Date" },
        key: { type: "string", title: "key" },
        latestVersion: { type: "number", title: "Latest Version" },
        versionMessage: { type: "string", title: "Version Message" },
        documentVersionAddedDate: {
          type: "string",
          title: "Document Version Added Date",
        }
      },
    };
    let ui_schemaResult = {"addedDate": {"ui:readonly": true}, "documentVersionAddedDate": {"ui:readonly": true}, "latestVersion": {"ui:readonly": true}, "metadataModelName": {"ui:readonly": true}, "versionMessage": {"ui:readonly": true} , "key": {"ui:readonly": true , "ui:widget": "date"}};

    let form_dataResult = {
      metadataModelName: "model A",
      addedDate: "16/2/2020",
      latestVersion: 1,
      key: "KeyValue",
      versionMessage: "message 1",
      documentVersionAddedDate: "16/2/2020",
    };
    let option = 0;
      let res={name:"title 1" , id: 1 ,metadataModelId :2 , metadataModelName: "model A" , addedDate: '16/2/2020' , modifiedDate: '16/2/2020' , latestVersion: 1, deletedDate: '16/2/2020' , documentVersion: {values : [{attributeName:"key" , attributeId :3 , isRequired : true , typeId:2, value :"KeyValue"}],childrenDocuments : [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}] , documenetScans :["scan 1" , "scan 2"] , id: 4 , versionMessage :"message 1" , author:"author" , addedDate: '16/2/2020'}};
      let { schema, ui_schema, form_data, map } = ParseDocument(res ,option );
    //expectations for the returned values 
    expect(schema).toStrictEqual(schemaResult);
    expect(ui_schema).toStrictEqual(ui_schemaResult);
    expect(form_data).toStrictEqual(form_dataResult);
    let mapRes = []
    mapRes["key"] = 3;
    expect(JSON.stringify(map)).toEqual(JSON.stringify(mapRes));
      expect(ObjectMock).toHaveBeenCalledTimes(4);
    //first call for ObjectMock
    expect(ObjectMock.mock.calls[0][0]).toStrictEqual(ui_schemaResult);
      expect(ObjectMock.mock.calls[0][1]).toBe("key");
      expect(ObjectMock.mock.calls[0][2]).toStrictEqual({
        value: { "ui:readonly": true },
        writable: true,
        enumerable: true,
        configurable: true,
      });
      //second call for the mock
      expect(ObjectMock.mock.calls[1][0]).toStrictEqual({
        metadataModelName: { type: "string", title: "Metadata Model Name" },
        addedDate: { type: "string", title: " Document Added Date" },
        key: { type: "string", title: "key" },
        latestVersion: { type: "number", title: "Latest Version" },
        versionMessage: { type: "string", title: "Version Message" },
        documentVersionAddedDate: {
          type: "string",
          title: "Document Version Added Date",
        }
      });
      expect(ObjectMock.mock.calls[1][1]).toBe("key");
      expect(ObjectMock.mock.calls[1][2]).toStrictEqual({
        value: {
          type: "string",
          title: "key",
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });
      //fourth call for the mock
      expect(ObjectMock.mock.calls[2][0]).toStrictEqual(ui_schemaResult);
      expect(ObjectMock.mock.calls[2][1]).toBe("key");
      expect(ObjectMock.mock.calls[2][2]).toStrictEqual({
        value: {
          "ui:widget": "date",
          "ui:readonly": true,
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });
       //fourth call for the mock
       expect(ObjectMock.mock.calls[3][0]).toStrictEqual(form_dataResult);
      expect(ObjectMock.mock.calls[3][1]).toBe("key");
      expect(ObjectMock.mock.calls[3][2]).toStrictEqual({"configurable": true, "enumerable": true, "value": "KeyValue", "writable": true});
     
  });
 

  it("tests the returned values when option = 1 and type = 3 , 4, 5", () => {
    const ObjectMock = jest.spyOn(Object, "defineProperty")
    let schemaResult = {
      title: "title 1",
      type: "object",
      required: ["documentVersion","key"],
      properties: {
        metadataModelName: { type: "string", title: "Metadata Model Name" },
        addedDate: { type: "string", title: " Document Added Date" },
        key: { type: "number", title: "key" },
        latestVersion: { type: "number", title: "Latest Version" },
        versionMessage: { type: "string", title: "Version Message" },
        documentVersion: { type: "string", title: "New Version Message" },
        documentVersionAddedDate: {
          type: "string",
          title: "Document Version Added Date",
        }
      },
    };
    let ui_schemaResult = {"addedDate": {"ui:readonly": true}, "documentVersionAddedDate": {"ui:readonly": true}, "latestVersion": {"ui:readonly": true}, "metadataModelName": {"ui:readonly": true}, "versionMessage": {"ui:readonly": true} };

    let form_dataResult = {
      metadataModelName: "model A",
      addedDate: "16/2/2020",
      latestVersion: 1,
      key: "KeyValue",
      versionMessage: "message 1",
      documentVersionAddedDate: "16/2/2020",
    };
    let option = 1;
      let res={name:"title 1" , id: 1 ,metadataModelId :2 , metadataModelName: "model A" , addedDate: '16/2/2020' , modifiedDate: '16/2/2020' , latestVersion: 1, deletedDate: '16/2/2020' , documentVersion: {values : [{attributeName:"key" , attributeId :3 , isRequired : true , typeId:3 , value :"KeyValue"}],childrenDocuments : [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}] , documenetScans :["scan 1" , "scan 2"] , id: 4 , versionMessage :"message 1" , author:"author" , addedDate: '16/2/2020'}};
      let { schema, ui_schema, form_data, map } = ParseDocument(res ,option );
    expect(ObjectMock).toHaveBeenCalledTimes(3);
    //first call for ObjectMock
    expect(ObjectMock.mock.calls[0][0]).toStrictEqual({
      metadataModelName: { type: "string", title: "Metadata Model Name" },
      addedDate: { type: "string", title: " Document Added Date" },
      key: { type: "number", title: "key" },
      latestVersion: { type: "number", title: "Latest Version" },
      versionMessage: { type: "string", title: "Version Message" },
      documentVersion: { type: "string", title: "New Version Message" },
      documentVersionAddedDate: {
        type: "string",
        title: "Document Version Added Date",
      }
    });
      expect(ObjectMock.mock.calls[0][1]).toBe("documentVersion");
      expect(ObjectMock.mock.calls[0][2]).toStrictEqual({
        value: {
          type: "string",
          title: "New Version Message",
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });
      //second call for the mock
      expect(ObjectMock.mock.calls[1][0]).toStrictEqual({
        metadataModelName: { type: "string", title: "Metadata Model Name" },
        addedDate: { type: "string", title: " Document Added Date" },
        key: { type: "number", title: "key" },
        latestVersion: { type: "number", title: "Latest Version" },
        versionMessage: { type: "string", title: "Version Message" },
        documentVersion: { type: "string", title: "New Version Message" },
        documentVersionAddedDate: {
          type: "string",
          title: "Document Version Added Date",
        }
      });
      expect(ObjectMock.mock.calls[1][1]).toBe("key");
      expect(ObjectMock.mock.calls[1][2]).toStrictEqual({
        value: {
          type: "number",
          title: "key",
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });
       //third call for the mock
       expect(ObjectMock.mock.calls[2][0]).toStrictEqual(form_dataResult);
      expect(ObjectMock.mock.calls[2][1]).toBe("key");
      expect(ObjectMock.mock.calls[2][2]).toStrictEqual({"configurable": true, "enumerable": true, "value": "KeyValue", "writable": true});
     //expectations for the returned values 
     expect(schema).toStrictEqual(schemaResult);
     expect(ui_schema).toStrictEqual(ui_schemaResult);
     expect(form_data).toStrictEqual(form_dataResult);
     let mapRes = []
     mapRes["key"] = 3;
     expect(JSON.stringify(map)).toEqual(JSON.stringify(mapRes));
  });
 

  
  it("tests the returned values when option = 1 and type =6", () => {
    const ObjectMock = jest.spyOn(Object, "defineProperty")
    let schemaResult = {
      title: "title 1",
      type: "object",
      required: ["documentVersion","key"],
      properties: {
        metadataModelName: { type: "string", title: "Metadata Model Name" },
        addedDate: { type: "string", title: " Document Added Date" },
        key: { type: "string", title: "key" },
        latestVersion: { type: "number", title: "Latest Version" },
        versionMessage: { type: "string", title: "Version Message" },
        documentVersion: { type: "string", title: "New Version Message" },
        documentVersionAddedDate: {
          type: "string",
          title: "Document Version Added Date",
        }
      },
    };
    let ui_schemaResult = {"addedDate": {"ui:readonly": true}, "documentVersionAddedDate": {"ui:readonly": true}, "latestVersion": {"ui:readonly": true}, "metadataModelName": {"ui:readonly": true}, "versionMessage": {"ui:readonly": true} };

    let form_dataResult = {
      metadataModelName: "model A",
      addedDate: "16/2/2020",
      latestVersion: 1,
      key: "KeyValue",
      versionMessage: "message 1",
      documentVersionAddedDate: "16/2/2020",
    };
    let option = 1;
      let res={name:"title 1" , id: 1 ,metadataModelId :2 , metadataModelName: "model A" , addedDate: '16/2/2020' , modifiedDate: '16/2/2020' , latestVersion: 1, deletedDate: '16/2/2020' , documentVersion: {values : [{attributeName:"key" , attributeId :3 , isRequired : true , typeId:6 , value :"KeyValue"}],childrenDocuments : [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}] , documenetScans :["scan 1" , "scan 2"] , id: 4 , versionMessage :"message 1" , author:"author" , addedDate: '16/2/2020'}};
      let { schema, ui_schema, form_data, map } = ParseDocument(res ,option );
    expect(ObjectMock).toHaveBeenCalledTimes(3);
    //first call for ObjectMock
    expect(ObjectMock.mock.calls[0][0]).toStrictEqual({
      metadataModelName: { type: "string", title: "Metadata Model Name" },
      addedDate: { type: "string", title: " Document Added Date" },
      key: { type: "string", title: "key" },
      latestVersion: { type: "number", title: "Latest Version" },
      versionMessage: { type: "string", title: "Version Message" },
      documentVersion: { type: "string", title: "New Version Message" },
      documentVersionAddedDate: {
        type: "string",
        title: "Document Version Added Date",
      }
    });
      expect(ObjectMock.mock.calls[0][1]).toBe("documentVersion");
      expect(ObjectMock.mock.calls[0][2]).toStrictEqual({
        value: {
          type: "string",
          title: "New Version Message",
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });
      //second call for the mock
      expect(ObjectMock.mock.calls[1][0]).toStrictEqual({
        metadataModelName: { type: "string", title: "Metadata Model Name" },
        addedDate: { type: "string", title: " Document Added Date" },
        key: { type: "string", title: "key" },
        latestVersion: { type: "number", title: "Latest Version" },
        versionMessage: { type: "string", title: "Version Message" },
        documentVersion: { type: "string", title: "New Version Message" },
        documentVersionAddedDate: {
          type: "string",
          title: "Document Version Added Date",
        }
      });
      expect(ObjectMock.mock.calls[1][1]).toBe("key");
      expect(ObjectMock.mock.calls[1][2]).toStrictEqual({
        value: {
          type: "string",
          title: "key",
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });
       //third call for the mock
       expect(ObjectMock.mock.calls[2][0]).toStrictEqual(form_dataResult);
      expect(ObjectMock.mock.calls[2][1]).toBe("key");
      expect(ObjectMock.mock.calls[2][2]).toStrictEqual({"configurable": true, "enumerable": true, "value": "KeyValue", "writable": true});
     //expectations for the returned values 
     expect(schema).toStrictEqual(schemaResult);
     expect(ui_schema).toStrictEqual(ui_schemaResult);
     expect(form_data).toStrictEqual(form_dataResult);
     let mapRes = []
     mapRes["key"] = 3;
     expect(JSON.stringify(map)).toEqual(JSON.stringify(mapRes));
  });
 

  it("tests the returned values when option = 1 and error type", () => {
    const ObjectMock = jest.spyOn(Object, "defineProperty")
    let schemaResult = {
      title: "title 1",
      type: "object",
      required: ["documentVersion","key"],
      properties: {
        metadataModelName: { type: "string", title: "Metadata Model Name" },
        addedDate: { type: "string", title: " Document Added Date" },
        key: { type: "", title: "key" },
        latestVersion: { type: "number", title: "Latest Version" },
        versionMessage: { type: "string", title: "Version Message" },
        documentVersion: { type: "string", title: "New Version Message" },
        documentVersionAddedDate: {
          type: "string",
          title: "Document Version Added Date",
        }
      },
    };
    let ui_schemaResult = {"addedDate": {"ui:readonly": true}, "documentVersionAddedDate": {"ui:readonly": true}, "latestVersion": {"ui:readonly": true}, "metadataModelName": {"ui:readonly": true}, "versionMessage": {"ui:readonly": true} };

    let form_dataResult = {
      metadataModelName: "model A",
      addedDate: "16/2/2020",
      latestVersion: 1,
      key: "KeyValue",
      versionMessage: "message 1",
      documentVersionAddedDate: "16/2/2020",
    };
    let option = 1;
      let res={name:"title 1" , id: 1 ,metadataModelId :2 , metadataModelName: "model A" , addedDate: '16/2/2020' , modifiedDate: '16/2/2020' , latestVersion: 1, deletedDate: '16/2/2020' , documentVersion: {values : [{attributeName:"key" , attributeId :3 , isRequired : true , typeId:7 , value :"KeyValue"}],childrenDocuments : [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}] , documenetScans :["scan 1" , "scan 2"] , id: 4 , versionMessage :"message 1" , author:"author" , addedDate: '16/2/2020'}};
      let { schema, ui_schema, form_data, map } = ParseDocument(res ,option );
    expect(ObjectMock).toHaveBeenCalledTimes(3);
    //first call for ObjectMock
    expect(ObjectMock.mock.calls[0][0]).toStrictEqual({
      metadataModelName: { type: "string", title: "Metadata Model Name" },
      addedDate: { type: "string", title: " Document Added Date" },
      key: { type: "", title: "key" },
      latestVersion: { type: "number", title: "Latest Version" },
      versionMessage: { type: "string", title: "Version Message" },
      documentVersion: { type: "string", title: "New Version Message" },
      documentVersionAddedDate: {
        type: "string",
        title: "Document Version Added Date",
      }
    });
      expect(ObjectMock.mock.calls[0][1]).toBe("documentVersion");
      expect(ObjectMock.mock.calls[0][2]).toStrictEqual({
        value: {
          type: "string",
          title: "New Version Message",
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });
      //second call for the mock
      expect(ObjectMock.mock.calls[1][0]).toStrictEqual({
        metadataModelName: { type: "string", title: "Metadata Model Name" },
        addedDate: { type: "string", title: " Document Added Date" },
        key: { type: "", title: "key" },
        latestVersion: { type: "number", title: "Latest Version" },
        versionMessage: { type: "string", title: "Version Message" },
        documentVersion: { type: "string", title: "New Version Message" },
        documentVersionAddedDate: {
          type: "string",
          title: "Document Version Added Date",
        }
      });
      expect(ObjectMock.mock.calls[1][1]).toBe("key");
      expect(ObjectMock.mock.calls[1][2]).toStrictEqual({
        value: {
          type: "",
          title: "key",
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });
       //third call for the mock
       expect(ObjectMock.mock.calls[2][0]).toStrictEqual(form_dataResult);
      expect(ObjectMock.mock.calls[2][1]).toBe("key");
      expect(ObjectMock.mock.calls[2][2]).toStrictEqual({"configurable": true, "enumerable": true, "value": "KeyValue", "writable": true});
     //expectations for the returned values 
     expect(schema).toStrictEqual(schemaResult);
     expect(ui_schema).toStrictEqual(ui_schemaResult);
     expect(form_data).toStrictEqual(form_dataResult);
     let mapRes = []
     mapRes["key"] = 3;
     expect(JSON.stringify(map)).toEqual(JSON.stringify(mapRes));
  });

});