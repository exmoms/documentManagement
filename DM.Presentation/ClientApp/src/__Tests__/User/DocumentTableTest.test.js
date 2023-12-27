
import React from "react";
import ReactDom from "react-dom";
import DocumentTable from "../../components/User/DocumentTable";
import { cleanup, fireEvent } from "@testing-library/react";
import renderer from "react-test-renderer";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { createMount } from '@material-ui/core/test-utils';
import Dialog from "@material-ui/core/Dialog";
import CardMedia from "@material-ui/core/CardMedia";
import ReactToPrint from "react-to-print";
import MaterialTable from "material-table";
import * as PostDataMock from "../../api/PostData";
import * as FetchDataMock from "../../api/FetchData";
import EmailPopUP from "../../components/User/EmailPopUp";
import PrintDocument from "../../components/User/PrintDocument";
import DocumentHistory from "../../components/User/DocumentHistory";
import UpdateOrPreviewDocumentDialog from "../../components/User/UpdateOrPreviewDocumentDialog";
import DownloadDocument from "../../components/User/DownloadDocument";
import DocumentAttachments from "../../components/User/DocumentAttachments";
import { BrowserRouter as Router } from "react-router-dom";
import { Redirect } from "react-router";
import ConfirmOperationDialog from "../../components/User/ConfirmOperationDialog";
afterEach(cleanup);
describe("DocumentTable", () => {
    beforeEach(()=>{
        jest.spyOn(FetchDataMock, "fetchData").mockImplementation(() => Promise.resolve([]) )
    })
    afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
      let data =[{id: 1} , {id: 2}];
      let set = {id : 1 , name: " set1"};
      let action = "browse-document";
      const handleSelect = jest.fn();
      const handleClose = jest.fn();
    const div = document.createElement("div");
    ReactDom.render(
      <DocumentTable
      data={data}
      set={set}
      action={action}
      handleSelect={handleSelect}
      handleClose={handleClose}
      />,
      div
    );
  });
  test("DocumentTable matches snapshot", () => {
    let data =[{id: 1} , {id: 2}];
    let set = {id : 1 , name: " set1"};
    let action = "browse-document";
    const handleSelect = jest.fn();
    const handleClose = jest.fn();
    const renderedValue = createMount()(
        <DocumentTable
        data={data}
      set={set}
      action={action}
      handleSelect={handleSelect}
      handleClose={handleClose}
        />
      );
      expect(renderedValue.html()).toMatchSnapshot();
  });

  test("ViewDocumentAction functionality", () => {
    let data =[{id: 1} , {id: 2}];
    let set = {id : 1 , name: " set1"};
    let action = "show-history";
    const handleSelect = jest.fn();
    const handleClose = jest.fn();
    const wrapper = mount(
        <DocumentTable
        data={data}
      set={set}
      action={action}
      handleSelect={handleSelect}
      handleClose={handleClose}
        />
      );

       act(() => {
        wrapper
          .find(MaterialTable)
          .props()
          .actions[0].onClick({ target: { value: "" } }, { latestVersion: 2});
      });
      wrapper.update();
      wrapper.render();
       //UpdateOrPreviewDocumentDialobog
       expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().open).toBeTruthy();
       expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().option).toBe(0);
       expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().documentVersionId).toBe(2);
  });
  
  test("UpdateDocumentAction functionality", () => {
    let data =[{id: 1} , {id: 2}];
    let set = {id : 1 , name: " set1"};
    let action = "show-history";
    const handleSelect = jest.fn();
    const handleClose = jest.fn();
    const wrapper = mount(
        <DocumentTable
        data={data}
      set={set}
      action={action}
      handleSelect={handleSelect}
      handleClose={handleClose}
        />
      );

       act(() => {
        wrapper
          .find(MaterialTable)
          .props()
          .actions[1].onClick({ target: { value: "" } }, { latestVersion: 2});
      });
      wrapper.update();
      wrapper.render();
       //UpdateOrPreviewDocumentDialobog
       expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().open).toBeTruthy();
       expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().option).toBe(1);
       expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().documentVersionId).toBe(2);
  });
 

  test("DeleteDocumentAction", () => {
      const mockJsonPromiseMetaDataModel ={ok:true}; // 2
      const fetchingMetaDataModel = jest
        .spyOn(PostDataMock, "postDataToAPI")
        .mockImplementation(() => mockJsonPromiseMetaDataModel);
        let wrapper;
        let data =[{documentId: 1} , {documentId: 2}];
        let set = {id : 1 , name: " set1"};
        let action = "browse-document";
        const handleSelect = jest.fn();
        const handleClose = jest.fn();
     wrapper = mount(
        <DocumentTable
        data={data}
      set={set}
      action={action}
      handleSelect={handleSelect}
      handleClose={handleClose}
        />
      );

       act(() => {
        wrapper
          .find(MaterialTable)
          .props()
          .actions[2].onClick({ target: { value: "" } }, {documentId: 2});
      });

        wrapper.render();
        wrapper.update();
       //expectations
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(0);
      expect(wrapper.find(ConfirmOperationDialog).props().open).toBeTruthy(); 
      expect(wrapper.find(ConfirmOperationDialog).props().content).toStrictEqual({"buttonText": "delete", "contentText": "dialog_doucmentTable_confirmDeleteDocument", "title": "dialog_deleteConfirmation"}); 
      expect(wrapper.find("#notification").props().open).toBeFalsy(); 
      expect(wrapper.find("#notification").props().error).toBeFalsy(); 
      expect(wrapper.find("#notification").props().errorMessage).toStrictEqual([]); 
 });


 test("ArchiveDocumentAction", () => {
      const mockJsonPromiseMetaDataModel = {ok:true}; // 2
      const fetchingMetaDataModel = jest
        .spyOn(PostDataMock, "postDataToAPI")
        .mockImplementation(() => mockJsonPromiseMetaDataModel);
        let wrapper;
        let data =[{documentId: 1} , {documentId: 2}];
        let set = {id : 1 , name: " set1"};
        let action = "browse-document";
        const handleSelect = jest.fn();
        const handleClose = jest.fn();
     wrapper = mount(
        <DocumentTable
        data={data}
      set={set}
      action={action}
      handleSelect={handleSelect}
      handleClose={handleClose}
        />
      );

       act(() => {
        wrapper
          .find(MaterialTable)
          .props()
          .actions[3].onClick({ target: { value: "" } }, {documentId: 2});
      });

        wrapper.render();
        wrapper.update();
       //expectations
       expect(fetchingMetaDataModel).toHaveBeenCalledTimes(0);
       expect(wrapper.find(ConfirmOperationDialog).props().open).toBeTruthy(); 
       expect(wrapper.find(ConfirmOperationDialog).props().content).toStrictEqual({"buttonText": "archive_document", "contentText": "dialog_doucmentTable_confirmArchiveDocument", "title": "dialog_archiveConfirmation", "type": "archive"}); 
      expect(wrapper.find("#notification").props().open).toBeFalsy(); 
      expect(wrapper.find("#notification").props().error).toBeFalsy(); 
      expect(wrapper.find("#notification").props().errorMessage).toStrictEqual([]); 
 });

  test("EmailDocumentsAction and toggleShow functionality", () => {
    let data =[{id: 1} , {id: 2}];
    let set = {id : 1 , name: " set1"};
    let action = "browse-document";
    const handleSelect = jest.fn();
    const handleClose = jest.fn();
    let rowData1 = ["data"];
    let rowData2 = 'data';
            const wrapper = mount(
                <DocumentTable
                data={data}
              set={set}
              action={action}
              handleSelect={handleSelect}
              handleClose={handleClose}
                />
              );
    
       act(() => {
        wrapper
          .find(MaterialTable)
          .props()
          .actions[4].onClick({ target: { value: "" } }, rowData1);
      });
           wrapper.render();
           wrapper.update();
       //EmailPopUP
       expect(wrapper.find(EmailPopUP).length).toBe(1);
       expect(wrapper.find(EmailPopUP).at(0).props().show).toBeTruthy();
       expect(wrapper.find(EmailPopUP).at(0).props().dataToSend).toBe(rowData1);
       act(() => {
        wrapper
          .find(MaterialTable)
          .props()
          .actions[4].onClick({ target: { value: "" } }, rowData2);
      });
           wrapper.render();
           wrapper.update();
           expect(wrapper.find(EmailPopUP).length).toBe(1);
           expect(wrapper.find(EmailPopUP).at(0).props().show).toBeTruthy();
           expect(wrapper.find(EmailPopUP).at(0).props().dataToSend).toStrictEqual([rowData2]);
      //toggleShow
           act(() => {
            wrapper
              .find(EmailPopUP)
              .props().toggleShow(false);
          });
               wrapper.render();
               wrapper.update();
               expect(wrapper.find(EmailPopUP).length).toBe(0);
      
  });

  test("EmailDocumentAction functionality", () => {
    let data =[{id: 1} , {id: 2}];
    let set = {id : 1 , name: " set1"};
    let action = "browse-document";
    const handleSelect = jest.fn();
    const handleClose = jest.fn();
    let rowData1 = ["data"];
    let rowData2 = 'data';
            const wrapper = mount(
                <DocumentTable
                data={data}
              set={set}
              action={action}
              handleSelect={handleSelect}
              handleClose={handleClose}
                />
              );
    
       act(() => {
        wrapper
          .find(MaterialTable)
          .props()
          .actions[5].onClick({ target: { value: "" } }, rowData1);
      });
           wrapper.render();
           wrapper.update();
       //EmailPopUP
       expect(wrapper.find(EmailPopUP).length).toBe(1);
       expect(wrapper.find(EmailPopUP).at(0).props().show).toBeTruthy();
       expect(wrapper.find(EmailPopUP).at(0).props().dataToSend).toBe(rowData1);
       act(() => {
        wrapper
          .find(MaterialTable)
          .props()
          .actions[5].onClick({ target: { value: "" } }, rowData2);
      });
           wrapper.render();
           wrapper.update();
           expect(wrapper.find(EmailPopUP).length).toBe(1);
           expect(wrapper.find(EmailPopUP).at(0).props().show).toBeTruthy();
           expect(wrapper.find(EmailPopUP).at(0).props().dataToSend).toStrictEqual([rowData2]);
      
  });


  // test("PrintDocumentsAction functionality when response == 200 ", (done) =>  {
  //   let data =[{id: 1} , {id: 2}];
  //   let set = {id : 1 , name: " set1"};
  //   let action = "browse-document";
  //   const handleSelect = jest.fn();
  //   const handleClose = jest.fn();
  //   let rowData1 = [{latestVersion: 1} , {latestVersion: 2}]
  //   // const mockSuccessResponse = {ok:true , json:()=>{ return [{imgs:["url 1" , "url 2"]}]}};
  //   // const mockSuccessResponseMetaDataModel = Promise.resolve(
  //   //   mockSuccessResponse
  //   // ); 
  //   let mockSuccessErrorPromise = [{imgs:["url 1" , "url 2"]}];
  //   let mockSuccessError = Promise.resolve(mockSuccessErrorPromise);
  //   const mockSuccessResponsePost = Promise.resolve(Promise.resolve({
  //     ok: true,
  //     json: () => mockSuccessError,
  //   }));
  //   const PostData = jest
  //       .spyOn(PostDataMock, "postDataToAPI")
  //       .mockReturnValue(mockSuccessResponsePost);
  //       let wrapper;
  //            wrapper = mount(
  //               <DocumentTable
  //               data={data}
  //             set={set}
  //             action={action}
  //             handleSelect={handleSelect}
  //             handleClose={handleClose}
  //               />
  //             );
  //             return mockSuccessResponsePost.then(() => {
  //         wrapper
  //         .find(MaterialTable)
  //         .props()
  //         .actions[6].onClick({ target: { value: "" } }, rowData1);
  //       }).then(() => {
  //         wrapper.render();
  //         wrapper.update();
  //      //expectations
  //      expect(PostData).toHaveBeenCalledTimes(1);
  //     expect(PostData.mock.calls[0][0]).toBe("api/Document/GetDocumentScansByVersionIds");
  //     expect(PostData.mock.calls[0][1]).toStrictEqual([1 , 2]);
  //      //PrintDocument
  //      expect(wrapper.find(PrintDocument).at(0).props().open).toBeTruthy();
  //      expect(wrapper.find(PrintDocument).at(0).props().scannedDoc).toStrictEqual(["url 1" , "url 2"]);
  //      expect(wrapper.find("#notification").props().open).toBeFalsy(); 
  //     expect(wrapper.find("#notification").props().error).toBeFalsy(); 
  //     expect(wrapper.find("#notification").props().errorMessage).toStrictEqual([]); 
  //      act( () => {
  //       wrapper
  //       .find(PrintDocument)
  //       .props().handleClose();
  //   });
  //        wrapper.render();
  //        wrapper.update();
  //        expect(wrapper.find(PrintDocument).length).toBe(0);
  //     });
  //   });
      // test("PrintDocumentsAction functionality when response !== 200 ",async() => {
      //   let data =[{id: 1} , {id: 2}];
      //   let set = {id : 1 , name: " set1"};
      //   let action = "browse-document";
      //   const handleSelect = jest.fn();
      //   const handleClose = jest.fn();
      //   let rowData1 = [{latestVersion: 1} , {latestVersion: 2}]
      //   let mockSuccessErrorPromise = { error: ["errorMessage"] };
      //   let mockSuccessError = Promise.resolve(mockSuccessErrorPromise);
      //   const mockSuccessResponsePost = Promise.resolve({
      //     ok: false,
      //     json: () => mockSuccessError,
      //   });
      //   const PostData = jest
      //       .spyOn(PostDataMock, "postDataToAPI")
      //       .mockImplementation(() => mockSuccessResponsePost);
      //       let wrapper;
      //            wrapper = mount(
      //               <DocumentTable
      //               data={data}
      //             set={set}
      //             action={action}
      //             handleSelect={handleSelect}
      //             handleClose={handleClose}
      //               />
      //             );
      //               await  wrapper
      //               .find(MaterialTable)
      //               .props()
      //               .actions[6].onClick({ target: { value: "" } }, rowData1);
            
      //         wrapper.render();
      //         wrapper.update();
      //      //expectations
      //      expect(PostData).toHaveBeenCalledTimes(1);
      //     expect(PostData.mock.calls[0][0]).toBe("api/Document/GetDocumentScansByVersionIds");
      //     expect(PostData.mock.calls[0][1]).toStrictEqual([1 , 2]);
      //     expect(wrapper.find(PrintDocument).length).toBe(0);
      //     expect(wrapper.find("#notification").props().open).toBeTruthy(); 
      //     expect(wrapper.find("#notification").props().error).toBeTruthy(); 
      //     expect(wrapper.find("#notification").props().errorMessage).toStrictEqual([]); 
      //   //   process.nextTick(() => {
      //   //     try {
      //   //        //PrintDocument
      //   //   expect(wrapper.find(PrintDocument).length).toBe(0);
      //   //   expect(wrapper.find("#notification").props().open).toBeTruthy(); 
      //   //   expect(wrapper.find("#notification").props().error).toBeTruthy(); 
      //   //   expect(wrapper.find("#notification").props().errorMessage).toStrictEqual([]); 
      //   //     } catch (e) {
      //   //         return done(e);
      //   //     }
      //   //     done();
      //   // });
      //   });
        // test("PrintDocumentsAction functionality when response == 200 ", () => {
        //   let data =[{id: 1} , {id: 2}];
        //   let set = {id : 1 , name: " set1"};
        //   let action = "browse-document";
        //   const handleSelect = jest.fn();
        //   const handleClose = jest.fn();
        //   let rowData1 = [{latestVersion: 1} , {latestVersion: 2}]
        //   const mockSuccessResponse = {ok:true , json:()=>{ return [{imgs:["url 1" , "url 2"]}]}};
        //   const mockSuccessResponseMetaDataModel = Promise.resolve(
        //     mockSuccessResponse
        //   ); 
        //   const PostData = jest
        //       .spyOn(PostDataMock, "postDataToAPI")
        //       .mockImplementation(() => mockSuccessResponseMetaDataModel);
        //       let wrapper;
        //            wrapper = mount(
        //               <DocumentTable
        //               data={data}
        //             set={set}
        //             action={action}
        //             handleSelect={handleSelect}
        //             handleClose={handleClose}
        //               />
        //             );
        //             return mockSuccessResponseMetaDataModel.then(() => {
        //         wrapper
        //         .find(MaterialTable)
        //         .props()
        //         .actions[7].onClick({ target: { value: "" } }, rowData1);
        //       }).then(() => {
        //         wrapper.render();
        //         wrapper.update();
        //      //expectations
        //      expect(PostData).toHaveBeenCalledTimes(1);
        //     expect(PostData.mock.calls[0][0]).toBe("api/Document/GetDocumentScansByVersionIds");
        //     expect(PostData.mock.calls[0][1]).toStrictEqual([1 , 2]);
        //      //PrintDocument
        //      expect(wrapper.find(PrintDocument).at(0).props().open).toBeTruthy();
        //      expect(wrapper.find(PrintDocument).at(0).props().scannedDoc).toStrictEqual(["url 1" , "url 2"]);
        //      expect(wrapper.find("#notification").props().open).toBeFalsy(); 
        //     expect(wrapper.find("#notification").props().error).toBeFalsy(); 
        //     expect(wrapper.find("#notification").props().errorMessage).toStrictEqual([]); 
        //      act( () => {
        //       wrapper
        //       .find(PrintDocument)
        //       .props().handleClose();
        //   });
        //        wrapper.render();
        //        wrapper.update();
        //        expect(wrapper.find(PrintDocument).length).toBe(0);
        //     });
        //   });
            // test("PrintDocumentsAction functionality when response !== 200 ", () => {
            //   let data =[{id: 1} , {id: 2}];
            //   let set = {id : 1 , name: " set1"};
            //   let action = "browse-document";
            //   const handleSelect = jest.fn();
            //   const handleClose = jest.fn();
            //   let rowData1 = [{latestVersion: 1} , {latestVersion: 2}]
            //   const mockSuccessResponse = {ok:false , json:()=>{ return {error:["errorMessage"]}}};
            //   const mockSuccessResponseMetaDataModel = Promise.resolve(
            //     mockSuccessResponse
            //   ); 
            //   const PostData = jest
            //       .spyOn(PostDataMock, "postDataToAPI")
            //       .mockImplementation(() => mockSuccessResponseMetaDataModel);
            //       let wrapper;
            //            wrapper = mount(
            //               <DocumentTable
            //               data={data}
            //             set={set}
            //             action={action}
            //             handleSelect={handleSelect}
            //             handleClose={handleClose}
            //               />
            //             );
            //   return mockSuccessResponseMetaDataModel.then(() => {
            //         wrapper
            //         .find(MaterialTable)
            //         .props()
            //         .actions[7].onClick({ target: { value: "" } }, rowData1);
            //       }).then(() => {
            //         wrapper.render();
            //         wrapper.update();
            //      //expectations
            //      expect(PostData).toHaveBeenCalledTimes(1);
            //     expect(PostData.mock.calls[0][0]).toBe("api/Document/GetDocumentScansByVersionIds");
            //     expect(PostData.mock.calls[0][1]).toStrictEqual([1 , 2]);
            //     //PrintDocument
            //     expect(wrapper.find(PrintDocument).length).toBe(0);
            //     expect(wrapper.find("#notification").props().open).toBeTruthy(); 
            //     expect(wrapper.find("#notification").props().error).toBeTruthy(); 
            //     expect(wrapper.find("#notification").props().errorMessage).toStrictEqual([]); 
            //     });
            //   });

          test("ViewDocumentHistoryAction functionality", () => {
            let data =[{id: 1} , {id: 2}];
            let set = {id : 1 , name: " set1"};
            let action = "browse-document";
            const handleSelect = jest.fn();
            const handleClose = jest.fn();
            let rowData1 = {documentId: 1}
            const mockSuccessResponseMetaDataModel = [
                { versionId: 1 , versionMessage: "version Message " , documentId: 2 , documentName: "Document A", addedDate: '29/4/2020'}
              ];
              const mockJsonPromiseMetaDataModel = Promise.resolve(
                mockSuccessResponseMetaDataModel
              ); // 2
              const fetchingMetaDataModel = jest
                .spyOn(FetchDataMock, "fetchData")
                .mockImplementation(() => mockJsonPromiseMetaDataModel);
                let wrapper;
      return mockJsonPromiseMetaDataModel.then(() => {
        wrapper = mount(
            <DocumentTable
            data={data}
          set={set}
          action={action}
          handleSelect={handleSelect}
          handleClose={handleClose}
            />
          );
             
             act(() => {
              wrapper
                .find(MaterialTable)
                .props()
                .actions[8].onClick({ target: { value: "" } }, rowData1);
            });

      }).then(() => {
        wrapper.render();
        wrapper.update();
    //expectations
              expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
              expect(fetchingMetaDataModel.mock.calls[0][0]).toBe("/api/Document/GetDocumentHistory?docId=1");
               //DocumentHistory
               expect(wrapper.find(DocumentHistory).at(0).props().open).toBeTruthy();
               expect(wrapper.find(DocumentHistory).at(0).props().documentId).toBe(1);
   });
});

// test("DownloadDocumentAction functionality when response == 200 ", () => {
//   let data =[{id: 1} , {id: 2}];
//   let set = {id : 1 , name: " set1"};
//   let action = "browse-document";
//   const handleSelect = jest.fn();
//   const handleClose = jest.fn();
//   let rowData1 = {latestVersion: 1 , documentName:"documentName"};
//   const mockSuccessResponseMetaDataModel = {ok:true, json:()=>{ return [{imgs:[]}]}};
//   const mockJsonPromiseMetaDataModel = Promise.resolve(
//     mockSuccessResponseMetaDataModel
//   ); // 2
//     const PostData = jest
//       .spyOn(PostDataMock, "postDataToAPI")
//       .mockImplementation(() => mockJsonPromiseMetaDataModel);
//       let wrapper;
//            wrapper = mount(
//               <DocumentTable
//               data={data}
//             set={set}
//             action={action}
//             handleSelect={handleSelect}
//             handleClose={handleClose}
//               />
//             );
//             return mockJsonPromiseMetaDataModel.then(() => {
//         wrapper
//         .find(MaterialTable)
//         .props()
//         .actions[9].onClick({ target: { value: "" } }, rowData1);
//          wrapper.render();
//          wrapper.update();
//         }).then(() => {
//           wrapper.render();
//           wrapper.update();
//      //expectations
//      expect(PostData).toHaveBeenCalledTimes(1);
//     expect(PostData.mock.calls[0][0]).toBe("api/Document/GetDocumentScansByVersionIds");
//     expect(PostData.mock.calls[0][1]).toStrictEqual([1 ]);
//       //DownloadDocument
//       expect(wrapper.find(DownloadDocument).length).toBe(1);
//       expect(wrapper.find(DownloadDocument).at(0).props().open).toBeTruthy();
//       expect(wrapper.find(DownloadDocument).at(0).props().scannedDoc).toStrictEqual({ok:true, json:()=>{ return ["sccaned 1"]}});
//       expect(wrapper.find(DownloadDocument).at(0).props().documentName).toBe(undefined);
//       expect(wrapper.find("#notification").props().open).toBeFalsy(); 
//       expect(wrapper.find("#notification").props().error).toBeFalsy(); 
//       expect(wrapper.find("#notification").props().errorMessage).toStrictEqual([]);
//       act( () => {
//           wrapper
//           .find(DownloadDocument)
//           .props().handleClose();
//       });
//            wrapper.render();
//            wrapper.update();
//            expect(wrapper.find(DownloadDocument).length).toBe(0);
//     });
//   });

  // test("DownloadDocumentAction functionality when response is not ok", () => {
  //   let data =[{id: 1} , {id: 2}];
  //   let set = {id : 1 , name: " set1"};
  //   let action = "browse-document";
  //   const handleSelect = jest.fn();
  //   const handleClose = jest.fn();
  //   let rowData1 = {latestVersion: 1 , documentName:"documentName"};
  //   const mockSuccessResponseMetaDataModel = {ok:false, json:()=>{ return {error:["errorMessage"]}} };
  //   const mockJsonPromiseMetaDataModel = Promise.resolve(
  //     mockSuccessResponseMetaDataModel
  //   ); // 2
  //     const PostData = jest
  //       .spyOn(PostDataMock, "postDataToAPI")
  //       .mockImplementation(() => mockJsonPromiseMetaDataModel);
  //       let wrapper;
  //            wrapper = mount(
  //               <DocumentTable
  //               data={data}
  //             set={set}
  //             action={action}
  //             handleSelect={handleSelect}
  //             handleClose={handleClose}
  //               />
  //             );
  //             return mockJsonPromiseMetaDataModel.then(() => {
  //         wrapper
  //         .find(MaterialTable)
  //         .props()
  //         .actions[9].onClick({ target: { value: "" } }, rowData1);
  //          wrapper.render();
  //          wrapper.update();
  //         }).then(() => {
  //           wrapper.render();
  //           wrapper.update();
  //      //expectations
  //      expect(PostData).toHaveBeenCalledTimes(1);
  //     expect(PostData.mock.calls[0][0]).toBe("api/Document/GetDocumentScansByVersionIds");
  //     expect(PostData.mock.calls[0][1]).toStrictEqual([1 ]);
  //       //DownloadDocument
  //       expect(wrapper.find(DownloadDocument).length).toBe(1);
  //       expect(wrapper.find(DownloadDocument).at(0).props().open).toBeTruthy();
  //       expect(wrapper.find(DownloadDocument).at(0).props().scannedDoc).toStrictEqual({error:["errorMessage"]});
  //       expect(wrapper.find(DownloadDocument).at(0).props().documentName).toBe(undefined);
  //       expect(wrapper.find("#notification").props().open).toBeTruthy(); 
  //       expect(wrapper.find("#notification").props().error).toBeTruthy(); 
  //       expect(wrapper.find("#notification").props().errorMessage).toStrictEqual(["errorMessage"]);
  //       act( () => {
  //           wrapper
  //           .find(DownloadDocument)
  //           .props().handleClose();
  //       });
  //            wrapper.render();
  //            wrapper.update();
  //            expect(wrapper.find(DownloadDocument).length).toBe(0);
  //     });
  //   });
    test("ViewAttachmentsAction functionality", () => {
      let data =[{id: 1} , {id: 2}];
      let set = {id : 1 , name: " set1"};
      let action = "browse-document";
      const handleSelect = jest.fn();
      const handleClose = jest.fn();
      const wrapper = mount(
          <DocumentTable
          data={data}
        set={set}
        action={action}
        handleSelect={handleSelect}
        handleClose={handleClose}
          />
        );
         act(() => {
          wrapper
            .find(MaterialTable)
            .props()
            .actions[10].onClick({ target: { value: "" } }, { documentId: 2});
        });
        wrapper.update();
        wrapper.render();
        //DocumentAttachments
       expect(wrapper.find(DocumentAttachments).at(0).props().show).toBeTruthy();
       expect(wrapper.find(DocumentAttachments).at(0).props().documentId).toBe(2);
       act(() => {
        wrapper
          .find(DocumentAttachments)
          .props().handleClose();
      });
      wrapper.update();
      wrapper.render();
      expect(wrapper.find(DocumentAttachments).length).toBe(0);
    });
    
    test("SelectDocumentAction functionality", () => {
      let data =[{id: 1} , {id: 2}];
      let set = {id : 1 , name: " set1"};
      let action = "update-document";
      const handleSelect = jest.fn();
      const handleClose = jest.fn();
      const wrapper = mount(
          <DocumentTable
          data={data}
        set={set}
        action={action}
        handleSelect={handleSelect}
        handleClose={handleClose}
          />
        )
  
         act(() => {
          wrapper
            .find(MaterialTable)
            .props()
            .actions[1].onClick({ target: { value: "" } }, { documentId: 2 , documentName : "Document A" , latestVersion : 3});
        });
        wrapper.update();
        wrapper.render();
        expect(handleSelect).toHaveBeenCalledTimes(1);
      expect(handleSelect.mock.calls[0][0]).toStrictEqual({"id": 2, "latest_version": 3, "name": "Document A"});
      
    });
    
    test("AddDocumentToSetAction functionality", () => {
      let data =[{id: 1} , {id: 2}];
      let set = {id : 1 , name: " set1"};
      let action = "add-to-documentset";
      const handleSelect = jest.fn();
      const handleClose = jest.fn();
      let mockJsonPromiseMetaDataModel={ok:true};
      const mockJsonPromise = Promise.resolve(mockJsonPromiseMetaDataModel); 
      const fetchingMetaDataModel = jest
        .spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromise);
      let rowData = [{documentId: 1} ,{documentId:2} ];
      const wrapper = mount(
        <Router>
          <DocumentTable
          data={data}
        set={set}
        action={action}
        handleSelect={handleSelect}
        handleClose={handleClose}
          />
        </Router>
        );
        return mockJsonPromise.then(() => {
         act(() => {
          wrapper
            .find(MaterialTable)
            .props()
            .actions[1].onClick({ target: { value: "" } },rowData);
        });
      }).then(() => {
        wrapper.update();
        wrapper.render();
        expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
        expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/DocumentSet/AddDocumentToDocumentSet?document_set_Id=1');
        expect(fetchingMetaDataModel.mock.calls[0][1]).toStrictEqual([1,2]);
       //the length of  redirect is resetted to 0 because of the update functionality
       expect(wrapper.find(Redirect).length).toBe(0);
    });
  });
  //   test("AddDocumentToSetAction functionality when rowData is not array ", () => {
  //     let data =[{id: 1} , {id: 2}];
  //     let set = {id : 1 , name: " set1"};
  //     let action = "add-to-documentset";
  //     const handleSelect = jest.fn();
  //     const handleClose = jest.fn();
  //     let mockJsonPromiseMetaDataModel= {ok:false , json:()=>{ return {error:["errorMessage"]}}};
  //     const mockJsonPromise = Promise.resolve(mockJsonPromiseMetaDataModel); 
  //     const fetchingMetaDataModel = jest
  //       .spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromise);
  //     let rowData = {documentId: 1} ;
  //     const wrapper = mount(
  //       <Router>
  //         <DocumentTable
  //         data={data}
  //       set={set}
  //       action={action}
  //       handleSelect={handleSelect}
  //       handleClose={handleClose}
  //         />
  //       </Router>
  //       );
  //       return mockJsonPromise.then(() => {
  //        act(() => {
  //         wrapper
  //           .find(MaterialTable)
  //           .props()
  //           .actions[1].onClick({ target: { value: "" } },rowData);
  //       });
  //     }).then(() => {
  //       wrapper.update();
  //       wrapper.render();
  //       expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
  //       expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/DocumentSet/AddDocumentToDocumentSet?document_set_Id=1');
  //       expect(fetchingMetaDataModel.mock.calls[0][1]).toStrictEqual([1]);
  //       //the length of  redirect is resetted to 0 because of the update functionality
  //      expect(wrapper.find(Redirect).length).toBe(0);
  //      expect(wrapper.find("#notification").props().open).toBeTruthy(); 
  //       expect(wrapper.find("#notification").props().error).toBeTruthy(); 
  //       expect(wrapper.find("#notification").props().errorMessage).toStrictEqual(["errorMessage"]); 
  //   });
  // });
    test("AddDocumentsToSetAction functionality", () => {
        let data =[{id: 1} , {id: 2}];
        let set = {id : 1 , name: " set1"};
        let action = "add-to-documentset";
        const handleSelect = jest.fn();
        const handleClose = jest.fn();
        let mockJsonPromiseMetaDataModel={ok:true};
        const mockJsonPromise = Promise.resolve(mockJsonPromiseMetaDataModel); 
        const fetchingMetaDataModel = jest
          .spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromise);;
        let rowData = [{documentId: 1} ,{documentId:2} ];
        const wrapper = mount(
          <Router>
            <DocumentTable
            data={data}
          set={set}
          action={action}
          handleSelect={handleSelect}
          handleClose={handleClose}
            />
          </Router>
          );
          return mockJsonPromise.then(() => {
           act(() => {
            wrapper
              .find(MaterialTable)
              .props()
              .actions[2].onClick({ target: { value: "" } },rowData);
          });
        }).then(() => {
          wrapper.update();
          wrapper.render();
          expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
          expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/DocumentSet/AddDocumentToDocumentSet?document_set_Id=1');
          expect(fetchingMetaDataModel.mock.calls[0][1]).toStrictEqual([1,2]);
         //the length of  redirect is resetted to 0 because of the update functionality
         expect(wrapper.find(Redirect).length).toBe(0);
      });
    });
    //   test("AddDocumentsToSetAction functionality when rowData is not array ", () => {
    //     let data =[{id: 1} , {id: 2}];
    //     let set = {id : 1 , name: " set1"};
    //     let action = "add-to-documentset";
    //     const handleSelect = jest.fn();
    //     const handleClose = jest.fn();
    //     let mockJsonPromiseMetaDataModel= {ok:false , json:()=>{ return {error:["errorMessage"]}}};
    //     const mockJsonPromise = Promise.resolve(mockJsonPromiseMetaDataModel); 
    //     const fetchingMetaDataModel = jest
    //       .spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromise);;
    //     let rowData = {documentId: 1} ;
    //     const wrapper = mount(
    //       <Router>
    //         <DocumentTable
    //         data={data}
    //       set={set}
    //       action={action}
    //       handleSelect={handleSelect}
    //       handleClose={handleClose}
    //         />
    //       </Router>
    //       );
    //       return mockJsonPromise.then(() => {
    //        act(() => {
    //         wrapper
    //           .find(MaterialTable)
    //           .props()
    //           .actions[2].onClick({ target: { value: "" } },rowData);
    //       });
    //     }).then(() => {
    //       wrapper.update();
    //       wrapper.render();
    //       expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
    //       expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/DocumentSet/AddDocumentToDocumentSet?document_set_Id=1');
    //       expect(fetchingMetaDataModel.mock.calls[0][1]).toStrictEqual([1]);
    //       //the length of  redirect is resetted to 0 because of the update functionality
    //      expect(wrapper.find(Redirect).length).toBe(0);
    //      expect(wrapper.find("#notification").props().open).toBeTruthy(); 
    //      expect(wrapper.find("#notification").props().error).toBeTruthy(); 
    //      expect(wrapper.find("#notification").props().errorMessage).toStrictEqual(["errorMessage"]); 
    //   });
    // });
      test("CloseUpdateDialog functionality when id === -1", () => {
        let data =[{id: 1} , {id: 2}];
        let set = {id : 1 , name: " set1"};
        let action = "show-history";
        const handleSelect = jest.fn();
        const handleClose = jest.fn();
        const wrapper = mount(
            <DocumentTable
            data={data}
          set={set}
          action={action}
          handleSelect={handleSelect}
          handleClose={handleClose}
            />
          );
          let id =-1;
          let neededUpdateId = -1
         let message="message";
           act(() => {
            wrapper
              .find(MaterialTable)
              .props()
              .actions[0].onClick({ target: { value: "" } }, { latestVersion: 2});
          });
          wrapper.update();
          wrapper.render();
           //UpdateOrPreviewDocumentDialobog
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().open).toBeTruthy();
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().option).toBe(0);
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().documentVersionId).toBe(2);
           act(() => {
            wrapper
              .find(UpdateOrPreviewDocumentDialog)
              .props().handler(id, message , neededUpdateId);
          });
          wrapper.update();
          wrapper.render();
          //UpdateOrPreviewDocumentDialobog
          expect(wrapper.find(UpdateOrPreviewDocumentDialog).length).toBe(0);
      });

      test("CloseUpdateDialog functionality when (id !== -1 && neededUpdateId === -1)", () => {
        let data =[{latestVersion: 1} , {latestVersion: 3}];
        let set = {id : 1 , name: " set1"};
        let action = "show-history";
        const handleSelect = jest.fn();
        const handleClose = jest.fn();
        const updateTableData = jest.fn();
        const wrapper = mount(
            <DocumentTable
            data={data}
          set={set}
          action={action}
          handleSelect={handleSelect}
          handleClose={handleClose}
          updateTableData={updateTableData}
            />
          );
          let id =1;
          let neededUpdateId = -1;
         let message="message";
           act(() => {
            wrapper
              .find(MaterialTable)
              .props()
              .actions[0].onClick({ target: { value: "" } }, { latestVersion: 2});
          });
          wrapper.update();
          wrapper.render();
           //UpdateOrPreviewDocumentDialobog
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().open).toBeTruthy();
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().option).toBe(0);
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().documentVersionId).toBe(2);
           act(() => {
            wrapper
              .find(UpdateOrPreviewDocumentDialog)
              .props().handler(id, message, neededUpdateId);
          });
          wrapper.update();
          wrapper.render();
          //UpdateOrPreviewDocumentDialobog
          expect(wrapper.find(UpdateOrPreviewDocumentDialog).length).toBe(0);
           expect(updateTableData).toHaveBeenCalledTimes(1);
           expect(updateTableData.mock.calls[0][0]).toStrictEqual(data);
           expect(updateTableData.mock.calls[0][1]).toStrictEqual(id);
      });

      test("CloseUpdateDialog functionality when (id !== -1 && neededUpdateId === -1) and action === show-history", () => {
        let data =[{documentId: 1 , documentName : "documentName1", latestVersion: 1 , addedDate:"addedDate1"} , {documentId: 2 , documentName : "documentName2", latestVersion: 2 , addedDate:"addedDate2"}];
        let set = {id : 1 , name: " set1"};
        let action = "show-history";
        const handleSelect = jest.fn();
        const handleClose = jest.fn();
        const updateTableData = jest.fn();
        const wrapper = mount(
            <DocumentTable
            data={data}
          set={set}
          action={action}
          handleSelect={handleSelect}
          handleClose={handleClose}
          updateTableData={updateTableData}
            />
          );
          let id =1;
         let message="message";
         let neededUpdateId = -1;
           act(() => {
            wrapper
              .find(MaterialTable)
              .props()
              .actions[0].onClick({ target: { value: "" } }, { latestVersion: 2});
          });
          wrapper.update();
          wrapper.render();
           //UpdateOrPreviewDocumentDialobog
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().open).toBeTruthy();
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().option).toBe(0);
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().documentVersionId).toBe(2);
           act(() => {
            wrapper
              .find(UpdateOrPreviewDocumentDialog)
              .props().handler(id, message,neededUpdateId);
          });
          wrapper.update();
          wrapper.render();
          //UpdateOrPreviewDocumentDialobog
          expect(wrapper.find(UpdateOrPreviewDocumentDialog).length).toBe(0);
           expect(updateTableData).toHaveBeenCalledTimes(1);
           expect(updateTableData.mock.calls[0][0]).toStrictEqual([{"addedDate": "addedDate1", "documentId": 1, "documentName": "documentName1", "latestVersion": 1, "tableData": {"id": 0}}, 
           {"addedDate": "addedDate2", "documentId": 2, "documentName": "documentName2", "latestVersion": 2, "tableData": {"id": 1}}, {"addedDate": "addedDate2", "documentId": 2, "documentName": "documentName2", "latestVersion": 1, "tableData": {"id": 1}, "versionMessage": "message"}] );
           expect(updateTableData.mock.calls[0][1]).toStrictEqual(id);
      });

      test("CloseUpdateDialog functionality when (id !== -1 && neededUpdateId === -1) and action !== show-history", () => {
        let data =[{documentId: 1 , documentName : "documentName1", latestVersion: 1 , addedDate:"addedDate1"} , {documentId: 2 , documentName : "documentName2", latestVersion: 2 , addedDate:"addedDate2"}];
        let set = {id : 1 , name: " set1"};
        let action = "browse-document";
        const handleSelect = jest.fn();
        const handleClose = jest.fn();
        const updateTableData = jest.fn();
        const clickButtonSpy = jest.spyOn(HTMLButtonElement.prototype, 'click');
        const wrapper = mount(
            <DocumentTable
            data={data}
          set={set}
          action={action}
          handleSelect={handleSelect}
          handleClose={handleClose}
          updateTableData={updateTableData}
            />, { attachTo: document.body }
          );
          let id =1;
          let  neededUpdateId=-1
         let message="message";
           act(() => {
            wrapper
              .find(MaterialTable)
              .props()
              .actions[0].onClick({ target: { value: "" } }, { latestVersion: 2});
          });
          wrapper.update();
          wrapper.render();
           //UpdateOrPreviewDocumentDialobog
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().open).toBeTruthy();
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().option).toBe(0);
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().documentVersionId).toBe(2);
           act(() => {
            wrapper
              .find(UpdateOrPreviewDocumentDialog)
              .props().handler(id, message , neededUpdateId);
          });
          wrapper.update();
          wrapper.render();
          //UpdateOrPreviewDocumentDialobog
          expect(wrapper.find(UpdateOrPreviewDocumentDialog).length).toBe(0);
          expect(clickButtonSpy).toHaveBeenCalledTimes(0);
          expect(wrapper.find("#notification").props().open).toBeTruthy(); 
      expect(wrapper.find("#notification").props().error).toBeTruthy(); 
      expect(wrapper.find("#notification").props().errorMessage).toStrictEqual([
        "[Error] : Can not Refresh Search Result .. Please Press Search Button",
      ]); 
      });
      test("CloseUpdateDialog functionality when (id === -1 && neededUpdateId !== -1)", () => {
        let data =[{id: 1} , {id: 2}];
        let set = {id : 1 , name: " set1"};
        let action = "show-history";
        const handleSelect = jest.fn();
        const handleClose = jest.fn();
        const wrapper = mount(
            <DocumentTable
            data={data}
          set={set}
          action={action}
          handleSelect={handleSelect}
          handleClose={handleClose}
            />
          );
          let id =-1;
          let neededUpdateId = 1
         let message="message";
           act(() => {
            wrapper
              .find(MaterialTable)
              .props()
              .actions[0].onClick({ target: { value: "" } }, { latestVersion: 2});
          });
          wrapper.update();
          wrapper.render();
           //UpdateOrPreviewDocumentDialobog
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().open).toBeTruthy();
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().option).toBe(0);
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().documentVersionId).toBe(2);
           act(() => {
            wrapper
              .find(UpdateOrPreviewDocumentDialog)
              .props().handler(id, message , neededUpdateId);
          });
          wrapper.update();
          wrapper.render();
          //UpdateOrPreviewDocumentDialobog
          expect(wrapper.find(UpdateOrPreviewDocumentDialog).length).toBe(1);
          expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().open).toBeTruthy();
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().option).toBe(1);
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().documentVersionId).toBe(1);
      });

      test("CloseUpdateDialog functionality when (id !== -1 && neededUpdateId  !==  -1 and action === show-history", () => {
        let data =[{documentId: 1 , documentName : "documentName1", latestVersion: 1 , addedDate:"addedDate1"} , {documentId: 2 , documentName : "documentName2", latestVersion: 2 , addedDate:"addedDate2"}];
        let set = {id : 1 , name: " set1"};
        let action = "show-history";
        const handleSelect = jest.fn();
        const handleClose = jest.fn();
        const updateTableData = jest.fn();
        const wrapper = mount(
            <DocumentTable
            data={data}
          set={set}
          action={action}
          handleSelect={handleSelect}
          handleClose={handleClose}
          updateTableData={updateTableData}
            />
          );
          let id =1;
         let message="message";
         let neededUpdateId = 1;
           act(() => {
            wrapper
              .find(MaterialTable)
              .props()
              .actions[0].onClick({ target: { value: "" } }, { latestVersion: 2});
          });
          wrapper.update();
          wrapper.render();
           //UpdateOrPreviewDocumentDialobog
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().open).toBeTruthy();
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().option).toBe(0);
           expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().documentVersionId).toBe(2);
           act(() => {
            wrapper
              .find(UpdateOrPreviewDocumentDialog)
              .props().handler(id, message,neededUpdateId);
          });
          wrapper.update();
          wrapper.render();
          //UpdateOrPreviewDocumentDialobog
          expect(wrapper.find(UpdateOrPreviewDocumentDialog).length).toBe(1);
          expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().open).toBeTruthy();
          expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().option).toBe(1);
          expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().documentVersionId).toBe(1);
           expect(updateTableData).toHaveBeenCalledTimes(1);
           expect(updateTableData.mock.calls[0][0]).toStrictEqual([{"addedDate": "addedDate1", "documentId": 1, "documentName": "documentName1", "latestVersion": 1, "tableData": {"id": 0}}, 
           {"addedDate": "addedDate2", "documentId": 2, "documentName": "documentName2", "latestVersion": 2, "tableData": {"id": 1}}, {"addedDate": "addedDate2", "documentId": 2, "documentName": "documentName2", "latestVersion": 1, "tableData": {"id": 1}, "versionMessage": "message"}] );
           expect(updateTableData.mock.calls[0][1]).toStrictEqual(id);
      });

      // test("CloseUpdateDialog functionality when (id !== -1 && neededUpdateId  !==  -1) and action !== show-history", () => {
      //   let data =[{documentId: 1 , documentName : "documentName1", latestVersion: 1 , addedDate:"addedDate1"} , {documentId: 2 , documentName : "documentName2", latestVersion: 2 , addedDate:"addedDate2"}];
      //   let set = {id : 1 , name: " set1"};
      //   let action = "browse-document";
      //   const handleSelect = jest.fn();
      //   const handleClose = jest.fn();
      //   const updateTableData = jest.fn();
      //   let neededUpdateId = 1;
      //   const clickButtonSpy = jest.spyOn(HTMLButtonElement.prototype, 'click');
      //   const wrapper = mount(
      //       <DocumentTable
      //       data={data}
      //     set={set}
      //     action={action}
      //     handleSelect={handleSelect}
      //     handleClose={handleClose}
      //     updateTableData={updateTableData}
      //       />, {attachTo:document.body}
      //     );
      //     let id =1;
      //    let message="message";
      //      act(() => {
      //       wrapper
      //         .find(MaterialTable)
      //         .props()
      //         .actions[0].onClick({ target: { value: "" } }, { latestVersion: 2});
      //     });
      //     wrapper.update();
      //     wrapper.render();
      //      //UpdateOrPreviewDocumentDialobog
      //      expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().open).toBeTruthy();
      //      expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().option).toBe(0);
      //      expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().documentVersionId).toBe(2);
      //      act(() => {
      //       wrapper
      //         .find(UpdateOrPreviewDocumentDialog)
      //         .props().handler(id, message, neededUpdateId);
      //     });
      //     wrapper.update();
      //     wrapper.render();
      //     //UpdateOrPreviewDocumentDialobog
      //     expect(wrapper.find(UpdateOrPreviewDocumentDialog).length).toBe(1);
      //     expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().open).toBeTruthy();
      //     expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().option).toBe(1);
      //     expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().documentVersionId).toBe(2);
      //     expect(clickButtonSpy).toHaveBeenCalledTimes(1);
      // });

          test("handleCloseHistoryDialog functionality when id == -1", () => {
            let data =[{id: 1} , {id: 2}];
            let set = {id : 1 , name: " set1"};
            let action = "browse-document";
            const handleSelect = jest.fn();
            const handleClose = jest.fn();
            let rowData1 = {documentId: 1};
           
            const mockSuccessResponseMetaDataModel = [
                { versionId: 1 , versionMessage: "version Message " , documentId: 2 , documentName: "Document A", addedDate: '29/4/2020'}
              ];
              const mockJsonPromiseMetaDataModel = Promise.resolve(
                mockSuccessResponseMetaDataModel
              ); // 2
              const fetchingMetaDataModel = jest
                .spyOn(FetchDataMock, "fetchData")
                .mockImplementation(() => mockJsonPromiseMetaDataModel);
                let wrapper;
      return mockJsonPromiseMetaDataModel.then(() => {
        wrapper = mount(
            <DocumentTable
            data={data}
          set={set}
          action={action}
          handleSelect={handleSelect}
          handleClose={handleClose}
            />
          );
             
             act(() => {
              wrapper
                .find(MaterialTable)
                .props()
                .actions[8].onClick({ target: { value: "" } }, rowData1);
            });

      }).then(() => {
        wrapper.render();
        wrapper.update();
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe("/api/Document/GetDocumentHistory?docId=1");
     expect(wrapper.find(DocumentHistory).at(0).props().open).toBeTruthy();
    expect(wrapper.find(DocumentHistory).at(0).props().documentId).toBe(1);
    act(() => {
        wrapper
          .find(DocumentHistory)
          .props().handleClose(-1);
      });
      wrapper.render();
        wrapper.update();
      expect(wrapper.find(DocumentHistory).length).toBe(0);
   });
});
test("handleCloseHistoryDialog functionality when index !== -1", () => {
    let data =[{documentId: 3} , {documentId: 2}];
    let set = {id : 1 , name: " set1"};
    let action = "browse-document";
    const handleSelect = jest.fn();
    const handleClose = jest.fn();
    const updateTableData = jest.fn();
    let rowData1 = {documentId: 1}
    const mockSuccessResponseMetaDataModel = [
        { versionId: 1 , versionMessage: "version Message " , documentId: 2 , documentName: "Document A", addedDate: '29/4/2020'}
      ];
      const mockJsonPromiseMetaDataModel = Promise.resolve(
        mockSuccessResponseMetaDataModel
      ); // 2
      const fetchingMetaDataModel = jest
        .spyOn(FetchDataMock, "fetchData")
        .mockImplementation(() => mockJsonPromiseMetaDataModel);
        let wrapper;
return mockJsonPromiseMetaDataModel.then(() => {
wrapper = mount(
    <DocumentTable
    data={data}
  set={set}
  action={action}
  handleSelect={handleSelect}
  handleClose={handleClose}
  updateTableData={updateTableData}
    />
  );
     
     act(() => {
      wrapper
        .find(MaterialTable)
        .props()
        .actions[8].onClick({ target: { value: "" } }, rowData1);
    });

}).then(() => {
wrapper.render();
wrapper.update();
expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
expect(fetchingMetaDataModel.mock.calls[0][0]).toBe("/api/Document/GetDocumentHistory?docId=1");
expect(wrapper.find(DocumentHistory).at(0).props().open).toBeTruthy();
expect(wrapper.find(DocumentHistory).at(0).props().documentId).toBe(1);
act(() => {
wrapper
  .find(DocumentHistory)
  .props().handleClose(1);
});
wrapper.render();
wrapper.update();
expect(wrapper.find(DocumentHistory).length).toBe(0);
expect(wrapper.find("#notification").props().open).toBeTruthy(); 
expect(wrapper.find("#notification").props().error).toBeTruthy(); 
expect(wrapper.find("#notification").props().errorMessage).toStrictEqual([
  "[Error] : Can not Refresh Search Result .. Please Press Search Button",
]); 
});
});

test("handleCloseHistoryDialog functionality when index == -1", () => {
    let data =[{latestVersion : 4 , documentId: 1} , {documentId: 2 , latestVersion:5}];
    let set = {id : 1 , name: " set1"};
    let action = "browse-document";
    const handleSelect = jest.fn();
    const handleClose = jest.fn();
    const updateTableData = jest.fn();
    let rowData1 = {documentId: 1}
    const mockSuccessResponseMetaDataModel = [
        { versionId: 1 , versionMessage: "version Message " , documentId: 2 , documentName: "Document A", addedDate: '29/4/2020'}
      ];
      const mockJsonPromiseMetaDataModel = Promise.resolve(
        mockSuccessResponseMetaDataModel
      ); // 2
      const fetchingMetaDataModel = jest
        .spyOn(FetchDataMock, "fetchData")
        .mockImplementation(() => mockJsonPromiseMetaDataModel);
        let wrapper;
return mockJsonPromiseMetaDataModel.then(() => {
wrapper = mount(
    <DocumentTable
    data={data}
  set={set}
  action={action}
  handleSelect={handleSelect}
  handleClose={handleClose}
  updateTableData={updateTableData}
    />
  );
     
     act(() => {
      wrapper
        .find(MaterialTable)
        .props()
        .actions[8].onClick({ target: { value: "" } }, rowData1);
    });

}).then(() => {
wrapper.render();
wrapper.update();
expect(wrapper.find(DocumentHistory).at(0).props().open).toBeTruthy();
expect(wrapper.find(DocumentHistory).at(0).props().documentId).toBe(1);
act(() => {
wrapper
  .find(DocumentHistory)
  .props().handleClose(-1);
});
wrapper.render();
wrapper.update();
expect(wrapper.find(DocumentHistory).length).toBe(0);

});
});
});
 


