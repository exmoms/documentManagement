import React from "react";
import ReactDom from "react-dom";
import CreateDocument from "../../components/User/CreateDocument";
import DocumentForm from "../../components/User/DocumentForm";
import ScannedDocumentSelector from "../../components/User/ScannedDocumentSelector";
import AggregatedMetaDataModelForm from "../../components/User/AggregatedMetaDataModelForm";
import AddAttachments from "../../components/User/AddAttachments";
import SubmissionStep from "../../components/User/CreateDocument/SubmissionStep";
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
import { BrowserRouter as Router } from "react-router-dom";
import * as FetchMock from "../../api/FetchData";
import * as PostDataMock from "../../api/PostData";
import { getMetaDataModels } from "../../api/FetchData";
afterEach(cleanup);
describe("CreateDocumentFunctionalitiesTest", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(<Router><CreateDocument /></Router>,
      div
    );
  });

  test("CreateDocument matches snapshot", () => {
    const component = renderer.create(
        <Router><CreateDocument /></Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("test intialization", () => {
      let wrapper = mount(<Router><CreateDocument /></Router>);
      //expectations for DocumentForm
      expect(wrapper.find(DocumentForm).at(0).props().schema).toStrictEqual({});
      expect(wrapper.find(DocumentForm).at(0).props().uiSchema).toStrictEqual({});
      expect(wrapper.find(DocumentForm).at(0).props().formData).toStrictEqual([]);
      expect(wrapper.find(DocumentForm).at(0).props().id).toBe("fill-metadata-form");
      //expectations for AggregatedMetaDataModelForm
      expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([]);
       //expectations for AggregatedMetaDataModelForm
       expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([]);
       //expectations for AddAttachments
       expect(wrapper.find(AddAttachments).at(0).props().compoundModelsInfo).toStrictEqual([]);
       //expectations for SubmissionStep
       expect(wrapper.find(SubmissionStep).at(0).props().response).toBe(null);
       expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeFalsy();
       expect(wrapper.find(SubmissionStep).at(0).props().errors).toBe("");
       //expect the effects of renderDocMetaData
       const initModel = {
        id: 0,
        name: "",
      };
       expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
       expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual(initModel);
       expect(wrapper.find("#doc-version-msg").at(0).props().value).toBe("");
       expect(wrapper.find("#doc-version-msg").at(0).props().disabled).toBeTruthy();
  });

  test("componentDidMount tests with getMetaDataModels mocking", () => {
    //mock first component fetchData
    const mockSuccessResponseMetaDataModel = [
      { id: 1, metaDataModelName: "Model A" },
      { id: 2, metaDataModelName: "Model B" },
    ];
    const mockJsonPromiseMetaDataModel = Promise.resolve(
      mockSuccessResponseMetaDataModel
    ); // 2
    const fetchingMetaDataModel = jest
      .spyOn(FetchMock, "fetchData")
      .mockImplementation(() => mockJsonPromiseMetaDataModel);
      let wrapper;
      return mockJsonPromiseMetaDataModel.then(() => {
         wrapper = mount(<Router><CreateDocument /></Router>); 
      }).then(() => {
        wrapper.render();
        wrapper.update();
    //expectations
    let result = [
        { id: 1, name: "Model A" },
        { id: 2, name: "Model B" },
      ];
      expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
      expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
    expect(wrapper.find(Autocomplete).props().options).toStrictEqual(
        result
    );
   });
  });

  test("handleDropdownList functionality when restoredModel == null", () => {
    let wrapper= mount(<Router><CreateDocument /></Router>);
    let reason = "select-option";
    let value = {name:"Model A" , id:1};
    let mockJsonPromise = null;
    const localStorageMock =  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(() => mockJsonPromise);;
    act(() => {
        wrapper
          .find("#combo-box-metadata-model")
          .at(0)
          .props()
          .onChange({ target: { value: "" } } , value , reason);
      });
      wrapper.render();
      wrapper.update();
      expect(localStorageMock).toHaveBeenCalledTimes(1);
      expect(localStorageMock.mock.calls[0][0]).toBe("Model A");
      //expectation for the new state
      //expectations for DocumentForm
      expect(wrapper.find(DocumentForm).at(0).props().schema).toStrictEqual({});
      expect(wrapper.find(DocumentForm).at(0).props().uiSchema).toStrictEqual({});
      expect(wrapper.find(DocumentForm).at(0).props().formData).toStrictEqual([]);
      expect(wrapper.find(DocumentForm).at(0).props().id).toBe("fill-metadata-form");
      //expectations for AggregatedMetaDataModelForm
      expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([]);
       //expectations for AggregatedMetaDataModelForm
       expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([]);
       //expectations for AddAttachments
       expect(wrapper.find(AddAttachments).at(0).props().compoundModelsInfo).toStrictEqual([]);
       //expectations for SubmissionStep
       expect(wrapper.find(SubmissionStep).at(0).props().response).toBe(null);
       expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeFalsy();
       expect(wrapper.find(SubmissionStep).at(0).props().errors).toBe("");
       //expect the effects of renderDocMetaData
       expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
       expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual(value);
       expect(wrapper.find("#doc-version-msg").at(0).props().value).toBe("");
       expect(wrapper.find("#doc-version-msg").at(0).props().disabled).toBeFalsy();
  });

  test("handleDropdownList functionality when restoredModel !== null", () => {
    let wrapper= mount(<Router><CreateDocument /></Router>);
    let reason = "select-option";
    let value = {name:"Model A" , id:1};
    let mockJsonPromise = JSON.stringify({name:"Name 1" , author:"Author 1" , versionMessage:"Message 1", formData:["form 1" , "form 2"] , aggregatedDocs:[{selectedDoc : {name : "AggreggatedName"}}]  , attachments:["attachments 1" , "attachments 2"] });
    const localStorageMock =  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(() => mockJsonPromise);;
    act(() => {
        wrapper
          .find("#combo-box-metadata-model")
          .at(0)
          .props()
          .onChange({ target: { value: "" } } , value , reason);
      });
      wrapper.render();
      wrapper.update();
      expect(localStorageMock).toHaveBeenCalledTimes(1);
      expect(localStorageMock.mock.calls[0][0]).toBe("Model A");
      //expectation for the new state
      //expectations for DocumentForm
      expect(wrapper.find(DocumentForm).at(0).props().schema).toStrictEqual({});
      expect(wrapper.find(DocumentForm).at(0).props().uiSchema).toStrictEqual({});
      expect(wrapper.find(DocumentForm).at(0).props().formData).toStrictEqual(["form 1" , "form 2"] );
      expect(wrapper.find(DocumentForm).at(0).props().id).toBe("fill-metadata-form");
      //expectations for AggregatedMetaDataModelForm
      expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([{selectedDoc : {name : "AggreggatedName"}}]);
       //expectations for AddAttachments
       expect(wrapper.find(AddAttachments).at(0).props().compoundModelsInfo).toStrictEqual(["attachments 1" , "attachments 2"]);
       //expectations for SubmissionStep
       expect(wrapper.find(SubmissionStep).at(0).props().response).toBe(null);
       expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeFalsy();
       expect(wrapper.find(SubmissionStep).at(0).props().errors).toBe("");
       //expect the effects of renderDocMetaData
       expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
       expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual(value);
       expect(wrapper.find("#doc-version-msg").at(0).props().value).toBe("Message 1");
       expect(wrapper.find("#doc-version-msg").at(0).props().disabled).toBeFalsy();
  });
 

  test("handleDropdownList functionality when reason == clear", () => {
    //mock first component getMetaDataModels
    const mockSuccessResponseMetaDataModel = [
      { id: 1, metaDataModelName: "Model A" },
      { id: 2, metaDataModelName: "Model B" },
    ];
    const mockJsonPromiseMetaDataModel = Promise.resolve(
      mockSuccessResponseMetaDataModel
    ); // 2
    const fetchingMetaDataModel = jest
      .spyOn(FetchMock, "fetchData")
      .mockImplementation(() => mockJsonPromiseMetaDataModel);
      let wrapper;
      let reason = "clear";
    let value = {name:"Model A" , id:1};
      return mockJsonPromiseMetaDataModel.then(() => {
         wrapper = mount(<Router><CreateDocument /></Router>); 
      }).then(() => {
        wrapper.render();
        wrapper.update();
        act(() => {
            wrapper
              .find("#combo-box-metadata-model")
              .at(0)
              .props()
              .onChange({ target: { value: "" } } , value , reason);
          });
          wrapper.render();
          wrapper.update();
    //expectations
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);   
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
    let result = [{ id: 1, name: "Model A" },{ id: 2, name: "Model B" },];
    const initModel = {
        id: 0,
        name: "",
      };
    //expectations for DocumentForm
    expect(wrapper.find(DocumentForm).at(0).props().schema).toStrictEqual({});
    expect(wrapper.find(DocumentForm).at(0).props().uiSchema).toStrictEqual({});
    expect(wrapper.find(DocumentForm).at(0).props().formData).toStrictEqual([]);
    expect(wrapper.find(DocumentForm).at(0).props().id).toBe("fill-metadata-form");
    //expectations for AggregatedMetaDataModelForm
    expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([]);
     //expectations for AggregatedMetaDataModelForm
     expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([]);
     //expectations for AddAttachments
     expect(wrapper.find(AddAttachments).at(0).props().compoundModelsInfo).toStrictEqual([]);
     //expectations for SubmissionStep
     expect(wrapper.find(SubmissionStep).at(0).props().response).toBe(null);
     expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeFalsy();
     expect(wrapper.find(SubmissionStep).at(0).props().errors).toBe("");
     //expect the effects of renderDocMetaData
     expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual(result);
     expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual(initModel);
     expect(wrapper.find("#doc-version-msg").at(0).props().value).toBe("");
     expect(wrapper.find("#doc-version-msg").at(0).props().disabled).toBeTruthy();
   });
  });
  

  test("componentDidUpdate functionality", () => {
    let wrapper= mount(<Router><CreateDocument /></Router>);
    let reason = "select-option";
    let value = {name:"Model A" , id:1};
    let value2 = {name:"Model A" , id:2};
    let result = [
        { id: 1, name: "Model A" },
        { id: 2, name: "Model B" },
      ];
    let mockSuccessResponseMetaDataModel = {metaDataModelName:"Model A" , metaDataAttributes:[{metaDataAttributeName:"MetaData 1" , id:1 , isRequired:true ,dataTypeID:6}] , childMetaDataModels:[{id: 2 , aggregateName: "Aggregated 1" , childMetaDataModelId:4}] , compoundModels:[{id:1 ,caption : "compound model" , isRequired: true }]}
      const mockJsonPromiseMetaDataModel = Promise.resolve(
        mockSuccessResponseMetaDataModel
      );
    const fetchingMetaDataModel = jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromiseMetaDataModel);
    let mockJsonPromise = JSON.stringify({name:"Name 1" , author:"Author 1" , versionMessage:"Message 1", formData:["form 1" , "form 2"] , aggregatedDocs:[{selectedDoc : {name : "AggreggatedName"}}]  , attachments:["attachments 1" , "attachments 2"] });
    const localStorageMock =  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(() => mockJsonPromise);;

      //setting getMetaDataModelData returned value 
      return mockJsonPromiseMetaDataModel.then(() => {
         //calling handleDropdownList help setting model.id = 1
    act(() => {
        wrapper
          .find("#combo-box-metadata-model")
          .at(0)
          .props()
          .onChange({ target: { value: "" } } , value , reason);
      });
      wrapper.render();
      wrapper.update();
       //expectation for componentDidMount
      expect(localStorageMock).toHaveBeenCalledTimes(1);
      expect(localStorageMock.mock.calls[0][0]).toBe("Model A");
      //expectation for handleDropdownList
      //expectations for DocumentForm
      expect(wrapper.find(DocumentForm).at(0).props().schema).toStrictEqual({});
      expect(wrapper.find(DocumentForm).at(0).props().uiSchema).toStrictEqual({});
      expect(wrapper.find(DocumentForm).at(0).props().formData).toStrictEqual(["form 1" , "form 2"] );
      expect(wrapper.find(DocumentForm).at(0).props().id).toBe("fill-metadata-form");
      //expectations for AggregatedMetaDataModelForm
      expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([{"selectedDoc": {"name": "AggreggatedName"}}]);
       //expectations for AddAttachments
       expect(wrapper.find(AddAttachments).at(0).props().compoundModelsInfo).toStrictEqual(["attachments 1", "attachments 2"]);
       //expectations for SubmissionStep
       expect(wrapper.find(SubmissionStep).at(0).props().response).toBe(null);
       expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeFalsy();
       expect(wrapper.find(SubmissionStep).at(0).props().errors).toBe("");
       //expect the effects of renderDocMetaData
       expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual(result);
       expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual(value);
       expect(wrapper.find("#doc-version-msg").at(0).props().value).toBe("Message 1");
       expect(wrapper.find("#doc-version-msg").at(0).props().disabled).toBeFalsy();
     }).then(() => {
      act(() => {
        wrapper.render();
        wrapper.update();
      });
      

      //expectations for DocumentForm
      expect(wrapper.find(DocumentForm).at(0).props().schema).toStrictEqual({"properties": {"MetaData 1": {"default": "", "title": "MetaData 1", "type": "string"}}, "required": ["MetaData 1"], "title": "Model A", "type": "object"});
      //expect(wrapper.find(DocumentForm).at(0).props().uiSchema).toStrictEqual({"MetaData 1":{"ui:widget": "date"}});
      expect(wrapper.find(DocumentForm).at(0).props().formData).toStrictEqual(["form 1" , "form 2"] );
      expect(wrapper.find(DocumentForm).at(0).props().id).toBe("fill-metadata-form");
      //expectations for AggregatedMetaDataModelForm
      expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([{"childMetaDataModelId": 4, "modelId": 2, "modelName": "Aggregated 1", "selectedDoc": {"id": -1, "name": "..."}}]);
       //expectations for AddAttachments
       expect(wrapper.find(AddAttachments).at(0).props().compoundModelsInfo).toStrictEqual([{"attachedFile": undefined, "attachmentName": "compound model", "compoundModelId": 1, "isRequiered": true}]);
       //expectations for SubmissionStep
       expect(wrapper.find(SubmissionStep).at(0).props().response).toBe(null);
       expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeFalsy();
       expect(wrapper.find(SubmissionStep).at(0).props().errors).toBe("");
       //expect the effects of renderDocMetaData
       expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual(result);
       expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual(value);
       expect(wrapper.find("#doc-version-msg").at(0).props().value).toBe("Message 1");
       expect(wrapper.find("#doc-version-msg").at(0).props().disabled).toBeFalsy();
        //test case 2 for the second branch
        //calling handleDropdownList help setting model.id = 2
       act(() => {
        wrapper
          .find("#combo-box-metadata-model")
          .at(0)
          .props()
          .onChange({ target: { value: "" } } , value2 , reason);
      });
      }).then(() => {
     act(() => {
      wrapper.render();
      wrapper.update();
    });
  //expectation for componentDidMount
  expect(localStorageMock).toHaveBeenCalledTimes(2);
  expect(localStorageMock.mock.calls[1][0]).toBe("Model A");
  //expectation for getMetaDataModelData
  expect(fetchingMetaDataModel).toHaveBeenCalledTimes(3);
  expect(fetchingMetaDataModel.mock.calls[0][0]).toBe("/api/MetaDataModel/GetMetaDataModelsIdName");
  expect(fetchingMetaDataModel.mock.calls[1][0]).toBe("/api/MetaDataModel/1");
  expect(fetchingMetaDataModel.mock.calls[2][0]).toBe("/api/MetaDataModel/2");
       //expectations for DocumentForm
      expect(wrapper.find(DocumentForm).at(0).props().schema).toStrictEqual({"properties": {"MetaData 1": {"default": "", "title": "MetaData 1", "type": "string"}}, "required": ["MetaData 1"], "title": "Model A", "type": "object"});
      //expect(wrapper.find(DocumentForm).at(0).props().uiSchema).toStrictEqual({"MetaData 1":{"ui:widget": "date"}});
      expect(wrapper.find(DocumentForm).at(0).props().formData).toStrictEqual([] );
      expect(wrapper.find(DocumentForm).at(0).props().id).toBe("fill-metadata-form");
      //expectations for AggregatedMetaDataModelForm
      expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([{ "selectedDoc": {"name": "AggreggatedName"}}]);
       //expectations for AddAttachments
       expect(wrapper.find(AddAttachments).at(0).props().compoundModelsInfo).toStrictEqual(["attachments 1", "attachments 2"]);
       //expectations for SubmissionStep
       expect(wrapper.find(SubmissionStep).at(0).props().response).toBe(null);
       expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeFalsy();
       expect(wrapper.find(SubmissionStep).at(0).props().errors).toBe("");
       //expect the effects of renderDocMetaData
       expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual(result);
       expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual(value2);
       expect(wrapper.find("#doc-version-msg").at(0).props().value).toBe("Message 1");
       expect(wrapper.find("#doc-version-msg").at(0).props().disabled).toBeFalsy();
  });
  });
  


  test("updateChildrenDocuments functionality", () => {
    let wrapper= mount(<Router><CreateDocument /></Router>);
    let aggregatedDocs = [{"childMetaDataModelId": 4, "modelId": 2, "modelName": "Aggregated 1", "selectedDoc": {"id": 1, "name": "..."}}];
    //expectations for DocumentForm
    expect(wrapper.find(DocumentForm).at(0).props().schema).toStrictEqual({});
    expect(wrapper.find(DocumentForm).at(0).props().uiSchema).toStrictEqual({});
    expect(wrapper.find(DocumentForm).at(0).props().formData).toStrictEqual([]);
    expect(wrapper.find(DocumentForm).at(0).props().id).toBe("fill-metadata-form");
    //expectations for AggregatedMetaDataModelForm
    expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([]);
     //expectations for AddAttachments
     expect(wrapper.find(AddAttachments).at(0).props().compoundModelsInfo).toStrictEqual([]);
     //expectations for SubmissionStep
     expect(wrapper.find(SubmissionStep).at(0).props().response).toBe(null);
     expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeFalsy();
     expect(wrapper.find(SubmissionStep).at(0).props().errors).toBe("");
     //expect the effects of renderDocMetaData
     const initModel = {
      id: 0,
      name: "",
    };
     expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
     expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual(initModel);
     expect(wrapper.find("#doc-version-msg").at(0).props().value).toBe("");
     expect(wrapper.find("#doc-version-msg").at(0).props().disabled).toBeTruthy();
    act(() => {
        wrapper
          .find(AggregatedMetaDataModelForm)
          .at(0)
          .props()
          .updater(aggregatedDocs);
      });
      wrapper.render();
      wrapper.update();
      //expectations for AggregatedMetaDataModelForm
    expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual(aggregatedDocs);
  });
  

  test("updateAttachments functionality when isCompleted == true", () => {
    let wrapper= mount(<Router><CreateDocument /></Router>);
    let attachments = [{"attachedFile": "file 1", "attachmentName": "compound model", "compoundModelId": 1, "isRequiered": true}];
    let isCompleted= true;
    //expectations for DocumentForm
    expect(wrapper.find(DocumentForm).at(0).props().schema).toStrictEqual({});
    expect(wrapper.find(DocumentForm).at(0).props().uiSchema).toStrictEqual({});
    expect(wrapper.find(DocumentForm).at(0).props().formData).toStrictEqual([]);
    expect(wrapper.find(DocumentForm).at(0).props().id).toBe("fill-metadata-form");
    //expectations for AggregatedMetaDataModelForm
    expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([]);
     //expectations for AddAttachments
     expect(wrapper.find(AddAttachments).at(0).props().compoundModelsInfo).toStrictEqual([]);
     //expectations for SubmissionStep
     expect(wrapper.find(SubmissionStep).at(0).props().response).toBe(null);
     expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeFalsy();
     expect(wrapper.find(SubmissionStep).at(0).props().errors).toBe("");
     //expect the effects of renderDocMetaData
     const initModel = {
      id: 0,
      name: "",
    };
     expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
     expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual(initModel);
     expect(wrapper.find("#doc-version-msg").at(0).props().value).toBe("");
     expect(wrapper.find("#doc-version-msg").at(0).props().disabled).toBeTruthy();
    act(() => {
        wrapper
          .find(AddAttachments)
          .at(0)
          .props()
          .updater(attachments , isCompleted);
      });
      wrapper.render();
      wrapper.update();
      //expectations for AddAttachments
      expect(wrapper.find(AddAttachments).at(0).props().compoundModelsInfo).toStrictEqual(attachments);
  });
  

  test("updateAttachments functionality when isCompleted == false", () => {
    let wrapper= mount(<Router><CreateDocument /></Router>);
    let attachments = [{"attachedFile": "file 1", "attachmentName": "compound model", "compoundModelId": 1, "isRequiered": true}];
    let isCompleted= false;
    //expectations for DocumentForm
    expect(wrapper.find(DocumentForm).at(0).props().schema).toStrictEqual({});
    expect(wrapper.find(DocumentForm).at(0).props().uiSchema).toStrictEqual({});
    expect(wrapper.find(DocumentForm).at(0).props().formData).toStrictEqual([]);
    expect(wrapper.find(DocumentForm).at(0).props().id).toBe("fill-metadata-form");
    //expectations for AggregatedMetaDataModelForm
    expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([]);
     //expectations for AddAttachments
     expect(wrapper.find(AddAttachments).at(0).props().compoundModelsInfo).toStrictEqual([]);
     //expectations for SubmissionStep
     expect(wrapper.find(SubmissionStep).at(0).props().response).toBe(null);
     expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeFalsy();
     expect(wrapper.find(SubmissionStep).at(0).props().errors).toBe("");
     //expect the effects of renderDocMetaData
     const initModel = {
      id: 0,
      name: "",
    };
     expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
     expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual(initModel);
     expect(wrapper.find("#doc-version-msg").at(0).props().value).toBe("");
     expect(wrapper.find("#doc-version-msg").at(0).props().disabled).toBeTruthy();
    act(() => {
        wrapper
          .find(AddAttachments)
          .at(0)
          .props()
          .updater(attachments , isCompleted);
      });
      wrapper.render();
      wrapper.update();
      //expectations for AddAttachments
      expect(wrapper.find(AddAttachments).at(0).props().compoundModelsInfo).toStrictEqual([]);
  });
  

  test("postData functionality when is valid", () => {
    let wrapper= mount(<Router><CreateDocument /></Router>);
    const mockSuccessResponsePostDocumentData =  {ok:true , json:()=>{ return {error:["errorMessage"]}}};
  const mockJsonPromisePostDocumentData = Promise.resolve(mockSuccessResponsePostDocumentData);
    const postMock =  jest.spyOn(PostDataMock, "postDocumentData").mockImplementation(() => mockJsonPromisePostDocumentData);;
    let reason = "select-option";
    let value = {name:"Model A" , id:1};
    let value2 = {name:"Model A" , id:2};
    let result = [
        { id: 1, name: "Model A" },
        { id: 2, name: "Model B" },
      ];
    let mockSuccessResponseMetaDataModel = {metaDataModelName:"Model A" , metaDataAttributes:[{metaDataAttributeName:"MetaData 1" , id:1 , isRequired:true ,dataTypeID:6}] , childMetaDataModels:[{id: 2 , aggregateName: "Aggregated 1" , childMetaDataModelId:4}] , compoundModels:[{id:1 ,caption : "compound model" , isRequired: true }]}
      const mockJsonPromiseMetaDataModel = Promise.resolve(
        mockSuccessResponseMetaDataModel
      );
    const fetchingMetaDataModel = jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromiseMetaDataModel);
    let mockJsonPromise = JSON.stringify({name:"Name 1" , author:"Author 1" , versionMessage:"Message 1", formData:["form 1" , "form 2"] , aggregatedDocs:[{selectedDoc : {name : "AggreggatedName"}}]  , attachments:["attachments 1" , "attachments 2"] });
    const localStorageMock =  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(() => mockJsonPromise);;
    const setLocalStorageMock =  jest.spyOn(window.localStorage.__proto__, 'setItem');
    let scannedFiles  = ["scanned 1" , "scanned 2"];
    let index = null;  
    //setting getMetaDataModelData returned value 
      return mockJsonPromiseMetaDataModel.then(() => {
         //calling handleDropdownList help setting model.id = 1
    act(() => {
        wrapper
          .find("#combo-box-metadata-model")
          .at(0)
          .props()
          .onChange({ target: { value: "" } } , value , reason);
      });
    act(() => {
        wrapper
          .find(ScannedDocumentSelector)
          .at(0)
          .props()
          .updateScannedFiles(scannedFiles , index);
      });
      wrapper.render();
      wrapper.update();
       //expectation for componentDidMount
       expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
       expect(fetchingMetaDataModel.mock.calls[0][0]).toBe("/api/MetaDataModel/GetMetaDataModelsIdName");
       expect(fetchingMetaDataModel.mock.calls[1][0]).toBe("/api/MetaDataModel/1");
      expect(localStorageMock).toHaveBeenCalledTimes(1);
      expect(localStorageMock.mock.calls[0][0]).toBe("Model A");
      //expectation for handleDropdownList
      //expectations for DocumentForm
      expect(wrapper.find(DocumentForm).at(0).props().schema).toStrictEqual({});
      expect(wrapper.find(DocumentForm).at(0).props().uiSchema).toStrictEqual({});
      expect(wrapper.find(DocumentForm).at(0).props().formData).toStrictEqual(["form 1" , "form 2"] );
      expect(wrapper.find(DocumentForm).at(0).props().id).toBe("fill-metadata-form");
      //expectations for AggregatedMetaDataModelForm
      expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([{"selectedDoc": {"name": "AggreggatedName"}}]);
       //expectations for AddAttachments
       expect(wrapper.find(AddAttachments).at(0).props().compoundModelsInfo).toStrictEqual(["attachments 1", "attachments 2"]);
       //expectations for SubmissionStep
       expect(wrapper.find(SubmissionStep).at(0).props().response).toBe(null);
       expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeFalsy();
       expect(wrapper.find(SubmissionStep).at(0).props().errors).toBe("");
       //expect the effects of renderDocMetaData
      //  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual(result);
       expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual(value);
       expect(wrapper.find("#doc-version-msg").at(0).props().value).toBe("Message 1");
       expect(wrapper.find("#doc-version-msg").at(0).props().disabled).toBeFalsy();
     }).then(() => {
      act(() => {
        wrapper.render();
        wrapper.update();
      });
      
      //expectations for DocumentForm
      expect(wrapper.find(DocumentForm).at(0).props().schema).toStrictEqual({"properties": {"MetaData 1": {"default": "", "title": "MetaData 1", "type": "string"}}, "required": ["MetaData 1"], "title": "Model A", "type": "object"});
      //expect(wrapper.find(DocumentForm).at(0).props().uiSchema).toStrictEqual({"MetaData 1":{"ui:widget": "date"}});
      expect(wrapper.find(DocumentForm).at(0).props().formData).toStrictEqual(["form 1" , "form 2"] );
      expect(wrapper.find(DocumentForm).at(0).props().id).toBe("fill-metadata-form");
      //expectations for AggregatedMetaDataModelForm
      expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([{"childMetaDataModelId": 4, "modelId": 2, "modelName": "Aggregated 1", "selectedDoc": {"id": -1, "name": "..."}}]);
       //expectations for AddAttachments
       expect(wrapper.find(AddAttachments).at(0).props().compoundModelsInfo).toStrictEqual([{"attachedFile": undefined, "attachmentName": "compound model", "compoundModelId": 1, "isRequiered": true}]);
       //expectations for SubmissionStep
       expect(wrapper.find(SubmissionStep).at(0).props().response).toBe(null);
       expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeFalsy();
       expect(wrapper.find(SubmissionStep).at(0).props().errors).toBe("");
       //expect the effects of renderDocMetaData
      //  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual(result);
       expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual(value);
       expect(wrapper.find("#doc-version-msg").at(0).props().value).toBe("Message 1");
       expect(wrapper.find("#doc-version-msg").at(0).props().disabled).toBeFalsy();
       //calling onSubmit
       return mockJsonPromisePostDocumentData.then(() => {
     act(() => {
      let formData={key:"KeyForm"};
       wrapper
         .find(DocumentForm)
         .at(0)
         .props()
         .onSubmit({formData});
     });
    }).then(() => { 
      let modelData_ ="{\"id\":1,\"versionMessage\":\"Message 1\",\"formData\":{\"key\":\"KeyForm\"},\"aggregatedDocs\":[{\"modelId\":2,\"modelName\":\"Aggregated 1\",\"childMetaDataModelId\":4,\"selectedDoc\":{\"id\":-1,\"name\":\"...\"}}],\"attachments\":[{\"compoundModelId\":1,\"attachmentName\":\"compound model\",\"isRequiered\":true}]}";
     let document_data ={"Attachments": [], "DocumentVersion": { "ChildrenDocuments": [{"AggregateMetaDataModelID": 2, "ChildDocumentVersionId": undefined}], "Values": [{"AttributeId": 1, "Value": undefined}], "VersionMessage": "Message 1"}, "MetadataModelId": 1};
      wrapper.render();
    wrapper.update();
    expect(setLocalStorageMock).toHaveBeenCalledTimes(1);
    expect(setLocalStorageMock.mock.calls[0][0]).toBe("Model A");
    expect(setLocalStorageMock.mock.calls[0][1]).toBe(modelData_);
    //expectations for   postDocumentData
    expect(postMock).toHaveBeenCalledTimes(1);
    expect(postMock.mock.calls[0][0]).toStrictEqual(document_data);
    expect(postMock.mock.calls[0][1]).toStrictEqual(["scanned 1" , "scanned 2"]);
    expect(postMock.mock.calls[0][2]).toStrictEqual([]);
    expect(postMock.mock.calls[0][3]).toStrictEqual("/api/Document/AddNewDocument");
    expect(postMock.mock.calls[0][4]).toStrictEqual("Add");
    //expectations for SubmissionStep
    expect(wrapper.find(SubmissionStep).at(0).props().response).toStrictEqual(mockSuccessResponsePostDocumentData);
    expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeFalsy();
    expect(wrapper.find(SubmissionStep).at(0).props().errors).toBe("");
    })
  });
  });
 
  test("postData functionality when is valid and res is not ok",(done) =>  {
    let wrapper= mount(<Router><CreateDocument /></Router>);
    let mockSuccessErrorPromise = { error: ["errorMessage"] };
    let mockSuccessError = Promise.resolve(mockSuccessErrorPromise);
    const mockSuccessResponsePost = Promise.resolve({
      ok: false,
      json: () => mockSuccessError,
    });
    const postMock =  jest.spyOn(PostDataMock, "postDocumentData").mockImplementation(() => mockSuccessResponsePost);;
    let reason = "select-option";
    let value = {name:"Model A" , id:1};
    let value2 = {name:"Model A" , id:2};
    let result = [
        { id: 1, name: "Model A" },
        { id: 2, name: "Model B" },
      ];
    let mockSuccessResponseMetaDataModel = {metaDataModelName:"Model A" , metaDataAttributes:[{metaDataAttributeName:"MetaData 1" , id:1 , isRequired:true ,dataTypeID:6}] , childMetaDataModels:[{id: 2 , aggregateName: "Aggregated 1" , childMetaDataModelId:4}] , compoundModels:[{id:1 ,caption : "compound model" , isRequired: true }]}
      const mockJsonPromiseMetaDataModel = Promise.resolve(
        mockSuccessResponseMetaDataModel
      );
    const fetchingMetaDataModel = jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromiseMetaDataModel);
    let mockJsonPromise = JSON.stringify({name:"Name 1" , author:"Author 1" , versionMessage:"Message 1", formData:["form 1" , "form 2"] , aggregatedDocs:[{selectedDoc : {name : "AggreggatedName"}}]  , attachments:["attachments 1" , "attachments 2"] });
    const localStorageMock =  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(() => mockJsonPromise);;
    const setLocalStorageMock =  jest.spyOn(window.localStorage.__proto__, 'setItem');
    let scannedFiles  = ["scanned 1" , "scanned 2"];
    let index = null;  
    //setting getMetaDataModelData returned value 
      return mockJsonPromiseMetaDataModel.then(() => {
         //calling handleDropdownList help setting model.id = 1
    act(() => {
        wrapper
          .find("#combo-box-metadata-model")
          .at(0)
          .props()
          .onChange({ target: { value: "" } } , value , reason);
      });
    act(() => {
        wrapper
          .find(ScannedDocumentSelector)
          .at(0)
          .props()
          .updateScannedFiles(scannedFiles , index);
      });
      wrapper.render();
      wrapper.update();
       //expectation for componentDidMount
       expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
       expect(fetchingMetaDataModel.mock.calls[0][0]).toBe("/api/MetaDataModel/GetMetaDataModelsIdName");
       expect(fetchingMetaDataModel.mock.calls[1][0]).toBe("/api/MetaDataModel/1");
      expect(localStorageMock).toHaveBeenCalledTimes(1);
      expect(localStorageMock.mock.calls[0][0]).toBe("Model A");
      //expectation for handleDropdownList
      //expectations for DocumentForm
      expect(wrapper.find(DocumentForm).at(0).props().schema).toStrictEqual({});
      expect(wrapper.find(DocumentForm).at(0).props().uiSchema).toStrictEqual({});
      expect(wrapper.find(DocumentForm).at(0).props().formData).toStrictEqual(["form 1" , "form 2"] );
      expect(wrapper.find(DocumentForm).at(0).props().id).toBe("fill-metadata-form");
      //expectations for AggregatedMetaDataModelForm
      expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([{"selectedDoc": {"name": "AggreggatedName"}}]);
       //expectations for AddAttachments
       expect(wrapper.find(AddAttachments).at(0).props().compoundModelsInfo).toStrictEqual(["attachments 1", "attachments 2"]);
       //expectations for SubmissionStep
       expect(wrapper.find(SubmissionStep).at(0).props().response).toBe(null);
       expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeFalsy();
       expect(wrapper.find(SubmissionStep).at(0).props().errors).toBe("");
       //expect the effects of renderDocMetaData
      //  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual(result);
       expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual(value);
       expect(wrapper.find("#doc-version-msg").at(0).props().value).toBe("Message 1");
       expect(wrapper.find("#doc-version-msg").at(0).props().disabled).toBeFalsy();
     }).then(() => {
      act(() => {
        wrapper.render();
        wrapper.update();
      });
      
      //expectations for DocumentForm
      expect(wrapper.find(DocumentForm).at(0).props().schema).toStrictEqual({"properties": {"MetaData 1": {"default": "", "title": "MetaData 1", "type": "string"}}, "required": ["MetaData 1"], "title": "Model A", "type": "object"});
      //expect(wrapper.find(DocumentForm).at(0).props().uiSchema).toStrictEqual({"MetaData 1":{"ui:widget": "date"}});
      expect(wrapper.find(DocumentForm).at(0).props().formData).toStrictEqual(["form 1" , "form 2"] );
      expect(wrapper.find(DocumentForm).at(0).props().id).toBe("fill-metadata-form");
      //expectations for AggregatedMetaDataModelForm
      expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([{"childMetaDataModelId": 4, "modelId": 2, "modelName": "Aggregated 1", "selectedDoc": {"id": -1, "name": "..."}}]);
       //expectations for AddAttachments
       expect(wrapper.find(AddAttachments).at(0).props().compoundModelsInfo).toStrictEqual([{"attachedFile": undefined, "attachmentName": "compound model", "compoundModelId": 1, "isRequiered": true}]);
       //expectations for SubmissionStep
       expect(wrapper.find(SubmissionStep).at(0).props().response).toBe(null);
       expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeFalsy();
       expect(wrapper.find(SubmissionStep).at(0).props().errors).toBe("");
       //expect the effects of renderDocMetaData
      //  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual(result);
       expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual(value);
       expect(wrapper.find("#doc-version-msg").at(0).props().value).toBe("Message 1");
       expect(wrapper.find("#doc-version-msg").at(0).props().disabled).toBeFalsy();
       //calling onSubmit
     act(() => {
      let formData={key:"KeyForm"};
       wrapper
         .find(DocumentForm)
         .at(0)
         .props()
         .onSubmit({formData});
     });
      let modelData_ ="{\"id\":1,\"versionMessage\":\"Message 1\",\"formData\":{\"key\":\"KeyForm\"},\"aggregatedDocs\":[{\"modelId\":2,\"modelName\":\"Aggregated 1\",\"childMetaDataModelId\":4,\"selectedDoc\":{\"id\":-1,\"name\":\"...\"}}],\"attachments\":[{\"compoundModelId\":1,\"attachmentName\":\"compound model\",\"isRequiered\":true}]}";
     let document_data ={"Attachments": [],"DocumentVersion": { "ChildrenDocuments": [{"AggregateMetaDataModelID": 2, "ChildDocumentVersionId": undefined}], "Values": [{"AttributeId": 1, "Value": undefined}], "VersionMessage": "Message 1"}, "MetadataModelId": 1};
      wrapper.render();
    wrapper.update();
    expect(setLocalStorageMock).toHaveBeenCalledTimes(1);
    expect(setLocalStorageMock.mock.calls[0][0]).toBe("Model A");
    expect(setLocalStorageMock.mock.calls[0][1]).toBe(modelData_);
    //expectations for   postDocumentData
    expect(postMock).toHaveBeenCalledTimes(1);
    expect(postMock.mock.calls[0][0]).toStrictEqual(document_data);
    expect(postMock.mock.calls[0][1]).toStrictEqual(["scanned 1" , "scanned 2"]);
    expect(postMock.mock.calls[0][2]).toStrictEqual([]);
    expect(postMock.mock.calls[0][3]).toStrictEqual("/api/Document/AddNewDocument");
    expect(postMock.mock.calls[0][4]).toStrictEqual("Add");
    //expectations for SubmissionStep
    expect(wrapper.find(SubmissionStep).at(0).props().response).toStrictEqual(null);
    expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeTruthy();
    process.nextTick(() => {
     expect(wrapper.find(SubmissionStep).at(0).props().errors).toStrictEqual("");
      done(); 
    });
   
  });
  });

  test("postData functionality when is  not valid", () => {
    let wrapper= mount(<Router><CreateDocument /></Router>);
    const mockSuccessResponsePostDocumentData = Promise.resolve({response:"successfully" , error:"error"});
  const mockJsonPromisePostDocumentData = Promise.resolve(mockSuccessResponsePostDocumentData);
    const postMock =  jest.spyOn(PostDataMock, "postDocumentData").mockImplementation(() => mockJsonPromisePostDocumentData);;
    let reason = "select-option";
    let value = {name:"Model A" , id:1};
    let value2 = {name:"Model A" , id:2};
    let result = [
        { id: 1, name: "Model A" },
        { id: 2, name: "Model B" },
      ];
    let mockSuccessResponseMetaDataModel = {metaDataModelName:"Model A" , metaDataAttributes:[{metaDataAttributeName:"MetaData 1" , id:1 , isRequired:true ,dataTypeID:6}] , childMetaDataModels:[{id: 2 , aggregateName: "Aggregated 1" , childMetaDataModelId:4}] , compoundModels:[{id:1 ,caption : "compound model" , isRequired: true }]}
      const mockJsonPromiseMetaDataModel = Promise.resolve(
        mockSuccessResponseMetaDataModel
      );
    const fetchingMetaDataModel = jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromiseMetaDataModel);
    let mockJsonPromise = JSON.stringify({name:"Name 1" , author:"Author 1" , versionMessage:"Message 1", formData:["form 1" , "form 2"] , aggregatedDocs:[{selectedDoc : {name : "AggreggatedName"}}]  , attachments:["attachments 1" , "attachments 2"] });
    const localStorageMock =  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(() => mockJsonPromise);;
    const setLocalStorageMock =  jest.spyOn(window.localStorage.__proto__, 'setItem'); 
    //setting getMetaDataModelData returned value 
      return mockJsonPromiseMetaDataModel.then(() => {
         //calling handleDropdownList help setting model.id = 1
    act(() => {
        wrapper
          .find("#combo-box-metadata-model")
          .at(0)
          .props()
          .onChange({ target: { value: "" } } , value , reason);
      });
      wrapper.render();
      wrapper.update();
       //expectation for componentDidMount
       expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
       expect(fetchingMetaDataModel.mock.calls[0][0]).toBe("/api/MetaDataModel/GetMetaDataModelsIdName");
       expect(fetchingMetaDataModel.mock.calls[1][0]).toBe("/api/MetaDataModel/1");
      expect(localStorageMock).toHaveBeenCalledTimes(1);
      expect(localStorageMock.mock.calls[0][0]).toBe("Model A");
      //expectation for handleDropdownList
      //expectations for DocumentForm
      expect(wrapper.find(DocumentForm).at(0).props().schema).toStrictEqual({});
      expect(wrapper.find(DocumentForm).at(0).props().uiSchema).toStrictEqual({});
      expect(wrapper.find(DocumentForm).at(0).props().formData).toStrictEqual(["form 1" , "form 2"] );
      expect(wrapper.find(DocumentForm).at(0).props().id).toBe("fill-metadata-form");
      //expectations for AggregatedMetaDataModelForm
      expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([{"selectedDoc": {"name": "AggreggatedName"}}]);
       //expectations for AddAttachments
       expect(wrapper.find(AddAttachments).at(0).props().compoundModelsInfo).toStrictEqual(["attachments 1", "attachments 2"]);
       //expectations for SubmissionStep
       expect(wrapper.find(SubmissionStep).at(0).props().response).toBe(null);
       expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeFalsy();
       expect(wrapper.find(SubmissionStep).at(0).props().errors).toBe("");
       //expect the effects of renderDocMetaData
      //  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual(result);
       expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual(value);
       expect(wrapper.find("#doc-version-msg").at(0).props().value).toBe("Message 1");
       expect(wrapper.find("#doc-version-msg").at(0).props().disabled).toBeFalsy();
     }).then(() => {
      act(() => {
        wrapper.render();
        wrapper.update();
      });
      

      //expectations for DocumentForm
      expect(wrapper.find(DocumentForm).at(0).props().schema).toStrictEqual({"properties": {"MetaData 1": {"default": "", "title": "MetaData 1", "type": "string"}}, "required": ["MetaData 1"], "title": "Model A", "type": "object"});
      //expect(wrapper.find(DocumentForm).at(0).props().uiSchema).toStrictEqual({"MetaData 1":{"ui:widget": "date"}});
      expect(wrapper.find(DocumentForm).at(0).props().formData).toStrictEqual(["form 1" , "form 2"] );
      expect(wrapper.find(DocumentForm).at(0).props().id).toBe("fill-metadata-form");
      //expectations for AggregatedMetaDataModelForm
      expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([{"childMetaDataModelId": 4, "modelId": 2, "modelName": "Aggregated 1", "selectedDoc": {"id": -1, "name": "..."}}]);
       //expectations for AddAttachments
       expect(wrapper.find(AddAttachments).at(0).props().compoundModelsInfo).toStrictEqual([{"attachedFile": undefined, "attachmentName": "compound model", "compoundModelId": 1, "isRequiered": true}]);
       //expectations for SubmissionStep
       expect(wrapper.find(SubmissionStep).at(0).props().response).toBe(null);
       expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeFalsy();
       expect(wrapper.find(SubmissionStep).at(0).props().errors).toBe("");
       //expect the effects of renderDocMetaData
      //  expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual(result);
       expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual(value);
       expect(wrapper.find("#doc-version-msg").at(0).props().value).toBe("Message 1");
       expect(wrapper.find("#doc-version-msg").at(0).props().disabled).toBeFalsy();
       //calling onSubmit
       return mockSuccessResponsePostDocumentData.then(() => {
     act(() => {
      let formData={key:"KeyForm"};
       wrapper
         .find(DocumentForm)
         .at(0)
         .props()
         .onSubmit({formData});
     });
    }).then(() => { 
      wrapper.render();
    wrapper.update();
    expect(setLocalStorageMock).toHaveBeenCalledTimes(0);
    //expectations for   postDocumentData
    expect(postMock).toHaveBeenCalledTimes(0);
    //expectations for SubmissionStep
    expect(wrapper.find(SubmissionStep).at(0).props().response).toStrictEqual(null);
    expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeFalsy();
    expect(wrapper.find(SubmissionStep).at(0).props().errors).toBe("");
    })
 
  });
  });

  test("ScannedDocumentSelector functionality ", () => {
    let wrapper= mount(<Router><CreateDocument /></Router>);
    let attachments = [{"attachedFile": "file 1", "attachmentName": "compound model", "compoundModelId": 1, "isRequiered": true}];
    let isCompleted= false;
    //expectations for DocumentForm
    expect(wrapper.find(DocumentForm).at(0).props().schema).toStrictEqual({});
    expect(wrapper.find(DocumentForm).at(0).props().uiSchema).toStrictEqual({});
    expect(wrapper.find(DocumentForm).at(0).props().formData).toStrictEqual([]);
    expect(wrapper.find(DocumentForm).at(0).props().id).toBe("fill-metadata-form");
    //expectations for AggregatedMetaDataModelForm
    expect(wrapper.find(AggregatedMetaDataModelForm).at(0).props().aggregatedDocsInfo).toStrictEqual([]);
     //expectations for AddAttachments
     expect(wrapper.find(AddAttachments).at(0).props().compoundModelsInfo).toStrictEqual([]);
     //expectations for SubmissionStep
     expect(wrapper.find(SubmissionStep).at(0).props().response).toBe(null);
     expect(wrapper.find(SubmissionStep).at(0).props().uploading).toBeFalsy();
     expect(wrapper.find(SubmissionStep).at(0).props().errors).toBe("");
     //expect the effects of renderDocMetaData
     const initModel = {
      id: 0,
      name: "",
    };
     expect(wrapper.find(Autocomplete).at(0).props().options).toStrictEqual([]);
     expect(wrapper.find(Autocomplete).at(0).props().value).toStrictEqual(initModel);
     expect(wrapper.find("#doc-version-msg").at(0).props().value).toBe("");
     expect(wrapper.find("#doc-version-msg").at(0).props().disabled).toBeTruthy();
     let scannedFiles  = ["scanned 1" , "scanned 2"];
     let index = null;
    act(() => {
        wrapper
          .find(ScannedDocumentSelector)
          .at(0)
          .props()
          .updateScannedFiles(scannedFiles , index);
      });
      wrapper.render();
      wrapper.update();
      //expectations for ScannedDocumentSelector
      expect(wrapper.find(ScannedDocumentSelector).at(0).props().scannedDocFiles).toStrictEqual(scannedFiles);
      //test case 2 
      let index2 = 0;
      let result = ["scanned 1" , "scanned 2"]
      result.splice(index2 , 1);
     act(() => {
         wrapper
           .find(ScannedDocumentSelector)
           .at(0)
           .props()
           .updateScannedFiles(scannedFiles , index2);
       });
       wrapper.render();
       wrapper.update();
        //expectations for ScannedDocumentSelector
      expect(wrapper.find(ScannedDocumentSelector).at(0).props().scannedDocFiles).toStrictEqual(result);
  });
 
});