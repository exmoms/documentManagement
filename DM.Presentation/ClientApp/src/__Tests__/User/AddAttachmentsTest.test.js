import React from "react";
import ReactDom from "react-dom";
import AddAttachments from "../../components/User/AddAttachments";
import BrowseAggregatedDocsPopUp from "../../components/User/BrowseAggregatedDocsPopUp";
import { getAvailableAggregatedDocs } from "../../api/FetchData";
import { cleanup, fireEvent } from "@testing-library/react";
import renderer from "react-test-renderer";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
afterEach(cleanup);
describe("AddAttachments", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    let compoundModelsInfo = [
      { compoundModelId: 1, attachedFile: { id: 2, name: "AttachedDoc2" } },
    ];
    const updater = jest.fn();
    const div = document.createElement("div");
    ReactDom.render(
      <AddAttachments
        updater={updater}
        compoundModelsInfo={compoundModelsInfo}
      />,
      div
    );
  });

  test("AddAttachments matches snapshot", () => {
    let compoundModelsInfo = [
      { compoundModelId: 1, attachedFile: { id: 2, name: "AttachedDoc2" } },
    ];
    const updater = jest.fn();
    const component = renderer.create(
      <AddAttachments
        updater={updater}
        compoundModelsInfo={compoundModelsInfo}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("AddAttachments addAttachmentcOnClickHandler functionality", () => {
    //TBD
    let compoundModelsInfo = [
      {
        compoundModelId: 1,
        attachedFile: { id: 2, name: "AttachedDoc2" },
        isRequiered: true,
      },
      {
        compoundModelId: 2,
        attachedFile: { id: 2, name: "AttachedDoc2" },
        isRequiered: true,
      },
    ];
    const updater = jest.fn();
    const clickEvent = jest.fn();
    let wrapper = mount(
      <AddAttachments
        updater={updater}
        compoundModelsInfo={compoundModelsInfo}
      />,
      { attachTo: document.body }
    );
    // document.getElementById("addAttachment1").addEventListener('click', clickEvent)
    // const mockClick = jest.spyOn(document.getElementById("addAttachment1"), 'click')
    const mockConsole = jest.spyOn(console, "log");
    //click addAttachmentcOnClickHandler
    act(() => {
      wrapper
        .find("#addAttachment1")
        .at(0)
        .props()
        .onClick({ target: { value: "" } });
    });
    wrapper.update();
    expect(mockConsole).toHaveBeenCalledTimes(2);
    expect(mockConsole.mock.calls[0][0]).toBe(
      "call the click event on an attachment with id 1"
    );
    expect(mockConsole.mock.calls[1][0]).toBe(
      "call the click event on an attachment with id 1"
    );
    // expect(mockClick).toHaveBeenCalledTimes(1);
  });

  test("AddAttachments onChangeFile functionality and is valid", async () => {
    let compoundModelsInfo = [
      {
        compoundModelId: 1,
        attachedFile: { id: 2, name: "AttachedDoc2" },
        isRequiered: true,
      },
    ];
    const updater = jest.fn();
    const stopPropagationMock = jest.fn();
    const preventDefaultMock = jest.fn();
    let wrapper = mount(
      <AddAttachments
        updater={updater}
        compoundModelsInfo={compoundModelsInfo}
      />
    );
    //click addAttachmentcOnClickHandler
    expect(wrapper.find(".onChangeFile1").length).toBe(1);
    act(() => {
      wrapper
        .find(".onChangeFile1")
        .at(0)
        .props()
        .onChange({
          target: { id: 1, files: [{ name: "file1" }] },
          stopPropagation: stopPropagationMock,
          preventDefault: preventDefaultMock,
        });
    });
    wrapper.update();
    expect(stopPropagationMock).toHaveBeenCalledTimes(1);
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    expect(
      document.getElementById("table-cell-aggregated-doc1").innerHTML
    ).toBe("file1");
    expect(updater).toHaveBeenCalledTimes(1);
    //first argument for first call of the mock
    let temp = compoundModelsInfo;
    let file = { name: "file1" };
    let index_ = -1;
    index_ = compoundModelsInfo.findIndex((item) => {
      return item.compoundModelId === 1;
    });
    temp[index_].attachedFile = file;
    expect(updater.mock.calls[0][0]).toBe(temp);
    expect(updater.mock.calls[0][1]).toBeTruthy();
  });

  test("AddAttachments onChangeFile functionality and is not valid", async () => {
    let compoundModelsInfo = [
      {
        compoundModelId: 1,
        attachedFile: { id: 2, name: "AttachedDoc2" },
        isRequiered: true,
      },
      {
        compoundModelId: 2,
        attachedFile: { id: 2, name: "AttachedDoc2" },
        isRequiered: true,
      },
    ];
    const updater = jest.fn();
    const stopPropagationMock = jest.fn();
    const preventDefaultMock = jest.fn();
    let wrapper = mount(
      <AddAttachments
        updater={updater}
        compoundModelsInfo={compoundModelsInfo}
      />
    );
    //click addAttachmentcOnClickHandler
    expect(wrapper.find(".onChangeFile1").length).toBe(1);
    act(() => {
      wrapper
        .find(".onChangeFile1")
        .at(0)
        .props()
        .onChange({
          target: { id: 1, files: [{ name: "AttachedDoc2" }] },
          stopPropagation: stopPropagationMock,
          preventDefault: preventDefaultMock,
        });
    });
    wrapper.update();
    expect(stopPropagationMock).toHaveBeenCalledTimes(1);
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    expect(
      wrapper.find("#table-cell-aggregated-doc1").innerHTML
    ).toBeUndefined();
    expect(wrapper.find(Dialog).props().open).toBeTruthy();
  });

  test("AddAttachments renderDuplicatedAttachmentsDialog functionality , toggleShow functionality", async () => {
    let compoundModelsInfo = [
      {
        compoundModelId: 1,
        attachedFile: { id: 2, name: "AttachedDoc2" },
        isRequiered: true,
      },
      {
        compoundModelId: 2,
        attachedFile: { id: 2, name: "AttachedDoc2" },
        isRequiered: true,
      },
    ];
    const updater = jest.fn();
    const stopPropagationMock = jest.fn();
    const preventDefaultMock = jest.fn();
    let wrapper = mount(
      <AddAttachments
        updater={updater}
        compoundModelsInfo={compoundModelsInfo}
      />
    );
    //click addAttachmentcOnClickHandler to open the dialog
    act(() => {
      wrapper
        .find(".onChangeFile1")
        .at(0)
        .props()
        .onChange({
          target: { id: 1, files: [{ name: "AttachedDoc2" }] },
          stopPropagation: stopPropagationMock,
          preventDefault: preventDefaultMock,
        });
    });
    wrapper.update();
    expect(stopPropagationMock).toHaveBeenCalledTimes(1);
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    expect(
      wrapper.find("#table-cell-aggregated-doc1").innerHTML
    ).toBeUndefined();
    expect(wrapper.find(Dialog).props().open).toBeTruthy();
    //click onClose for dialog
    act(() => {
      wrapper
        .find(Dialog)
        .props()
        .onClose({ target: { value: "" } });
    });
    wrapper.update();
    expect(wrapper.find(Dialog).innerHTML).toBeUndefined();
  });

  test("AddAttachments renderDuplicatedAttachmentsDialog functionality , addAttachmentcOnClickHandler functionality", async () => {
    let compoundModelsInfo = [
      {
        compoundModelId: 1,
        attachedFile: { id: 2, name: "AttachedDoc2" },
        isRequiered: true,
      },
      {
        compoundModelId: 2,
        attachedFile: { id: 2, name: "AttachedDoc2" },
        isRequiered: true,
      },
    ];
    const updater = jest.fn();
    const stopPropagationMock = jest.fn();
    const preventDefaultMock = jest.fn();
    const mockConsole = jest.spyOn(console, "log");
    let wrapper = mount(
      <AddAttachments
        updater={updater}
        compoundModelsInfo={compoundModelsInfo}
      />
    );
    //click addAttachmentcOnClickHandler to open the dialog
    act(() => {
      wrapper
        .find(".onChangeFile1")
        .at(0)
        .props()
        .onChange({
          target: { id: 1, files: [{ name: "AttachedDoc2" }] },
          stopPropagation: stopPropagationMock,
          preventDefault: preventDefaultMock,
        });
    });
    wrapper.update();
    expect(stopPropagationMock).toHaveBeenCalledTimes(1);
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    expect(
      wrapper.find("#table-cell-aggregated-doc1").innerHTML
    ).toBeUndefined();
    expect(wrapper.find(Dialog).props().open).toBeTruthy();
    //click onClose for dialog
    act(() => {
      wrapper
        .find("#addAttachmentcOnClickHandlerButton0")
        .at(0)
        .props()
        .onClick({ target: { value: "" } });
    });
    wrapper.update();
    expect(mockConsole).toHaveBeenCalledTimes(1);
    expect(mockConsole.mock.calls[0][0]).toBe(
      "call the click event on an attachment with id 1"
    );
    // toggleShow
    expect(wrapper.find(Dialog).innerHTML).toBeUndefined();
  });
});
