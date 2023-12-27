import React from "react";
import ReactDom from "react-dom";
import SearchDocumentByFreeText from "../../components/User/SearchDocumentByFreeText";
import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as FetchMock from "../../api/FetchData";
import StringValue from "../../components/User/StringValue";
import Button from "@material-ui/core/Button";
afterEach(cleanup);
describe("SearchDocumentByFreeText", () => { 
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    let composeSearchRequest = jest.fn();
    let modelId =1;
    let setIdExclude = 2;
    const div = document.createElement("div");
    ReactDom.render(
      <SearchDocumentByFreeText
      setIdExclude ={setIdExclude} modelId ={modelId} composeSearchRequest ={composeSearchRequest}>
      </SearchDocumentByFreeText>,
      div
    );
  });

  test("SearchDocumentByFreeText matches snapshot", () => {
    let composeSearchRequest = jest.fn();
    let modelId =1;
    let setIdExclude = 2;
    const component = renderer.create(
        <SearchDocumentByFreeText
        setIdExclude ={setIdExclude} modelId ={modelId} composeSearchRequest ={composeSearchRequest}>
        </SearchDocumentByFreeText>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("SearchDocumentByFreeText intializations",  () =>{
    let composeSearchRequest = jest.fn();
    let modelId =1;
    let setIdExclude = 2;
    let wrapper = mount(
      <SearchDocumentByFreeText setIdExclude ={setIdExclude} modelId ={modelId} composeSearchRequest ={composeSearchRequest} />
    );
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
    expect(wrapper.find(Autocomplete).at(1).props().options).toStrictEqual([]);
    expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({"id": -1, "title": ""});
    expect(wrapper.find(Autocomplete).at(1).props().value).toStrictEqual({title:"",id:-1});
    expect(wrapper.find(Autocomplete).at(1).props().disabled).toBeTruthy();
});

test("componentDidMount functionality",  () =>{
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
            <SearchDocumentByFreeText setIdExclude ={setIdExclude} modelId ={modelId} composeSearchRequest ={composeSearchRequest} />
          );
      }).then(() => {
        wrapper.render();
        wrapper.update();
    //expectations
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
    expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentClass/');
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([
            {
             "id": 1,
             "selected": false,
             "title": "Model A",
          },
         ]);
         expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({"id": 1, "title": "Model A"});
         expect(wrapper.find(Autocomplete).at(1).props().options).toStrictEqual([
        {
         "id": 1,
         "selected": false,
         "title": "Class A",
      },
     ]);
    expect(wrapper.find(Autocomplete).at(1).props().value).toStrictEqual({title:"",id:-1});
    expect(wrapper.find(Autocomplete).at(1).props().disabled).toBeTruthy();
   });
    
});

test("componentDidUpdate functionality",  () =>{
    let composeSearchRequest = jest.fn();
    let modelId =1;
    let setIdExclude = 2;

    const mockSuccessResponseMetaDataModel = [
        { id: 1, metaDataModelName: "Model A" , documentClassName: "Class A" },{ id: 2, metaDataModelName: "Model B" , documentClassName: "Class B" }
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
            <SearchDocumentByFreeText setIdExclude ={setIdExclude} modelId ={modelId} composeSearchRequest ={composeSearchRequest} />
          );
      }).then(() => {
        wrapper.render();
        wrapper.update();
    //expectations
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
    expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentClass/');
    expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({"id": 1, "title": "Model A"});
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([
            {
             "id": 1,
             "selected": false,
             "title": "Model A",
          }
         ]);
    expect(wrapper.find(Autocomplete).at(1).props().options).toStrictEqual([
        {
         "id": 1,
         "selected": false,
         "title": "Class A",
      },
      {
        "id": 2,
        "selected": false,
        "title": "Class B",
     }
     ]);
    expect(wrapper.find(Autocomplete).at(1).props().value).toStrictEqual({title:"",id:-1});
    expect(wrapper.find(Autocomplete).at(1).props().disabled).toBeTruthy();
   });
    
});

test("componentDidUpdate functionality when the model is undefined",  () =>{
    let composeSearchRequest = jest.fn();
    let modelId =3;
    let setIdExclude = 2;

    const mockSuccessResponseMetaDataModel = [
        { id: 1, metaDataModelName: "Model A" , documentClassName: "Class A" },{ id: 2, metaDataModelName: "Model B" , documentClassName: "Class B" }
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
            <SearchDocumentByFreeText setIdExclude ={setIdExclude} modelId ={modelId} composeSearchRequest ={composeSearchRequest} />
          );
      }).then(() => {
        wrapper.render();
        wrapper.update();
    //expectations
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
    expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentClass/');
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([
            {
             "id": 1,
             "selected": false,
             "title": "Model A",
          } ,
          {
            "id": 2,
            "selected": false,
            "title": "Model B",
         }
         ]);
         expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({"id": -1, "title": ""});
         expect(wrapper.find(Autocomplete).at(1).props().options).toStrictEqual([
        {
         "id": 1,
         "selected": false,
         "title": "Class A",
      },
      {
        "id": 2,
        "selected": false,
        "title": "Class B",
     }
     ]);
    expect(wrapper.find(Autocomplete).at(1).props().value).toStrictEqual({title:"",id:-1});
    expect(wrapper.find(Autocomplete).at(1).props().disabled).toBeTruthy();
   });
    
});

test("componentDidUpdate functionality when modelId is undefined",  () =>{
    let composeSearchRequest = jest.fn();
    let modelId =1;
    let setIdExclude = 2;

    const mockSuccessResponseMetaDataModel = [
        { id: 1, metaDataModelName: "Model A" , documentClassName: "Class A" },{ id: 2, metaDataModelName: "Model B" , documentClassName: "Class B" }
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
            <SearchDocumentByFreeText setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest} />
          );
      }).then(() => {
        wrapper.render();
        wrapper.update();
    //expectations
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
    expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentClass/');
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([
            {
             "id": 1,
             "selected": false,
             "title": "Model A",
          } ,
          {
            "id": 2,
            "selected": false,
            "title": "Model B",
         }
         ]);
         expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({"id": -1, "title": ""});
         expect(wrapper.find(Autocomplete).at(1).props().options).toStrictEqual([
        {
         "id": 1,
         "selected": false,
         "title": "Class A",
      },
      {
        "id": 2,
        "selected": false,
        "title": "Class B",
     }
     ]);
    expect(wrapper.find(Autocomplete).at(1).props().value).toStrictEqual({title:"",id:-1});
    expect(wrapper.find(Autocomplete).at(1).props().disabled).toBeFalsy();
   });
    
});

test("handleModelChange functionality when modelId is defined",  () =>{
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
            <SearchDocumentByFreeText setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest} modelId={modelId}/>
          );
          let value = {id: 3 , title:"value A"}
          act(() => {
            wrapper
              .find(Autocomplete)
              .at(0)
              .props()
              .onChange({ target: { value: "" } } , value );
          });

      }).then(() => {
        wrapper.render();
        wrapper.update();
    //expectations
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
    expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentClass/');
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([
            {
             "id": 1,
             "selected": false,
             "title": "Model A",
          },
         ]);
         expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({"id": 1, "title": "Model A"});
         expect(wrapper.find(Autocomplete).at(1).props().options).toStrictEqual([
        {
         "id": 1,
         "selected": false,
         "title": "Class A",
      },
     ]);
    expect(wrapper.find(Autocomplete).at(1).props().value).toStrictEqual({title:"",id:-1});
    expect(wrapper.find(Autocomplete).at(1).props().disabled).toBeTruthy();
   });
    
});

test("handleModelChange functionality when value is null",  () =>{
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
            <SearchDocumentByFreeText setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest}  />
          );
          let value = null
          act(() => {
            wrapper
              .find(Autocomplete)
              .at(0)
              .props()
              .onChange({ target: { value: "" } } , value );
          });

      }).then(() => {
        wrapper.render();
        wrapper.update();
    //expectations
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
    expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentClass/');
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([
            {
             "id": 1,
             "selected": false,
             "title": "Model A",
          },
         ]);
   expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({"id": -1, "title": ""});
    expect(wrapper.find(Autocomplete).at(1).props().options).toStrictEqual([
        {
         "id": 1,
         "selected": false,
         "title": "Class A",
      },
     ]);
    expect(wrapper.find(Autocomplete).at(1).props().value).toStrictEqual({title:"",id:-1});
    expect(wrapper.find(Autocomplete).at(1).props().disabled).toBeFalsy();
   });
    
});

test("handleModelChange functionality when value is not null",  () =>{
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
            <SearchDocumentByFreeText setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest}  />
          );
          let value = {id: 3 , title:"value A"};
          act(() => {
            wrapper
              .find(Autocomplete)
              .at(0)
              .props()
              .onChange({ target: { value: "" } } , value );
          });

      }).then(() => {
        wrapper.render();
        wrapper.update();
    //expectations 
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
    expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentClass/');
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([
            {
             "id": 1,
             "selected": false,
             "title": "Model A",
          },
         ]);
    expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({"id": 3, "title": "value A"});
    expect(wrapper.find(Autocomplete).at(1).props().options).toStrictEqual([
        {
         "id": 1,
         "selected": false,
         "title": "Class A",
      },
     ]);
    expect(wrapper.find(Autocomplete).at(1).props().value).toStrictEqual({title:"",id:-1});
    expect(wrapper.find(Autocomplete).at(1).props().disabled).toBeFalsy();
   });
    
});

test("handleClassChange functionality when value is null",  () =>{
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
            <SearchDocumentByFreeText setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest}  />
          );
          let value = null
          act(() => {
            wrapper
              .find(Autocomplete)
              .at(1)
              .props()
              .onChange({ target: { value: "" } } , value );
          });

      }).then(() => {
        wrapper.render();
        wrapper.update();
    //expectations
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
    expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentClass/');
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([
            {
             "id": 1,
             "selected": false,
             "title": "Model A",
          },
         ]);
   expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({"id": -1, "title": ""});
    expect(wrapper.find(Autocomplete).at(1).props().options).toStrictEqual([
        {
         "id": 1,
         "selected": false,
         "title": "Class A",
      },
     ]);
    expect(wrapper.find(Autocomplete).at(1).props().value).toStrictEqual({title:"",id:-1});
    expect(wrapper.find(Autocomplete).at(1).props().disabled).toBeFalsy();
   });
    
});
 
test("handleClassChange functionality when value is not null",  () =>{
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
            <SearchDocumentByFreeText setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest}  />
          );
          let value = {id: 3 , title:"value A"};
          act(() => {
            wrapper
              .find(Autocomplete)
              .at(1)
              .props()
              .onChange({ target: { value: "" } } , value );
          });

      }).then(() => {
        wrapper.render();
        wrapper.update();
    //expectations
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
    expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentClass/');
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([
            {
             "id": 1,
             "selected": false,
             "title": "Model A",
          },
         ]);
   expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({"id": -1, "title": ""});
    expect(wrapper.find(Autocomplete).at(1).props().options).toStrictEqual([
        {
         "id": 1,
         "selected": false,
         "title": "Class A",
      },
     ]);
    expect(wrapper.find(Autocomplete).at(1).props().value).toStrictEqual({title:"value A",id:3});
    expect(wrapper.find(Autocomplete).at(1).props().disabled).toBeFalsy();
   }); 
});
 
test("handleChangeInput functionality",  () =>{
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
    let value = "tested value";
      return mockJsonPromiseMetaDataModel.then(() => {
         wrapper = mount(
            <SearchDocumentByFreeText setIdExclude ={setIdExclude} modelId ={modelId} composeSearchRequest ={composeSearchRequest} />
          );
          act(() => {
            wrapper
              .find(StringValue)
              .at(0)
              .props()
              .handleValueChange( value );
          });
          wrapper.update();
          //calling handleSearch help expect the sideEffects
          act(() => {
            wrapper
              .find(Button)
              .at(0)
              .props()
              .onClick();
          });
      }).then(() => {
        wrapper.render();
        wrapper.update();
    //expectations
    expect(composeSearchRequest).toHaveBeenCalledTimes(1);
    expect(composeSearchRequest.mock.calls[0][1].text).toBe(value);
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
    expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentClass/');
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([
            {
             "id": 1,
             "selected": false,
             "title": "Model A",
          },
         ]);
         expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({"id": 1, "title": "Model A"});
         expect(wrapper.find(Autocomplete).at(1).props().options).toStrictEqual([
        {
         "id": 1,
         "selected": false,
         "title": "Class A",
      },
     ]);
    expect(wrapper.find(Autocomplete).at(1).props().value).toStrictEqual({title:"",id:-1});
    expect(wrapper.find(Autocomplete).at(1).props().disabled).toBeTruthy();
   });  
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
            <SearchDocumentByFreeText setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest} />
          );
      }).then(() => {
        wrapper.render();
        wrapper.update();
    //expectations
    expect(composeSearchRequest).toHaveBeenCalledTimes(0);
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
    expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentClass/');
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([
            {
             "id": 1,
             "selected": false,
             "title": "Model A",
          },
         ]);
         expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({"id": -1, "title": ""});
         expect(wrapper.find(Autocomplete).at(1).props().options).toStrictEqual([
        {
         "id": 1,
         "selected": false,
         "title": "Class A",
      },
     ]);
    expect(wrapper.find(Autocomplete).at(1).props().value).toStrictEqual({title:"",id:-1});
    expect(wrapper.find(Autocomplete).at(1).props().disabled).toBeFalsy();
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
            <SearchDocumentByFreeText setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest} modelId={modelId}/>
          );
      }).then(() => {
        wrapper.render();
        wrapper.update();
    //expectations
    expect(consoleMock).toHaveBeenCalledTimes(3);
    expect(consoleMock.mock.calls[2][0]).toBe("[ERROR] The Model is not found");
    expect(composeSearchRequest).toHaveBeenCalledTimes(0);
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
    expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentClass/');
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([
            {
             "id": 1,
             "selected": false,
             "title": "Model A",
          },
         ]);
         expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({"id": -1, "title": ""});
         expect(wrapper.find(Autocomplete).at(1).props().options).toStrictEqual([
        {
         "id": 1,
         "selected": false,
         "title": "Class A",
      },
     ]);
    expect(wrapper.find(Autocomplete).at(1).props().value).toStrictEqual({title:"",id:-1});
    expect(wrapper.find(Autocomplete).at(1).props().disabled).toBeTruthy();
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
            <SearchDocumentByFreeText setIdExclude ={setIdExclude}  composeSearchRequest ={composeSearchRequest} modelId={modelId}/>
          );
      }).then(() => {
        wrapper.render();
        wrapper.update();
    //expectations
    expect(composeSearchRequest).toHaveBeenCalledTimes(0);
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
    expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentClass/');
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([
            {
             "id": 1,
             "selected": false,
             "title": "Model A",
          },
         ]);
         expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({"id": 1, "title": "Model A"});
         expect(wrapper.find(Autocomplete).at(1).props().options).toStrictEqual([
        {
         "id": 1,
         "selected": false,
         "title": "Class A",
      },
     ]);
    expect(wrapper.find(Autocomplete).at(1).props().value).toStrictEqual({title:"",id:-1});
    expect(wrapper.find(Autocomplete).at(1).props().disabled).toBeTruthy();
   });  
});

test("handleSearch when all the conditions are setted to false",  () =>{
    let composeSearchRequest = jest.fn();
    let modelId =1;
    let setIdExclude = 2;
    let wrapper = mount(
      <SearchDocumentByFreeText modelId ={modelId} composeSearchRequest ={composeSearchRequest} />
    );
    let value ="tested value";
    let api_url = "/api/document/SearchByFreeTxt";
    let payload = {
        text: value,
        modelId: null,
        classId: null,
        setId: null,
        setIdExclude: null,
      };
    act(() => {
        wrapper
          .find(StringValue)
          .at(0)
          .props()
          .handleValueChange( value );
      });
      wrapper.update();
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
      expect(composeSearchRequest.mock.calls[0][1]).toStrictEqual(payload);
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
    expect(wrapper.find(Autocomplete).at(1).props().options).toStrictEqual([]);
    expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({"id": -1, "title": ""});
    expect(wrapper.find(Autocomplete).at(1).props().value).toStrictEqual({title:"",id:-1});
    expect(wrapper.find(Autocomplete).at(1).props().disabled).toBeTruthy();
});

test("handleSearch when model_id !== -1",  () =>{
    let composeSearchRequest = jest.fn();
    let modelId =1;
    let setIdExclude = 2;
    let wrapper = mount(
      <SearchDocumentByFreeText  composeSearchRequest ={composeSearchRequest} setIdExclude={setIdExclude}/>
    );
    let value ="tested value";
    let api_url = "/api/document/SearchByFreeTxt";
    let payload = {
        text: value,
        modelId: 3,
        classId: null,
        setId: null,
        setIdExclude: 2,
      };
      let value2 = {id: 3 , title:"value A"};
    act(() => {
        wrapper
          .find(StringValue)
          .at(0)
          .props()
          .handleValueChange( value );
      });
      wrapper.update();
          act(() => {
            wrapper
              .find(Autocomplete)
              .at(0)
              .props()
              .onChange({ target: { value: "" } } , value2 );
          });
          wrapper.update();
      //caliing handleSearch
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
      expect(composeSearchRequest.mock.calls[0][1]).toStrictEqual(payload);
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
    expect(wrapper.find(Autocomplete).at(1).props().options).toStrictEqual([]);
    expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({"id": 3, "title": "value A"});
    expect(wrapper.find(Autocomplete).at(1).props().value).toStrictEqual({title:"",id:-1});
    expect(wrapper.find(Autocomplete).at(1).props().disabled).toBeFalsy();
});
 
test("handleSearch when class_id !== -1",  () =>{
    let composeSearchRequest = jest.fn();
    let modelId =1;
    let setIdExclude = 2;
    let wrapper = mount(
      <SearchDocumentByFreeText  composeSearchRequest ={composeSearchRequest} setIdExclude={setIdExclude}/>
    );
    let value ="tested value";
    let api_url = "/api/document/SearchByFreeTxt";
    let payload = {
        text: value,
        modelId: null,
        classId: 3,
        setId: null,
        setIdExclude: 2,
      };
      let value2 = {id: 3 , title:"value A"};
    act(() => {
        wrapper
          .find(StringValue)
          .at(0)
          .props()
          .handleValueChange( value );
      });
      wrapper.update();
          act(() => {
            wrapper
              .find(Autocomplete)
              .at(1)
              .props()
              .onChange({ target: { value: "" } } , value2 );
          });
          wrapper.update();
      //caliing handleSearch
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
      expect(composeSearchRequest.mock.calls[0][1]).toStrictEqual(payload);
    expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
    expect(wrapper.find(Autocomplete).at(1).props().options).toStrictEqual([]);
    expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual({"id": -1, "title": ""});
    expect(wrapper.find(Autocomplete).at(1).props().value).toStrictEqual({"id": 3, "title": "value A"});
    expect(wrapper.find(Autocomplete).at(1).props().disabled).toBeFalsy();
});

});