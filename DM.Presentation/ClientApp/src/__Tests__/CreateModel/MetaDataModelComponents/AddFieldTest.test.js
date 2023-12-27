import React from "react";
import ReactDom from "react-dom";
import AddFields from "../../../components/CreateModel/MetaDataModelComponent/AddFields.js";
import { cleanup } from "@testing-library/react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import { act } from "react-dom/test-utils";
import Button from "@material-ui/core/Button";
afterEach(cleanup);
describe("Add Field", () => {
  test("renders without crashing", () => {
    const div = document.createElement("div");
    const handelMetaDataAttributeMock = jest.fn();
    let MetaDataAttribute = [{ Name: "", isRequired: false, dataTypeId: "" }];
    let dateTypes = [
      { id: 1, name: "Bool" },
      { id: 2, name: "Date" },
      { id: 3, name: "Decimal" },
      { id: 4, name: "Double" },
      { id: 5, name: "Int" },
      { id: 6, name: "String" },
    ];
    ReactDom.render(
      <AddFields
        handelmetaDataAttribute={handelMetaDataAttributeMock}
        value={{ metaDataAttribute: MetaDataAttribute, dateTypes: dateTypes }}
      />,
      div
    );
  });
  test("matches snapshot", async () => {
    const handelMetaDataAttributeMock = jest.fn();
    let MetaDataAttribute = [{ Name: "", isRequired: false, dataTypeId: "" }];
    let dateTypes = [
      { id: 1, name: "Bool" },
      { id: 2, name: "Date" },
      { id: 3, name: "Decimal" },
      { id: 4, name: "Double" },
      { id: 5, name: "Int" },
      { id: 6, name: "String" },
    ];
    const wrapper = shallow(
      <AddFields
        handelmetaDataAttribute={handelMetaDataAttributeMock}
        value={{ metaDataAttribute: MetaDataAttribute, dateTypes: dateTypes }}
      />
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test("test passing data to props functionality", () => {
    const handelMetaDataAttributeMock = jest.fn();
    let MetaDataAttribute = [
      {
        metaDataAttributeName: "tested value1",
        isRequired: false,
        dataTypeID: "1",
      },
      {
        metaDataAttributeName: "tested value2",
        isRequired: false,
        dataTypeID: "1",
      },
    ];
    let dateTypes = [
      { id: 1, name: "Bool" },
      { id: 2, name: "Date" },
      { id: 3, name: "Decimal" },
      { id: 4, name: "Double" },
      { id: 5, name: "Int" },
      { id: 6, name: "String" },
    ];
    let wrapper;
    wrapper = mount(
      <AddFields
        handelmetaDataAttribute={handelMetaDataAttributeMock}
        value={{ metaDataAttribute: MetaDataAttribute, dateTypes: dateTypes , step_3_error:true }}
      />
    );
    MetaDataAttribute.map((item, index) => {
      expect(
        wrapper
          .find(".NameField" + index)
          .at(0)
          .props().value
      ).toBe(MetaDataAttribute[index].metaDataAttributeName);
      expect(
        wrapper
          .find(".CheckBox" + index)
          .at(0)
          .props().value
      ).toBe(MetaDataAttribute[index].isRequired);
      expect(
        wrapper
          .find(".ComboBox" + index)
          .at(0)
          .props().options
      ).toBe(dateTypes);
      expect(
        wrapper
          .find(".ComboBox" + index)
          .at(0)
          .props().value
      ).toStrictEqual({"dataTypeID": "1", "step_3_error": true});
    });
    let index = 0;
    act(() => {
      wrapper
        .find(".NameField" + index)
        .at(0)
        .props()
        .onChange({
          target: {
            value: "tested value3",
            name: "MetaDataAttribute" + index + "Name",
            dataset: { id: 0 },
          },
        });
      wrapper
        .find(".CheckBox" + index)
        .at(0)
        .props()
        .onChange({
          target: {
            checked: true,
            name: "isRequired" + index,
            dataset: { id: 0 },
          },
        });
      wrapper
        .find(".ComboBox" + index)
        .at(0)
        .props()
        .onChange({ target: { value: "" } }, { id: 1 });
    });
    expect(handelMetaDataAttributeMock).toHaveBeenCalledTimes(3);
    //Name Field change
    let MetaDataAttributeArgument1 = MetaDataAttribute;
    MetaDataAttributeArgument1[index].MetaDataAttributeName = "tested value3";
    expect(handelMetaDataAttributeMock.mock.calls[0][0]).toStrictEqual(
      MetaDataAttributeArgument1
    );
    //checkbox change
    let MetaDataAttributeArgument2 = MetaDataAttribute;
    MetaDataAttributeArgument2[index].IsRequired = true;
    expect(handelMetaDataAttributeMock.mock.calls[1][0]).toStrictEqual(
      MetaDataAttributeArgument2
    );
    //ComboBox change
    let MetaDataAttributeArgument3 = MetaDataAttribute;
    MetaDataAttributeArgument3[index].dataTypeID = 1;
    expect(handelMetaDataAttributeMock.mock.calls[2][0]).toStrictEqual(
      MetaDataAttributeArgument3
    );
  });

  test("test Add Field functionality", () => {
    const handelMetaDataAttributeMock = jest.fn();
    let MetaDataAttribute = [
      {
        MetaDataAttributeName: "tested value1",
        IsRequired: false,
        DataTypeID: "1",
      },
      {
        MetaDataAttributeName: "tested value2",
        IsRequired: false,
        DataTypeID: "2",
      },
    ];
    let dateTypes = [
      { id: 1, name: "Bool" },
      { id: 2, name: "Date" },
      { id: 3, name: "Decimal" },
      { id: 4, name: "Double" },
      { id: 5, name: "Int" },
      { id: 6, name: "String" },
    ];
    let wrapper;
    wrapper = shallow(
      <AddFields
        handelmetaDataAttribute={handelMetaDataAttributeMock}
        value={{ metaDataAttribute: MetaDataAttribute, dateTypes: dateTypes }}
      />
    );
    act(() => {
      wrapper
        .find("#addAttribute")
        .at(0)
        .simulate("click", { target: { value: "" } });
    });
    expect(handelMetaDataAttributeMock).toHaveBeenCalledTimes(1);
    let MetaDataAttributeArgument = MetaDataAttribute;
    MetaDataAttributeArgument.push({
      metaDataAttributeName: "",
      isRequired: false,
      dataTypeID: "",
    });
    expect(handelMetaDataAttributeMock.mock.calls[0][0]).toStrictEqual(
      MetaDataAttributeArgument
    );
  });

  test("test remove Field functionality", () => {
    const handelMetaDataAttributeMock = jest.fn();
    let MetaDataAttribute = [
      {
        MetaDataAttributeName: "tested value1",
        IsRequired: false,
        DataTypeID: "1",
      },
      {
        MetaDataAttributeName: "tested value2",
        IsRequired: false,
        DataTypeID: "2",
      },
    ];
    let dateTypes = [
      { id: 1, name: "Bool" },
      { id: 2, name: "Date" },
      { id: 3, name: "Decimal" },
      { id: 4, name: "Double" },
      { id: 5, name: "Int" },
      { id: 6, name: "String" },
    ];
    let wrapper;
    wrapper = shallow(
      <AddFields
        handelmetaDataAttribute={handelMetaDataAttributeMock}
        value={{ metaDataAttribute: MetaDataAttribute, dateTypes: dateTypes }}
      />
    );
    act(() => {
      wrapper.find("#removeAttribute").at(0).simulate("click", { index: 0 });
    });
    expect(handelMetaDataAttributeMock).toHaveBeenCalledTimes(1);
    let MetaDataAttributeArgument = MetaDataAttribute;
    MetaDataAttributeArgument.splice(0, 1);
    expect(handelMetaDataAttributeMock.mock.calls[0][0]).toStrictEqual(
      MetaDataAttributeArgument
    );
  });

  test("error and helperText functionality", () => {
    const handelMetaDataAttributeMock = jest.fn();
    let MetaDataAttribute = [
      {
        metaDataAttributeName: "",
        isRequired: false,
        dataTypeID: "1",
      },
      {
        metaDataAttributeName: "tested value2",
        isRequired: false,
        dataTypeID: "1",
      },
    ];
    let dateTypes = [
      { id: 1, name: "Bool" },
      { id: 2, name: "Date" },
      { id: 3, name: "Decimal" },
      { id: 4, name: "Double" },
      { id: 5, name: "Int" },
      { id: 6, name: "String" },
    ];
    let wrapper;
    wrapper = mount(
      <AddFields
        handelmetaDataAttribute={handelMetaDataAttributeMock}
        value={{ metaDataAttribute: MetaDataAttribute, dateTypes: dateTypes , step_3_error:true }}
      />
    );
    MetaDataAttribute.map((item, index) => {
      if( index ==0)
      {
        expect(
          wrapper
            .find(".NameField" + index)
            .at(0)
            .props().error
        ).toBeTruthy();
        expect(
          wrapper
            .find(".NameField" + index)
            .at(0)
            .props().helperText
        ).toBe("fill_out_field");
      }
      else
      {
        expect(
          wrapper
            .find(".NameField" + index)
            .at(0)
            .props().error
        ).toBeFalsy();
        expect(
          wrapper
            .find(".NameField" + index)
            .at(0)
            .props().helperText
        ).toBe("");
      }
    });

  });
});
