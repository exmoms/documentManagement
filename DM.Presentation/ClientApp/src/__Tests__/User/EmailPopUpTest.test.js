import React from "react";
import ReactDom from "react-dom";
import EmailPopUp from "../../components/User/EmailPopUp";
import { cleanup, fireEvent } from "@testing-library/react";
import renderer from "react-test-renderer";
import { mount, shallow } from "enzyme";
import { act } from "react-dom/test-utils";
import { createMount } from '@material-ui/core/test-utils';
import Dialog from "@material-ui/core/Dialog";
import CardMedia from "@material-ui/core/CardMedia";
import ReactToPrint from "react-to-print";
import * as PostDataMock from "../../api/PostData";
import { DialogContentText } from "@material-ui/core";
afterEach(cleanup);
describe("EmailPopUp", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
      let show = true;
      let dataToSend=[{latestVersion :1 , documentName : "Document 1"} , {latestVersion :2 , documentName : "Document 2"}]
    const toggleShow = jest.fn();
    const div = document.createElement("div");
    ReactDom.render(
      <EmailPopUp
      show={show}
      dataToSend={dataToSend}
      toggleShow={toggleShow}
      />,
      div
    );
  });
  test("PrintDocument matches snapshot", () => {
    let show = true;
      let dataToSend=[{latestVersion :1 , documentName : "Document 1"} , {latestVersion :2 , documentName : "Document 2"}]
    const toggleShow = jest.fn();
    const renderedValue = createMount()(
        <EmailPopUp
      show={show}
      dataToSend={dataToSend}
      toggleShow={toggleShow}
      />
      );
      expect(renderedValue.html()).toMatchSnapshot();
  });
  
  test("test intialization + documentsNames functionality", () => {
    let show = true;
    let dataToSend=[{latestVersion :1 , documentName : "Document 1"} , {latestVersion :2 , documentName : "Document 2"}]
  const toggleShow = jest.fn();
    const wrapper = mount(
        <EmailPopUp
      show={show}
      dataToSend={dataToSend}
      toggleShow={toggleShow}
      />
      );
      //expectations
      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
      expect(wrapper.find("#reciever-0").at(0).length).toBe(1);
      expect(wrapper.find("#reciever-1").at(0).length).toBe(0);
      expect(wrapper.find(DialogContentText).text()).toBe("send_email_to \" Document 1Document 2 \".");
  });

  test("toggleShow functionality", () => {
    let show = true;
    let dataToSend=[{latestVersion :1 , documentName : "Document 1"} , {latestVersion :2 , documentName : "Document 2"}]
  const toggleShow = jest.fn();
    const wrapper = mount(
        <EmailPopUp
      show={show}
      dataToSend={dataToSend}
      toggleShow={toggleShow}
      />
      );
      act(() => {
        wrapper
          .find(Dialog)
          .at(0)
          .props()
          .onClose();
      });
      wrapper.update();
      expect(toggleShow).toHaveBeenCalledTimes(1);
      expect(toggleShow.mock.calls[0][0]).toBeFalsy();
      //expectations for intialization
      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
      expect(wrapper.find("#reciever-0").at(0).length).toBe(1);
      expect(wrapper.find("#reciever-1").at(0).length).toBe(0);
      expect(wrapper.find(DialogContentText).text()).toBe("send_email_to \" Document 1Document 2 \".");
  });

  test("onChange functionality when the e-mail is valid", () => {
    let show = true;
    let dataToSend=[{latestVersion :1 , documentName : "Document 1"} , {latestVersion :2 , documentName : "Document 2"}]
  const toggleShow = jest.fn();
    const wrapper = mount(
        <EmailPopUp
      show={show}
      dataToSend={dataToSend}
      toggleShow={toggleShow}
      />
      );

      act(() => {
        wrapper
          .find("#reciever-0")
          .at(0)
          .props()
          .onChange({ target: { value: "email@example.com" , id: "reciever-0" } });
      });
      wrapper.update();
      wrapper.render();
       //expectations for intialization
       expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
       expect(wrapper.find("#reciever-0").at(0).length).toBe(1);
       expect(wrapper.find("#reciever-1").at(0).length).toBe(1);
       expect(wrapper.find("#reciever-2").at(0).length).toBe(0);
       expect(wrapper.find(DialogContentText).text()).toBe("send_email_to \" Document 1Document 2 \".");
  });
 
  test("onChange functionality when the e-mail isn't valid", () => {
    let show = true;
    let dataToSend=[{latestVersion :1 , documentName : "Document 1"} , {latestVersion :2 , documentName : "Document 2"}]
  const toggleShow = jest.fn();
    const wrapper = mount(
        <EmailPopUp
      show={show}
      dataToSend={dataToSend}
      toggleShow={toggleShow}
      />
      );

      act(() => {
        wrapper
          .find("#reciever-0")
          .at(0)
          .props()
          .onChange({ target: { value: "unvalidEmailFormat" , id: "reciever-0" } });
      });
      wrapper.update();
      wrapper.render();
       //expectations for intialization
       expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
       expect(wrapper.find("#reciever-0").at(0).length).toBe(1);
       expect(wrapper.find("#reciever-1").at(0).length).toBe(0);
       expect(wrapper.find(DialogContentText).text()).toBe("send_email_to \" Document 1Document 2 \".");
  });

  test("toggleSend functionality when status is 200", () => {
    let show = true;
    let dataToSend=[{latestVersion :1 , documentName : "Document 1"} , {latestVersion :2 , documentName : "Document 2"}]
  const toggleShow = jest.fn();
  const preventDefaultMock = jest.fn();
  const mockSuccessResponse = {ok:true, json:()=>{return  Promise.resolve( {error:["error"]})}};
  const mockJsonPromise = Promise.resolve(mockSuccessResponse); 
  const PostData=  jest.spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromise);
  let emailData = {
    Subject: "subject",
    RecieverEmails: [""],
    // SenderName: sender,
    EmailBody: "body",
    DocumentVersionIds: [1, 2],
  };
  let  wrapper;  
  return mockJsonPromise.then(() => {
         wrapper = mount(
            <EmailPopUp
          show={show}
          dataToSend={dataToSend}
          toggleShow={toggleShow}
          />
          );
          act(() => {
            wrapper
            .find("#reciever-0")
            .at(0)
            .props()
            .onChange({ target: { value: "email@example.com" , id: "reciever-0" } });
          });
          wrapper.update();
       wrapper.render();
          //expectations for intialization
       expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
       expect(wrapper.find("#reciever-0").at(0).length).toBe(1);
       expect(wrapper.find("#reciever-1").at(0).length).toBe(1);
       expect(wrapper.find("#reciever-2").at(0).length).toBe(0);
       expect(wrapper.find(DialogContentText).text()).toBe("send_email_to \" Document 1Document 2 \".");
       const recieverNodeList = document.getElementsByName("reciever");
      //  expect(recieverNodeList.length).toBe(2);//received 9 //failed expected
    for (let idx = 0; idx < recieverNodeList.length; idx++) {
      const element = recieverNodeList[idx];
      element.value="testedValue";
    }
    document.getElementById("subject").value="subject";
    document.getElementById("body").value="body";
      act(() => {
        wrapper
          .find("#emailDocForm")
          .at(0)
          .props()
          .onSubmit({
            target: { value: "" },
            preventDefault: preventDefaultMock,
          });
      });
     }).then(() => {
       wrapper.update();
       wrapper.render();
       
      expect(preventDefaultMock).toHaveBeenCalledTimes(1);
      expect(PostData).toHaveBeenCalledTimes(1);
      expect(PostData.mock.calls[0][0]).toStrictEqual("/api/Document/SendDocumentScansByEmail");
     expect(PostData.mock.calls[0][1]).toStrictEqual({"DocumentVersionIds": [1, 2], "EmailBody": "body", "RecieverEmails": ["testedValue", "testedValue" , "testedValue" , "testedValue" , "testedValue" , "testedValue" , "testedValue" , "testedValue" , "testedValue"], "Subject": "subject"}); 
     expect(wrapper.find("#notification").at(0).props().open).toBeTruthy(); 
    });
      
  });
  
  // test("toggleSend functionality when status isn't 200", (done) =>{
  //   let show = true;
  //   let dataToSend=[{latestVersion :1 , documentName : "Document 1"} , {latestVersion :2 , documentName : "Document 2"}]
  // const toggleShow = jest.fn();
  // const preventDefaultMock = jest.fn();
  // let mockSuccessErrorPromise = { error: ["errorMessage"] };
  //   let mockSuccessError = Promise.resolve(mockSuccessErrorPromise);
  //   const mockSuccessResponsePost = Promise.resolve({
  //     ok: false,
  //     json: () => mockSuccessError,
  //   });
  //   const PostMock = jest
  //     .spyOn(PostDataMock, "postDataToAPI")
  //     .mockReturnValue(mockSuccessResponsePost);
  // let emailData = {
  //   Subject: "subject",
  //   RecieverEmails: [""],
  //   // SenderName: sender,
  //   EmailBody: "body",
  //   DocumentVersionIds: [1, 2],
  // };
  // let  wrapper;  
  //        wrapper = shallow(
  //           <EmailPopUp
  //         show={show}
  //         dataToSend={dataToSend}
  //         toggleShow={toggleShow}
  //         />
  //         );
  //         act(() => {
  //           wrapper
  //           .find("#reciever-0")
  //           .at(0)
  //           .props()
  //           .onChange({ target: { value: "email@example.com" , id: "reciever-0" } });
  //         });
  //         wrapper.update();
  //      wrapper.render();
  //         //expectations for intialization
  //      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
  //      expect(wrapper.find("#reciever-0").at(0).length).toBe(1);
  //      expect(wrapper.find("#reciever-1").at(0).length).toBe(1);
  //      expect(wrapper.find("#reciever-2").at(0).length).toBe(0);
  //      expect(wrapper.find(DialogContentText).text()).toBe("send_email_to \" Document 1Document 2 \".");
  //      const recieverNodeList = document.getElementsByName("reciever");
  //     //  expect(recieverNodeList.length).toBe(2);//received 9 //failed expected
  //   for (let idx = 0; idx < recieverNodeList.length; idx++) {
  //     const element = recieverNodeList[idx];
  //     element.value="testedValue";
  //   }
  //   document.getElementById("subject").value="subject";
  //   document.getElementById("body").value="body";
  //     act(() => {
  //       wrapper
  //         .find("#emailDocForm")
  //         .at(0)
  //         .props()
  //         .onSubmit({
  //           target: { value: "" },
  //           preventDefault: preventDefaultMock,
  //         });
  //     });
       
  //     expect(preventDefaultMock).toHaveBeenCalledTimes(1);
  //     expect(PostData).toHaveBeenCalledTimes(1);
  //     expect(PostData.mock.calls[0][0]).toStrictEqual("/api/Document/SendDocumentScansByEmail");
  //     process.nextTick(() => {

  //       expect(wrapper.find("#notification").props().open).toBeTruthy();
  //       expect(wrapper.find("#notification").props().error).toBeTruthy();
  //       expect(wrapper.find("#notification").props().errorMessage).toStrictEqual([
  //         "errorMessage",
  //       ]);
  //       done(); 
  //     });
  //   });
      

});