import React from "react";
import ReactDom from "react-dom";
import SearchDocumentByValue from "../../components/User/SearchDocumentByValue";
import SearchDocumentByValueType from "../../components/User/SearchDocumentByValueType";
import DateValue from "../../components/User/DateValue";
import BoolValue from "../../components/User/BoolValue";
import NumberValue from "../../components/User/NumberValue";
import StringValue from "../../components/User/StringValue";
import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as FetchMock from "../../api/FetchData";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
afterEach(cleanup);
describe("SearchDocumentByValueType", () => { 
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    let handleValueChange = jest.fn();
    let dataType =1;
    let attributeId = 2;
    let attributeName="attributeName";
    const div = document.createElement("div");
    ReactDom.render(
      <SearchDocumentByValueType
      dataType ={dataType} attributeId ={attributeId} attributeName ={attributeName} handleValueChange ={handleValueChange}>
      </SearchDocumentByValueType>,
      div
    );
  });
  
  test("SearchDocumentByValue matches snapshot", () => {
    let handleValueChange = jest.fn();
    let dataType =1;
    let attributeId = 2;
    let attributeName="attributeName";
    const component = renderer.create(
        <SearchDocumentByValueType
       dataType ={dataType} attributeId ={attributeId} attributeName ={attributeName} handleValueChange ={handleValueChange}>
        </SearchDocumentByValueType>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("showSearchOption functionality when data_type= 1",  () =>{
    let handleValueChange = jest.fn();
    let dataType =1;
    let attributeId = 2;
    let attributeName="attributeName";
    let wrapper = mount(
      <SearchDocumentByValueType dataType ={dataType} attributeId ={attributeId} attributeName ={attributeName} handleValueChange ={handleValueChange} />
    );
    expect(wrapper.find(BoolValue).length).toBe(1);
    expect(wrapper.find(BoolValue).at(0).props().label).toBe("value");
});
 
test("showSearchOption functionality when data_type= 2",  () =>{
    let handleValueChange = jest.fn();
    let dataType =2;
    let attributeId = 2;
    let attributeName="attributeName";
    let wrapper = mount(
      <SearchDocumentByValueType dataType ={dataType} attributeId ={attributeId} attributeName ={attributeName} handleValueChange ={handleValueChange} />
    );
    expect(wrapper.find(RadioGroup).length).toBe(1);
    expect(wrapper.find(FormControlLabel).length).toBe(2);
});
test("showSearchOption functionality when default",  () =>{
    let handleValueChange = jest.fn();
    let dataType =7;
    let attributeId = 2;
    let attributeName="attributeName";
    let wrapper = mount(
      <SearchDocumentByValueType dataType ={dataType} attributeId ={attributeId} attributeName ={attributeName} handleValueChange ={handleValueChange} />
    );
    expect(wrapper.find(BoolValue).length).toBe(0);
    expect(wrapper.find(RadioGroup).length).toBe(0);
    expect(wrapper.find(FormControlLabel).length).toBe(0);
});

test("showFilter and handleOptionChange functionalities when value ",  () =>{
    let handleValueChange = jest.fn();
    let dataType =2;
    let attributeId = 2;
    let attributeName="attributeName";
    let wrapper = mount(
      <SearchDocumentByValueType dataType ={dataType} attributeId ={attributeId} attributeName ={attributeName} handleValueChange ={handleValueChange} />
    );
    //calling handleOptionChange
    let value="value"
    act(() => {
        wrapper
          .find(RadioGroup)
          .at(0)
          .props()
          .onChange({ target: { value: "" } } ,value);
      });
      wrapper.update();
      wrapper.render();
      expect(wrapper.find(DateValue).length).toBe(1);
    expect(wrapper.find(DateValue).at(0).props().label).toBe("value");
});

test("showFilter and handleOptionChange functionalities when min-max ",  () =>{
    let handleValueChange = jest.fn();
    let dataType =2;
    let attributeId = 2;
    let attributeName="attributeName";
    let wrapper = mount(
      <SearchDocumentByValueType dataType ={dataType} attributeId ={attributeId} attributeName ={attributeName} handleValueChange ={handleValueChange} />
    );
    //calling handleOptionChange
    let value="min-max"
    act(() => {
        wrapper
          .find(RadioGroup)
          .at(0)
          .props()
          .onChange({ target: { value: "" } } ,value);
      });
      wrapper.update();
      wrapper.render();
      expect(wrapper.find(DateValue).length).toBe(2);
    expect(wrapper.find(DateValue).at(0).props().label).toBe("min");
    expect(wrapper.find(DateValue).at(1).props().label).toBe("max");
});

test("showSearchOption functionality when data_type= 6",  () =>{
    let handleValueChange = jest.fn();
    let dataType =6;
    let attributeId = 2;
    let attributeName="attributeName";
    let wrapper = mount(
      <SearchDocumentByValueType dataType ={dataType} attributeId ={attributeId} attributeName ={attributeName} handleValueChange ={handleValueChange} />
    );
    expect(wrapper.find(StringValue).length).toBe(1);
    expect(wrapper.find(StringValue).at(0).props().label).toBe("value");
});

test("showFieldAccordingToDataType functionality when data_type= 3",  () =>{
    let handleValueChange = jest.fn();
    let dataType =3;
    let attributeId = 2;
    let attributeName="attributeName";
    let wrapper = mount(
      <SearchDocumentByValueType dataType ={dataType} attributeId ={attributeId} attributeName ={attributeName} handleValueChange ={handleValueChange} />
    );
    //calling handleOptionChange
    let value="value"
    act(() => {
        wrapper
          .find(RadioGroup)
          .at(0)
          .props()
          .onChange({ target: { value: "" } } ,value);
      });
      wrapper.update();
      wrapper.render();
      expect(wrapper.find(NumberValue).length).toBe(1);
    expect(wrapper.find(NumberValue).at(0).props().label).toBe("value");
});

test("showFieldAccordingToDataType functionality when data_type= 4",  () =>{
    let handleValueChange = jest.fn();
    let dataType =4;
    let attributeId = 2;
    let attributeName="attributeName";
    let wrapper = mount(
      <SearchDocumentByValueType dataType ={dataType} attributeId ={attributeId} attributeName ={attributeName} handleValueChange ={handleValueChange} />
    );
    //calling handleOptionChange
    let value="value"
    act(() => {
        wrapper
          .find(RadioGroup)
          .at(0)
          .props()
          .onChange({ target: { value: "" } } ,value);
      });
      wrapper.update();
      wrapper.render();
      expect(wrapper.find(NumberValue).length).toBe(1);
    expect(wrapper.find(NumberValue).at(0).props().label).toBe("value");
});
test("showFieldAccordingToDataType functionality when data_type= 5",  () =>{
    let handleValueChange = jest.fn();
    let dataType =5;
    let attributeId = 2;
    let attributeName="attributeName";
    let wrapper = mount(
      <SearchDocumentByValueType dataType ={dataType} attributeId ={attributeId} attributeName ={attributeName} handleValueChange ={handleValueChange} />
    );
    //calling handleOptionChange
    let value="value"
    act(() => {
        wrapper
          .find(RadioGroup)
          .at(0)
          .props()
          .onChange({ target: { value: "" } } ,value);
      });
      wrapper.update();
      wrapper.render();
      expect(wrapper.find(NumberValue).length).toBe(1);
    expect(wrapper.find(NumberValue).at(0).props().label).toBe("value");
});

test("handleValueChange functionality when min",  () =>{
    let handleValueChange = jest.fn();
    let dataType =5;
    let attributeId = 2;
    let attributeName="attributeName";
    let value2=6;
    let label2="min"
    let wrapper = mount(
      <SearchDocumentByValueType dataType ={dataType} attributeId ={attributeId} attributeName ={attributeName} handleValueChange ={handleValueChange} />
    );
    //calling handleOptionChange
    let value="value"
    act(() => {
        wrapper
          .find(RadioGroup)
          .at(0)
          .props()
          .onChange({ target: { value: "" } } ,value);
      });
      wrapper.update();
      wrapper.render();
      expect(wrapper.find(NumberValue).length).toBe(1);
    expect(wrapper.find(NumberValue).at(0).props().label).toBe("value");
    expect(wrapper.find(NumberValue).at(0).props().attributeName).toBe(attributeName);
    act(() => {
        wrapper
          .find(NumberValue)
          .at(0)
          .props()
          .handleValueChange(value2 ,label2);
      });
      wrapper.update();
      wrapper.render();
      expect(handleValueChange).toHaveBeenCalledTimes(1);
      expect(handleValueChange.mock.calls[0][0]).toBe(value2);
      expect(handleValueChange.mock.calls[0][1]).toBe(label2);
      expect(handleValueChange.mock.calls[0][2]).toBe(attributeId);
});

test("handleValueChange functionality when max",  () =>{
    let handleValueChange = jest.fn();
    let dataType =5;
    let attributeId = 2;
    let attributeName="attributeName";
    let value2=6;
    let label2="max"
    let wrapper = mount(
      <SearchDocumentByValueType dataType ={dataType} attributeId ={attributeId} attributeName ={attributeName} handleValueChange ={handleValueChange} />
    );
    //calling handleOptionChange
    let value="value"
    act(() => {
        wrapper
          .find(RadioGroup)
          .at(0)
          .props()
          .onChange({ target: { value: "" } } ,value);
      });
      wrapper.update();
      wrapper.render();
      expect(wrapper.find(NumberValue).length).toBe(1);
    expect(wrapper.find(NumberValue).at(0).props().label).toBe("value");
    expect(wrapper.find(NumberValue).at(0).props().attributeName).toBe(attributeName);
    act(() => {
        wrapper
          .find(NumberValue)
          .at(0)
          .props()
          .handleValueChange(value2 ,label2);
      });
      wrapper.update();
      wrapper.render();
      expect(handleValueChange).toHaveBeenCalledTimes(1);
      expect(handleValueChange.mock.calls[0][0]).toBe(value2);
      expect(handleValueChange.mock.calls[0][1]).toBe(label2);
      expect(handleValueChange.mock.calls[0][2]).toBe(attributeId);
});

test("handleValueChange functionality when value",  () =>{
    let handleValueChange = jest.fn();
    let dataType =5;
    let attributeId = 2;
    let attributeName="attributeName";
    let value2=6;
    let label2="value"
    let wrapper = mount(
      <SearchDocumentByValueType dataType ={dataType} attributeId ={attributeId} attributeName ={attributeName} handleValueChange ={handleValueChange} />
    );
    //calling handleOptionChange
    let value="value"
    act(() => {
        wrapper
          .find(RadioGroup)
          .at(0)
          .props()
          .onChange({ target: { value: "" } } ,value);
      });
      wrapper.update();
      wrapper.render();
      expect(wrapper.find(NumberValue).length).toBe(1);
    expect(wrapper.find(NumberValue).at(0).props().label).toBe("value");
    expect(wrapper.find(NumberValue).at(0).props().attributeName).toBe(attributeName);
    act(() => {
        wrapper
          .find(NumberValue)
          .at(0)
          .props()
          .handleValueChange(value2 ,label2);
      });
      wrapper.update();
      wrapper.render();
      expect(handleValueChange).toHaveBeenCalledTimes(1);
      expect(handleValueChange.mock.calls[0][0]).toBe(value2);
      expect(handleValueChange.mock.calls[0][1]).toBe(label2);
      expect(handleValueChange.mock.calls[0][2]).toBe(attributeId);
});
});