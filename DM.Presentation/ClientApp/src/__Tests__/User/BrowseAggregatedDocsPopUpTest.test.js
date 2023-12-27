import React from "react";
import ReactDom from "react-dom";
import BrowseAggregatedDocsPopUp from "../../components/User/BrowseAggregatedDocsPopUp";
import SearchDocuments from "../../components/User/SearchDocuments";
import DocumentTable from "../../components/User/DocumentTable";
import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Autocomplete from "@material-ui/lab/Autocomplete";
afterEach(cleanup);
describe("BrowseAggregatedDocsPopUp", () => {
  test("renders without crashing", () => {
    let modelId = 0;
    let browseDocs = [];
    let show = false;
    const action = jest.fn();
    const div = document.createElement("div");
    ReactDom.render(
      <BrowseAggregatedDocsPopUp
        modelId={modelId}
        show={show}
        action={action}
      />,
      div
    );
  });

  test("BrowseAggregatedDocsPopUp matches snapshot", () => {
    let modelId = 0;
    let browseDocs = [];
    let show = false;
    const action = jest.fn();
    const component = renderer.create(
      <BrowseAggregatedDocsPopUp
        modelId={modelId}
        show={show}
        action={action}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("Select functionality", () => {
    let modelIdMock = 2;
    let browseDocs = [
      {
        id: 0,
        name: "first document",
        latestVersion: 1,
      },
      {
        id: 1,
        name: "second document",
        latestVersion: 2,
      },
      {
        id: 2,
        name: "third document",
        latestVersion: 3,
      },
    ];
    let show = true;
    const action = jest.fn();
    let wrapper = mount(
      <BrowseAggregatedDocsPopUp
        modelId={modelIdMock}
        show={show}
        action={action}
      />
    );
    //test intialization
    expect(wrapper.find(SearchDocuments).at(0).props().modelId).toBe(
      modelIdMock
    );
    expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
    expect(wrapper.find(DocumentTable).at(0).props().data).toStrictEqual([]);
    act(() => {
      wrapper
        .find(DocumentTable)
        .at(0)
        .props()
        .handleSelect({ id: 1, name: "tested value" });
    });
    wrapper.update();
    expect(action).toHaveBeenCalledTimes(2);
    expect(action.mock.calls[0][0]).toStrictEqual("addDoc");
    expect(action.mock.calls[0][1]).toStrictEqual({
      modelId: modelIdMock,
      selectedDoc: { id: 1, name: "tested value" },
    });
    expect(action.mock.calls[1][0]).toStrictEqual("show");
    expect(action.mock.calls[1][1]).toBe(false);
  });

  test("Cancel functionality", () => {
    let modelIdMock = 0;
    let browseDocs = [
      {
        id: 0,
        name: "first document",
        latestVersion: 1,
      },
      {
        id: 1,
        name: "second document",
        latestVersion: 2,
      },
      {
        id: 2,
        name: "third document",
        latestVersion: 3,
      },
    ];
    let show = true;
    const action = jest.fn();
    let wrapper = mount(
      <BrowseAggregatedDocsPopUp
        modelId={modelIdMock}
        browseDocs={browseDocs}
        show={show}
        action={action}
      />
    );
    act(() => {
      wrapper
        .find("#CancelButton")
        .at(0)
        .props()
        .onClick({ target: { value: "" } });
    });
    wrapper.update();
    expect(action).toHaveBeenCalledTimes(1);
    expect(action.mock.calls[0][0]).toStrictEqual("show");
    expect(action.mock.calls[0][1]).toBe(false);
  });

  test("getDocumentList functionality", () => {
    let modelIdMock = 0;
    let browseDocs = [
      {
        id: 0,
        name: "first document",
        latestVersion: 1,
      },
      {
        id: 1,
        name: "second document",
        latestVersion: 2,
      },
      {
        id: 2,
        name: "third document",
        latestVersion: 3,
      },
    ];
    let show = true;
    const action = jest.fn();
    let wrapper = mount(
      <BrowseAggregatedDocsPopUp
        modelId={modelIdMock}
        browseDocs={browseDocs}
        show={show}
        action={action}
      />
    );
    act(() => {
      wrapper
        .find(SearchDocuments)
        .at(0)
        .props()
        .getDocumentList([
          { id: 1, name: "tested value 1" },
          { id: 2, name: "tested value 2" },
        ]);
    });
    wrapper.update();
    expect(wrapper.find(DocumentTable).at(0).props().data).toStrictEqual([
      { id: 1, name: "tested value 1", tableData: { id: 0 } },
      { id: 2, name: "tested value 2", tableData: { id: 1 } },
    ]);
  });

  test("Cancel functionality of Dialog", () => {
    let modelIdMock = 0;
    let browseDocs = [
      {
        id: 0,
        name: "first document",
        latestVersion: 1,
      },
      {
        id: 1,
        name: "second document",
        latestVersion: 2,
      },
      {
        id: 2,
        name: "third document",
        latestVersion: 3,
      },
    ];
    let show = true;
    const action = jest.fn();
    let wrapper = mount(
      <BrowseAggregatedDocsPopUp
        modelId={modelIdMock}
        browseDocs={browseDocs}
        show={show}
        action={action}
      />
    );
    act(() => {
      wrapper.find(Dialog).at(0).props().onClose();
    });
    wrapper.update();
    expect(action).toHaveBeenCalledTimes(1);
    expect(action.mock.calls[0][0]).toStrictEqual("show");
    expect(action.mock.calls[0][1]).toBe(false);
  });
});
