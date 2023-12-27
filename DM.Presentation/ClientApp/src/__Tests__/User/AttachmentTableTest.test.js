
import React from "react";
import ReactDom from "react-dom";
import AttachmentTable from "../../components/User/AttachmentTable";
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
afterEach(cleanup);
describe("AttachmentTable", () => {

    afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    let attachments = [{id:1 , name:"name A" , contentType:"contentType A"} , {id:2, name:"name B" , contentType:"contentType B"}];
    const updateAttachments = jest.fn();
  const div = document.createElement("div");
  ReactDom.render(
    <AttachmentTable
    attachments={attachments}
    updateAttachments={updateAttachments}
    />,
    div
  );
});
test("AttachmentTable matches snapshot", () => {
    let attachments = [{id:1 , name:"name A" , contentType:"contentType A"} , {id:2, name:"name B" , contentType:"contentType B"}];
    const updateAttachments = jest.fn();
  const renderedValue = createMount()(
      <AttachmentTable
      attachments={attachments}
    updateAttachments={updateAttachments}
      />
    );
    expect(renderedValue.html()).toMatchSnapshot();
});

test("intializations", () => {
    let attachments = [{id:1 , name:"name A" , contentType:"contentType A" , attachmentFile:"attachmentFile A"} , {id:2, name:"name B" , contentType:"contentType B", attachmentFile:"attachmentFile B"}];
    const updateAttachments = jest.fn();
    const wrapper = mount(
        <AttachmentTable
        attachments={attachments}
        updateAttachments={updateAttachments}
        />
      );
      //expectations
      attachments.map((attachment, index) => {
        expect(wrapper.find("#link"+index).length).toBe(1);
        expect(wrapper.find("#link"+index).at(0).props().href).toBe(attachment.attachmentFile);
        expect(wrapper.find("#link"+index).at(0).props().download).toBe(attachment.name);
        expect(wrapper.find(`#download-attachment-button${attachment.id}`).length).toBe(1);
      });
      attachments.map((attachment, index) => {
        expect(wrapper.find(".onChangeFile"+attachment.id).length).toBe(1);
        expect(wrapper.find(".onChangeFile"+attachment.id).at(0).props().id).toBe(attachment.id);
      });
      expect(wrapper.find("#notifications").at(0).props().open).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().errorMessage).toStrictEqual([]);
      expect(wrapper.find(MaterialTable).at(0).props().data).toStrictEqual(attachments);
  });
 
  test("onChangeFile when file is undefined", () => {
    let attachments = [{id:1 , name:"name A" , contentType:"contentType A" , attachmentFile:"attachmentFile A"} , {id:2, name:"name B" , contentType:"contentType B", attachmentFile:"attachmentFile B"}];
    const updateAttachments = jest.fn();
    const wrapper = mount(
        <AttachmentTable
        attachments={attachments}
        updateAttachments={updateAttachments}
        />
      );
      const stopPropagationMock = jest.fn();
    const preventDefaultMock = jest.fn();
      act(() => {
        wrapper
          .find(".onChangeFile1")
          .props().onChange({
            target: { id: 1, files: [] },
            stopPropagation: stopPropagationMock,
            preventDefault: preventDefaultMock,
          });
      });

        wrapper.render();
        wrapper.update();
      //expectations
      expect(stopPropagationMock).toHaveBeenCalledTimes(1);
      expect(preventDefaultMock).toHaveBeenCalledTimes(1);
      attachments.map((attachment, index) => {
        expect(wrapper.find("#link"+index).length).toBe(1);
        expect(wrapper.find("#link"+index).at(0).props().href).toBe(attachment.attachmentFile);
        expect(wrapper.find("#link"+index).at(0).props().download).toBe(attachment.name);
        expect(wrapper.find(`#download-attachment-button${attachment.id}`).length).toBe(1);
      });
      attachments.map((attachment, index) => {
        expect(wrapper.find(".onChangeFile"+attachment.id).length).toBe(1);
        expect(wrapper.find(".onChangeFile"+attachment.id).at(0).props().id).toBe(attachment.id);
      });
      expect(wrapper.find("#notifications").at(0).props().open).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().errorMessage).toStrictEqual([]);
      expect(wrapper.find(MaterialTable).at(0).props().data).toStrictEqual(attachments);
  });
 
  test("onChangeFile when is == -1", () => {
    let attachments = [{id:1 , name:"name A" , contentType:"contentType A" , attachmentFile:"attachmentFile A"} , {id:2, name:"name B" , contentType:"contentType B", attachmentFile:"attachmentFile B"}];
    const updateAttachments = jest.fn();
    const consoleMock = jest.spyOn(console, "log");
    process.env.NODE_ENV = "development";
    const wrapper = mount(
        <AttachmentTable
        attachments={attachments}
        updateAttachments={updateAttachments}
        />
      );
      const stopPropagationMock = jest.fn();
    const preventDefaultMock = jest.fn();
      act(() => {
        wrapper
          .find(".onChangeFile1")
          .props().onChange({
            target: { id: 3, files: [{ name: "file1" }] },
            stopPropagation: stopPropagationMock,
            preventDefault: preventDefaultMock,
          });
      });

        wrapper.render();
        wrapper.update();
      //expectations
      expect(stopPropagationMock).toHaveBeenCalledTimes(1);
      expect(preventDefaultMock).toHaveBeenCalledTimes(1);
      expect(consoleMock).toHaveBeenCalledTimes(1);
      expect(consoleMock.mock.calls[0][0]).toBe("[ERROR] Can't find the event.target.id:");
      expect(consoleMock.mock.calls[0][1]).toBe(3);
      attachments.map((attachment, index) => {
        expect(wrapper.find("#link"+index).length).toBe(1);
        expect(wrapper.find("#link"+index).at(0).props().href).toBe(attachment.attachmentFile);
        expect(wrapper.find("#link"+index).at(0).props().download).toBe(attachment.name);
        expect(wrapper.find(`#download-attachment-button${attachment.id}`).length).toBe(1);
      });
      attachments.map((attachment, index) => {
        expect(wrapper.find(".onChangeFile"+attachment.id).length).toBe(1);
        expect(wrapper.find(".onChangeFile"+attachment.id).at(0).props().id).toBe(attachment.id);
      });
      expect(wrapper.find("#notifications").at(0).props().open).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().errorMessage).toStrictEqual([]);
      expect(wrapper.find(MaterialTable).at(0).props().data).toStrictEqual(attachments);
  });

  test("onChangeFile when is == -1 and  process.env.NODE_ENV !== development ", () => {
    let attachments = [{id:1 , name:"name A" , contentType:"contentType A" , attachmentFile:"attachmentFile A"} , {id:2, name:"name B" , contentType:"contentType B", attachmentFile:"attachmentFile B"}];
    const updateAttachments = jest.fn();
    process.env.NODE_ENV = "";
    const wrapper = mount(
        <AttachmentTable
        attachments={attachments}
        updateAttachments={updateAttachments}
        />
      );
      const stopPropagationMock = jest.fn();
    const preventDefaultMock = jest.fn();
    const consoleMock = jest.spyOn(console, "log")
      act(() => {
        wrapper
          .find(".onChangeFile1")
          .props().onChange({
            target: { id: 3, files: [{ name: "file1" }] },
            stopPropagation: stopPropagationMock,
            preventDefault: preventDefaultMock,
          });
      });

        wrapper.render();
        wrapper.update();
      //expectations
      expect(stopPropagationMock).toHaveBeenCalledTimes(1);
      expect(preventDefaultMock).toHaveBeenCalledTimes(1);
      expect(consoleMock).toHaveBeenCalledTimes(0);
      attachments.map((attachment, index) => {
        expect(wrapper.find("#link"+index).length).toBe(1);
        expect(wrapper.find("#link"+index).at(0).props().href).toBe(attachment.attachmentFile);
        expect(wrapper.find("#link"+index).at(0).props().download).toBe(attachment.name);
        expect(wrapper.find(`#download-attachment-button${attachment.id}`).length).toBe(1);
      });
      attachments.map((attachment, index) => {
        expect(wrapper.find(".onChangeFile"+attachment.id).length).toBe(1);
        expect(wrapper.find(".onChangeFile"+attachment.id).at(0).props().id).toBe(attachment.id);
      });
      expect(wrapper.find("#notifications").at(0).props().open).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().errorMessage).toStrictEqual([]);
      expect(wrapper.find(MaterialTable).at(0).props().data).toStrictEqual(attachments);
  });

  test("onChangeFile when is !== -1 and res is not ok", () => {
    const mockJsonPromiseMetaDataModel1 = {ok:false , json:()=>{ return {error:["errorMessage"]}}}; // 2
    const mockJsonPromiseMetaDataModel = Promise.resolve(
      mockJsonPromiseMetaDataModel1
    ); // 2
      const fetchingMetaDataModel = jest
        .spyOn(PostDataMock, "postAttachmentData")
        .mockImplementation(() => mockJsonPromiseMetaDataModel);
    let attachments = [{id:1 , name:"name A" , contentType:"contentType A" , attachmentFile:"attachmentFile A"} , {id:2, name:"name B" , contentType:"contentType B", attachmentFile:"attachmentFile B"}];
    const updateAttachments = jest.fn();
    process.env.NODE_ENV = "";
    const wrapper = mount(
        <AttachmentTable
        attachments={attachments}
        updateAttachments={updateAttachments}
        />
      );
      const stopPropagationMock = jest.fn();
    const preventDefaultMock = jest.fn();
    const consoleMock = jest.spyOn(console, "log")
    return mockJsonPromiseMetaDataModel.then(() => {
      act(() => {
        wrapper
          .find(".onChangeFile1")
          .props().onChange({
            target: { id: 1, files: [{ name: "file1" }] },
            stopPropagation: stopPropagationMock,
            preventDefault: preventDefaultMock,
          });
      });

    }).then(() => {
      wrapper.render();
      wrapper.update();
      //expectations
      expect(stopPropagationMock).toHaveBeenCalledTimes(1);
      expect(preventDefaultMock).toHaveBeenCalledTimes(1);
      expect(consoleMock).toHaveBeenCalledTimes(0);
      attachments.map((attachment, index) => {
        expect(wrapper.find("#link"+index).length).toBe(1);
        expect(wrapper.find("#link"+index).at(0).props().href).toBe(attachment.attachmentFile);
        expect(wrapper.find("#link"+index).at(0).props().download).toBe(attachment.name);
        expect(wrapper.find(`#download-attachment-button${attachment.id}`).length).toBe(1);
      });
      attachments.map((attachment, index) => {
        expect(wrapper.find(".onChangeFile"+attachment.id).length).toBe(1);
        expect(wrapper.find(".onChangeFile"+attachment.id).at(0).props().id).toBe(attachment.id);
      });
      expect(wrapper.find("#notifications").at(0).props().open).toBeTruthy();
      expect(wrapper.find("#notifications").at(0).props().error).toBeTruthy();
      expect(wrapper.find("#notifications").at(0).props().errorMessage).toStrictEqual(["errorMessage"]);
      expect(wrapper.find(MaterialTable).at(0).props().data).toStrictEqual(attachments);

      expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
      expect(fetchingMetaDataModel.mock.calls[0][0]).toStrictEqual( { id: 1 });
      expect(fetchingMetaDataModel.mock.calls[0][1]).toStrictEqual({ name: "file1" });
      expect(fetchingMetaDataModel.mock.calls[0][2]).toBe("/api/Document/UpdateAttachment");
  });
});
  test("onChangeFile when is !== -1 and res is  ok", () => {
    const mockSuccessResponseMetaDataModel = {ok:true , json:()=>{ return {error:["errorMessage"]}}}; // 2
    const mockJsonPromiseMetaDataModel = Promise.resolve(
      mockSuccessResponseMetaDataModel
    ); // 2
      const fetchingMetaDataModel = jest
        .spyOn(PostDataMock, "postAttachmentData")
        .mockImplementation(() => mockJsonPromiseMetaDataModel);
    let attachments = [{id:1 , name:"name A" , contentType:"contentType A" , attachmentFile:"attachmentFile A"} , {id:2, name:"name B" , contentType:"contentType B", attachmentFile:"attachmentFile B"}];
    const updateAttachments = jest.fn();
    process.env.NODE_ENV = "";
    const wrapper = mount(
        <AttachmentTable
        attachments={attachments}
        updateAttachments={updateAttachments}
        />
      );
      const stopPropagationMock = jest.fn();
    const preventDefaultMock = jest.fn();
    const consoleMock = jest.spyOn(console, "log");
    return mockJsonPromiseMetaDataModel.then(() => {
      act(() => {
        wrapper
          .find(".onChangeFile1")
          .props().onChange({
            target: { id: 1, files: [{ name: "file1" }] },
            stopPropagation: stopPropagationMock,
            preventDefault: preventDefaultMock,
          });
      });

    }).then(() => {
      wrapper.render();
      wrapper.update();
      //expectations
      expect(stopPropagationMock).toHaveBeenCalledTimes(1);
      expect(preventDefaultMock).toHaveBeenCalledTimes(1);
      expect(consoleMock).toHaveBeenCalledTimes(0);
      attachments.map((attachment, index) => {
        expect(wrapper.find("#link"+index).length).toBe(1);
        expect(wrapper.find("#link"+index).at(0).props().href).toBe(attachment.attachmentFile);
        expect(wrapper.find("#link"+index).at(0).props().download).toBe(attachment.name);
        expect(wrapper.find(`#download-attachment-button${attachment.id}`).length).toBe(1);
      });
      attachments.map((attachment, index) => {
        expect(wrapper.find(".onChangeFile"+attachment.id).length).toBe(1);
        expect(wrapper.find(".onChangeFile"+attachment.id).at(0).props().id).toBe(attachment.id);
      });
      expect(wrapper.find("#notifications").at(0).props().open).toBeTruthy();
      expect(wrapper.find("#notifications").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().errorMessage).toStrictEqual([]);
      expect(wrapper.find(MaterialTable).at(0).props().data).toStrictEqual(attachments);

      expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
      expect(fetchingMetaDataModel.mock.calls[0][0]).toStrictEqual( { id: 1 });
      expect(fetchingMetaDataModel.mock.calls[0][1]).toStrictEqual({ name: "file1" });
      expect(fetchingMetaDataModel.mock.calls[0][2]).toBe("/api/Document/UpdateAttachment");

      expect(updateAttachments).toHaveBeenCalledTimes(1);
      expect(updateAttachments.mock.calls[0][0]).toStrictEqual([{"attachmentFile": "attachmentFile A", "contentType": undefined, "id": 1, "name": "file1", "tableData": {"id": 0}}, {"attachmentFile": "attachmentFile B", "contentType": "contentType B", "id": 2, "name": "name B", "tableData": {"id": 1}}]);
  });
});
  test("setOpenNotification", () => {
    let attachments = [{id:1 , name:"name A" , contentType:"contentType A" , attachmentFile:"attachmentFile A"} , {id:2, name:"name B" , contentType:"contentType B", attachmentFile:"attachmentFile B"}];
    const updateAttachments = jest.fn();
    const wrapper = mount(
        <AttachmentTable
        attachments={attachments}
        updateAttachments={updateAttachments}
        />
      );
      act(() => {
        wrapper
          .find("#notifications").at(0).props().setOpen(true);
      });

        wrapper.render();
        wrapper.update();
      //expectations
      attachments.map((attachment, index) => {
        expect(wrapper.find("#link"+index).length).toBe(1);
        expect(wrapper.find("#link"+index).at(0).props().href).toBe(attachment.attachmentFile);
        expect(wrapper.find("#link"+index).at(0).props().download).toBe(attachment.name);
        expect(wrapper.find(`#download-attachment-button${attachment.id}`).length).toBe(1);
      });
      attachments.map((attachment, index) => {
        expect(wrapper.find(".onChangeFile"+attachment.id).length).toBe(1);
        expect(wrapper.find(".onChangeFile"+attachment.id).at(0).props().id).toBe(attachment.id);
      });
      expect(wrapper.find("#notifications").at(0).props().open).toBeTruthy();
      expect(wrapper.find("#notifications").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().errorMessage).toStrictEqual([]);
      expect(wrapper.find(MaterialTable).at(0).props().data).toStrictEqual(attachments);
  });
 
  test("action[0]when res is ok", () => {
    let attachments = [{id:1 , name:"name A" , contentType:"contentType A" , attachmentFile:"attachmentFile A"} , {id:2, name:"name B" , contentType:"contentType B", attachmentFile:"attachmentFile B"}];
    const updateAttachments = jest.fn();
    const mockJsonPromiseMetaDataModel = {ok:true};
    const fetchingMetaDataModel = jest
        .spyOn(PostDataMock, "postDataToAPI")
        .mockImplementation(() => mockJsonPromiseMetaDataModel);
    const wrapper = mount(
        <AttachmentTable
        attachments={attachments}
        updateAttachments={updateAttachments}
        />
      );
      act(() => {
        wrapper
        .find(MaterialTable)
        .props()
        .actions[0].onClick({ target: { value: "" } }, {id:1 , name:"name A" , contentType:"contentType A" , attachmentFile:"attachmentFile A"});
      });

        wrapper.render();
        wrapper.update();
      //expectations
      expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
      expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/Document/DeleteAttachments?id=1');
      expect(fetchingMetaDataModel.mock.calls[0][1]).toBe(null);
       new Promise((resolve, reject) => {
        setTimeout(() => {
          {
            let dataRes = attachments;
          const index = dataRes.indexOf({documentId: 2});
          dataRes.splice(index, 1);
          expect(wrapper.find("#notifications").at(0).props().open).toBeTruthy();
          expect(updateAttachments).toHaveBeenCalledTimes(1);
          expect(updateAttachments.mock.calls[0][0]).toBe(dataRes);
          }
          resolve();
        }, 1000);
      });
      attachments.map((attachment, index) => {
        expect(wrapper.find("#link"+index).length).toBe(1);
        expect(wrapper.find("#link"+index).at(0).props().href).toBe(attachment.attachmentFile);
        expect(wrapper.find("#link"+index).at(0).props().download).toBe(attachment.name);
        expect(wrapper.find(`#download-attachment-button${attachment.id}`).length).toBe(1);
      });
      attachments.map((attachment, index) => {
        expect(wrapper.find(".onChangeFile"+attachment.id).length).toBe(1);
        expect(wrapper.find(".onChangeFile"+attachment.id).at(0).props().id).toBe(attachment.id);
      });
     
      expect(wrapper.find("#notifications").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().errorMessage).toStrictEqual([]);
      expect(wrapper.find(MaterialTable).at(0).props().data).toStrictEqual(attachments);
  });
 
  test("action[0] when res isn't ok", () => {
    let attachments = [{id:1 , name:"name A" , contentType:"contentType A" , attachmentFile:"attachmentFile A"} , {id:2, name:"name B" , contentType:"contentType B", attachmentFile:"attachmentFile B"}];
    const updateAttachments = jest.fn();
    const mockJsonPromiseMetaDataModel = {ok:false , json:()=>{ return {error:["errorMessage"]}}};
    const fetchingMetaDataModel = jest
        .spyOn(PostDataMock, "postDataToAPI")
        .mockImplementation(() => mockJsonPromiseMetaDataModel);
    const wrapper = mount(
        <AttachmentTable
        attachments={attachments}
        updateAttachments={updateAttachments}
        />
      );
      act(() => {
        wrapper
        .find(MaterialTable)
        .props()
        .actions[0].onClick({ target: { value: "" } }, {id:1 , name:"name A" , contentType:"contentType A" , attachmentFile:"attachmentFile A"});
      });

        wrapper.render();
        wrapper.update();
      //expectations
      expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
      expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/Document/DeleteAttachments?id=1');
      expect(fetchingMetaDataModel.mock.calls[0][1]).toBe(null);
      attachments.map((attachment, index) => {
        expect(wrapper.find("#link"+index).length).toBe(1);
        expect(wrapper.find("#link"+index).at(0).props().href).toBe(attachment.attachmentFile);
        expect(wrapper.find("#link"+index).at(0).props().download).toBe(attachment.name);
        expect(wrapper.find(`#download-attachment-button${attachment.id}`).length).toBe(1);
      });
      attachments.map((attachment, index) => {
        expect(wrapper.find(".onChangeFile"+attachment.id).length).toBe(1);
        expect(wrapper.find(".onChangeFile"+attachment.id).at(0).props().id).toBe(attachment.id);
      });

      expect(wrapper.find("#notifications").at(0).props().open).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().errorMessage).toStrictEqual([]);
      expect(wrapper.find(MaterialTable).at(0).props().data).toStrictEqual(attachments);
  });
 
  test("action[1]", () => {
    let attachments = [{id:1 , name:"name A" , contentType:"contentType A" , attachmentFile:"attachmentFile A"} , {id:2, name:"name B" , contentType:"contentType B", attachmentFile:"attachmentFile B"}];
    const updateAttachments = jest.fn();
    const wrapper = mount(
        <AttachmentTable
        attachments={attachments}
        updateAttachments={updateAttachments}
        /> ,{ attachTo: document.body }
      );
      const clickInputSpy = jest.spyOn(HTMLButtonElement.prototype, 'click');
      act(() => {
        wrapper
        .find(MaterialTable)
        .props()
        .actions[1].onClick({ target: { value: "" } }, {id:1 , name:"name A" , contentType:"contentType A" , attachmentFile:"attachmentFile A"});
      });

        wrapper.render();
        wrapper.update();
      //expectations
      expect(clickInputSpy).toHaveBeenCalledTimes(1);
      attachments.map((attachment, index) => {
        expect(wrapper.find("#link"+index).length).toBe(1);
        expect(wrapper.find("#link"+index).at(0).props().href).toBe(attachment.attachmentFile);
        expect(wrapper.find("#link"+index).at(0).props().download).toBe(attachment.name);
        expect(wrapper.find(`#download-attachment-button${attachment.id}`).length).toBe(1);
      });
      attachments.map((attachment, index) => {
        expect(wrapper.find(".onChangeFile"+attachment.id).length).toBe(1);
        expect(wrapper.find(".onChangeFile"+attachment.id).at(0).props().id).toBe(attachment.id);
      });

      expect(wrapper.find("#notifications").at(0).props().open).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().errorMessage).toStrictEqual([]);
      expect(wrapper.find(MaterialTable).at(0).props().data).toStrictEqual(attachments);
  });
 
  test("action[2] when null", () => {
    let attachments = [];
    const updateAttachments = jest.fn();
    const wrapper = mount(
        <AttachmentTable
        attachments={attachments}
        updateAttachments={updateAttachments}
        /> 
      );
      const clickInputSpy = jest.spyOn(HTMLInputElement.prototype, 'click');
      act(() => {
        wrapper
        .find(MaterialTable)
        .props()
        .actions[2].onClick({ target: { value: "" } }, {id:1 , name:"name A" , contentType:"contentType A" , attachmentFile:"attachmentFile A"});
      });

        wrapper.render();
        wrapper.update();
      //expectations
      expect(clickInputSpy).toHaveBeenCalledTimes(0);
      attachments.map((attachment, index) => {
        expect(wrapper.find("#link"+index).length).toBe(1);
        expect(wrapper.find("#link"+index).at(0).props().href).toBe(attachment.attachmentFile);
        expect(wrapper.find("#link"+index).at(0).props().download).toBe(attachment.name);
        expect(wrapper.find(`#download-attachment-button${attachment.id}`).length).toBe(1);
      });
      attachments.map((attachment, index) => {
        expect(wrapper.find(".onChangeFile"+attachment.id).length).toBe(1);
        expect(wrapper.find(".onChangeFile"+attachment.id).at(0).props().id).toBe(attachment.id);
      });

      expect(wrapper.find("#notifications").at(0).props().open).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().errorMessage).toStrictEqual([]);
      expect(wrapper.find(MaterialTable).at(0).props().data).toStrictEqual(attachments);
  });
 
  test("action[2] when (index == -1)", () => {
    let attachments =  [{id:1 , name:"name A" , contentType:"contentType A" , attachmentFile:"attachmentFile A"} , {id:2, name:"name B" , contentType:"contentType B", attachmentFile:"attachmentFile B"}];
    const updateAttachments = jest.fn();
    const wrapper = mount(
        <AttachmentTable
        attachments={attachments}
        updateAttachments={updateAttachments}
        /> 
      );
      const clickInputSpy = jest.spyOn(HTMLInputElement.prototype, 'click');
      act(() => {
        wrapper
        .find(MaterialTable)
        .props()
        .actions[2].onClick({ target: { value: "" } }, {id:3 , name:"name C" , contentType:"contentType C" , attachmentFile:"attachmentFile C"});
      });

        wrapper.render();
        wrapper.update();
      //expectations
      expect(clickInputSpy).toHaveBeenCalledTimes(0);
      attachments.map((attachment, index) => {
        expect(wrapper.find("#link"+index).length).toBe(1);
        expect(wrapper.find("#link"+index).at(0).props().href).toBe(attachment.attachmentFile);
        expect(wrapper.find("#link"+index).at(0).props().download).toBe(attachment.name);
        expect(wrapper.find(`#download-attachment-button${attachment.id}`).length).toBe(1);
      });
      attachments.map((attachment, index) => {
        expect(wrapper.find(".onChangeFile"+attachment.id).length).toBe(1);
        expect(wrapper.find(".onChangeFile"+attachment.id).at(0).props().id).toBe(attachment.id);
      });

      expect(wrapper.find("#notifications").at(0).props().open).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().errorMessage).toStrictEqual([]);
      expect(wrapper.find(MaterialTable).at(0).props().data).toStrictEqual(attachments);
  });
 
  test("action[2] when (index !== -1)", () => {
    let attachments =  [{id:1 , name:"name A" , contentType:"contentType A" , attachmentFile:"attachmentFile A"} , {id:2, name:"name B" , contentType:"contentType B", attachmentFile:"attachmentFile B"}];
    const updateAttachments = jest.fn();
    const wrapper = mount(
        <AttachmentTable
        attachments={attachments}
        updateAttachments={updateAttachments}
        /> 
      );
      const clickInputSpy = jest.spyOn(HTMLInputElement.prototype, 'click');
      act(() => {
        wrapper
        .find(MaterialTable)
        .props()
        .actions[2].onClick({ target: { value: "" } }, {id:1 , name:"name A" , contentType:"contentType A" , attachmentFile:"attachmentFile A"});
      });

        wrapper.render();
        wrapper.update();
      //expectations
      expect(clickInputSpy).toHaveBeenCalledTimes(1);
      attachments.map((attachment, index) => {
        expect(wrapper.find("#link"+index).length).toBe(1);
        expect(wrapper.find("#link"+index).at(0).props().href).toBe(attachment.attachmentFile);
        expect(wrapper.find("#link"+index).at(0).props().download).toBe(attachment.name);
        expect(wrapper.find(`#download-attachment-button${attachment.id}`).length).toBe(1);
      });
      attachments.map((attachment, index) => {
        expect(wrapper.find(".onChangeFile"+attachment.id).length).toBe(1);
        expect(wrapper.find(".onChangeFile"+attachment.id).at(0).props().id).toBe(attachment.id);
      });

      expect(wrapper.find("#notifications").at(0).props().open).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notifications").at(0).props().errorMessage).toStrictEqual([]);
      expect(wrapper.find(MaterialTable).at(0).props().data).toStrictEqual(attachments);
  });

});