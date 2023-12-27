import React from "react";
import ReactDom from "react-dom";
import SubmissionStep from "../../../components/User/CreateDocument/SubmissionStep.js";
import Notifications from "../../../components/Admin/Notifications.js";
import { cleanup } from "@testing-library/react";
import { mount } from "enzyme";
import Form from "react-jsonschema-form";
import { shallow } from "enzyme";
import { act } from "react-dom/test-utils";
import { Button, Typography, CircularProgress } from "@material-ui/core";
import { Redirect } from "react-router-dom";
afterEach(cleanup);
describe("SubmissionStep", () => {
  test("renders without crashing", () => {
    const div = document.createElement("div");
    let response=null;
    let uploading= true;
    let errorText="";
    const handleResubmit = jest.fn();
    ReactDom.render(
      <SubmissionStep
      response={response}
      uploading={uploading}
      errorText={errorText}
      handleResubmit={handleResubmit}
      />,
      div
    );
  });

  it("matches the snapshot", () => {
    let response=null;
    let uploading= true;
    let errorText="";
    const handleResubmit = jest.fn();
    const wrapper = mount(
        <SubmissionStep
        response={response}
        uploading={uploading}
        errorText={errorText}
        handleResubmit={handleResubmit}
        />
    );
    expect(wrapper).toMatchSnapshot();
  });

  test("rendering when uploading is true", () => {
    let response=null;
    let uploading= true;
    let errorText="";
    const handleResubmit = jest.fn();
    const wrapper = shallow(
        <SubmissionStep
        response={response}
        uploading={uploading}
        errorText={errorText}
        handleResubmit={handleResubmit}
        />
    );
   wrapper.update();
   wrapper.render();
   expect(wrapper.find(CircularProgress).length).toBe(1);
   expect(wrapper.find(Typography).text()).toBe("creatdocument_uploadingfilleddoc");
  });
  

  test("rendering when uploading is false and response is ok", () => {
    let response={ok:true};
    let uploading= false;
    let errorText="";
    let errors="errors";
    const consoleMock = jest.fn();
    window.location.reload = consoleMock;
    const handleResubmit = jest.fn();
    const handleReset = jest.fn();
    const wrapper = shallow(
        <SubmissionStep
        response={response}
        uploading={uploading}
        errorText={errorText}
        errors={errors}
        handleResubmit={handleResubmit}
        handleReset={handleReset}
        />
    );
   wrapper.update();
   wrapper.render();
   expect(wrapper.find("#notifications").length).toBe(1);
   expect(wrapper.find("#notifications").at(0).props().open).toBeFalsy();
   expect(wrapper.find("#notifications").at(0).props().error).toBeFalsy();
   expect(wrapper.find("#notifications").at(0).props().errorMessage).toBe(errors);
   expect(wrapper.find(Button).text()).toBe("creatdocument_addnewdoc");
   expect(wrapper.find(Redirect).length).toBe(0);
   //test onSubmit functionality
   act(() => {
    wrapper
      .find(Button)
      .props()
      .onClick();
  });
  wrapper.update();
 //expectation for click event 
  expect(handleReset).toHaveBeenCalledTimes(1);
  expect(wrapper.find(Redirect).length).toBe(1);
  expect(wrapper.find(Redirect).at(0).props().to).toBe("/create-document");
  });
  
  test("rendering when uploading is false and response is not ok", () => {
    let response={ok:false ,status:"failed"};
    let uploading= false;
    let errorText="uncaught error";
    let errors="errors";
    const consoleMock = jest.fn();
    window.location.reload = consoleMock;
    const handleResubmit = jest.fn();
    const handleReset = jest.fn();
    const wrapper = shallow(
        <SubmissionStep
        response={response}
        uploading={uploading}
        errorText={errorText}
        errors={errors}
        handleResubmit={handleResubmit}
        handleReset={handleReset}
        />
    );
   wrapper.update();
   wrapper.render();
   expect(wrapper.find("#notifications").length).toBe(1);
   expect(wrapper.find("#notifications").at(0).props().open).toBeFalsy();
   expect(wrapper.find("#notifications").at(0).props().error).toBeTruthy();
   expect(wrapper.find("#notifications").at(0).props().errorMessage).toBe(errors);
   expect(wrapper.find(Button).text()).toBe("reset_doc");
   expect(wrapper.find(Redirect).length).toBe(0);
   //test setOpen functionality
   act(() => {
    wrapper
      .find("#notifications")
      .props()
      .setOpen(true);
  });
   //test onSubmit functionality
   act(() => {
    wrapper
      .find(Button)
      .props()
      .onClick();
  });
  wrapper.update();
  expect(wrapper.find("#notifications").at(0).props().open).toBeTruthy();
 //expectation for click event 
 expect(wrapper.find(Redirect).length).toBe(1);
  expect(handleReset).toHaveBeenCalledTimes(1);
  expect(wrapper.find(Redirect).at(0).props().to).toBe("/create-document");
  }); 
 
});