import React from "react";
import ReactDom from "react-dom";
import AddAttachments from "../../components/User/AddAttachments";
import UpdateOrPreviewDocumentDialog from "../../components/User/UpdateOrPreviewDocumentDialog";
import ShowDocumentChildren from "../../components/User/ShowDocumentChildren";
import ConfirmUpdateDialog from "../../components/User/ConfirmUpdateDialog";
import PreviewDocumentScans from "../../components/User/PreviewDocumentScans";
import ScannedDocumentSelector from "../../components/User/ScannedDocumentSelector";
import * as ParseDocumentMock from "../../utils/ParseDocument";
import {parseDocumentDataToForm}  from "../../utils/ParseDocument";
import * as FetchMock from "../../api/FetchData";
import * as PostDataMock from "../../api/PostData";
import { getDocumentById } from "../../api/FetchData";
import { postDocumentData } from "../../api/PostData";
import { cleanup, fireEvent } from "@testing-library/react";
import renderer from "react-test-renderer";
import { mount , shallow} from "enzyme";
import { act } from "react-dom/test-utils";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import { createMount } from '@material-ui/core/test-utils';
import Form from "react-jsonschema-form";
import DialogContentText from "@material-ui/core/DialogContentText";
afterEach(cleanup);
describe("UpdateOrPreviewDocumentDialog", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("UpdateOrPreviewDocumentDialog renders without crashing", () => {
      let open = true;
      let option = 1;
      let document_id = 1;
    const updater = jest.fn();
    const updateDocument = jest.fn();
    const div = document.createElement("div");
    ReactDom.render(
        <UpdateOrPreviewDocumentDialog
        open={open}
        option={option}
        document_id={document_id}
        handler={updater}
        updateDocument={updateDocument}
      />,
      div
    );
  });

  test("UpdateOrPreviewDocumentDialog matches snapshot", () => {
    let open = true;
    let option = 1;
    let document_id = 1;
  const updater = jest.fn();
  const updateDocument = jest.fn();
    const renderedValue = createMount()(
        <UpdateOrPreviewDocumentDialog
        open={open}
        option={option}
        document_id={document_id}
        handler={updater}
        updateDocument={updateDocument}
      />
      );
      expect(renderedValue.html()).toMatchSnapshot();
  });
  

  test("UpdateOrPreviewDocumentDialog test intialization", () => {
    let open = true;
    let option = 1;
    let document_id = 1;
  const updater = jest.fn();
  const updateDocument = jest.fn();
    const wrapper = mount(
        <UpdateOrPreviewDocumentDialog
        open={open}
        option={option}
        document_id={document_id}
        handler={updater}
        updateDocument={updateDocument}
      />
      );
      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
      expect(wrapper.find(Form).at(0).props().schema).toStrictEqual({});
      expect(wrapper.find(Form).at(0).props().uiSchema).toStrictEqual({});
      expect(wrapper.find(ShowDocumentChildren).length).toBe(0); // option is 1
  });

  test("UpdateOrPreviewDocumentDialog , contentText functionality when option = 0", () => {
    let open = true;
    let option = 0;
    let document_id = 1;
  const updater = jest.fn();
  const updateDocument = jest.fn();
    const wrapper = mount(
        <UpdateOrPreviewDocumentDialog
        open={open}
        option={option}
        document_id={document_id}
        handler={updater}
        updateDocument={updateDocument}
      />
      );
      //expectations
      expect(wrapper.find(DialogContentText).text()).toBe("dialog_previewdocument");
  });

  test("UpdateOrPreviewDocumentDialog , contentText functionality when option = 1", () => {
    let open = true;
    let option = 1;
    let document_id = 1;
  const updater = jest.fn();
  const updateDocument = jest.fn();
    const wrapper = mount(
        <UpdateOrPreviewDocumentDialog
        open={open}
        option={option}
        document_id={document_id}
        handler={updater}
        updateDocument={updateDocument}
      />
      );
      //expectations
      expect(wrapper.find(DialogContentText).text()).toBe("dialog_updatedocument");
  });

  test("UpdateOrPreviewDocumentDialog , contentText functionality when option is undefined", () => {
    let open = true;
    let option = -1;
    let document_id = 1;
  const updater = jest.fn();
  const updateDocument = jest.fn();
    const wrapper = mount(
        <UpdateOrPreviewDocumentDialog
        open={open}
        option={option}
        document_id={document_id}
        handler={updater}
        updateDocument={updateDocument}
      />
      );
      //expectations
      expect(wrapper.find(DialogContentText).text()).toBe("");
  });

  test("UpdateOrPreviewDocumentDialog , updateDocumentFromChild  functionality", () => {
    let open = true;
    let option = 1;
    let document_id = 1;
  const updater = jest.fn();
  const updateDocument = jest.fn();
  let documentVersionId = 1;
  const mockSuccessResponse = {name:"title 1" , id: 1 ,metadataModelId :2 , metadataModelName: "model A" , addedDate: '16/2/2020' , modifiedDate: '16/2/2020' , latestVersion: 1, deletedDate: '16/2/2020' , documentVersion: {values : [{attributeName:"key" , attributeId :3}],childrenDocuments : [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}] , documenetScans :["scan 1" , "scan 2"] , id: 4 , versionMessage :"message 1" , author:"author" , addedDate: '16/2/2020'}};
  const mockJsonPromise = Promise.resolve(mockSuccessResponse); 
  const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise);
  let wrapper;
  return mockJsonPromise.then(() => { 
   wrapper = mount(
        <UpdateOrPreviewDocumentDialog
        open={open}
        option={option}
        documentVersionId ={documentVersionId}
        document_id={document_id}
        handler={updater}
        updateDocument={updateDocument}
      />
      );
      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
      expect(wrapper.find(Form).at(0).props().schema).toStrictEqual({});
      expect(wrapper.find(Form).at(0).props().uiSchema).toStrictEqual({});
      expect(wrapper.find(ShowDocumentChildren).length).toBe(0); // option is 1
      expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeFalsy();
    }).then(() => {
      wrapper.render();
      wrapper.update();
      let childrenDocuments = [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}];
      expect(wrapper.find(ShowDocumentChildren).at(0).props().documents).toStrictEqual(childrenDocuments);
      //calling updateDocumentFromChild
      act(() => {
        wrapper
          .find(ShowDocumentChildren)
          .at(0)
          .props()
          .updateDocument(1);
      });
      wrapper.render();
      wrapper.update();
      expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeTruthy();
  });
});
  test("UpdateOrPreviewDocumentDialog ,componentDidMount + componentDidUpdate functionality", async () => {
    let open = true;
    let option = 2;
    let document_id = 1;
    let documentVersionId =1;
  const updater = jest.fn();
  const updateDocument = jest.fn();
  const mockSuccessResponse = {name:"title 1" , id: 1 ,metadataModelId :2 , metadataModelName: "model A" , addedDate: '16/2/2020' , modifiedDate: '16/2/2020' , latestVersion: 1, deletedDate: '16/2/2020' , documentVersion: {values : [{attributeName:"key" , attributeId :3}],childrenDocuments : [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}] , documenetScans :["scan 1" , "scan 2"] , id: 4 , versionMessage :"message 1" , author:"author" , addedDate: '16/2/2020'}};
  const mockJsonPromise = Promise.resolve(mockSuccessResponse); 
  const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise);
  let wrapper;
  return mockJsonPromise.then(() => {
     wrapper = mount(
        <UpdateOrPreviewDocumentDialog
        open={open}
        option={option}
        documentVersionId ={documentVersionId}
        document_id={document_id}
        handler={updater}
        updateDocument={updateDocument}
      />
      );

      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
    expect(wrapper.find(Form).at(0).props().schema).toStrictEqual({});
    expect(wrapper.find(Form).at(0).props().uiSchema).toStrictEqual({});
    expect(wrapper.find(ShowDocumentChildren).length).toBe(0); // option is 2
    expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeFalsy();
    //calling update 
    wrapper.setProps({documentVersionId:2})
  }).then(() => {
    wrapper.update();
    wrapper.render();
    //expectation for componentDidUpdate
    let schema = {
      title: "title 1",
      type: "object",
      required: [],
      properties: {
        metadataModelName: { type: "string", title: "metadata_model_name" },
        addedDate: { type: "string", title: "metadata_model_date" },
        key: { type: "", title: "key" },
        latestVersion: { type: "number", title: "latest_version" },
        versionMessage: { type: "string", title: "version_message" },
        documentVersionAddedDate: {
          type: "string",
          title: "document_version_added_date",
        },
      },
    };
    let ui_schema = {"addedDate": {"ui:readonly": true}, "documentVersionAddedDate": {"ui:readonly": true}, "latestVersion": {"ui:readonly": true}, "metadataModelName": {"ui:readonly": true}, "versionMessage": {"ui:readonly": true}};

    let form_data = {
      metadataModelName: "model A",
      addedDate: "16/2/2020",
      latestVersion: 1,
      key: undefined,
      versionMessage: "message 1",
      documentVersionAddedDate: "16/2/2020",
    };
    let childrenDocuments = [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}];
    let documentScans = ["scan 1" , "scan 2"];
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/document/GetDocumentVersionById?id=1");
    expect(fetchMock.mock.calls[1][0]).toBe("/api/document/GetDocumentVersionById?id=2");
    expect(fetchMock.mock.calls[2][0]).toBe("/api/document/GetDocumentVersionById?id=2");
    expect(wrapper.find(Form).at(0).props().schema).toStrictEqual(schema);
    expect(wrapper.find(Form).at(0).props().uiSchema).toStrictEqual(ui_schema);
    expect(wrapper.find(Form).at(0).props().formData).toStrictEqual(form_data);
    expect(wrapper.find(ShowDocumentChildren).at(0).props().option).toBe(2);
    expect(wrapper.find(ShowDocumentChildren).at(0).props().documents).toStrictEqual(childrenDocuments);
    expect(wrapper.find(PreviewDocumentScans).at(0).props().scannedDoc).toStrictEqual(documentScans);
  });
  });

  test("UpdateOrPreviewDocumentDialog , onChange + assignFormData when the length of cashed_form_data != 0 functionality", () => {
    let open = true;
    let option = 1;
    let document_id = 1;
  const updater = jest.fn();
  const updateDocument = jest.fn();
    const wrapper = mount(
        <UpdateOrPreviewDocumentDialog
        open={open}
        option={option}
        document_id={document_id}
        handler={updater}
        updateDocument={updateDocument}
      />
      );
      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
      expect(wrapper.find(Form).at(0).props().schema).toStrictEqual({});
      expect(wrapper.find(Form).at(0).props().uiSchema).toStrictEqual({});
      expect(wrapper.find(ShowDocumentChildren).length).toBe(0); // option is 1
      expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeFalsy();
      //calling onChange
      let formData={"document_version":1};
    act(() => {
      wrapper
        .find(Form)
        .at(0)
        .props()
        .onChange({formData});
    });
    wrapper.render();
    wrapper.update();
    //expectations
    expect(wrapper.find(Form).at(0).props().formData).toBe(formData);
  });

  test("UpdateOrPreviewDocumentDialog ,  assignFormData when the length of cashed_form_data == 0 functionality", () => {
    let open = true;
    let option = 1;
    let document_id = 1;
  const updater = jest.fn();
  const updateDocument = jest.fn();
    const wrapper = mount(
        <UpdateOrPreviewDocumentDialog
        open={open}
        option={option}
        document_id={document_id}
        handler={updater}
        updateDocument={updateDocument}
      />
      );
      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
      expect(wrapper.find(Form).at(0).props().schema).toStrictEqual({});
      expect(wrapper.find(Form).at(0).props().uiSchema).toStrictEqual({});
      expect(wrapper.find(ShowDocumentChildren).length).toBe(0); // option is 1
      expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeFalsy();
      //calling onChange
      let formData={};
    act(() => {
      wrapper
        .find(Form)
        .at(0)
        .props()
        .onChange({formData});
    });
    wrapper.render();
    wrapper.update();
    //calling assignFormData
    expect(wrapper.find(Form).at(0).props().formData).toStrictEqual({});
  });

  test("UpdateOrPreviewDocumentDialog , handleIgnoreUpdate  functionality", () => {
    let open = true;
    let option = 1;
    let document_id = 1;
  const updater = jest.fn();
  const updateDocument = jest.fn();
    const wrapper = mount(
        <UpdateOrPreviewDocumentDialog
        open={open}
        option={option}
        document_id={document_id}
        handler={updater}
        updateDocument={updateDocument}
      />
      );
      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
      expect(wrapper.find(Form).at(0).props().schema).toStrictEqual({});
      expect(wrapper.find(Form).at(0).props().uiSchema).toStrictEqual({});
      expect(wrapper.find(ShowDocumentChildren).length).toBe(0); // option is 1
      expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeFalsy();

       //calling handleIgnoreUpdate
       act(() => {
        wrapper
          .find(ConfirmUpdateDialog)
          .at(0)
          .props()
          .handleIgnoreUpdate();
      });
      wrapper.render();
      wrapper.update();
      expect(updater).toHaveBeenCalledTimes(1);
    expect(updater.mock.calls[0][0]).toBe(-1);
    expect(updater.mock.calls[0][1]).toBe("",);
    expect(updater.mock.calls[0][2]).toBe(-1);
  });

  test("UpdateOrPreviewDocumentDialog , handleClose  functionality", () => {
    let open = true;
    let option = 1;
    let document_id = 1;
  const updater = jest.fn();
  const updateDocument = jest.fn();
  let documentVersionId = 1;
  const mockSuccessResponse = {name:"title 1" , id: 1 ,metadataModelId :2 , metadataModelName: "model A" , addedDate: '16/2/2020' , modifiedDate: '16/2/2020' , latestVersion: 1, deletedDate: '16/2/2020' , documentVersion: {values : [{attributeName:"key" , attributeId :3}],childrenDocuments : [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}] , documenetScans :["scan 1" , "scan 2"] , id: 4 , versionMessage :"message 1" , author:"author" , addedDate: '16/2/2020'}};
  const mockJsonPromise = Promise.resolve(mockSuccessResponse); 
  const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise);
  let wrapper;
  return mockJsonPromise.then(() => { 
   wrapper = mount(
        <UpdateOrPreviewDocumentDialog
        open={open}
        option={option}
        documentVersionId ={documentVersionId}
        document_id={document_id}
        handler={updater}
        updateDocument={updateDocument}
      />
      );
      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
      expect(wrapper.find(Form).at(0).props().schema).toStrictEqual({});
      expect(wrapper.find(Form).at(0).props().uiSchema).toStrictEqual({});
      expect(wrapper.find(ShowDocumentChildren).length).toBe(0); // option is 1
      expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeFalsy();
    }).then(() => {
      wrapper.render();
      wrapper.update();
      let childrenDocuments = [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}];
      expect(wrapper.find(ShowDocumentChildren).at(0).props().documents).toStrictEqual(childrenDocuments);
      //calling updateDocumentFromChild
      act(() => {
        wrapper
          .find(ShowDocumentChildren)
          .at(0)
          .props()
          .updateDocument(1);
      });
      wrapper.render();
      wrapper.update();
      expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeTruthy();
       //calling handleIgnoreUpdate
       act(() => {
        wrapper
          .find(ConfirmUpdateDialog)
          .at(0)
          .props()
          .handleClose();
      });
      wrapper.render();
      wrapper.update();
      expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeFalsy();
  });
  });

  test("UpdateOrPreviewDocumentDialog , showUpdateButtton when option != 1 functionality", () => {
    let open = true;
    let option = 0;
    let document_id = 1;
  const updater = jest.fn();
  const updateDocument = jest.fn();
    const wrapper = mount(
        <UpdateOrPreviewDocumentDialog
        open={open}
        option={option}
        document_id={document_id}
        handler={updater}
        updateDocument={updateDocument}
      />
      );
      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
      expect(wrapper.find(Form).at(0).props().schema).toStrictEqual({});
      expect(wrapper.find(Form).at(0).props().uiSchema).toStrictEqual({});
      expect(wrapper.find(ShowDocumentChildren).length).toBe(0); // option is 0
      expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeFalsy();
      //expectation for showUpdateButtton
      expect(wrapper.find(Button).length).toBe(1);
      expect(wrapper.find("#showUpdateButtton").length).toBe(0);
  });

  test("UpdateOrPreviewDocumentDialog , showUpdateButtton when option == 1 functionality", () => {
    let open = true;
    let option = 1;
    let document_id = 1;
  const updater = jest.fn();
  const updateDocument = jest.fn();
    const wrapper = mount(
        <UpdateOrPreviewDocumentDialog
        open={open}
        option={option}
        document_id={document_id}
        handler={updater}
        updateDocument={updateDocument}
      /> );
      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
      expect(wrapper.find(Form).at(0).props().schema).toStrictEqual({});
      expect(wrapper.find(Form).at(0).props().uiSchema).toStrictEqual({});
      expect(wrapper.find(ShowDocumentChildren).length).toBe(0); // option is 1
      expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeFalsy();
      //expectation for showUpdateButtton
      expect(wrapper.find(Button).length).toBe(3);
      expect(document.getElementById("showUpdateButtton")).toBeInTheDocument();
  });


  test("UpdateOrPreviewDocumentDialog , updateChildrenDocuments functionality", () => {
    let open = true;
    let option = 1;
    let document_id = 1;
  const updater = jest.fn();
  const updateDocument = jest.fn();
  let documentVersionId = 1;
  const mockSuccessResponse = {name:"title 1" , id: 1 ,metadataModelId :2 , metadataModelName: "model A" , addedDate: '16/2/2020' , modifiedDate: '16/2/2020' , latestVersion: 1, deletedDate: '16/2/2020' , documentVersion: {values : [{attributeName:"key" , attributeId :3}],childrenDocuments : [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}] , documenetScans :["scan 1" , "scan 2"] , id: 4 , versionMessage :"message 1" , author:"author" , addedDate: '16/2/2020'}};
  const mockJsonPromise = Promise.resolve(mockSuccessResponse); 
  const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise);
  let wrapper;
  return mockJsonPromise.then(() => { 
   wrapper = mount(
        <UpdateOrPreviewDocumentDialog
        open={open}
        option={option}
        documentVersionId ={documentVersionId}
        document_id={document_id}
        handler={updater}
        updateDocument={updateDocument}
      />
      );
      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
      expect(wrapper.find(Form).at(0).props().schema).toStrictEqual({});
      expect(wrapper.find(Form).at(0).props().uiSchema).toStrictEqual({});
      expect(wrapper.find(ShowDocumentChildren).length).toBe(0); // option is 1
      expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeFalsy();
    }).then(() => {
      wrapper.render();
      wrapper.update();
      let childrenDocuments = [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}];
      expect(wrapper.find(ShowDocumentChildren).at(0).props().documents).toStrictEqual(childrenDocuments);
      //calling updateChildrenDocuments
      let documents=[{childDocumentVersionId :1 ,childMetadataModelId :2 , documentName:"document 1" , aggregateMetaDataModelID:3,aggregateName : "aggregated 1"}]
      act(() => {
        wrapper
          .find(ShowDocumentChildren)
          .at(0)
          .props()
          .updater(documents);
      });
      wrapper.render();
      wrapper.update();
      //expectation 
      expect(wrapper.find(ShowDocumentChildren).at(0).props().documents).toStrictEqual(documents);
  }); 
  });
//the corresponde functionaity has been removed
  // test("UpdateOrPreviewDocumentDialog , UNSAFE_componentWillReceiveProps functionality", async () => {
  //   let open = true;
  //   let option = 2;
  //   let document_id = 1;
  // const updater = jest.fn();
  // const updateDocument = jest.fn();
  // const mockSuccessResponse = {name:"title 1" , id: 1 ,metadataModelId :2 , metadataModelName: "model A" , addedDate: '16/2/2020' , modifiedDate: '16/2/2020' , latestVersion: 1, deletedDate: '16/2/2020' , documentVersion: {values : [{attributeName:"key" , attributeId :3}],childrenDocuments : [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}] , documenetScans :["scan 1" , "scan 2"] , id: 4 , versionMessage :"message 1" , author:"author" , addedDate: '16/2/2020'}};
  // const mockJsonPromise = Promise.resolve(mockSuccessResponse); 
  // const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise);
  // let wrapper;
  // return mockJsonPromise.then(() => {
  //    wrapper = mount(
  //       <UpdateOrPreviewDocumentDialog
  //       open={open}
  //       option={option}
  //       document_id={document_id}
  //       handler={updater}
  //       updateDocument={updateDocument}
  //     />
  //     );

  //     expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
  //   expect(wrapper.find(Form).at(0).props().schema).toStrictEqual({});
  //   expect(wrapper.find(Form).at(0).props().uiSchema).toStrictEqual({});
  //   expect(wrapper.find(ShowDocumentChildren).length).toBe(0); // option is 2
  //   expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeFalsy();
  //   //calling updateDocumentFromChild help setting needed_update_id not to 0 and show_confirm_dialog to true
  //   act(() => {
  //     wrapper
  //       .find(ShowDocumentChildren)
  //       .at(0)
  //       .props()
  //       .updateDocument(1);
  //   });
  //   wrapper.render();
  //   wrapper.update();
  //   expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeTruthy();
  //   //calling onSubmit help setting show_confirm_dialog to false 
  //   let formData={"document_version":1};
  //   act(() => {
  //     wrapper
  //       .find(Form)
  //       .at(0)
  //       .props()
  //       .onSubmit({formData});
  //   });
  //   wrapper.render();
  //   wrapper.update();
  //   expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeFalsy();
  //   //calling UNSAFE_componentWillReceiveProps 
  //   wrapper.setProps({document_id:3});
  // }).then(() => {
  //   wrapper.update();
  //   wrapper.render();
  //   //expectation for componentDidUpdate
  //   let schema = {
  //     title: "title 1",
  //     type: "object",
  //     required: [],
  //     properties: {
  //       documentId: { type: "number", title: "Document ID" },
  //       metadataModelId: { type: "number", title: "Metadata Model ID" },
  //       metadataModelName: { type: "string", title: "Metadata Model Name" },
  //       addedDate: { type: "string", title: " Document Added Date" },
  //       modifiedDate: { type: "string", title: "Modified Date" },
  //       latestVersion: { type: "number", title: "Latest Version" },
  //       deletedDate: { type: "string", title: "Deleted Date" },
  //       id: { type: "number", title: "ID" },
  //       key: { type: "", title: "key" },
  //       versionMessage: { type: "string", title: "Version Message" },
  //       author: { type: "string", title: "Author" },
  //       documentVersionAddedDate: {
  //         type: "string",
  //         title: "Document Version Added Date",
  //       },
  //     },
  //   };
  //   let ui_schema = {
  //     documentId: {
  //       "ui:readonly": true,
  //     },
  //     metadataModelId: {
  //       "ui:readonly": true,
  //     },
  //     metadataModelName: {
  //       "ui:readonly": true,
  //     },
  //     addedDate: {
  //       "ui:readonly": true,
  //     },
  //     modifiedDate: {
  //       "ui:readonly": true,
  //     },
  //     latestVersion: {
  //       "ui:readonly": true,
  //     },
  //     deletedDate: {
  //       "ui:readonly": true,
  //     },
  //     id: {
  //       "ui:readonly": true,
  //     },
  //     versionMessage: {
  //       "ui:readonly": true,
  //     },
  //     author: {
  //       "ui:readonly": true,
  //     },
  //     documentVersionAddedDate: {
  //       "ui:readonly": true,
  //     }
  //   };

  //   let form_data = {
  //     documentId: 1,
  //     metadataModelId: 2,
  //     metadataModelName: "model A",
  //     addedDate: "16/2/2020",
  //     modifiedDate: "16/2/2020",
  //     latestVersion: 1,
  //     deletedDate: "16/2/2020",
  //     id: 4,
  //     key: undefined,
  //     versionMessage: "message 1",
  //     author: "author",
  //     documentVersionAddedDate: "16/2/2020",
  //   };
  //   let childrenDocuments = [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}];
  //   let documentScans = ["scan 1" , "scan 2"];
  //   expect(fetchMock).toHaveBeenCalledTimes(3);
  //   expect(fetchMock.mock.calls[0][0]).toBe("/api/document/GetDocumentVersionById?id=1");
  //   expect(fetchMock.mock.calls[1][0]).toBe("/api/document/GetDocumentVersionById?id=3");
  //   expect(fetchMock.mock.calls[2][0]).toBe("/api/document/GetDocumentVersionById?id=1");
  //   expect(wrapper.find(Form).at(0).props().schema).toStrictEqual(schema);
  //   expect(wrapper.find(Form).at(0).props().uiSchema).toStrictEqual(ui_schema);
  //   expect(wrapper.find(Form).at(0).props().formData).toStrictEqual(form_data);
  //   expect(wrapper.find(ShowDocumentChildren).at(0).props().option).toBe(2);
  //   expect(wrapper.find(ShowDocumentChildren).at(0).props().documents).toStrictEqual(childrenDocuments);
  //   expect(wrapper.find(PreviewDocumentScans).at(0).props().scannedDoc).toStrictEqual(documentScans);
  // });
  // });


  test("UpdateOrPreviewDocumentDialog , onSubmit functionality when needed_update_id !== -1", () => {
    let open = true;
    let option = 1;
    let document_id = 1;
  const updater = jest.fn();
  const updateDocument = jest.fn();
  let documentVersionId =1;
  const mockSuccessResponse = {name:"title 1" , id: 1 ,metadataModelId :2 , metadataModelName: "model A" , addedDate: '16/2/2020' , modifiedDate: '16/2/2020' , latestVersion: 1, deletedDate: '16/2/2020' , documentVersion: {values : [{attributeName:"key" , attributeId :3}],childrenDocuments : [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}] , documenetScans :["scan 1" , "scan 2"] , id: 4 , versionMessage :"message 1" , author:"author" , addedDate: '16/2/2020'}};
  const mockJsonPromise = Promise.resolve(mockSuccessResponse); 
  const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise);
  let mockJsonPromisePostData ={ok:true , json:()=>{return Promise.resolve({constructor : Object , latestVersionId:2 , error:[{errorMessage :"errorMessage"}]})}};
  const postMock =  jest.spyOn(PostDataMock, "postDocumentData").mockImplementation(() => mockJsonPromisePostData);;
  let wrapper;
  return mockJsonPromise.then(() => {
     wrapper = mount(
        <UpdateOrPreviewDocumentDialog
        documentVersionId ={documentVersionId}
        open={open}
        option={option}
        document_id={document_id}
        handler={updater}
        updateDocument={updateDocument}
      />
      );

      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
    expect(wrapper.find(Form).at(0).props().schema).toStrictEqual({});
    expect(wrapper.find(Form).at(0).props().uiSchema).toStrictEqual({});
    expect(wrapper.find(ShowDocumentChildren).length).toBe(0); // option is 1
    expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeFalsy();
   
  }).then(() => {
    wrapper.update();
    wrapper.render();
     //calling updateDocumentFromChild help setting needed_update_id not to 0 and show_confirm_dialog to true
     act(() => {
      wrapper
        .find(ShowDocumentChildren)
        .at(0)
        .props()
        .updateDocument(1);
    });
    wrapper.render();
    wrapper.update();
    expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeTruthy();
    //calling onSubmit  
    let formData1={"document_version":0};
    let input ={formData: formData1};
    act(() => {
      wrapper
        .find(Form)
        .at(0)
        .props()
        .onSubmit(input);
    });
    //expectation for componentDidUpdate
    let form_data = {
      metadataModelName: "model A",
      addedDate: "16/2/2020",
      latestVersion: 1,
      key: undefined,
      versionMessage: "message 1",
      documentVersionAddedDate: "16/2/2020",
    };
    expect(wrapper.find(Form).at(0).props().formData).toStrictEqual(form_data);

    //calling onSubmit secondly
    act(() => {
      wrapper
        .find(ShowDocumentChildren)
        .at(0)
        .props()
        .updateDocument(1);
    });
    let formData2={"document_version":1, key:0};
    let input2 ={formData : formData2};
    act(() => {
      wrapper
        .find(Form)
        .at(0)
        .props()
        .onSubmit(input2);
    });
    //expectation for onSubmit
    expect(postMock).toHaveBeenCalled();
    //test first call for postDocumentData when key.localeCompare("document_version") == 0 and children_documents is empty
    expect(postMock.mock.calls[0][0]).toStrictEqual(
      {"ChildrenDocuments":  [
              {
             "aggregateMetaDataModelID": 2,
              "childDocumentVersionId": 1,
            },
              {
               "aggregateMetaDataModelID": 4,
              "childDocumentVersionId": 3,
            },
           ],
           "Values":  [
              {
               "attributeId": undefined,
               "value": 0,
             },
          ],
           "VersionMessage": undefined,
           "documentId": 1,}
    );
    expect(postMock.mock.calls[0][1]).toStrictEqual([]);
    expect(postMock.mock.calls[0][2]).toStrictEqual([]);
    expect(postMock.mock.calls[0][3]).toStrictEqual("/api/Document/UpdateDocumentVersion");
    expect(postMock.mock.calls[0][4]).toStrictEqual("Update");

    expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeTruthy();
  });
  });

  test("UpdateOrPreviewDocumentDialog , onSubmit functionality when needed_update_id == -1", () => {
    let open = true;
    let option = 1;
    let document_id = 1;
  const updater = jest.fn();
  const updateDocument = jest.fn();
  let documentVersionId =1;
  const mockSuccessResponse = {name:"title 1" , id: 1 ,metadataModelId :2 , metadataModelName: "model A" , addedDate: '16/2/2020' , modifiedDate: '16/2/2020' , latestVersion: 1, deletedDate: '16/2/2020' , documentVersion: {values : [{attributeName:"key" , attributeId :3}],childrenDocuments : [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}] , documenetScans :["scan 1" , "scan 2"] , id: 4 , versionMessage :"message 1" , author:"author" , addedDate: '16/2/2020'}};
  const mockJsonPromise = Promise.resolve(mockSuccessResponse); 
  const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise);
  let mockJsonPromisePostData ={ok:false , json:()=>{return Promise.resolve({constructor : Object , latestVersionId:2 , error:[]})}};
  const postMock =  jest.spyOn(PostDataMock, "postDocumentData").mockImplementation(() => mockJsonPromisePostData);;
  let wrapper;
  return mockJsonPromise.then(() => {
     wrapper = mount(
        <UpdateOrPreviewDocumentDialog
        documentVersionId ={documentVersionId}
        open={open}
        option={option}
        document_id={document_id}
        handler={updater}
        updateDocument={updateDocument}
      />
      );

      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
    expect(wrapper.find(Form).at(0).props().schema).toStrictEqual({});
    expect(wrapper.find(Form).at(0).props().uiSchema).toStrictEqual({});
    expect(wrapper.find(ShowDocumentChildren).length).toBe(0); // option is 1
    expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeFalsy();
   
  }).then(() => {
    wrapper.update();
    wrapper.render();
     //calling updateDocumentFromChild help setting needed_update_id not to 0 and show_confirm_dialog to true
     act(() => {
      wrapper
        .find(ShowDocumentChildren)
        .at(0)
        .props()
        .updateDocument(-1);
    });
    wrapper.render();
    wrapper.update();
    expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeTruthy();
    //calling onSubmit  
    let formData1={"document_version":0};
    let input1 ={formData : formData1};
    act(() => {
      wrapper
        .find(Form)
        .at(0)
        .props()
        .onSubmit(input1);
    });
    //expectation for componentDidUpdate
    let form_data = {
      metadataModelName: "model A",
      addedDate: "16/2/2020",
      latestVersion: 1,
      key: undefined,
      versionMessage: "message 1",
      documentVersionAddedDate: "16/2/2020",
    };
    expect(wrapper.find(Form).at(0).props().formData).toStrictEqual(form_data);

    //calling onSubmit secondly
    let formData2={"document_version":1, key:0};
    let input2 ={formData : formData2};
    act(() => {
      wrapper
        .find(Form)
        .at(0)
        .props()
        .onSubmit(input2);
    });
    //expectation for onSubmit
    expect(postMock).toHaveBeenCalled();
    //test first call for postDocumentData when key.localeCompare("document_version") == 0 and children_documents is empty
    expect(postMock.mock.calls[0][0]).toStrictEqual(
      {"ChildrenDocuments":  [
              {
             "aggregateMetaDataModelID": 2,
              "childDocumentVersionId": 1,
            },
              {
               "aggregateMetaDataModelID": 4,
              "childDocumentVersionId": 3,
            },
           ],
           "Values":  [
              {
               "attributeId": undefined,
               "value": 0,
             },
          ],
           "VersionMessage": undefined,
           "documentId": 1,}
    );
    expect(postMock.mock.calls[0][1]).toStrictEqual([]);
    expect(postMock.mock.calls[0][2]).toStrictEqual([]);
    expect(postMock.mock.calls[0][3]).toStrictEqual("/api/Document/UpdateDocumentVersion");
    expect(postMock.mock.calls[0][4]).toStrictEqual("Update");
  
    expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeTruthy();
    expect(updateDocument).toHaveBeenCalledTimes(0);
    expect(updater).toHaveBeenCalledTimes(0);
  });
  });


  test("UpdateOrPreviewDocumentDialog , handleClose functionality", async () => {
    let open = true;
    let option = 2;
    let document_id = 1;
  const updater = jest.fn();
  const updateDocument = jest.fn();
  let documentVersionId = 1;
  const mockSuccessResponse = {name:"title 1" , id: 1 ,metadataModelId :2 , metadataModelName: "model A" , addedDate: '16/2/2020' , modifiedDate: '16/2/2020' , latestVersion: 1, deletedDate: '16/2/2020' , documentVersion: {values : [{attributeName:"key" , attributeId :3}],childrenDocuments : [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}] , documenetScans :["scan 1" , "scan 2"] , id: 4 , versionMessage :"message 1" , author:"author" , addedDate: '16/2/2020'}};
  const mockJsonPromise = Promise.resolve(mockSuccessResponse); 
  const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise);
  let wrapper;
  return mockJsonPromise.then(() => {
     wrapper = mount(
        <UpdateOrPreviewDocumentDialog
        open={open}
        option={option}
        documentVersionId ={documentVersionId}
        document_id={document_id}
        handler={updater}
        updateDocument={updateDocument}
      />
      );

      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
    expect(wrapper.find(Form).at(0).props().schema).toStrictEqual({});
    expect(wrapper.find(Form).at(0).props().uiSchema).toStrictEqual({});
    expect(wrapper.find(ShowDocumentChildren).length).toBe(0); // option is 2
    expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeFalsy();
    
  }).then(() => {
    wrapper.update();
    wrapper.render();
    //expectation for componentDidUpdate
    let schema = {
      title: "title 1",
      type: "object",
      required: [],
      properties: {
        metadataModelName: { type: "string", title: "metadata_model_name" },
        addedDate: { type: "string", title: "metadata_model_date" },
        key: { type: "", title: "key" },
        latestVersion: { type: "number", title: "latest_version" },
        versionMessage: { type: "string", title: "version_message" },
        documentVersionAddedDate: {
          type: "string",
          title: "document_version_added_date",
        },
      },
    };
    let ui_schema = {"addedDate": {"ui:readonly": true}, "documentVersionAddedDate": {"ui:readonly": true}, "latestVersion": {"ui:readonly": true}, "metadataModelName": {"ui:readonly": true}, "versionMessage": {"ui:readonly": true}};

    let form_data = {
      metadataModelName: "model A",
      addedDate: "16/2/2020",
      latestVersion: 1,
      key: undefined,
      versionMessage: "message 1",
      documentVersionAddedDate: "16/2/2020",
    };
    let childrenDocuments = [{childDocumentVersionId:1 , aggregateMetaDataModelID :2} , {childDocumentVersionId:3 , aggregateMetaDataModelID :4}];
    let documentScans = ["scan 1" , "scan 2"];
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/document/GetDocumentVersionById?id=1");
    expect(wrapper.find(Form).at(0).props().schema).toStrictEqual(schema);
    expect(wrapper.find(Form).at(0).props().uiSchema).toStrictEqual(ui_schema);
    expect(wrapper.find(Form).at(0).props().formData).toStrictEqual(form_data);
    expect(wrapper.find(ShowDocumentChildren).at(0).props().option).toBe(2);
    expect(wrapper.find(ShowDocumentChildren).at(0).props().documents).toStrictEqual(childrenDocuments);
    expect(wrapper.find(PreviewDocumentScans).at(0).props().scannedDoc).toStrictEqual(documentScans);

    //calling handleClose
    act(() => {
      wrapper
        .find(Dialog)
        .at(0)
        .props()
        .onClose();
    });
    wrapper.render();
    wrapper.update();

    expect(updater).toHaveBeenCalledTimes(1);
    expect(updater.mock.calls[0][0]).toBe(-1);
    expect(updater.mock.calls[0][1]).toBe("");
  });
  });


  test("UpdateOrPreviewDocumentDialog , updateScannedDocFiles functionality" , () => {
    let open = true;
    let option = 1;
    let document_id = 1;
  const updater = jest.fn();
  const updateDocument = jest.fn();
  const postMock =  jest.spyOn(PostDataMock, "postDocumentData");
    const wrapper = mount(
        <UpdateOrPreviewDocumentDialog
        open={open}
        option={option}
        document_id={document_id}
        handler={updater}
        updateDocument={updateDocument}
      />);
      //test intialization
      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
      expect(wrapper.find(Form).at(0).props().schema).toStrictEqual({});
      expect(wrapper.find(Form).at(0).props().uiSchema).toStrictEqual({});
      expect(wrapper.find(ShowDocumentChildren).length).toBe(0); // option is 1
      expect(wrapper.find(ConfirmUpdateDialog).at(0).props().open).toBeFalsy();
      expect(wrapper.find(ScannedDocumentSelector).at(0).props().scannedDocFiles).toStrictEqual([]);
      //calling updateScannedFiles test case 1 when index == null
      let valid= true;
      let scannedFiles=["scanned 1" , "scanned 2"];
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
      expect(wrapper.find(ScannedDocumentSelector).at(0).props().scannedDocFiles).toStrictEqual(scannedFiles);
//calling updateChildrenDocuments , test case 2 when index is not null
let index2 = 1;
let result =["scanned 1" , "scanned 2"];
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
expect(wrapper.find(ScannedDocumentSelector).at(0).props().scannedDocFiles).toStrictEqual(result);
  });


});