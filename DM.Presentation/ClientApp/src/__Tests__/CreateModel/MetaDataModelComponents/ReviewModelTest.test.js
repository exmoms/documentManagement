import React from "react";
import ReactDom from "react-dom";
import ReviewModel from "../../../components/CreateModel/MetaDataModelComponent/ReviewModel.js";
import { cleanup } from "@testing-library/react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import TextField from "@material-ui/core/TextField";
import { act } from "react-dom/test-utils";
import Button from "@material-ui/core/Button";
afterEach(cleanup);
describe("Review Model", () => {
  test("renders without crashing", () => {
    const div = document.createElement("div");
    let MetaDataModelNameMocked = "";
    let DocumentClassSelectedMocked = [{}];
    let isCompoundMocked = false;
    let isAggregatedMocked = false;
    let AggregateMetaDataModelsPartsMocked = [
      { childMetaDataModelId: "", AggregateName: "" },
    ];
    let CompoundModelsMocked = [{ IsRequired: false, Caption: "" }];
    let SelectedMetaDataModelsMocked = [
      {
        metaDataModelName: "tested value 1",
        AggregateName: "aggregated name 1",
      },
    ];
    let MetaDataAttributeMock = [
      { Name: "", isRequired: false, dataTypeId: "" },
    ];
    ReactDom.render(
      <ReviewModel
        value={{
          metaDataModelName: MetaDataModelNameMocked,
          documentClassSelected: DocumentClassSelectedMocked,
          isCompound: isCompoundMocked,
          isAggregated: isAggregatedMocked,
          aggregateMetaDataModelsParts: AggregateMetaDataModelsPartsMocked,
          compoundModels: CompoundModelsMocked,
          selectedMetaDataModels: SelectedMetaDataModelsMocked,
          metaDataAttribute: MetaDataAttributeMock,
        }}
      />,
      div
    );
  });

  test("matches snapshot", () => {
    let MetaDataModelNameMocked = "Meta Data Model Name";
    let DocumentClassSelectedMocked = [{}];
    let isCompoundMocked = false;
    let isAggregatedMocked = false;
    let AggregateMetaDataModelsPartsMocked = [
      { childMetaDataModelId: "", AggregateName: "" },
    ];
    let CompoundModelsMocked = [{ IsRequired: false, Caption: "" }];
    let SelectedMetaDataModelsMocked = [
      {
        metaDataModelName: "tested value 1",
        AggregateName: "aggregated name 1",
      },
    ];
    let MetaDataAttributeMock = [
      { Name: "", isRequired: false, dataTypeId: "" },
    ];
    const wrapper = shallow(
      <ReviewModel
        value={{
          metaDataModelName: MetaDataModelNameMocked,
          documentClassSelected: DocumentClassSelectedMocked,
          isCompound: isCompoundMocked,
          isAggregated: isAggregatedMocked,
          aggregateMetaDataModelsParts: AggregateMetaDataModelsPartsMocked,
          compoundModels: CompoundModelsMocked,
          selectedMetaDataModels: SelectedMetaDataModelsMocked,
          metaDataAttribute: MetaDataAttributeMock,
        }}
      />
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test("test the functionality of the component", () => {
    let MetaDataModelNameMocked = "Meta Data Model Name";
    let DocumentClassSelectedMocked = {
      documentClassName: "Document Class Name 1",
    };
    let isCompoundMocked = false;
    let isAggregatedMocked = true;
    let AggregateMetaDataModelsPartsMocked = [
      { childMetaDataModelId: "", AggregateName: "" },
    ];
    let CompoundModelsMocked = [{ IsRequired: false, Caption: "" }];
    let SelectedMetaDataModelsMocked = [
      {
        metaDataModelName: "tested value 1",
        AggregateName: "aggregated name 1",
      },
    ];
    let MetaDataAttributeMock = [
      { Name: "", isRequired: false, dataTypeId: "" },
    ];
    const wrapper = shallow(
      <ReviewModel
        value={{
          metaDataModelName: MetaDataModelNameMocked,
          documentClassSelected: DocumentClassSelectedMocked,
          isCompound: isCompoundMocked,
          isAggregated: isAggregatedMocked,
          aggregateMetaDataModelsParts: AggregateMetaDataModelsPartsMocked,
          compoundModels: CompoundModelsMocked,
          selectedMetaDataModels: SelectedMetaDataModelsMocked,
          metaDataAttribute: MetaDataAttributeMock,
        }}
      />
    );
    expect(wrapper.find("#ModelName").text()).toBe(
      "modelname: Meta Data Model Name"
    );
    expect(wrapper.find("#DocumentClassName").text()).toBe(
      "documentparagraph: Document Class Name 1"
    );
    expect(wrapper.find("#isCompound").text()).toBe("notcompoundmodel");
    expect(wrapper.find("#isAggregated").text()).toBe(
      "aggregatedmodelincludes"
    );
  });
});
