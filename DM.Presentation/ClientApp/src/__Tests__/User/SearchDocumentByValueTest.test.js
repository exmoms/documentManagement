import React from "react";
import ReactDom from "react-dom";
import SearchDocumentByValue from "../../components/User/SearchDocumentByValue";
import SearchDocumentByValueType from "../../components/User/SearchDocumentByValueType";
import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as FetchMock from "../../api/FetchData";
import StringValue from "../../components/User/StringValue";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
afterEach(cleanup);
describe("SearchDocumentByValue", () => { 
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    let composeSearchRequest = jest.fn();
    let modelId =1;
    let setIdExclude = 2;
    const div = document.createElement("div");
    ReactDom.render(
      <SearchDocumentByValue
      setIdExclude ={setIdExclude} modelId ={modelId} composeSearchRequest ={composeSearchRequest}>
      </SearchDocumentByValue>,
      div
    );
  });

  test("SearchDocumentByValue matches snapshot", () => {
    let composeSearchRequest = jest.fn();
    let modelId =1;
    let setIdExclude = 2;
    const component = renderer.create(
        <SearchDocumentByValue
        setIdExclude ={setIdExclude} modelId ={modelId} composeSearchRequest ={composeSearchRequest}>
        </SearchDocumentByValue>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("SearchDocumentByValue intializations",  () =>{
    let composeSearchRequest = jest.fn();
    let modelId =1;
    let setIdExclude = 2;
    const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
    let wrapper = mount(
      <SearchDocumentByValue setIdExclude ={setIdExclude} modelId ={modelId} composeSearchRequest ={composeSearchRequest} />
    );
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
    expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({ title: "", id: -1 });
    expect(wrapper.find(Select).at(0).props().value).toStrictEqual([]);
    expect(wrapper.find(Chip).length).toBe(0);
    expect(wrapper.find(MenuItem).length).toBe(0);
});

test("componentDidMount functionality",  () =>{
    let composeSearchRequest = jest.fn();
    let modelId =1;
    let setIdExclude = 2;

    const mockSuccessResponseMetaDataModel = [
        { id: 1, metaDataModelName: "Model A" },
      ];
      const mockJsonPromiseMetaDataModel = Promise.resolve(
        mockSuccessResponseMetaDataModel
      ); // 2
      const fetchingMetaDataModel = jest
        .spyOn(FetchMock, "fetchData")
        .mockImplementation(() => mockJsonPromiseMetaDataModel);
    let wrapper;
      return mockJsonPromiseMetaDataModel.then(() => {
         wrapper = mount(
            <SearchDocumentByValue setIdExclude ={setIdExclude} modelId ={modelId} composeSearchRequest ={composeSearchRequest} />
          );
      }).then(() => {
        wrapper.render();
        wrapper.update();
    //expectations
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([
        {
         "id": 1,
         "selected": false,
         "title": "Model A",
      },
     ]);
    expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({ title: "Model A", id: 1 });
    expect(wrapper.find(Select).at(0).props().value).toStrictEqual([]);
    expect(wrapper.find(Chip).length).toBe(0);
    expect(wrapper.find(MenuItem).length).toBe(0);
   });   
});

test("componentDidUpdate functionality ",  () =>{
    let composeSearchRequest = jest.fn();
    let modelId =1;
    let setIdExclude = 2;

    const mockSuccessResponseMetaDataModel = [
        { id: 1, metaDataModelName: "Model A" , documentClassName: "Class A"}
      ];
      const mockJsonPromiseMetaDataModel = Promise.resolve(
        mockSuccessResponseMetaDataModel
      ); // 2
      const fetchingMetaDataModel = jest
        .spyOn(FetchMock, "fetchData")
        .mockImplementation(() => mockJsonPromiseMetaDataModel);
    let wrapper;
      return mockJsonPromiseMetaDataModel.then(() => {
         wrapper = mount(
            <SearchDocumentByValue setIdExclude ={setIdExclude} modelId ={modelId} composeSearchRequest ={composeSearchRequest} />
          );
      }).then(() => {
        wrapper.render();
        wrapper.update();
    //expectations
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
    expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/MetaDataModel/1');
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([
        {
         "id": 1,
         "selected": false,
         "title": "Model A",
      },
     ]);
    expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({ title: "Model A", id: 1 });
    expect(wrapper.find(Select).at(0).props().value).toStrictEqual([]);
    expect(wrapper.find(Chip).length).toBe(0);
    expect(wrapper.find(MenuItem).length).toBe(0);
   });
    
});

test("componentDidUpdate functionality when the model is undefined",  () =>{
  let composeSearchRequest = jest.fn();
  let modelId =2;
  let setIdExclude = 2;

  const mockSuccessResponseMetaDataModel = [
      { id: 1, metaDataModelName: "Model A" , documentClassName: "Class A"}
    ];
    const mockJsonPromiseMetaDataModel = Promise.resolve(
      mockSuccessResponseMetaDataModel
    ); // 2
    const fetchingMetaDataModel = jest
      .spyOn(FetchMock, "fetchData")
      .mockImplementation(() => mockJsonPromiseMetaDataModel);
  let wrapper;
    return mockJsonPromiseMetaDataModel.then(() => {
       wrapper = mount(
          <SearchDocumentByValue setIdExclude ={setIdExclude} modelId ={modelId} composeSearchRequest ={composeSearchRequest} />
        );
    }).then(() => {
      wrapper.render();
      wrapper.update();
  //expectations
  expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
  expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([
      {
       "id": 1,
       "selected": false,
       "title": "Model A",
    },
   ]);
  expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({ title: "", id: -1 });
  expect(wrapper.find(Select).at(0).props().value).toStrictEqual([]);
  expect(wrapper.find(Chip).length).toBe(0);
  expect(wrapper.find(MenuItem).length).toBe(0);
 });
  
});
test("handleModelChange functionality when value is not null",  () =>{
  let composeSearchRequest = jest.fn();
  let modelId =1;
  let setIdExclude = 2;
  let wrapper = mount(
    <SearchDocumentByValue setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest} />
  );
let value ={id:1 , title: " title A"}
  act(() => {
    wrapper
      .find(Autocomplete)
      .at(0)
      .props()
      .onChange({ target: { value: "" } } ,value);
  });
  wrapper.update();
  wrapper.render();
  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
  expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual(value);
  expect(wrapper.find(Select).at(0).props().value).toStrictEqual([]);
  expect(wrapper.find(Chip).length).toBe(0);
  expect(wrapper.find(MenuItem).length).toBe(0);
});

test("handleModelChange functionality when value is null",  () =>{
  let composeSearchRequest = jest.fn();
  let modelId =1;
  let setIdExclude = 2;
  let wrapper = mount(
    <SearchDocumentByValue setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest} />
  );
let value =null;
  act(() => {
    wrapper
      .find(Autocomplete)
      .at(0)
      .props()
      .onChange({ target: { value: "" } } ,value);
  });
  wrapper.update();
  wrapper.render();
  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
  expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({ title: "", id: -1 });
  expect(wrapper.find(Select).at(0).props().value).toStrictEqual([]);
  expect(wrapper.find(Chip).length).toBe(0);
  expect(wrapper.find(MenuItem).length).toBe(0);
});

test("addDefaultModel functionality when modelId is undefined",  () =>{
  let composeSearchRequest = jest.fn();
  let modelId =1;
  let setIdExclude = 2;

  const mockSuccessResponseMetaDataModel = [
      { id: 1, metaDataModelName: "Model A" , documentClassName: "Class A" },
    ];
    const mockJsonPromiseMetaDataModel = Promise.resolve(
      mockSuccessResponseMetaDataModel
    ); // 2
    const fetchingMetaDataModel = jest
      .spyOn(FetchMock, "fetchData")
      .mockImplementation(() => mockJsonPromiseMetaDataModel);
  let wrapper;
    return mockJsonPromiseMetaDataModel.then(() => {
       wrapper = mount(
          <SearchDocumentByValue setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest} />
        );
    }).then(() => {
      wrapper.render();
      wrapper.update();
  //expectations
  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([{id:1 , selected: false, title: "Model A"}]);
  expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({ title: "", id: -1 });
  expect(wrapper.find(Select).at(0).props().value).toStrictEqual([]);
  expect(wrapper.find(Chip).length).toBe(0);
  expect(wrapper.find(MenuItem).length).toBe(0);
 });  
});

test("addDefaultModel functionality when modelId is defined and model is undefined",  () =>{
  let composeSearchRequest = jest.fn();
  let modelId =2;
  let setIdExclude = 2;

  const mockSuccessResponseMetaDataModel = [
      { id: 1, metaDataModelName: "Model A" , documentClassName: "Class A" },
    ];
    const mockJsonPromiseMetaDataModel = Promise.resolve(
      mockSuccessResponseMetaDataModel
    ); // 2
    const consoleMock = jest
      .spyOn(console, "log");
    const fetchingMetaDataModel = jest
      .spyOn(FetchMock, "fetchData")
      .mockImplementation(() => mockJsonPromiseMetaDataModel);
  let wrapper;
    return mockJsonPromiseMetaDataModel.then(() => {
       wrapper = mount(
          <SearchDocumentByValue setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest} modelId={modelId}/>
        );
    }).then(() => {
      wrapper.render();
      wrapper.update();
  //expectations
  expect(consoleMock).toHaveBeenCalledTimes(2);
    expect(consoleMock.mock.calls[1][0]).toBe("[ERROR] The Model is not found");
  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([{id:1 , selected: false, title: "Model A"}]);
  expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({ title: "", id: -1 });
  expect(wrapper.find(Select).at(0).props().value).toStrictEqual([]);
  expect(wrapper.find(Chip).length).toBe(0);
  expect(wrapper.find(MenuItem).length).toBe(0);
 });  
});

test("addDefaultModel functionality when modelId is defined and model is defined",  () =>{
  let composeSearchRequest = jest.fn();
  let modelId =1;
  let setIdExclude = 2;

  const mockSuccessResponseMetaDataModel = [
      { id: 1, metaDataModelName: "Model A" , documentClassName: "Class A" },
    ];
    const mockJsonPromiseMetaDataModel = Promise.resolve(
      mockSuccessResponseMetaDataModel
    ); // 2
    const fetchingMetaDataModel = jest
      .spyOn(FetchMock, "fetchData")
      .mockImplementation(() => mockJsonPromiseMetaDataModel);
  let wrapper;
    return mockJsonPromiseMetaDataModel.then(() => {
       wrapper = mount(
          <SearchDocumentByValue setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest} modelId={modelId}/>
        );
    }).then(() => {
      wrapper.render();
      wrapper.update();
  //expectations
  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([{id:1 , selected: false, title: "Model A"}]);
  expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({ title: "Model A", id: 1 });
  expect(wrapper.find(Select).at(0).props().value).toStrictEqual([]);
  expect(wrapper.find(Chip).length).toBe(0);
  expect(wrapper.find(MenuItem).length).toBe(0);

 });  
});

test("handleAttributeChange functionality",  () =>{
  let composeSearchRequest = jest.fn();
  let modelId =1;
  let setIdExclude = 2;
  let wrapper = mount(
    <SearchDocumentByValue setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest} />
  );
  //first test case
  act(() => {
    wrapper
      .find(Select)
      .at(0)
      .props()
      .onChange({ target: { value: [{id:1 , title :"selected list 1"} , {id:2 , title :"selected list 2"}] } } ,{key:1});
  });
  wrapper.update();
  wrapper.render();
  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
  expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({ title: "", id: -1 });
  expect(wrapper.find(Select).at(0).props().value).toStrictEqual([{id:2 , title :"selected list 2"}]);
  expect(wrapper.find(Chip).length).toBe(1);
  expect(wrapper.find(MenuItem).length).toBe(0);
   //second test case
   let secondValue=[{id:2 , title :"selected list 2"}];
   act(() => {
    wrapper
      .find(Select)
      .at(0)
      .props()
      .onChange({ target: { value: [] } } ,{key:2});
  });
  wrapper.update();
  wrapper.render();
  //expectations for the second test case
  let index = secondValue.findIndex(
    (element) => element.id ===2
  );
  secondValue.splice(index, 1);
  expect(wrapper.find(SearchDocumentByValueType).length).toBe(0);
  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
  expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({ title: "", id: -1 });
  expect(wrapper.find(Select).at(0).props().value).toStrictEqual(secondValue);
  expect(wrapper.find(Chip).length).toBe(0);
  expect(wrapper.find(MenuItem).length).toBe(0);
});

test("showSearchFields functionality",  () =>{
  let composeSearchRequest = jest.fn();
  let modelId =1;
  let setIdExclude = 2;
  let wrapper = mount(
    <SearchDocumentByValue setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest} />
  );
  //setting value to selected list
  act(() => {
    wrapper
      .find(Select)
      .at(0)
      .props()
      .onChange({ target: { value: [{id:1 , title :"selected list 1" , min_value:2 ,max_value :10,data_type :0} , {id:2 , title :"selected list 2" , min_value:4 ,max_value :12,data_type :0}] } } ,{key:1});
  });
  wrapper.update();
  wrapper.render();
  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
  expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({ title: "", id: -1 });
  expect(wrapper.find(Select).at(0).props().value).toStrictEqual([{id:2 , title :"selected list 2" , min_value:4 ,max_value :12,data_type :0}]);
  expect(wrapper.find(Chip).length).toBe(1);
  expect(wrapper.find(MenuItem).length).toBe(0);
  //expectations for showSearchFields
  expect(wrapper.find(SearchDocumentByValueType).length).toBe(1);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().dataType).toStrictEqual(0);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeId).toStrictEqual(2);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeName).toStrictEqual("selected list 2");
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().minValue).toStrictEqual(4);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().maxValue).toStrictEqual(12);
});

test("handleValueChange functionality , case min ",  () =>{
  let composeSearchRequest = jest.fn();
  let modelId =1;
  let setIdExclude = 2;
  let wrapper = mount(
    <SearchDocumentByValue setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest} />
  );
  //setting value to selected list
  act(() => {
    wrapper
      .find(Select)
      .at(0)
      .props()
      .onChange({ target: { value: [{id:1 , title :"selected list 1" , min_value:2 ,max_value :10,data_type :0} , {id:2 , title :"selected list 2" , min_value:4 ,max_value :12,data_type :0}] } } ,{key:1});
  });
  wrapper.update();
  wrapper.render();
  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
  expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({ title: "", id: -1 });
  expect(wrapper.find(Select).at(0).props().value).toStrictEqual([{id:2 , title :"selected list 2" , min_value:4 ,max_value :12,data_type :0}]);
  expect(wrapper.find(Chip).length).toBe(1);
  expect(wrapper.find(MenuItem).length).toBe(0);
  //expectations for showSearchFields
  expect(wrapper.find(SearchDocumentByValueType).length).toBe(1);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().dataType).toStrictEqual(0);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeId).toStrictEqual(2);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeName).toStrictEqual("selected list 2");
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().minValue).toStrictEqual(4);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().maxValue).toStrictEqual(12);
  //calling handleValueChange
  let value =8;
  let label="min";
  let id =2;
  act(() => {
    wrapper
      .find(SearchDocumentByValueType)
      .at(0)
      .props()
      .handleValueChange(value,label,id);
  });
  wrapper.update();
  wrapper.render();
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().dataType).toStrictEqual(0);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeId).toStrictEqual(2);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeName).toStrictEqual("selected list 2");
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().minValue).toStrictEqual(value);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().maxValue).toStrictEqual(12);
  //calling handleValueChange when (element.id != id)
  let id2 =1;
  act(() => {
    wrapper
      .find(SearchDocumentByValueType)
      .at(0)
      .props()
      .handleValueChange(value,label,id2);
  });
  wrapper.update();
  wrapper.render();
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().dataType).toStrictEqual(0);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeId).toStrictEqual(2);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeName).toStrictEqual("selected list 2");
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().minValue).toStrictEqual(value);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().maxValue).toStrictEqual(12);

});

test("handleValueChange functionality , case max ",  () =>{
  let composeSearchRequest = jest.fn();
  let modelId =1;
  let setIdExclude = 2;
  let wrapper = mount(
    <SearchDocumentByValue setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest} />
  );
  //setting value to selected list
  act(() => {
    wrapper
      .find(Select)
      .at(0)
      .props()
      .onChange({ target: { value: [{id:1 , title :"selected list 1" , min_value:2 ,max_value :10,data_type :0} , {id:2 , title :"selected list 2" , min_value:4 ,max_value :12,data_type :0}] } } ,{key:1});
  });
  wrapper.update();
  wrapper.render();
  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
  expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({ title: "", id: -1 });
  expect(wrapper.find(Select).at(0).props().value).toStrictEqual([{id:2 , title :"selected list 2" , min_value:4 ,max_value :12,data_type :0}]);
  expect(wrapper.find(Chip).length).toBe(1);
  expect(wrapper.find(MenuItem).length).toBe(0);
  //expectations for showSearchFields
  expect(wrapper.find(SearchDocumentByValueType).length).toBe(1);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().dataType).toStrictEqual(0);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeId).toStrictEqual(2);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeName).toStrictEqual("selected list 2");
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().minValue).toStrictEqual(4);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().maxValue).toStrictEqual(12);
  //calling handleValueChange
  let value =8;
  let label="max";
  let id =2;
  act(() => {
    wrapper
      .find(SearchDocumentByValueType)
      .at(0)
      .props()
      .handleValueChange(value,label,id);
  });
  wrapper.update();
  wrapper.render();
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().dataType).toStrictEqual(0);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeId).toStrictEqual(2);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeName).toStrictEqual("selected list 2");
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().minValue).toStrictEqual(4);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().maxValue).toStrictEqual(value);
  //calling handleValueChange when (element.id != id)
  let id2 =2;
  act(() => {
    wrapper
      .find(SearchDocumentByValueType)
      .at(0)
      .props()
      .handleValueChange(value,label,id2);
  });
  wrapper.update();
  wrapper.render();
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().dataType).toStrictEqual(0);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeId).toStrictEqual(2);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeName).toStrictEqual("selected list 2");
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().minValue).toStrictEqual(4);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().maxValue).toStrictEqual(value);

});

test("handleValueChange functionality , case value ",  () =>{
  let composeSearchRequest = jest.fn();
  let modelId =1;
  let setIdExclude = 2;
  let wrapper = mount(
    <SearchDocumentByValue setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest} />
  );
  //setting value to selected list
  act(() => {
    wrapper
      .find(Select)
      .at(0)
      .props()
      .onChange({ target: { value: [{id:1 , title :"selected list 1" , min_value:2 ,max_value :10,data_type :0} , {id:2 , title :"selected list 2" , min_value:4 ,max_value :12,data_type :0}] } } ,{key:1});
  });
  wrapper.update();
  wrapper.render();
  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
  expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({ title: "", id: -1 });
  expect(wrapper.find(Select).at(0).props().value).toStrictEqual([{id:2 , title :"selected list 2" , min_value:4 ,max_value :12,data_type :0}]);
  expect(wrapper.find(Chip).length).toBe(1);
  expect(wrapper.find(MenuItem).length).toBe(0);
  //expectations for showSearchFields
  expect(wrapper.find(SearchDocumentByValueType).length).toBe(1);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().dataType).toStrictEqual(0);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeId).toStrictEqual(2);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeName).toStrictEqual("selected list 2");
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().minValue).toStrictEqual(4);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().maxValue).toStrictEqual(12);
  //calling handleValueChange
  let value =8;
  let label="value";
  let id =2;
  act(() => {
    wrapper
      .find(SearchDocumentByValueType)
      .at(0)
      .props()
      .handleValueChange(value,label,id);
  });
  wrapper.update();
  wrapper.render();
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().dataType).toStrictEqual(0);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeId).toStrictEqual(2);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeName).toStrictEqual("selected list 2");
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().minValue).toStrictEqual(value);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().maxValue).toStrictEqual(value);
  //calling handleValueChange when (element.id != id)
  let id2 =2;
  act(() => {
    wrapper
      .find(SearchDocumentByValueType)
      .at(0)
      .props()
      .handleValueChange(value,label,id2);
  });
  wrapper.update();
  wrapper.render();
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().dataType).toStrictEqual(0);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeId).toStrictEqual(2);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().attributeName).toStrictEqual("selected list 2");
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().minValue).toStrictEqual(value);
  expect(wrapper.find(SearchDocumentByValueType).at(0).props().maxValue).toStrictEqual(value);

});

test("handleSearch functionality when all the conditions are setted to true",  () =>{
  let composeSearchRequest = jest.fn();
  let modelId =1;
  let setIdExclude = 2;
  let wrapper = mount(
    <SearchDocumentByValue setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest} />
  );
  //setting value to selected list
  act(() => {
    wrapper
      .find(Select)
      .at(0)
      .props()
      .onChange({ target: { value: [{id:1 , title :"selected list 1" , min_value:2 ,max_value :10,data_type :0} , {id:2 , title :"selected list 2" , min_value:4 ,max_value :12,data_type :0}] } } ,{key:1});
  });
  wrapper.update();
  wrapper.render();
  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
  expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({ title: "", id: -1 });
  expect(wrapper.find(Select).at(0).props().value).toStrictEqual([{id:2 , title :"selected list 2" , min_value:4 ,max_value :12,data_type :0}]);
  expect(wrapper.find(Chip).length).toBe(1);
  expect(wrapper.find(MenuItem).length).toBe(0);
  //expectations for showSearchFields
  expect(wrapper.find(SearchDocumentByValueType).length).toBe(1);
   //calling handleSearch
   let api_url = "/api/document/SearchByValue";
  act(() => {
    wrapper
      .find(Button)
      .at(0)
      .props()
      .onClick();
  });
  wrapper.update();
  wrapper.render();
  expect(composeSearchRequest).toHaveBeenCalledTimes(1);
  expect(composeSearchRequest.mock.calls[0][0]).toBe(api_url);
  expect(composeSearchRequest.mock.calls[0][1]).toStrictEqual({"setId": null, "setIdExclude": 2, "values": [{"AttributeId": 2, "MaxValue": 12, "MinValue": 4, "TypeId": 0}]});
});

test("handleSearch functionality when all the conditions are setted to false",  () =>{
  let composeSearchRequest = jest.fn();
  let modelId =1;
  let setIdExclude = 2;
  let wrapper = mount(
    <SearchDocumentByValue  composeSearchRequest ={composeSearchRequest} />
  );
  //setting value to selected list
  act(() => {
    wrapper
      .find(Select)
      .at(0)
      .props()
      .onChange({ target: { value: [{id:1 , title :"selected list 1" , min_value:2 ,max_value :10,data_type :0} , {id:2 , title :"selected list 2" , min_value:0 ,max_value :null,data_type :0}] } } ,{key:1});
  });
  wrapper.update();
  wrapper.render();
  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
  expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({ title: "", id: -1 });
  expect(wrapper.find(Select).at(0).props().value).toStrictEqual([{id:2 , title :"selected list 2" , min_value:0 ,max_value :null,data_type :0}]);
  expect(wrapper.find(Chip).length).toBe(1);
  expect(wrapper.find(MenuItem).length).toBe(0);
  //expectations for showSearchFields
  expect(wrapper.find(SearchDocumentByValueType).length).toBe(1);
   //calling handleSearch
   let api_url = "/api/document/SearchByValue";
  act(() => {
    wrapper
      .find(Button)
      .at(0)
      .props()
      .onClick();
  });
  wrapper.update();
  wrapper.render();
  expect(composeSearchRequest).toHaveBeenCalledTimes(1);
  expect(composeSearchRequest.mock.calls[0][0]).toBe(api_url);
  expect(composeSearchRequest.mock.calls[0][1]).toStrictEqual({"setId": null, "setIdExclude": null, "values": []});
});

test("handleSearch functionality when isRangeViolation is false ",  () =>{
  let composeSearchRequest = jest.fn();
  let handleError = jest.fn();
  let modelId =1;
  let setIdExclude = 2;
  let wrapper = mount(
    <SearchDocumentByValue  composeSearchRequest ={composeSearchRequest} handleError ={handleError}/>
  );
  //setting value to selected list
  act(() => {
    wrapper
      .find(Select)
      .at(0)
      .props()
      .onChange({ target: { value: [{id:1 , title :"selected list 1" , min_value:2 ,max_value :10,data_type :0} , {id:2 , title :"selected list 2" , min_value:2 ,max_value :1,data_type :0}] } } ,{key:1});
  });
  wrapper.update();
  wrapper.render();
  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
  expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({ title: "", id: -1 });
  expect(wrapper.find(Select).at(0).props().value).toStrictEqual([{id:2 , title :"selected list 2" ,  min_value:2 ,max_value :1,data_type :0}]);
  expect(wrapper.find(Chip).length).toBe(1);
  expect(wrapper.find(MenuItem).length).toBe(0);
  //expectations for showSearchFields
  expect(wrapper.find(SearchDocumentByValueType).length).toBe(1);
   //calling handleSearch
   let api_url = "/api/document/SearchByValue";
  act(() => {
    wrapper
      .find(Button)
      .at(0)
      .props()
      .onClick();
  });
  wrapper.update();
  wrapper.render();
  expect(composeSearchRequest).toHaveBeenCalledTimes(0);
  expect(handleError).toHaveBeenCalledTimes(1);
  expect(handleError.mock.calls[0][0]).toStrictEqual({
    openNotifiction: true,
    error: true,
    errorMessage: ["min_max_range_error"],
  });
});

});