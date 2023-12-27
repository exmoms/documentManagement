import React from "react";
import ReactDom from "react-dom";
import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import { createMount } from '@material-ui/core/test-utils';
import Dialog from "@material-ui/core/Dialog";
import { Fragment } from "react";
import ListItem from "@material-ui/core/ListItem";
import Explorer from "../../../components/User/DocumentSet/Explorer";
import SearchDocuments from "../../../components/User/SearchDocuments";
import DocumentTable from "../../../components/User/DocumentTable";
import Button from "@material-ui/core/Button";
import * as FetchMock from "../../../api/FetchData";
import ListItemText from "@material-ui/core/ListItemText";
import * as PostDataMock from "../../../api/PostData";
import List from "@material-ui/core/List";
import { BrowserRouter as Router } from "react-router-dom";
import { Redirect } from "react-router";
import { Typography } from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import { TextField } from "@material-ui/core";
import Icon from "../../../components/User/DocumentSet/Icon";
import Add from "../../../components/User/DocumentSet/Add";
import { createBrowserHistory } from "history";
import * as BrowserHistoryMock from "history";
import { FILE, FOLDER } from "../../../components/User/DocumentSet/utils/constants";
afterEach(cleanup);

describe("Explorer", () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    test("renders without crashing", () => {
        const div = document.createElement("div");
        ReactDom.render(<Explorer />, div);
      });

    test("Explorer matches snapshot", () => {
    const renderedValue = createMount()(
        <Explorer />
      );
      expect(renderedValue.html()).toMatchSnapshot();
    });
  //   test("refreshDocumentSet functionality when set.id =0",  () =>{
  //     const mockSuccessResponseMetaDataModel = [
  //         {id:1, addedDate:"addedDate", modifiedDate:"modifiedDate",name:"name",attachedDocuments:[{id:1,name:"attched 1"}],childrenDocumentSets:[{id:1,name:"children 1"}]
  //     ,documentName:"documentName" , metadataModelId:2,metadataModelName:"metadataModelName",deletedDate:"deletedDate",latestVersion:2,documentVersion:1,attachments:"attachments"}
  //       ];
  //       const mockJsonPromiseMetaDataModel = Promise.resolve(
  //         mockSuccessResponseMetaDataModel
  //       ); // 2
  //       const fetchingMetaDataModel = jest
  //         .spyOn(FetchMock, "fetchData")
  //         .mockImplementation(() => mockJsonPromiseMetaDataModel);
  //         let  wrapper;
  //         return mockJsonPromiseMetaDataModel.then(() => {
  //       wrapper = mount(
  //             <Explorer/>
  //           );
  //         }).then(() => {
  //             wrapper.update();
  //             wrapper.render();
  //             expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
  //             expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/DocumentSet/GetRoots');
  //             expect(wrapper.find(Icon).length).toBe(1);
  //             expect(wrapper.find(Icon).at(0).props().type).toBe(FOLDER);
  //             expect(wrapper.find(Add).length).toBe(1);
  //             expect(wrapper.find(Add).at(0).props().set).toStrictEqual({"id": 0, "name": "Home"});
  //              expect(wrapper.find("#notification").length).toBe(1);
  //             expect(wrapper.find("#notification").at(0).props().open).toBeFalsy(); 
  //             expect(wrapper.find("#notification").at(0).props().error).toBeFalsy(); 
  //             expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]); 
  //         act(() => {
  //           wrapper
  //             .find(Icon)
  //             .at(0)
  //             .props()
  //             .refreshSet({id:0});
  //         });
  //         wrapper.update();
  //         wrapper.render();
  //         expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
  //         expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentSet/GetRoots');
  //         expect(wrapper.find(Icon).length).toBe(1);
  //         expect(wrapper.find(Icon).at(0).props().type).toBe(FOLDER);
  //         expect(wrapper.find(Icon).at(0).props().set).toStrictEqual({ id: 0, name: "Home" });
  //         expect(wrapper.find("#notification").at(0).props().open).toBeFalsy(); 
  //         expect(wrapper.find("#notification").at(0).props().error).toBeFalsy(); 
  //         expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual( []); 
  //         expect(wrapper.find("#goToUpperLevelId").length).toBe(1); 
  //       });
  // })
  

//   test("refreshDocumentSet functionality when set.id=1",  () =>{
//     const mockSuccessResponseMetaDataModel = [
//       {id:1, addedDate:"addedDate", modifiedDate:"modifiedDate",name:"name",attachedDocuments:[{id:1,name:"attched 1"}],childrenDocumentSets:[{id:1,name:"children 1"}]
//   ,documentName:"documentName" , metadataModelId:2,metadataModelName:"metadataModelName",deletedDate:"deletedDate",latestVersion:2,documentVersion:1,attachments:"attachments"}
//     ];
//     const mockJsonPromiseMetaDataModel = Promise.resolve(
//       mockSuccessResponseMetaDataModel
//     ); // 2
//     const mockSuccessResponseMetaDataModel2 = {attachedDocuments:[{id:1,name:"attched 1"}],childrenDocumentSets:[{id:1,name:"children 1"}]};
//         const mockJsonPromiseMetaDataModel2 = Promise.resolve(
//           mockSuccessResponseMetaDataModel2
//         ); // 2
//       const fetchingMetaDataModel = jest
//         .spyOn(FetchMock, "fetchData")
//         .mockReturnValueOnce(mockJsonPromiseMetaDataModel).mockReturnValueOnce(mockJsonPromiseMetaDataModel2);
//         let  wrapper;
//         return mockJsonPromiseMetaDataModel.then(() => {
//       wrapper = mount(
//             <Explorer/>
//           );
//         }).then(() => {
//             wrapper.update();
//             wrapper.render();
//             expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
//             expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/DocumentSet/GetRoots');
//             expect(wrapper.find(Icon).length).toBe(1);
//             expect(wrapper.find(Icon).at(0).props().type).toBe(FOLDER);
//             expect(wrapper.find(Add).length).toBe(1);
//             expect(wrapper.find(Add).at(0).props().set).toStrictEqual({"id": 0, "name": "Home"});
//              expect(wrapper.find("#notification").length).toBe(1);
//             expect(wrapper.find("#notification").at(0).props().open).toBeFalsy(); 
//             expect(wrapper.find("#notification").at(0).props().error).toBeFalsy(); 
//             expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]); 
//             return mockJsonPromiseMetaDataModel2.then(() => {
//         act(() => {
//           wrapper
//             .find(Icon)
//             .at(0)
//             .props()
//             .refreshSet({id:1});
//         });
//       }).then(() => {
//         wrapper.update();
//         wrapper.render();
//         expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
//         expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentSet/GetDocumentSetByID?document_set_id=1');
//         expect(wrapper.find(Icon).length).toBe(2);
//         expect(wrapper.find(Icon).at(0).props().type).toBe(FOLDER);
//         expect(wrapper.find("#notification").at(0).props().open).toBeTruthy(); 
//         expect(wrapper.find("#notification").at(0).props().error).toBeFalsy(); 
//         expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual( []); 
//         expect(wrapper.find("#goToUpperLevelId").length).toBe(1); 
//       });
//     });
// })


  //   test("componentDidUpdate functionality when (state.id !== 0) + refreshDocumentSet when set.id = 1",  () =>{
  //     jest.clearAllMocks();
  //     const mockSuccessResponseMetaDataModel1 = [
  //         {id:1, addedDate:"addedDate", modifiedDate:"modifiedDate",name:"name",attachedDocuments:[{id:1,name:"attched 1"}],childrenDocumentSets:[{id:1,name:"children 1"}]
  //     ,documentName:"documentName" , metadataModelId:2,metadataModelName:"metadataModelName",deletedDate:"deletedDate",latestVersion:2,documentVersion:1,attachments:"attachments"}
  //       ];
  //       const mockSuccessResponseMetaDataModel2 = {attachedDocuments:[{id:1,name:"attched 1"}],childrenDocumentSets:[{id:1,name:"children 1"}]};
  //       const mockJsonPromiseMetaDataModel1 = Promise.resolve(
  //         mockSuccessResponseMetaDataModel1
  //       ); // 2
  //       const mockJsonPromiseMetaDataModel2 = Promise.resolve(
  //         mockSuccessResponseMetaDataModel2
  //       ); // 2
  //       let replaceMock = jest.fn();
  //       let createBrowserHistoryReturnedValue={location:{state:{id:1 , name :"Name A" , openNotifiction:true, error:true,errorMessage:["errorMessage"]}} , replace:()=>{ replaceMock }};
  //          const createBrowserHistoryMock=  jest.spyOn(BrowserHistoryMock, "createBrowserHistory").mockReturnValueOnce(createBrowserHistoryReturnedValue).mockReturnValueOnce(createBrowserHistoryReturnedValue).mockReturnValueOnce(createBrowserHistoryReturnedValue);
  //       const fetchingMetaDataModel = jest
  //         .spyOn(FetchMock, "fetchData")
  //         .mockReturnValueOnce(mockJsonPromiseMetaDataModel1).mockReturnValueOnce(mockJsonPromiseMetaDataModel2).mockReturnValueOnce(mockJsonPromiseMetaDataModel2).mockReturnValueOnce(mockJsonPromiseMetaDataModel2);
  //         let  wrapper;
  //         return mockJsonPromiseMetaDataModel1.then(() => {
  //       wrapper = mount(
  //             <Explorer/>
  //           );
  //         }).then(() => {
  //           return mockJsonPromiseMetaDataModel2.then(() => {
  //             wrapper.update();
  //           }).then(() => {
  //             wrapper.update();
  //             wrapper.render();
  //              expect(createBrowserHistoryMock).toHaveBeenCalledTimes(3);
  //             expect(fetchingMetaDataModel).toHaveBeenCalledTimes(4);
  //             // expect(replaceMock).toHaveBeenCalledTimes(1);
  //             expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/DocumentSet/GetRoots');
  //             expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentSet/GetDocumentSetByID?document_set_id=1');
  //             expect(wrapper.find(Icon).length).toBe(2);
  //             expect(wrapper.find(Icon).at(0).props().type).toBe(FOLDER);
  //             expect(wrapper.find(Icon).at(0).props().set).toStrictEqual({"id": 1, "name": "Name A"});
  //             expect(wrapper.find(Icon).at(1).props().type).toBe(FILE);
  //             expect(wrapper.find(Icon).at(1).props().set).toStrictEqual({"id": 1, "name": "Name A"});
  //             expect(wrapper.find("#notification").at(0).props().open).toBeTruthy(); 
  //             expect(wrapper.find("#notification").at(0).props().error).toBeTruthy(); 
  //             expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual(["errorMessage"]); 
  //             expect(wrapper.find("#notification").length).toBe(1);
  //         });
  //       });
  // })
    // test("componentDidUpdate functionality when (state.id === 0)",  () =>{
    //     const mockSuccessResponseMetaDataModel = [
    //         {id:1, addedDate:"addedDate", modifiedDate:"modifiedDate",name:"name",attachedDocuments:[{id:1,name:"attched 1"}],childrenDocumentSets:[{id:1,name:"children 1"}]
    //     ,documentName:"documentName" , metadataModelId:2,metadataModelName:"metadataModelName",deletedDate:"deletedDate",latestVersion:2,documentVersion:1,attachments:"attachments"}
    //       ];
    //       const mockJsonPromiseMetaDataModel = Promise.resolve(
    //         mockSuccessResponseMetaDataModel
    //       ); // 2
    //       let replaceMock = jest.fn();
    //       let createBrowserHistoryReturnedValue={location:{state:{id:0 , name :"Name A" , openNotifiction:false, error:false,errorMessage:[]}} , replace:({state})=>{ replaceMock({state}) }};
    //          const createBrowserHistoryMock=  jest.spyOn(BrowserHistoryMock, "createBrowserHistory").mockReturnValueOnce(createBrowserHistoryReturnedValue);
    //       const fetchingMetaDataModel = jest
    //         .spyOn(FetchMock, "fetchData")
    //         .mockImplementation(() => mockJsonPromiseMetaDataModel);
    //         let  wrapper;
    //         return mockJsonPromiseMetaDataModel.then(() => {
    //       wrapper = mount(
    //             <Explorer/>
    //           );
    //         }).then(() => {
    //             wrapper.update();
    //             wrapper.render();
    //             expect(createBrowserHistoryMock).toHaveBeenCalledTimes(1);
    //             expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
    //             // expect(replaceMock).toHaveBeenCalledTimes(1);
    //             expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/DocumentSet/GetRoots');
    //             expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentSet/GetRoots');
    //             expect(wrapper.find(Icon).length).toBe(1);
    //             expect(wrapper.find(Icon).at(0).props().type).toBe(FOLDER);
    //             expect(wrapper.find(Add).length).toBe(1);
    //             expect(wrapper.find(Add).at(0).props().set).toStrictEqual({"id": 0, "name": "Home"});
    //              expect(wrapper.find("#notification").length).toBe(1);
    //             expect(wrapper.find("#notification").at(0).props().open).toBeFalsy(); 
    //             expect(wrapper.find("#notification").at(0).props().error).toBeFalsy(); 
    //             expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]); 
 
    //         });
    // })
   

    // test("showMore functionality + goToUpperLevel + setOpenNotification",  () =>{
    //     const mockSuccessResponseMetaDataModel1 = [
    //         {id:1, addedDate:"addedDate", modifiedDate:"modifiedDate",name:"name",attachedDocuments:[{id:1,name:"attched 1"}],childrenDocumentSets:[{id:1,name:"children 1"}]
    //     ,documentName:"documentName" , metadataModelId:2,metadataModelName:"metadataModelName",deletedDate:"deletedDate",latestVersion:2,documentVersion:1,attachments:"attachments"}
    //       ];
    //       const mockSuccessResponseMetaDataModel2 = {attachedDocuments:[],childrenDocumentSets:[{id:1,name:"children 1"}]};
    //       const mockJsonPromiseMetaDataModel1 = Promise.resolve(
    //         mockSuccessResponseMetaDataModel1
    //       ); // 2
    //       const mockJsonPromiseMetaDataModel2 = Promise.resolve(
    //         mockSuccessResponseMetaDataModel2
    //       ); // 2
    //       const fetchingMetaDataModel = jest
    //         .spyOn(FetchMock, "fetchData")
    //         .mockReturnValueOnce(mockJsonPromiseMetaDataModel1).mockReturnValueOnce(mockJsonPromiseMetaDataModel2);
    //         let  wrapper;
    //         return mockJsonPromiseMetaDataModel1.then(() => {
    //       wrapper = mount(
    //             <Explorer/>
    //           );
    //         }).then(() => {
    //             wrapper.update();
    //             wrapper.render();
    //             expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
    //             // expect(replaceMock).toHaveBeenCalledTimes(1);
    //             expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/DocumentSet/GetRoots');
    //             expect(wrapper.find(Icon).length).toBe(1);
    //             expect(wrapper.find(Icon).at(0).props().type).toBe(FOLDER);
    //          //calling showMore
    //          return mockJsonPromiseMetaDataModel2.then(() => {
    //          act(() => {
    //             wrapper
    //               .find(Icon)
    //               .at(0)
    //               .props()
    //               .enterFolder(1,"tested Value");
    //           });
    //         }).then(() => {
    //         wrapper.update();
    //         wrapper.render();
    //         expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
    //         expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentSet/GetDocumentSetByID?document_set_id=1');
    //         expect(wrapper.find(Icon).length).toBe(1);
    //         expect(wrapper.find(Icon).at(0).props().type).toBe(FOLDER);
    //         expect(wrapper.find(Icon).at(0).props().set).toStrictEqual({"id": 1, "name": "tested Value"});
    //         expect(wrapper.find("#notification").at(0).props().open).toBeFalsy(); 
    //         expect(wrapper.find("#notification").at(0).props().error).toBeFalsy(); 
    //         expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]); 
    //         expect(wrapper.find("#goToUpperLevelId").length).toBe(2);
    //         act(() => {
    //           wrapper
    //             .find("#goToUpperLevelId")
    //             .at(0)
    //             .props()
    //             .onClick();
    //         });
    //         wrapper.update();
    //         wrapper.render();
    //         expect(fetchingMetaDataModel).toHaveBeenCalledTimes(3);
    //         expect(fetchingMetaDataModel.mock.calls[2][0]).toBe('/api/DocumentSet/GetRoots');
    //         expect(wrapper.find(Icon).length).toBe(1);
    //         expect(wrapper.find(Icon).at(0).props().type).toBe(FOLDER);
    //         expect(wrapper.find(Icon).at(0).props().set).toStrictEqual({"id": 1, "name": "tested Value"});
    //         expect(wrapper.find("#notification").at(0).props().open).toBeFalsy(); 
    //         expect(wrapper.find("#notification").at(0).props().error).toBeFalsy(); 
    //         expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]); 
    //         expect(wrapper.find("#goToUpperLevelId").length).toBe(2); 

    //         act(() => {
    //           wrapper
    //             .find("#notification")
    //             .at(0)
    //             .props()
    //             .setOpen(true);
    //         });
    //         wrapper.update();
    //         wrapper.render();
    //         expect(wrapper.find("#notification").at(0).props().open).toBeTruthy(); 

    //         act(() => {
    //           wrapper
    //             .find(Icon)
    //             .at(0)
    //             .props()
    //             .showNotification(false , true , ["erroMessage"]);
    //         });
    //         wrapper.update();
    //         wrapper.render();
    //         expect(wrapper.find("#notification").at(0).props().open).toBeFalsy(); 
    //         expect(wrapper.find("#notification").at(0).props().error).toBeTruthy(); 
    //         expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual(["erroMessage"]); 

          
            
    //       });
    //       });     
          
    // })
    
  //   test("showMore functionality + goToUpperLevel when index >= 1",  () =>{
  //     const mockSuccessResponseMetaDataModel1 = [
  //         {id:1, addedDate:"addedDate", modifiedDate:"modifiedDate",name:"name",attachedDocuments:[{id:1,name:"attched 1"}],childrenDocumentSets:[{id:1,name:"children 1"}]
  //     ,documentName:"documentName" , metadataModelId:2,metadataModelName:"metadataModelName",deletedDate:"deletedDate",latestVersion:2,documentVersion:1,attachments:"attachments"}
  //       ];
  //       const mockSuccessResponseMetaDataModel2 = {attachedDocuments:[],childrenDocumentSets:[{id:1,name:"children 1"}]};
  //       const mockJsonPromiseMetaDataModel1 = Promise.resolve(
  //         mockSuccessResponseMetaDataModel1
  //       ); // 2
  //       const mockJsonPromiseMetaDataModel2 = Promise.resolve(
  //         mockSuccessResponseMetaDataModel2
  //       ); // 2
  //       const fetchingMetaDataModel = jest
  //         .spyOn(FetchMock, "fetchData")
  //         .mockReturnValueOnce(mockJsonPromiseMetaDataModel1).mockReturnValueOnce(mockJsonPromiseMetaDataModel2).mockReturnValueOnce(mockJsonPromiseMetaDataModel2).mockReturnValueOnce(mockJsonPromiseMetaDataModel2).mockReturnValueOnce(mockJsonPromiseMetaDataModel2);
  //         let  wrapper;
  //         return mockJsonPromiseMetaDataModel1.then(() => {
  //       wrapper = mount(
  //             <Explorer/>
  //           );
  //         }).then(() => {
  //             wrapper.update();
  //             wrapper.render();
  //             expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
  //             // expect(replaceMock).toHaveBeenCalledTimes(1);
  //             expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/DocumentSet/GetRoots');
  //             expect(wrapper.find(Icon).length).toBe(1);
  //             expect(wrapper.find(Icon).at(0).props().type).toBe(FOLDER);
  //          //calling showMore
  //          return mockJsonPromiseMetaDataModel2.then(() => {
  //          act(() => {
  //             wrapper
  //               .find(Icon)
  //               .at(0)
  //               .props()
  //               .enterFolder(1,"tested Value1");
  //           });
  //           wrapper.update();
  //           act(() => {
  //             wrapper
  //               .find(Icon)
  //               .at(0)
  //               .props()
  //               .enterFolder(2,"tested Value2");
  //           });
  //         }).then(() => {
  //         wrapper.update();
  //         wrapper.render();
  //         expect(fetchingMetaDataModel).toHaveBeenCalledTimes(3);
  //         expect(fetchingMetaDataModel.mock.calls[2][0]).toBe('/api/DocumentSet/GetDocumentSetByID?document_set_id=2');
  //         expect(wrapper.find(Icon).length).toBe(1);
  //         expect(wrapper.find(Icon).at(0).props().type).toBe(FOLDER);
  //         expect(wrapper.find(Icon).at(0).props().set).toStrictEqual({"id": 2, "name": "tested Value2"});
  //         expect(wrapper.find("#notification").at(0).props().open).toBeFalsy(); 
  //         expect(wrapper.find("#notification").at(0).props().error).toBeFalsy(); 
  //         expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]); 
  //         expect(wrapper.find("#goToUpperLevelId").length).toBe(3);
  //         act(() => {
  //           wrapper
  //             .find("#goToUpperLevelId")
  //             .at(1)
  //             .props()
  //             .onClick();
  //         });
  //         wrapper.update();
  //         wrapper.render();
  //         expect(fetchingMetaDataModel).toHaveBeenCalledTimes(4);
  //         expect(fetchingMetaDataModel.mock.calls[3][0]).toBe('/api/DocumentSet/GetDocumentSetByID?document_set_id=1');
  //         expect(wrapper.find(Icon).length).toBe(1);
  //         expect(wrapper.find(Icon).at(0).props().type).toBe(FOLDER);
  //         expect(wrapper.find(Icon).at(0).props().set).toStrictEqual({"id": 2, "name": "tested Value2"});
  //         expect(wrapper.find("#notification").at(0).props().open).toBeFalsy(); 
  //         expect(wrapper.find("#notification").at(0).props().error).toBeFalsy(); 
  //         expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]); 
  //         expect(wrapper.find("#goToUpperLevelId").length).toBe(3);   
      
  //       });     
  //     });      
  // })
});