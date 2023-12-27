import React from "react";
import ReactDom from "react-dom";
import DocumentHistory from "../../components/User/DocumentHistory";
import { cleanup } from "@testing-library/react";
import { mount } from "enzyme";
import Form from "react-jsonschema-form";
import { shallow } from "enzyme";
import { act } from "react-dom/test-utils";
import Dialog from "@material-ui/core/Dialog";
import DocumentTable from "../../components/User/DocumentTable";
import * as FetchMock from "../../api/FetchData";
afterEach(cleanup);
describe("DocumentHistory", () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    let open = true;
    let data = [{tabledata : "data 1"} , {tabledata : "data 2"}];
    const handleClose = jest.fn();
    ReactDom.render(
      <DocumentHistory
      open={open}
      data={data}
      handleClose={handleClose}
      />,
      div
    );
  });

  it("matches the snapshot", () => {
    let open = true;
    let data = [{tabledata : "data 1"} , {tabledata : "data 2"}];
    const handleClose = jest.fn();
    const wrapper = mount(
        <DocumentHistory
        open={open}
        data={data}
        handleClose={handleClose}
        />
    );
    expect(wrapper).toMatchSnapshot();
  });

  test("componentDidMount functionality",  () =>{
    let handleClose = jest.fn();
    let documentId = 1;
    let open= true;

    const mockSuccessResponseMetaDataModel = [
        { versionId:1 , versionMessage:"versionMessage", documentId:2 , documentName:"documentName" , addedDate:"addedDate"},
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
            <DocumentHistory handleClose ={handleClose} documentId ={documentId} open ={open} />
          );
      }).then(() => {
        wrapper.render();
        wrapper.update();
    //expectations
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/Document/GetDocumentHistory?docId=1');
    expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
    expect(wrapper.find(DocumentTable).at(0).props().data).toStrictEqual(
      [
         {
          "addedDate": "addedDate",
          "documentId": 2,
          "documentName": "documentName",
         "latestVersion": 1,
         "tableData":  {
         "id": 0,
         },
          "versionMessage": "versionMessage",
        },
      ]
    );
   });   
});

test("componentDidUpdate functionality",  () =>{
  let handleClose = jest.fn();
  let documentId = 1;
  let open= true;

  const mockSuccessResponseMetaDataModel = [
      { versionId:1 , versionMessage:"versionMessage", documentId:2 , documentName:"documentName" , addedDate:"addedDate"},
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
          <DocumentHistory handleClose ={handleClose} documentId ={documentId} open ={open} />
        );
        wrapper.setProps({documentId:2});
    }).then(() => {
      wrapper.render();
        wrapper.update();
  //expectations
  expect(fetchingMetaDataModel).toHaveBeenCalledTimes(3);
  expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/Document/GetDocumentHistory?docId=1');
  expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/Document/GetDocumentHistory?docId=2');
  expect(fetchingMetaDataModel.mock.calls[2][0]).toBe('/api/Document/GetDocumentHistory?docId=2');
  expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
  expect(wrapper.find(DocumentTable).at(0).props().data).toStrictEqual(
    [
       {
        "addedDate": "addedDate",
        "documentId": 2,
        "documentName": "documentName",
       "latestVersion": 1,
       "tableData":  {
       "id": 0,
       },
        "versionMessage": "versionMessage",
      },
    ]
  );
 });   
});

test("getDocumentList functionality",  () =>{
  let handleClose = jest.fn();
  let documentId = 1;
  let open= true;

  const mockSuccessResponseMetaDataModel = [
      { versionId:1 , versionMessage:"versionMessage", documentId:2 , documentName:"documentName" , addedDate:"addedDate"},
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
          <DocumentHistory handleClose ={handleClose} documentId ={documentId} open ={open} />
        );
    }).then(() => {
      wrapper.render();
      wrapper.update();
  //expectations for componentDidMount
  expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
  expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/Document/GetDocumentHistory?docId=1');
  expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
  expect(wrapper.find(DocumentTable).at(0).props().data).toStrictEqual(
    [
       {
        "addedDate": "addedDate",
        "documentId": 2,
        "documentName": "documentName",
       "latestVersion": 1,
       "tableData":  {
       "id": 0,
       },
        "versionMessage": "versionMessage",
      },
    ]
  );
  //calling  updateTableData
  let data2= [
    {
     "addedDate": "addedDate",
     "documentId": 2,
     "documentName": "documentName",
    "latestVersion": 1,
    "tableData":  {
    "id": 0,
    },
     "versionMessage": "versionMessage",
   },
 ];
 let latestVersionId =2;
      act(() => {
        wrapper
          .find(DocumentTable)
          .at(0)
          .props()
          .updateTableData(data2,latestVersionId);
      });
      wrapper.render();
      wrapper.update();
      expect(wrapper.find(DocumentTable).at(0).props().data).toStrictEqual(data2);
      //calling handleCloseDialog help expect the setted value of latestVersionId
      act(() => {
        wrapper
          .find(Dialog)
          .at(0)
          .props()
          .onClose();
      });
      wrapper.render();
      wrapper.update();
      expect(handleClose).toHaveBeenCalledTimes(1);
      expect(handleClose.mock.calls[0][0]).toBe(latestVersionId);
 });   
});

test("handleCloseDialog functionality",  () =>{
  let handleClose = jest.fn();
  let documentId = 1;
  let open= true;

  const mockSuccessResponseMetaDataModel = [
      { versionId:1 , versionMessage:"versionMessage", documentId:2 , documentName:"documentName" , addedDate:"addedDate"},
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
          <DocumentHistory handleClose ={handleClose} documentId ={documentId} open ={open} />
        );
    }).then(() => {
      wrapper.render();
      wrapper.update();
  //expectations for componentDidMount
  expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
  expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/Document/GetDocumentHistory?docId=1');
  expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
  expect(wrapper.find(DocumentTable).at(0).props().data).toStrictEqual(
    [
       {
        "addedDate": "addedDate",
        "documentId": 2,
        "documentName": "documentName",
       "latestVersion": 1,
       "tableData":  {
       "id": 0,
       },
        "versionMessage": "versionMessage",
      },
    ]
  );
      act(() => {
        wrapper
          .find(Dialog)
          .at(0)
          .props()
          .onClose();
      });
      wrapper.render();
      wrapper.update();
      expect(handleClose).toHaveBeenCalledTimes(1);
      expect(handleClose.mock.calls[0][0]).toBe(-1);
 });   
});

});
