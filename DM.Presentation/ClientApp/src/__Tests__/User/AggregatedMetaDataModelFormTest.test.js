import React from "react";
import ReactDom from "react-dom";
import AggregatedMetaDataModelForm from "../../components/User/AggregatedMetaDataModelForm";
import BrowseAggregatedDocsPopUp from "../../components/User/BrowseAggregatedDocsPopUp";
import { getAvailableAggregatedDocs } from "../../api/FetchData";
import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Autocomplete from "@material-ui/lab/Autocomplete";
afterEach(cleanup);
describe("AggregatedMetaDataModelForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    let aggregatedDocsInfo = [
      { modelId: 1, modelName: "doc1", selectedDoc: { id: 2, name: "doc2" } },
    ];
    const updater = jest.fn();
    const div = document.createElement("div");
    ReactDom.render(
      <AggregatedMetaDataModelForm
        updater={updater}
        aggregatedDocsInfo={aggregatedDocsInfo}
      />,
      div
    );
  });

  test("AggregatedMetaDataModelForm matches snapshot", () => {
    let aggregatedDocsInfo = [
      { modelId: 1, modelName: "doc1", selectedDoc: { id: 2, name: "doc2" } },
    ];
    const updater = jest.fn();
    const component = renderer.create(
      <AggregatedMetaDataModelForm
        updater={updater}
        aggregatedDocsInfo={aggregatedDocsInfo}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("AggregatedMetaDataModelForm addAggreDocOnClickHandler functionality", () => {
    let aggregatedDocsInfo = [
      {
        modelId: 1,
        modelName: "doc1",
        selectedDoc: { id: 2, name: "doc2" },
        childMetaDataModelId: 1,
      },
    ];
    const updater = jest.fn();
    let wrapper = mount(
      <AggregatedMetaDataModelForm
        updater={updater}
        aggregatedDocsInfo={aggregatedDocsInfo}
      />
    );
    //test the intialization
    expect(wrapper.find(BrowseAggregatedDocsPopUp).props().modelId).toBe(-1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).props().show).toBeFalsy();
    //test addAggreDocOnClickHandler
    act(() => {
      wrapper
        .find("#addAggregated1")
        .at(0)
        .props()
        .onClick({ target: { value: "" } });
    });
    wrapper.update();
    expect(wrapper.find(BrowseAggregatedDocsPopUp).props().modelId).toBe(1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).props().show).toBeTruthy();
  });

  test("AggregatedMetaDataModelForm updateStateFromChild functionality when attribName == show", () => {
    let aggregatedDocsInfo = [
      {
        modelId: 1,
        modelName: "doc1",
        selectedDoc: { id: 2, name: "doc2" },
        childMetaDataModelId: 1,
      },
    ];
    const updater = jest.fn();
    let wrapper = mount(
      <AggregatedMetaDataModelForm
        updater={updater}
        aggregatedDocsInfo={aggregatedDocsInfo}
      />
    );
    //test the intialization
    expect(wrapper.find(BrowseAggregatedDocsPopUp).props().modelId).toBe(-1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).props().show).toBeFalsy();
    //click updateStateFromChild
    let attribName = "show";
    let newState = true;
    act(() => {
      wrapper
        .find(BrowseAggregatedDocsPopUp)
        .at(0)
        .props()
        .action(attribName, newState);
    });
    wrapper.update();
    expect(wrapper.find(BrowseAggregatedDocsPopUp).props().show).toBeTruthy();
  });

  test("AggregatedMetaDataModelForm updateStateFromChild functionality when attribName == addDoc", () => {
    let aggregatedDocsInfo = [
      {
        modelId: 1,
        modelName: "doc1",
        selectedDoc: { id: 2, name: "doc2" },
        childMetaDataModelId: 1,
      },
    ];
    const updater = jest.fn();
    const mockConsole = jest.spyOn(console, "log");
    let wrapper = mount(
      <AggregatedMetaDataModelForm
        updater={updater}
        aggregatedDocsInfo={aggregatedDocsInfo}
      />,
      { attachTo: document.body }
    );
    //test the intialization
    expect(wrapper.find(BrowseAggregatedDocsPopUp).props().modelId).toBe(-1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).props().show).toBeFalsy();
    //click updateStateFromChild
    let attribName = "addDoc";
    let newState = {
      modelId: 1,
      modelName: "doc1",
      selectedDoc: { id: 2, name: "AddedDoc" },
      childMetaDataModelId: 1,
      selectedId: 2,
    };
    act(() => {
      wrapper
        .find(BrowseAggregatedDocsPopUp)
        .at(0)
        .props()
        .action(attribName, newState);
    });
    wrapper.update();
    //commented by the developer
    // expect(document.getElementById("table-cell-aggregated-doc" + newState.modelId).innerHTML).toBe(newState.selectedDoc.name);
    var temp = aggregatedDocsInfo;
    var index = -1;
    index = aggregatedDocsInfo.findIndex((item) => {
      return item.modelId === newState.modelId && newState.selectedId !== -1;
    });
    temp[index].selectedDoc = newState.selectedDoc;
    expect(updater).toHaveBeenCalledTimes(1);
    expect(updater.mock.calls[0][0]).toBe(temp);

    // test console.log statement
    expect(mockConsole).toHaveBeenCalledTimes(0);
  });
});
