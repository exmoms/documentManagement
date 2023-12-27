import React from "react";
import ReactDom from "react-dom";
import ParseMetaDataModel from "../../../utils/ParseMetaDataModel";
import { cleanup } from "@testing-library/react";
import { mount } from "enzyme";
import Form from "react-jsonschema-form";
import { shallow } from "enzyme";
import { act } from "react-dom/test-utils";
afterEach(cleanup);

describe("ParseMetaDataModel", () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
  it("tests the returned values when type == 6", () => {
    const ObjectMock = jest.spyOn(Object, "defineProperty")
      let res={metaDataModelName:"Model A" , metaDataAttributes:[{metaDataAttributeName:"MetaData 1" , id:1 , isRequired:true ,dataTypeID:6}]}
    let { json_schema, ui_schema, map } = ParseMetaDataModel(res);
    expect(json_schema).toStrictEqual({"properties": {"MetaData 1": {"default": "", "title": "MetaData 1", "type": "string"}}, "required": ["MetaData 1"], "title": "Model A", "type": "object"});
    expect(JSON.stringify(map)).toEqual(JSON.stringify([]));
    expect(ui_schema).toStrictEqual({});
    expect(ObjectMock).toHaveBeenCalledTimes(1);
    expect(ObjectMock.mock.calls[0][0]).toStrictEqual({"MetaData 1": {"default": "", "title": "MetaData 1", "type": "string"}});
    expect(ObjectMock.mock.calls[0][1]).toBe("MetaData 1");
    expect(ObjectMock.mock.calls[0][2]).toStrictEqual({
        value: {
          type: "string",
          title: "MetaData 1",
          default: "",
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });

  });
  

  it("tests the returned values when type == 3 , 5 , 4", () => {
    const ObjectMock = jest.spyOn(Object, "defineProperty")
      let res={metaDataModelName:"Model A" , metaDataAttributes:[{metaDataAttributeName:"MetaData 1" , id:1 , isRequired:true ,dataTypeID:3}]}
    let { json_schema, ui_schema, map } = ParseMetaDataModel(res);
    expect(json_schema).toStrictEqual({"properties": {"MetaData 1": {"default": "", "title": "MetaData 1", "type": "number"}}, "required": ["MetaData 1"], "title": "Model A", "type": "object"});
    expect(JSON.stringify(map)).toEqual(JSON.stringify([]));
    expect(ui_schema).toStrictEqual({});
    expect(ObjectMock).toHaveBeenCalledTimes(1);
    expect(ObjectMock.mock.calls[0][0]).toStrictEqual({"MetaData 1": {"default": "", "title": "MetaData 1", "type": "number"}});
    expect(ObjectMock.mock.calls[0][1]).toBe("MetaData 1");
    expect(ObjectMock.mock.calls[0][2]).toStrictEqual({
        value: {
          type: "number",
          title: "MetaData 1",
          default: "",
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });

  });
 

  it("tests the returned values when type == 1", () => {
    const ObjectMock = jest.spyOn(Object, "defineProperty")
      let res={metaDataModelName:"Model A" , metaDataAttributes:[{metaDataAttributeName:"MetaData 1" , id:1 , isRequired:true ,dataTypeID:1}]}
    let { json_schema, ui_schema, map } = ParseMetaDataModel(res);
    expect(json_schema).toStrictEqual({"properties": {"MetaData 1": {"default": false, "title": "MetaData 1", "type": "boolean"}}, "required": ["MetaData 1"], "title": "Model A", "type": "object"});
    expect(JSON.stringify(map)).toEqual(JSON.stringify([]));
    expect(ui_schema).toStrictEqual({});
    expect(ObjectMock).toHaveBeenCalledTimes(1);
    expect(ObjectMock.mock.calls[0][0]).toStrictEqual({"MetaData 1": {"default": false, "title": "MetaData 1", "type": "boolean"}});
    expect(ObjectMock.mock.calls[0][1]).toBe("MetaData 1");
    expect(ObjectMock.mock.calls[0][2]).toStrictEqual({
        value: {
          type: "boolean",
          title: "MetaData 1",
          default: false,
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });

  });

  it("tests the returned values when type == 2", () => {
    const ObjectMock = jest.spyOn(Object, "defineProperty")
      let res={metaDataModelName:"Model A" , metaDataAttributes:[{metaDataAttributeName:"MetaData 1" , id:1 , isRequired:true ,dataTypeID:2}]}
    let { json_schema, ui_schema, map } = ParseMetaDataModel(res);
    expect(json_schema).toStrictEqual({"properties": {"MetaData 1": {"default": "", "title": "MetaData 1", "type": "string"}}, "required": ["MetaData 1"], "title": "Model A", "type": "object"});
    expect(JSON.stringify(map)).toEqual(JSON.stringify([]));
    expect(ui_schema).toStrictEqual({"MetaData 1":{"ui:widget": "date"}});
    expect(ObjectMock).toHaveBeenCalledTimes(2);
    expect(ObjectMock.mock.calls[0][0]).toStrictEqual({"MetaData 1": {"default": "", "title": "MetaData 1", "type": "string"}});
    expect(ObjectMock.mock.calls[0][1]).toBe("MetaData 1");
    expect(ObjectMock.mock.calls[0][2]).toStrictEqual({
        value: {
          type: "string",
          title: "MetaData 1",
          default: "",
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });
     //the second call for the mock
     expect(ObjectMock.mock.calls[1][0]).toStrictEqual({"MetaData 1":{"ui:widget": "date"}});
    expect(ObjectMock.mock.calls[1][1]).toBe("MetaData 1");
    expect(ObjectMock.mock.calls[1][2]).toStrictEqual({
        value: {
          "ui:widget": "date",
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });
  });
//TBD 
  it("tests the returned values, shall throw error", () => {
    const ObjectMock = jest.spyOn(Object, "defineProperty")
      let res={metaDataModelName:"Model A" , metaDataAttributes:[{metaDataAttributeName:"MetaData 1" , id:1 , isRequired:true ,dataTypeID:7}]}
    let { json_schema, ui_schema, map } = ParseMetaDataModel(res);
    expect(json_schema).toStrictEqual({"properties": {"MetaData 1": {"default": "", "title": "MetaData 1", "type": ""}}, "required": ["MetaData 1"], "title": "Model A", "type": "object"});
    expect(JSON.stringify(map)).toEqual(JSON.stringify([]));
    expect(ui_schema).toStrictEqual({});
    expect(ObjectMock).toHaveBeenCalledTimes(1);
    expect(ObjectMock.mock.calls[0][0]).toStrictEqual({"MetaData 1": {"default": "", "title": "MetaData 1", "type": ""}});
    expect(ObjectMock.mock.calls[0][1]).toBe("MetaData 1");
    expect(ObjectMock.mock.calls[0][2]).toStrictEqual({
        value: {
          type: "",
          title: "MetaData 1",
          default: "",
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });

  });
});