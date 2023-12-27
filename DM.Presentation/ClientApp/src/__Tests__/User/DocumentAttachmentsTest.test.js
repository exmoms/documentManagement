import React from "react";
import ReactDom from "react-dom";
import DocumentAttachments from "../../components/User/DocumentAttachments";
import AttachmentTable from "../../components/User/AttachmentTable";
import { cleanup } from "@testing-library/react";
import { mount } from "enzyme";
import Form from "react-jsonschema-form";
import { shallow } from "enzyme";
import { act } from "react-dom/test-utils";
import Dialog from "@material-ui/core/Dialog";
import * as FetchMock from "../../api/FetchData";
import * as PostDataMock from "../../api/PostData";
import Button from "@material-ui/core/Button";
afterEach(cleanup);
describe("DocumentAttachments", () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
      test("handleCloseDialog", () => {
        jest.clearAllMocks();
        let documentIdMock = -1;
        let show  = true;
        const handleClose = jest.fn();
        const mockSuccessResponse = [];
        const mockJsonPromise = Promise.resolve(mockSuccessResponse); 
        const PostMock =  jest.spyOn(PostDataMock, "postAttachmentData").mockImplementation(() => mockJsonPromise);
      const mockSuccessResponse2 = [{id : 1 , name:"attachment A" , contentType: "type" , attachmentFile:"attachmentFile" , compoundModelId : 2 ,caption :"caption" , addedDate:'29/4/2020'}];
          const mockJsonPromise2 = Promise.resolve(mockSuccessResponse2); 
          const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise2);
      let wrapper;
      const stopPropagationMock = jest.fn();
      return mockJsonPromise2.then(() => {  
       wrapper = mount(
            <DocumentAttachments
            documentId={documentIdMock}
          show={show}
          handleClose={handleClose}
            />
        );
        act(() => {
          wrapper
            .find(Dialog)
            .at(0)
            .props()
            .onClose();
        });
      }).then(() => {
        wrapper.update();
        wrapper.render();
        expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
        expect(wrapper.find(AttachmentTable).at(0).props().attachments).toStrictEqual([]);
        
        expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
        expect(wrapper.find(AttachmentTable).at(0).props().attachments).toStrictEqual([
           ]);
        expect(handleClose).toHaveBeenCalledTimes(1);
      });
        });
      
        test("updateAttachments", () => {
          jest.clearAllMocks();
          let documentIdMock = -1;
          let show  = true;
          const handleClose = jest.fn();
          const mockSuccessResponse = [];
        const mockJsonPromise = Promise.resolve(mockSuccessResponse); 
        const PostMock =  jest.spyOn(PostDataMock, "postAttachmentData").mockImplementation(() => mockJsonPromise);
          const mockSuccessResponse2 = [{id : 1 , name:"attachment A" , contentType: "type" , attachmentFile:"attachmentFile" , compoundModelId : 2 ,caption :"caption" , addedDate:'29/4/2020'}];
          const mockJsonPromise2 = Promise.resolve(mockSuccessResponse2); 
          const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise2);
          let wrapper;
          let attachments =[{id : 1 , attchmentName: "attachment1"} , {id : 2 , attchmentName: "attachment2"}]
          return mockJsonPromise2.then(() => {  
           wrapper = mount(
              <DocumentAttachments
              documentId={documentIdMock}
            show={show}
            handleClose={handleClose}
              />
          );
          act(() => {
              wrapper
                .find(AttachmentTable)
                .at(0)
                .props()
                .updateAttachments(attachments);
            });
        }).then(() => {
            wrapper.update();
          wrapper.render();
          expect(wrapper.find('.onChangeFile1').at(0).props().id).toBe(1);
          expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
          expect(wrapper.find(AttachmentTable).at(0).props().attachments).toStrictEqual(attachments);
        });
      });
        test("addNewAttachmentOnClickHandler", () => {
          jest.clearAllMocks();
          let documentIdMock = -1;
          let show  = true;
          const handleClose = jest.fn();
          const mockSuccessResponse = [];
        const mockJsonPromise = Promise.resolve(mockSuccessResponse); 
        const PostMock =  jest.spyOn(PostDataMock, "postAttachmentData").mockImplementation(() => mockJsonPromise);
          const mockSuccessResponse2 = [{id : 1 , name:"attachment A" , contentType: "type" , attachmentFile:"attachmentFile" , compoundModelId : 2 ,caption :"caption" , addedDate:'29/4/2020'}];
        const mockJsonPromise2 = Promise.resolve(mockSuccessResponse2); 
        const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise2);
        let wrapper;
        const clickInputSpy = jest.spyOn(HTMLInputElement.prototype, 'click');
        return mockJsonPromise2.then(() => {  
           wrapper = mount(
              <DocumentAttachments
              documentId={documentIdMock}
            show={show}
            handleClose={handleClose}
              />
          );
          
        }).then(() => {
          wrapper.update();
          wrapper.render();
          act(() => {
              wrapper
                .find(Button)
                .at(1)
                .props()
                .onClick();
            });
          expect(clickInputSpy).toHaveBeenCalledTimes(1);
          expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
          expect(wrapper.find(AttachmentTable).at(0).props().attachments).toStrictEqual([]);
        });
        });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    let documentId = 1;
    let show  = true;
    const handleClose = jest.fn();
    ReactDom.render(
      <DocumentAttachments
      documentId={documentId}
      show={show}
      handleClose={handleClose}
      />,
      div
    );
  });

  it("matches the snapshot", () => {
    let documentId = 1;
    let show  = true;
    const handleClose = jest.fn();
    const wrapper = mount(
        <DocumentAttachments
        documentId={documentId}
      show={show}
      handleClose={handleClose}
        />
    );
    expect(wrapper).toMatchSnapshot();
  });

  test("DocumentAttachments intializations", () => {
    let documentIdMock = 1;
    let show  = true;
    const handleClose = jest.fn();
    const wrapper = mount(
        <DocumentAttachments
        documentId={documentIdMock}
      show={show}
      handleClose={handleClose}
        />
    );
    expect(wrapper.find('.onChangeFile1').at(0).props().id).toBe(1);
    expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
    expect(wrapper.find(AttachmentTable).at(0).props().attachments).toStrictEqual([]);
  });

//   test("componentDidUpdate functionalities", () => {
//     let documentIdMock = 1;
//     let show  = true;
//     const handleClose = jest.fn();
//     const mockSuccessResponse = [{id : 1 , name:"attachment A" , contentType: "type" , attachmentFile:"attachmentFile" , compoundModelId : 2 ,caption :"caption" , addedDate:'29/4/2020'}];
//   const mockJsonPromise = Promise.resolve(mockSuccessResponse); 
//   const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise);
//   let wrapper;
//   return mockJsonPromise.then(() => {  
//    wrapper = mount(
//         <DocumentAttachments
//         documentId={documentIdMock}
//       show={show}
//       handleClose={handleClose}
//         />
//     );
//     expect(wrapper.find('.onChangeFile1').props().id).toBe(1);
//     expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
//     expect(wrapper.find(AttachmentTable).at(0).props().attachments).toStrictEqual([]);
//     //calling update
//     wrapper.setProps({documentId:2})
//   }).then(() => {
//     wrapper.update();
//     wrapper.render();
//     expect(fetchMock).toHaveBeenCalledTimes(2);
//     expect(fetchMock.mock.calls[0][0]).toBe("/api/Document/GetAttachmentsByDocumentId?docId=1");
//     expect(wrapper.find('.onChangeFile2').props().id).toBe(2);
//     expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
//     expect(wrapper.find(AttachmentTable).at(0).props().attachments).toStrictEqual(mockSuccessResponse);
// });
  
// });

  test("componentDidUpdate functionalities when length is 0", () => {
    let documentIdMock = 1;
    let show  = true;
    const handleClose = jest.fn();
    const mockSuccessResponse = [];
  const mockJsonPromise = Promise.resolve(mockSuccessResponse); 
  const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise);
  let wrapper;
  return mockJsonPromise.then(() => {  
   wrapper = mount(
        <DocumentAttachments
        documentId={documentIdMock}
      show={show}
      handleClose={handleClose}
        />
    );
    expect(wrapper.find('.onChangeFile1').props().id).toBe(1);
    expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
    expect(wrapper.find(AttachmentTable).at(0).props().attachments).toStrictEqual([]);
    //calling update
    wrapper.setProps({documentId:2})
  }).then(() => {
    wrapper.update();
    wrapper.render();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/Document/GetAttachmentsByDocumentId?docId=1");
    expect(wrapper.find('.onChangeFile2').props().id).toBe(2);
    expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
    expect(wrapper.find(AttachmentTable).at(0).props().attachments).toStrictEqual([]);
});
});
 
test("onChangeFile functionalities", () => {
    let documentIdMock = 1;
    let show  = true;
    const handleClose = jest.fn();
    const mockSuccessResponse = {ok:true  , json:()=>{ return {error:["errorMessage"]}}};
  const mockJsonPromise = Promise.resolve(mockSuccessResponse); 
  const PostMock =  jest.spyOn(PostDataMock, "postAttachmentData").mockImplementation(() => mockJsonPromise);
  const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => Promise.resolve([]));
  let wrapper;
  const stopPropagationMock = jest.fn();
    const preventDefaultMock = jest.fn();
  return mockJsonPromise.then(() => {  
   wrapper = mount(
        <DocumentAttachments
        documentId={documentIdMock}
      show={show}
      handleClose={handleClose}
        />
    );
    expect(wrapper.find('.onChangeFile1').props().id).toBe(1);
    expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
    expect(wrapper.find(AttachmentTable).at(0).props().attachments).toStrictEqual([]);
    act(() => {
        wrapper
          .find(".onChangeFile1")
          .at(0)
          .props()
          .onChange({
            target: { id: 1, files: [{ name: "file1" }] },
            stopPropagation: stopPropagationMock,
            preventDefault: preventDefaultMock,
          });
      });
  }).then(() => {
    wrapper.update();
    wrapper.render();
    expect(stopPropagationMock).toHaveBeenCalledTimes(1);
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    expect(PostMock).toHaveBeenCalledTimes(1);
    expect(PostMock.mock.calls[0][0]).toStrictEqual({DocumentId: 1 });
    expect(PostMock.mock.calls[0][1]).toStrictEqual({ name: "file1" });
    expect(PostMock.mock.calls[0][2]).toStrictEqual("/api/Document/AddNewAttachmentToDocument");
    expect(wrapper.find('.onChangeFile1').props().id).toBe(1);
    expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
    expect(wrapper.find(AttachmentTable).at(0).props().attachments).toStrictEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/Document/GetAttachmentsByDocumentId?docId=1");
});
});

test("onChangeFile functionalities when upload is false", () => {
    let documentIdMock = 1;
    let show  = true;
    const handleClose = jest.fn();
    const mockSuccessResponse = {ok:false  , json:()=>{ return {error:["errorMessage"]}}};
  const mockJsonPromise = Promise.resolve(mockSuccessResponse); 
  const PostMock =  jest.spyOn(PostDataMock, "postAttachmentData").mockImplementation(() => mockJsonPromise);
  const mockSuccessResponse2 = [{id : 1 , name:"attachment A" , contentType: "type" , attachmentFile:"attachmentFile" , compoundModelId : 2 ,caption :"caption" , addedDate:'29/4/2020'}];
  const mockJsonPromise2 = Promise.resolve(mockSuccessResponse2); 
  const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise2);
  let wrapper;
  const stopPropagationMock = jest.fn();
    const preventDefaultMock = jest.fn();
  return mockJsonPromise2.then(() => {  
   wrapper = mount(
        <DocumentAttachments
        documentId={documentIdMock}
      show={show}
      handleClose={handleClose}
        />
    );
  }).then(() => {
    wrapper.update();
    wrapper.render();
    expect(wrapper.find('.onChangeFile1').props().id).toBe(1);
    expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
    expect(wrapper.find(AttachmentTable).at(0).props().attachments).toStrictEqual([]);
    return mockJsonPromise.then(() => { 
    act(() => {
        wrapper
          .find(".onChangeFile1")
          .at(0)
          .props()
          .onChange({
            target: { id: 1, files: [{ name: "file1" }] },
            stopPropagation: stopPropagationMock,
            preventDefault: preventDefaultMock,
          });
      });
  }).then(() => {
    wrapper.update();
    wrapper.render();
    expect(stopPropagationMock).toHaveBeenCalledTimes(1);
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    expect(PostMock).toHaveBeenCalledTimes(1);
    expect(PostMock.mock.calls[0][0]).toStrictEqual({DocumentId: 1 });
    expect(PostMock.mock.calls[0][1]).toStrictEqual({ name: "file1" });
    expect(PostMock.mock.calls[0][2]).toStrictEqual("/api/Document/AddNewAttachmentToDocument");
    expect(wrapper.find('.onChangeFile1').at(0).props().id).toBe(1);
    expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
    expect(wrapper.find(AttachmentTable).at(0).props().attachments).toStrictEqual([
          {
         "addedDate": "29/4/2020",
          "attachmentFile": "attachmentFile",
           "caption": "caption",
           "compoundModelId": 2,
           "contentType": "type",
           "id": 1,
           "name": "attachment A",
           "tableData":  {
             "id": 0,
           },
         },
       ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
});
});
});
});