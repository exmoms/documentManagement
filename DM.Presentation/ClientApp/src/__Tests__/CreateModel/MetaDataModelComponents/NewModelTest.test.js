import React from "react";
import ReactDom from "react-dom";
import NewModel from "../../../components/CreateModel/MetaDataModelComponent/NewModel.js";
import { cleanup } from "@testing-library/react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import TextField from "@material-ui/core/TextField";
import { act } from "react-dom/test-utils";
afterEach(cleanup);
describe("NewModel", () => {
  test("renders without crashing", () => {
    const div = document.createElement("div");
    const onSetModelName = jest.fn();
    const onSetModelClassId = jest.fn();
    const handelDocumentClassSelectedMock = jest.fn();
    let MetaDataModelNameMocked = "";
    let DocumentClassIdMocked = 0;
    let DocumentClassListMocked = [];
    let DocumentClassSelectedMocked = [{}];
    ReactDom.render(
      <NewModel
        onSetModelName={onSetModelName}
        onSetModelClassId={onSetModelClassId}
        handeldocumentClassSelected={handelDocumentClassSelectedMock}
        value={{
          metaDataModelName: MetaDataModelNameMocked,
          documentClassId: DocumentClassIdMocked,
          DocumentClassList: DocumentClassListMocked,
          documentClassSelected: DocumentClassSelectedMocked,
        }}
      />,
      div
    );
  });
  test("matches snapshot", async () => {
    const onSetModelName = jest.fn();
    const onSetModelClassId = jest.fn();
    const handelDocumentClassSelectedMock = jest.fn();
    let MetaDataModelNameMocked = "";
    let DocumentClassIdMocked = 0;
    let DocumentClassListMocked = [];
    let DocumentClassSelectedMocked = [{}];
    const wrapper = shallow(
      <NewModel
        onSetModelName={onSetModelName}
        onSetModelClassId={onSetModelClassId}
        handeldocumentClassSelected={handelDocumentClassSelectedMock}
        value={{
          metaDataModelName: MetaDataModelNameMocked,
          documentClassId: DocumentClassIdMocked,
          DocumentClassList: DocumentClassListMocked,
          documentClassSelected: DocumentClassSelectedMocked,
        }}
      />
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test("test passing data to props functionality", () => {
    const onSetModelNameMock = jest.fn();
    const onSetModelClassIdMock = jest.fn();
    const handelDocumentClassSelectedMock = jest.fn();
    let MetaDataModelNameMocked = "";
    let DocumentClassIdMocked = 0;
    let DocumentClassListMocked = [];
    let DocumentClassSelectedMocked = [{ documentClassId: 1 }];
    let wrapper;
    wrapper = shallow(
      <NewModel
        onSetModelName={onSetModelNameMock}
        onSetModelClassId={onSetModelClassIdMock}
        handeldocumentClassSelected={handelDocumentClassSelectedMock}
        value={{
          metaDataModelName: MetaDataModelNameMocked,
          documentClassId: DocumentClassIdMocked,
          DocumentClassList: DocumentClassListMocked,
          documentClassSelected: DocumentClassSelectedMocked,
          step_1_error:true
        }}
      />
    );
    //expectations
    expect(wrapper.find(TextField).at(0).props().value).toBe(
      MetaDataModelNameMocked
    );
    expect(wrapper.find(".ComboBox").at(0).props().value).toStrictEqual({"documentClassSelected": [{"documentClassId": 1}], "step_1_error": true});
    expect(wrapper.find(".ComboBox").at(0).props().options).toBe(
      DocumentClassListMocked
    );
    act(() => {
      wrapper
        .find(TextField)
        .at(0)
        .simulate("change", { target: { value: "test2", name: "modelName" } });
      wrapper.find(".ComboBox").at(0).simulate("change", "", { id: 1 });
    });
    expect(onSetModelNameMock).toHaveBeenCalledTimes(1);
    expect(onSetModelNameMock.mock.calls[0][0]).toStrictEqual("test2");
    expect(onSetModelClassIdMock).toHaveBeenCalledTimes(1);
    expect(onSetModelClassIdMock.mock.calls[0][0]).toStrictEqual(1);
    expect(handelDocumentClassSelectedMock).toHaveBeenCalledTimes(1);
    expect(handelDocumentClassSelectedMock.mock.calls[0][0]).toStrictEqual({
      id: 1,
    });
  });

  test("error and helperText props functionality", () => {
    const onSetModelNameMock = jest.fn();
    const onSetModelClassIdMock = jest.fn();
    const handelDocumentClassSelectedMock = jest.fn();
    let MetaDataModelNameMocked = "";
    let DocumentClassIdMocked = 0;
    let DocumentClassListMocked = [];
    let DocumentClassSelectedMocked = [{ documentClassId: 1 }];
    let wrapper;
    wrapper = shallow(
      <NewModel
        onSetModelName={onSetModelNameMock}
        onSetModelClassId={onSetModelClassIdMock}
        handeldocumentClassSelected={handelDocumentClassSelectedMock}
        value={{
          metaDataModelName: MetaDataModelNameMocked,
          documentClassId: DocumentClassIdMocked,
          DocumentClassList: DocumentClassListMocked,
          documentClassSelected: DocumentClassSelectedMocked,
          step_1_error:true
        }}
      />
    );
    //expectations
    expect(wrapper.find(TextField).at(0).props().error).toBeTruthy();
    expect(wrapper.find(TextField).at(0).props().helperText).toBe("fill_out_field");
  });

  test("error and helperText props functionality when false ", () => {
    const onSetModelNameMock = jest.fn();
    const onSetModelClassIdMock = jest.fn();
    const handelDocumentClassSelectedMock = jest.fn();
    let MetaDataModelNameMocked = "";
    let DocumentClassIdMocked = 0;
    let DocumentClassListMocked = [];
    let DocumentClassSelectedMocked = [{ documentClassId: 1 }];
    let wrapper;
    wrapper = shallow(
      <NewModel
        onSetModelName={onSetModelNameMock}
        onSetModelClassId={onSetModelClassIdMock}
        handeldocumentClassSelected={handelDocumentClassSelectedMock}
        value={{
          metaDataModelName: MetaDataModelNameMocked,
          documentClassId: DocumentClassIdMocked,
          DocumentClassList: DocumentClassListMocked,
          documentClassSelected: DocumentClassSelectedMocked,
          step_1_error:false
        }}
      />
    );
    //expectations
    expect(wrapper.find(TextField).at(0).props().error).toBeFalsy();
    expect(wrapper.find(TextField).at(0).props().helperText).toBe("");
  });
});
