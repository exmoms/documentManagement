import React from "react";
import ReactDom from "react-dom";
import SearchDocumentByFreeText from "../../components/User/SearchDocumentByFreeText";
import SearchDocumentByValue from "../../components/User/SearchDocumentByValue";
import SearchDocuments from "../../components/User/SearchDocuments";
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
import * as PostDataMock from "../../api/PostData";
afterEach(cleanup);
describe("SearchDocuments", () => { 
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    let getDocumentList = jest.fn();
    let action="browse-document";
    let modelId=1;
    let setIdExclude=2;
    const div = document.createElement("div");
    ReactDom.render(
      <SearchDocuments
      getDocumentList ={getDocumentList} action ={action} modelId ={modelId} setIdExclude ={setIdExclude}>
      </SearchDocuments>,
      div
    );
  });
  
  test("SearchDocuments matches snapshot", () => {
    let getDocumentList = jest.fn();
    let action="browse-document";
    let modelId=1;
    let setIdExclude=2;
    const component = renderer.create(
        <SearchDocuments
        getDocumentList ={getDocumentList} action ={action} modelId ={modelId} setIdExclude ={setIdExclude}>
        </SearchDocuments>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });  

  test("handleChange  and showFilter functionalities when free-text",  () =>{
    let getDocumentList = jest.fn();
    let action="browse-document";
    let modelId=1;
    let setIdExclude=2;
    let wrapper = mount(
      <SearchDocuments getDocumentList ={getDocumentList} action ={action} modelId ={modelId} setIdExclude ={setIdExclude}/>
    );
    expect(wrapper.find(SearchDocumentByFreeText).length).toBe(1);
   //calling handleChange
   act(() => {
       wrapper
         .find(RadioGroup)
         .at(0)
         .props()
         .onChange({ target: { value: "free-text" } } );
     });
     wrapper.update();
     wrapper.render();
     expect(wrapper.find(SearchDocumentByFreeText).length).toBe(1);
     expect(wrapper.find(SearchDocumentByFreeText).at(0).props().modelId).toBe(modelId);
     expect(wrapper.find(SearchDocumentByFreeText).at(0).props().setIdExclude).toBe(setIdExclude);
     expect(getDocumentList).toHaveBeenCalledTimes(1);  
})

test("handleChange  and showFilter functionalities when value",  () =>{
    let getDocumentList = jest.fn();
    let action="browse-document";
    let modelId=1;
    let setIdExclude=2;
    let wrapper = mount(
      <SearchDocuments getDocumentList ={getDocumentList} action ={action} modelId ={modelId} setIdExclude ={setIdExclude}/>
    );
    expect(wrapper.find(SearchDocumentByValue).length).toBe(0);
   //calling handleChange
   act(() => {
       wrapper
         .find(RadioGroup)
         .at(0)
         .props()
         .onChange({ target: { value: "value" } } );
     });
     wrapper.update();
     wrapper.render();
     expect(wrapper.find(SearchDocumentByValue).length).toBe(1);
     expect(wrapper.find(SearchDocumentByValue).at(0).props().modelId).toBe(modelId);
     expect(wrapper.find(SearchDocumentByValue).at(0).props().setIdExclude).toBe(setIdExclude);
     expect(getDocumentList).toHaveBeenCalledTimes(1);  
})
test("handleChange  and showFilter functionalities when default",  () =>{
    let getDocumentList = jest.fn();
    let action="browse-document";
    let modelId=1;
    let setIdExclude=2;
    let wrapper = mount(
      <SearchDocuments getDocumentList ={getDocumentList} action ={action} modelId ={modelId} setIdExclude ={setIdExclude}/>
    );
    expect(wrapper.find(SearchDocumentByValue).length).toBe(0);
    expect(wrapper.find(SearchDocumentByFreeText).length).toBe(1);
   //calling handleChange
   act(() => {
       wrapper
         .find(RadioGroup)
         .at(0)
         .props()
         .onChange({ target: { value: "" } } );
     });
     wrapper.update();
     wrapper.render();
     expect(wrapper.find(SearchDocumentByValue).length).toBe(0);
     expect(wrapper.find(SearchDocumentByFreeText).length).toBe(0);
     expect(getDocumentList).toHaveBeenCalledTimes(1);  
})
test("composeSearchRequest functionalities",  () =>{
    let getDocumentList = jest.fn();
    let action="browse-document";
    let modelId=1;
    let setIdExclude=2;
    let url="url 1";
    let payload={payload:"payload"};
    let selectedAttributeNames=["name 1" , "name 2"];
    let mockSuccessResponseMetaDataModel={ok:true , json:()=>{ return [{documentId:1 , documentName:"documentName" , latestVersion:"3" , values:[]}] }};
    const mockJsonPromiseMetaDataModel = Promise.resolve(
      mockSuccessResponseMetaDataModel
    ); // 2
    const fetchingMetaDataModel = jest
        .spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromiseMetaDataModel);;
    let wrapper = mount(
      <SearchDocuments getDocumentList ={getDocumentList} action ={action} modelId ={modelId} setIdExclude ={setIdExclude}/>
    );
    expect(wrapper.find(SearchDocumentByValue).length).toBe(0);
   //calling handleChange
   act(() => {
       wrapper
         .find(RadioGroup)
         .at(0)
         .props()
         .onChange({ target: { value: "value" } } );
     });
     wrapper.update();
     wrapper.render();
     expect(wrapper.find(SearchDocumentByValue).length).toBe(1);
     expect(wrapper.find(SearchDocumentByValue).at(0).props().modelId).toBe(modelId);
     expect(wrapper.find(SearchDocumentByValue).at(0).props().setIdExclude).toBe(setIdExclude);
     expect(getDocumentList).toHaveBeenCalledTimes(1); 
     //calling  composeSearchRequest
     return mockJsonPromiseMetaDataModel.then(() => {
     act(() => {

        wrapper
          .find(SearchDocumentByValue)
          .at(0)
          .props()
          .composeSearchRequest(url , payload , selectedAttributeNames);
      });
      wrapper.update();
      wrapper.render();
    }).then(() => {
      wrapper.render();
      wrapper.update();
      expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
      expect(fetchingMetaDataModel.mock.calls[0][0]).toBe(url);
      expect(fetchingMetaDataModel.mock.calls[0][1]).toBe(payload);

      expect(getDocumentList).toHaveBeenCalledTimes(1);
    });
    });


test("composeSearchRequest functionalities when payload is null",  () =>{
    let getDocumentList = jest.fn();
    let action="browse-document";
    let modelId=1;
    let setIdExclude=2;
    let url="url 1";
    let payload=null;
    let selectedAttributeNames=["name 1" , "name 2"];
    let mockJsonPromiseMetaDataModel={ok:true , json:()=>{ return [{documentId:1 , documentName:"documentName" , latestVersion:"3" , values:[]}] }};
    const fetchingMetaDataModel = jest
        .spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromiseMetaDataModel);;
    let wrapper = mount(
      <SearchDocuments getDocumentList ={getDocumentList} action ={action} modelId ={modelId} setIdExclude ={setIdExclude}/>
    );
    expect(wrapper.find(SearchDocumentByValue).length).toBe(0);
   //calling handleChange
   act(() => {
       wrapper
         .find(RadioGroup)
         .at(0)
         .props()
         .onChange({ target: { value: "value" } } );
     });
     wrapper.update();
     wrapper.render();
     expect(wrapper.find(SearchDocumentByValue).length).toBe(1);
     expect(wrapper.find(SearchDocumentByValue).at(0).props().modelId).toBe(modelId);
     expect(wrapper.find(SearchDocumentByValue).at(0).props().setIdExclude).toBe(setIdExclude);
     expect(getDocumentList).toHaveBeenCalledTimes(1); 
     //calling  composeSearchRequest
     act(() => {

        wrapper
          .find(SearchDocumentByValue)
          .at(0)
          .props()
          .composeSearchRequest(url , payload , selectedAttributeNames);
      });
      wrapper.update();
      wrapper.render();
      expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
      expect(fetchingMetaDataModel.mock.calls[0][0]).toBe(url);
      expect(fetchingMetaDataModel.mock.calls[0][1]).toStrictEqual({});
});

test("handleSendRequest functionalities when res is not ok",  () =>{
    let getDocumentList = jest.fn();
    let action="browse-document";
    let modelId=1;
    let setIdExclude=2;
    let url="url 1";
    let payload={payload:"payload"};
    let selectedAttributeNames=["name 1" , "name 2"];
    let mockSuccessResponseMetaDataModel={ok:false , json:()=>{ return [{documentId:1 , documentName:"documentName" , latestVersion:"3" , values:[]}] }};
    const mockJsonPromiseMetaDataModel2 = Promise.resolve(
      mockSuccessResponseMetaDataModel
    ); // 2
    const fetchingMetaDataModel = jest
        .spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromiseMetaDataModel2);;
    let wrapper = mount(
      <SearchDocuments getDocumentList ={getDocumentList} action ={action} modelId ={modelId} setIdExclude ={setIdExclude}/>
    );
    expect(wrapper.find(SearchDocumentByValue).length).toBe(0);
   //calling handleChange
   act(() => {
       wrapper
         .find(RadioGroup)
         .at(0)
         .props()
         .onChange({ target: { value: "value" } } );
     });
     wrapper.update();
     wrapper.render();
     expect(wrapper.find(SearchDocumentByValue).length).toBe(1);
     expect(wrapper.find(SearchDocumentByValue).at(0).props().modelId).toBe(modelId);
     expect(wrapper.find(SearchDocumentByValue).at(0).props().setIdExclude).toBe(setIdExclude);
     expect(getDocumentList).toHaveBeenCalledTimes(1); 
     expect(getDocumentList.mock.calls[0][0]).toStrictEqual([]);
     //calling  composeSearchRequest
     return mockJsonPromiseMetaDataModel2.then(() => {
     act(() => {
        wrapper
          .find(SearchDocumentByValue)
          .at(0)
          .props()
          .composeSearchRequest(url , payload , selectedAttributeNames);
      });
      wrapper.update();
      wrapper.render();
    }).then(() => {
      wrapper.render();
      wrapper.update();
      expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
      expect(fetchingMetaDataModel.mock.calls[0][0]).toBe(url);
      expect(fetchingMetaDataModel.mock.calls[0][1]).toBe(payload);

      expect(getDocumentList).toHaveBeenCalledTimes(2);
      expect(getDocumentList.mock.calls[1][0]).toStrictEqual([]);
      expect(getDocumentList.mock.calls[1][1]).toStrictEqual([]);
    });
});

test("handleSendRequest functionalities when res is ok when value is not free-text ",  () =>{
    let getDocumentList = jest.fn();
    let action="browse-document";
    let modelId=1;
    let setIdExclude=2;
    let url="url 1";
    let payload={payload:"payload"};
    let selectedAttributeNames=["name 1" , "name 2"];
    let mockSuccessResponseMetaDataModel={ok:true , json:()=>{ return [{documentId:1 , documentName:"documentName" , latestVersion:"3" , values:[ {value:"value 1" , metaDataAttributeName :"metaDataAttributeName 1"} ]}] }};
    const mockJsonPromiseMetaDataModel2 = Promise.resolve(
      mockSuccessResponseMetaDataModel
    ); // 2
    const fetchingMetaDataModel = jest.spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromiseMetaDataModel2);;
    let wrapper = mount(
      <SearchDocuments getDocumentList ={getDocumentList} action ={action} modelId ={modelId} setIdExclude ={setIdExclude}/>
    );
    expect(wrapper.find(SearchDocumentByValue).length).toBe(0);
   //calling handleChange
   act(() => {
       wrapper
         .find(RadioGroup)
         .at(0)
         .props()
         .onChange({ target: { value: "value" } } );
     });
     wrapper.update();
     wrapper.render();
     expect(wrapper.find(SearchDocumentByValue).length).toBe(1);
     expect(wrapper.find(SearchDocumentByValue).at(0).props().modelId).toBe(modelId);
     expect(wrapper.find(SearchDocumentByValue).at(0).props().setIdExclude).toBe(setIdExclude);
     expect(getDocumentList).toHaveBeenCalledTimes(1); 
     expect(getDocumentList.mock.calls[0][0]).toStrictEqual([]);
     //calling  composeSearchRequest
     return mockJsonPromiseMetaDataModel2.then(() => {
     act(() => {
        wrapper
          .find(SearchDocumentByValue)
          .at(0)
          .props()
          .composeSearchRequest(url , payload , selectedAttributeNames);
      });
      wrapper.update();
      wrapper.render();
    }).then(() => {
      wrapper.render();
      wrapper.update();
      expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
      expect(fetchingMetaDataModel.mock.calls[0][0]).toBe(url);
      expect(fetchingMetaDataModel.mock.calls[0][1]).toBe(payload);

      expect(getDocumentList).toHaveBeenCalledTimes(1);
      // expect(getDocumentList.mock.calls[1][0]).toStrictEqual([{"documentId": 1, "documentName": "documentName", "latestVersion": "3", "metaDataAttributeName 1": "value 1"}]);
      // expect(getDocumentList.mock.calls[1][1]).toStrictEqual([{"field": "name 1", "title": "name 1"}, {"field": "name 2", "title": "name 2"}, {"field": "documentId", "hidden": true, "title": 
      // "documenttable_docid"}, {"field": "documentName", "hidden": true, "title": "documenttable_docname"}, {"field": "latestVersion", "title": "documenttable_latestversion"}]);
    });
    });

test("handleSendRequest functionalities when res is ok when value is  free-text ",  () =>{
    let getDocumentList = jest.fn();
    let action="browse-document";
    let modelId=1;
    let setIdExclude=2;
    let url="url 1";
    let payload={payload:"payload"};
    let selectedAttributeNames=["name 1" , "name 2"];
    let mockJsonPromiseMetaDataModel={ok:true , json:()=>{ return [{documentId:1 , documentName:"documentName" , latestVersion:"3" , values:[ {value:"value 1" , metaDataAttributeName :"metaDataAttributeName 1"} ]}] }};
    const mockJsonPromiseMetaDataModel2 = Promise.resolve(
      mockJsonPromiseMetaDataModel
    ); // 2
    const fetchingMetaDataModel = jest.spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromiseMetaDataModel2);;
    let wrapper = mount(
      <SearchDocuments getDocumentList ={getDocumentList} action ={action} modelId ={modelId} setIdExclude ={setIdExclude}/>
    );
    expect(wrapper.find(SearchDocumentByFreeText).length).toBe(1);
   //calling handleChange
   act(() => {
       wrapper
         .find(RadioGroup)
         .at(0)
         .props()
         .onChange({ target: { value: "free-text" } } );
     });
     wrapper.update();
     wrapper.render();
     expect(wrapper.find(SearchDocumentByFreeText).length).toBe(1);
     expect(wrapper.find(SearchDocumentByFreeText).at(0).props().modelId).toBe(modelId);
     expect(wrapper.find(SearchDocumentByFreeText).at(0).props().setIdExclude).toBe(setIdExclude);
     expect(getDocumentList).toHaveBeenCalledTimes(1); 
     expect(getDocumentList.mock.calls[0][0]).toStrictEqual([]);
     //calling  composeSearchRequest
     return mockJsonPromiseMetaDataModel2.then(() => {
     act(() => {
        wrapper
          .find(SearchDocumentByFreeText)
          .at(0)
          .props()
          .composeSearchRequest(url , payload , selectedAttributeNames);
      });
      wrapper.update();
      wrapper.render();
    }).then(() => {
      wrapper.render();
      wrapper.update();
      expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
      expect(fetchingMetaDataModel.mock.calls[0][0]).toBe(url);
      expect(fetchingMetaDataModel.mock.calls[0][1]).toBe(payload);

      expect(getDocumentList).toHaveBeenCalledTimes(1);
      // expect(getDocumentList.mock.calls[1][0]).toStrictEqual([{"documentId": 1, "documentName": "documentName", "latestVersion": "3" ,"attributeName": "metaDataAttributeName 1","attributeValue": "value 1"}]);
      // expect(getDocumentList.mock.calls[1][1]).toStrictEqual([{"field": "attributeName", "title": "documenttable_attributename"}, {"field": "attributeValue", "title": "documenttable_attributevalue"}, {"field": "documentId", "hidden": true, "title": 
      // "documenttable_docid"}, {"field": "documentName", "hidden": true, "title": "documenttable_docname"}, {"field": "latestVersion", "title": "documenttable_latestversion"}]);
});
});

test("handleSendRequest functionalities when res is ok when action is show-history",  () =>{
    let getDocumentList = jest.fn();
    let action="show-history";
    let modelId=1;
    let setIdExclude=2;
    let url="url 1";
    let payload={payload:"payload"};
    let selectedAttributeNames=["name 1" , "name 2"];
    let mockSuccessResponseMetaDataModel={ok:true , json:()=>{ return [{documentId:1 , documentName:"documentName" , latestVersion:"3" , values:[ {value:"value 1" , metaDataAttributeName :"metaDataAttributeName 1"} ]}] }};
    const mockJsonPromiseMetaDataModel2 = Promise.resolve(
      mockSuccessResponseMetaDataModel
    ); // 2
    const fetchingMetaDataModel = jest.spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromiseMetaDataModel2);;
    let wrapper = mount(
      <SearchDocuments getDocumentList ={getDocumentList} action ={action} modelId ={modelId} setIdExclude ={setIdExclude}/>
    );
    expect(wrapper.find(SearchDocumentByFreeText).length).toBe(1);
   //calling handleChange
   act(() => {
       wrapper
         .find(RadioGroup)
         .at(0)
         .props()
         .onChange({ target: { value: "free-text" } } );
     });
     wrapper.update();
     wrapper.render();
     expect(wrapper.find(SearchDocumentByFreeText).length).toBe(1);
     expect(wrapper.find(SearchDocumentByFreeText).at(0).props().modelId).toBe(modelId);
     expect(wrapper.find(SearchDocumentByFreeText).at(0).props().setIdExclude).toBe(setIdExclude);
     expect(getDocumentList).toHaveBeenCalledTimes(1); 
     expect(getDocumentList.mock.calls[0][0]).toStrictEqual([]);
     //calling  composeSearchRequest
     return mockJsonPromiseMetaDataModel2.then(() => {
     act(() => {
        wrapper
          .find(SearchDocumentByFreeText)
          .at(0)
          .props()
          .composeSearchRequest(url , payload , selectedAttributeNames);
      });
      wrapper.update();
      wrapper.render();
    }).then(() => {
      wrapper.render();
      wrapper.update();
      expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
      expect(fetchingMetaDataModel.mock.calls[0][0]).toBe(url);
      expect(fetchingMetaDataModel.mock.calls[0][1]).toBe(payload);

      expect(getDocumentList).toHaveBeenCalledTimes(1);
      // expect(getDocumentList.mock.calls[1][0]).toStrictEqual([{"documentId": 1, "documentName": "documentName", "latestVersion": "3" ,"attributeName": "metaDataAttributeName 1","attributeValue": "value 1"}]);
      // expect(getDocumentList.mock.calls[1][1]).toStrictEqual([{"field": "documentName", "title": "documenttable_docname"}, {"field": "documentId", "hidden": true, "title": "documenttable_docid"}, {"field": "versionMessage", "title": "version_message"}, {"field": "addedDate", "title": "added_date"}, {"field": "latestVersion", "title": "version_id"}]);
});
});
});