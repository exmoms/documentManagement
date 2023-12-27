import React from "react";
import ReactDom from "react-dom";
import ModelAttatchments from "../../../components/CreateModel/MetaDataModelComponent/ModelAttatchments.js";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { act } from "react-dom/test-utils";
import ReactDOM from "react-dom";
afterEach(cleanup);
describe("ModelAttatchments", () => {
  test("renders without crashing", () => {
    const div = document.createElement("div");
    const handelIsCompoundMock = jest.fn();
    const handelIsAggregatedMock = jest.fn();
    const handelCompoundModelsMock = jest.fn();
    const handelAggregateMetaDataModelsPartsMock = jest.fn();
    const handelSelectedMetaDataModelsMock = jest.fn();

    let isCompoundMocked = false;
    let isAggregatedMocked = false;
    let AggregateMetaDataModelsPartsMocked = [
      { childMetaDataModelId: "", AggregateName: "" },
    ];
    let MetaDataModelsMocked = [];
    let CompoundModelsMocked = [{ IsRequired: false, Caption: "" }];
    let SelectedMetaDataModelsMocked = [];
    ReactDom.render(
      <ModelAttatchments
        handelIsCompound={handelIsCompoundMock}
        handelIsAggregated={handelIsAggregatedMock}
        handelCompoundModels={handelCompoundModelsMock}
        handelAggregateMetaDataModelsParts={
          handelAggregateMetaDataModelsPartsMock
        }
        handelSelectedMetaDataModels={handelSelectedMetaDataModelsMock}
        value={{
          isCompound: isCompoundMocked,
          isAggregated: isAggregatedMocked,
          aggregateMetaDataModelsParts: AggregateMetaDataModelsPartsMocked,
          MetaDataModels: MetaDataModelsMocked,
          compoundModels: CompoundModelsMocked,
          selectedMetaDataModels: SelectedMetaDataModelsMocked,
        }}
      />,
      div
    );
  });
  test("matches snapshot", async () => {
    const handelIsCompoundMock = jest.fn();
    const handelIsAggregatedMock = jest.fn();
    const handelCompoundModelsMock = jest.fn();
    const handelAggregateMetaDataModelsPartsMock = jest.fn();
    const handelSelectedMetaDataModelsMock = jest.fn();

    let isCompoundMocked = true;
    let isAggregatedMocked = false;
    let AggregateMetaDataModelsPartsMocked = [
      { childMetaDataModelId: "", AggregateName: "" },
    ];
    let MetaDataModelsMocked = [];
    let CompoundModelsMocked = [{ IsRequired: false, Caption: "" }];
    let SelectedMetaDataModelsMocked = [];
    const wrapper = shallow(
      <ModelAttatchments
        handelIsCompound={handelIsCompoundMock}
        handelIsAggregated={handelIsAggregatedMock}
        handelCompoundModels={handelCompoundModelsMock}
        handelAggregateMetaDataModelsParts={
          handelAggregateMetaDataModelsPartsMock
        }
        handelSelectedMetaDataModels={handelSelectedMetaDataModelsMock}
        value={{
          isCompound: isCompoundMocked,
          isAggregated: isAggregatedMocked,
          aggregateMetaDataModelsParts: AggregateMetaDataModelsPartsMocked,
          MetaDataModels: MetaDataModelsMocked,
          compoundModels: CompoundModelsMocked,
          selectedMetaDataModels: SelectedMetaDataModelsMocked,
        }}
      />
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test("handles props component", async () => {
    const handelIsCompoundMock = jest.fn();
    const handelIsAggregatedMock = jest.fn();
    const handelCompoundModelsMock = jest.fn();
    const handelAggregateMetaDataModelsPartsMock = jest.fn();
    const handelSelectedMetaDataModelsMock = jest.fn();

    let isCompoundMocked = true;
    let isAggregatedMocked = true;
    let AggregateMetaDataModelsPartsMocked = [
      { childMetaDataModelId: "", AggregateName: "" },
    ];
    let MetaDataModelsMocked = [
      { metaDataModelId: 1, metaDataModelName: "meta data model 1" },
      { metaDataModelId: 2, metaDataModelName: "meta data model 2" },
    ];
    let CompoundModelsMocked = [
      { isRequired: false, caption: "tested value 1" },
      { isRequired: true, caption: "tested value 2" },
    ];
    let SelectedMetaDataModelsMocked = [
      { metaDataModelId: 1, metaDataModelName: "meta data model 1" },
    ];
    let wrapper = mount(
      <ModelAttatchments
        handelisCompound={handelIsCompoundMock}
        handelisAggregated={handelIsAggregatedMock}
        handelcompoundModels={handelCompoundModelsMock}
        handelaggregateMetaDataModelsParts={
          handelAggregateMetaDataModelsPartsMock
        }
        handelselectedMetaDataModels={handelSelectedMetaDataModelsMock}
        value={{
          isCompound: isCompoundMocked,
          isAggregated: isAggregatedMocked,
          aggregateMetaDataModelsParts: AggregateMetaDataModelsPartsMocked,
          MetaDataModels: MetaDataModelsMocked,
          compoundModels: CompoundModelsMocked,
          selectedMetaDataModels: SelectedMetaDataModelsMocked,
        }}
      />,
      { attachTo: document.body }
    );

    expect(wrapper.find(".isCompound").at(0).props().value).toBeTruthy();
    expect(wrapper.find(".isAggregated").at(0).props().value).toBeTruthy();
    //  //test CompoundModels setting
    act(() => {
      wrapper.useEffect;
    });
    wrapper.update();
    act(() => {
      wrapper
        .find(".isCompound")
        .at(0)
        .props()
        .onChange({ target: { name: "isCompound", checked: true } });
      wrapper
        .find(".isAggregated")
        .at(0)
        .props()
        .onChange({ target: { name: "isAggregated", checked: true } });
    });
    wrapper.update();
    expect(handelIsCompoundMock).toHaveBeenCalledTimes(1);
    expect(handelIsAggregatedMock).toHaveBeenCalledTimes(1);
    CompoundModelsMocked.map((item, index) => {
      expect(document.getElementById("NameOfAttatchment" + index).value).toBe(
        CompoundModelsMocked[index].caption
      );
      if (index == 0) {
        expect(document.getElementById("isRequired" + index).value).toBe(
          "false"
        );
      } else {
        expect(document.getElementById("isRequired" + index).value).toBe(
          "true"
        );
      }
    });

    //test AggregateMetaDataModelsParts setting
    AggregateMetaDataModelsPartsMocked.map((item, index) => {
      expect(document.getElementById("dataId" + index).value).toBe(
        AggregateMetaDataModelsPartsMocked[index].AggregateName
      );
      expect(document.getElementById("modelName" + index)).toBeInTheDocument();
      expect(document.getElementById("modelName" + index).value).toBe(
        SelectedMetaDataModelsMocked[index].metaDataModelName
      );
    });
  });

  test("test remove Field functionality for CompoundModels", async () => {
    const handelIsCompoundMock = jest.fn();
    const handelIsAggregatedMock = jest.fn();
    const handelCompoundModelsMock = jest.fn();
    const handelAggregateMetaDataModelsPartsMock = jest.fn();
    const handelSelectedMetaDataModelsMock = jest.fn();

    let isCompoundMocked = true;
    let isAggregatedMocked = true;
    let AggregateMetaDataModelsPartsMocked = [
      { childMetaDataModelId: "", AggregateName: "" },
    ];
    let MetaDataModelsMocked = [
      { metaDataModelId: 1, metaDataModelName: "meta data model 1" },
      { metaDataModelId: 2, metaDataModelName: "meta data model 2" },
    ];
    let CompoundModelsMocked = [
      { IsRequired: false, Caption: "tested value 1" },
      { IsRequired: true, Caption: "tested value 2" },
    ];
    let SelectedMetaDataModelsMocked = [
      { metaDataModelId: 1, metaDataModelName: "meta data model 1" },
    ];
    let wrapper = mount(
      <ModelAttatchments
        handelisCompound={handelIsCompoundMock}
        handelisAggregated={handelIsAggregatedMock}
        handelcompoundModels={handelCompoundModelsMock}
        handelaggregateMetaDataModelsParts={
          handelAggregateMetaDataModelsPartsMock
        }
        handelselectedMetaDataModels={handelSelectedMetaDataModelsMock}
        value={{
          isCompound: isCompoundMocked,
          isAggregated: isAggregatedMocked,
          aggregateMetaDataModelsParts: AggregateMetaDataModelsPartsMocked,
          MetaDataModels: MetaDataModelsMocked,
          compoundModels: CompoundModelsMocked,
          selectedMetaDataModels: SelectedMetaDataModelsMocked,
        }}
      />,
      { attachTo: document.body }
    );
    act(() => {
      fireEvent.click(document.getElementById("removeCompound"));
    });
    wrapper.update();
    expect(handelCompoundModelsMock).toHaveBeenCalledTimes(1);
    let CompoundModelsArgument = CompoundModelsMocked;
    CompoundModelsArgument.splice(0, 1);
    expect(handelCompoundModelsMock.mock.calls[0][0]).toStrictEqual(
      CompoundModelsArgument
    );
  });

  test("test add Field functionality for CompoundModels", async () => {
    const handelIsCompoundMock = jest.fn();
    const handelIsAggregatedMock = jest.fn();
    const handelCompoundModelsMock = jest.fn();
    const handelAggregateMetaDataModelsPartsMock = jest.fn();
    const handelSelectedMetaDataModelsMock = jest.fn();

    let isCompoundMocked = true;
    let isAggregatedMocked = true;
    let AggregateMetaDataModelsPartsMocked = [
      { childMetaDataModelId: "", AggregateName: "" },
    ];
    let MetaDataModelsMocked = [
      { metaDataModelId: 1, metaDataModelName: "meta data model 1" },
      { metaDataModelId: 2, metaDataModelName: "meta data model 2" },
    ];
    let CompoundModelsMocked = [
      { IsRequired: false, Caption: "tested value 1" },
      { IsRequired: true, Caption: "tested value 2" },
    ];
    let SelectedMetaDataModelsMocked = [
      { metaDataModelId: 1, metaDataModelName: "meta data model 1" },
    ];
    let wrapper = mount(
      <ModelAttatchments
        handelisCompound={handelIsCompoundMock}
        handelisAggregated={handelIsAggregatedMock}
        handelcompoundModels={handelCompoundModelsMock}
        handelaggregateMetaDataModelsParts={
          handelAggregateMetaDataModelsPartsMock
        }
        handelselectedMetaDataModels={handelSelectedMetaDataModelsMock}
        value={{
          isCompound: isCompoundMocked,
          isAggregated: isAggregatedMocked,
          aggregateMetaDataModelsParts: AggregateMetaDataModelsPartsMocked,
          MetaDataModels: MetaDataModelsMocked,
          compoundModels: CompoundModelsMocked,
          selectedMetaDataModels: SelectedMetaDataModelsMocked,
        }}
      />,
      { attachTo: document.body }
    );
    act(() => {
      fireEvent.click(document.getElementById("addCompound"));
    });
    wrapper.update();
    expect(handelCompoundModelsMock).toHaveBeenCalledTimes(1);
    let CompoundModelsArgument = CompoundModelsMocked;
    CompoundModelsArgument.push({ isRequired: false, caption: "" });
    expect(handelCompoundModelsMock.mock.calls[0][0]).toStrictEqual(
      CompoundModelsArgument
    );
  });

  test("test remove Field functionality for AggregateMetaDataModelsParts", async () => {
    const handelIsCompoundMock = jest.fn();
    const handelIsAggregatedMock = jest.fn();
    const handelCompoundModelsMock = jest.fn();
    const handelAggregateMetaDataModelsPartsMock = jest.fn();
    const handelSelectedMetaDataModelsMock = jest.fn();

    let isCompoundMocked = true;
    let isAggregatedMocked = true;
    let AggregateMetaDataModelsPartsMocked = [
      { childMetaDataModelId: "", AggregateName: "" },
    ];
    let MetaDataModelsMocked = [
      { metaDataModelId: 1, metaDataModelName: "meta data model 1" },
      { metaDataModelId: 2, metaDataModelName: "meta data model 2" },
    ];
    let CompoundModelsMocked = [
      { IsRequired: false, Caption: "tested value 1" },
      { IsRequired: true, Caption: "tested value 2" },
    ];
    let SelectedMetaDataModelsMocked = [
      { metaDataModelId: 1, metaDataModelName: "meta data model 1" },
    ];
    let wrapper = mount(
      <ModelAttatchments
        handelisCompound={handelIsCompoundMock}
        handelisAggregated={handelIsAggregatedMock}
        handelcompoundModels={handelCompoundModelsMock}
        handelaggregateMetaDataModelsParts={
          handelAggregateMetaDataModelsPartsMock
        }
        handelselectedMetaDataModels={handelSelectedMetaDataModelsMock}
        value={{
          isCompound: isCompoundMocked,
          isAggregated: isAggregatedMocked,
          aggregateMetaDataModelsParts: AggregateMetaDataModelsPartsMocked,
          MetaDataModels: MetaDataModelsMocked,
          compoundModels: CompoundModelsMocked,
          selectedMetaDataModels: SelectedMetaDataModelsMocked,
        }}
      />,
      { attachTo: document.body }
    );
    act(() => {
      fireEvent.click(document.getElementById("RemoveAggergate"));
    });
    wrapper.update();
    expect(handelAggregateMetaDataModelsPartsMock).toHaveBeenCalledTimes(1);
    let AggregateMetaDataModelsPartsArgument = AggregateMetaDataModelsPartsMocked;
    AggregateMetaDataModelsPartsArgument.splice(0, 1);
    expect(
      handelAggregateMetaDataModelsPartsMock.mock.calls[0][0]
    ).toStrictEqual(AggregateMetaDataModelsPartsArgument);
  });

  test("test add Field functionality for AggregateMetaDataModelsParts", async () => {
    const handelIsCompoundMock = jest.fn();
    const handelIsAggregatedMock = jest.fn();
    const handelCompoundModelsMock = jest.fn();
    const handelAggregateMetaDataModelsPartsMock = jest.fn();
    const handelSelectedMetaDataModelsMock = jest.fn();

    let isCompoundMocked = true;
    let isAggregatedMocked = true;
    let AggregateMetaDataModelsPartsMocked = [
      { childMetaDataModelId: "", aggregateName: "" },
    ];
    let MetaDataModelsMocked = [
      { metaDataModelId: 1, metaDataModelName: "meta data model 1" },
      { metaDataModelId: 2, metaDataModelName: "meta data model 2" },
    ];
    let CompoundModelsMocked = [
      { IsRequired: false, Caption: "tested value 1" },
      { IsRequired: true, Caption: "tested value 2" },
    ];
    let SelectedMetaDataModelsMocked = [
      { metaDataModelId: 1, metaDataModelName: "meta data model 1" },
    ];
    let wrapper = mount(
      <ModelAttatchments
        handelisCompound={handelIsCompoundMock}
        handelisAggregated={handelIsAggregatedMock}
        handelcompoundModels={handelCompoundModelsMock}
        handelaggregateMetaDataModelsParts={
          handelAggregateMetaDataModelsPartsMock
        }
        handelselectedMetaDataModels={handelSelectedMetaDataModelsMock}
        value={{
          isCompound: isCompoundMocked,
          isAggregated: isAggregatedMocked,
          aggregateMetaDataModelsParts: AggregateMetaDataModelsPartsMocked,
          MetaDataModels: MetaDataModelsMocked,
          compoundModels: CompoundModelsMocked,
          selectedMetaDataModels: SelectedMetaDataModelsMocked,
        }}
      />,
      { attachTo: document.body }
    );
    act(() => {
      fireEvent.click(document.getElementById("AddAggergate"));
    });
    wrapper.update();
    expect(handelAggregateMetaDataModelsPartsMock).toHaveBeenCalledTimes(1);
    let AggregateMetaDataModelsPartsArgument = AggregateMetaDataModelsPartsMocked;
    AggregateMetaDataModelsPartsArgument.push({
      childMetaDataModelId: "",
      aggregateName: "",
    });
    expect(
      handelAggregateMetaDataModelsPartsMock.mock.calls[0][0]
    ).toStrictEqual(AggregateMetaDataModelsPartsArgument);
  });
});
