import React from "react";
import ReactDom from "react-dom";
import CreateDocumentClass from "../../../components/CreateModel/DocumentClassComponents/CreateDocumentClass.js";
import { cleanup } from "@testing-library/react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import TextField from "@material-ui/core/TextField";
import { act } from "react-dom/test-utils";
import Button from "@material-ui/core/Button";
import * as PostDataMock from "../../../api/PostData";
import { BrowserRouter as Router } from "react-router-dom";
import { Redirect, MemoryRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { store } from "react-notifications-component";
afterEach(cleanup);
describe("CreateDocumentClass", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(<CreateDocumentClass />, div);
  });

  test("matches snapshot", () => {
    const wrapper = shallow(<CreateDocumentClass />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it("Submit data functionality when res is undefined", () => {
    let wrapper = mount(
      <Router>
        <CreateDocumentClass />
      </Router>
    );
  const notificationMock =    jest.spyOn(store, "addNotification");
    const PostMock = jest.spyOn(PostDataMock, "postDataToAPI");
    const preventDefaultMock = jest.fn();
    expect(wrapper.find(TextField).at(0).props().value).toBe("");
    act(() => {
      wrapper
        .find(TextField)
        .at(0)
        .props()
        .onChange({ target: { value: "test2" } });
    });
    wrapper.update();
    expect(wrapper.find(TextField).at(0).props().value).toBe("test2");
    //click the button
    act(() => {
      wrapper
        .find(".onSubmitForm")
        .at(0)
        .props()
        .onSubmit({
          target: { value: "" },
          preventDefault: preventDefaultMock,
        });
    });
    expect(PostMock).toHaveBeenCalledTimes(1);
    expect(PostMock.mock.calls[0][0]).toStrictEqual(
      "/api/DocumentClass/AddNewDocumentClass"
    );
    expect(PostMock.mock.calls[0][1]).toStrictEqual({
      documentClassName: "test2",
      "error": false,
      "errorMessage":  [],
       "open": false,
      redirect: null,
    });
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    act(() => {
      wrapper.render();
    });
    wrapper.update();
    expect(notificationMock).toHaveBeenCalledTimes(0);
    expect(wrapper.find(Redirect).length).toBe(0);
  });

  it("Submit data , Redirect functionality", () => {
    //test the  routering functionality of My account / Login
    const component = renderer
      .create(
        <MemoryRouter>
          <Redirect to="../../../components/CreateModel/Document Class" />
        </MemoryRouter>
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  // it("Submit data functionality when res is ok", () => {
  //   const mockSuccessResponse ={ok :true};
  //   const mockJsonPromise = Promise.resolve(mockSuccessResponse);
  //   global.fetch = require('jest-fetch-mock');
  //   fetch.mockResponse(mockJsonPromise);
  //   const PostMock = jest.spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromise);;
  //   const preventDefaultMock = jest.fn();
  //   let wrapper;
  //   return mockJsonPromise.then(() => {
  //      wrapper = mount(
  //       <Router>
  //         <CreateDocumentClass />
  //       </Router>
  //     );
  //     expect(wrapper.find(TextField).at(0).props().value).toBe("");
  //   act(() => {
  //     wrapper
  //       .find(TextField)
  //       .at(0)
  //       .props()
  //       .onChange({ target: { value: "test2" } });
  //   });
  //   wrapper.update();
  //   expect(wrapper.find(TextField).at(0).props().value).toBe("test2");
  //   //click the button
  //   act(() => {
  //     wrapper
  //       .find(".onSubmitForm")
  //       .at(0)
  //       .props()
  //       .onSubmit({
  //         target: { value: "" },
  //         preventDefault: preventDefaultMock,
  //       });
  //   });
  //   }).then(() => {
  //     wrapper.update();
  //     wrapper.render();
  //     //expectation
      
  //   expect(PostMock).toHaveBeenCalledTimes(1);
  //   expect(PostMock.mock.calls[0][0]).toStrictEqual(
  //     "/api/DocumentClass/AddNewDocumentClass"
  //   );
  //   expect(PostMock.mock.calls[0][1]).toStrictEqual({
  //     documentClassName: "test2",
  //     "error": false,
  //      "errorMessage":  [],
  //       "open": false,
  //     redirect: null,
  //   });
  //   expect(preventDefaultMock).toHaveBeenCalledTimes(1);
  //   expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
  //   expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
  //   });
  // });

  // it("Submit data functionality when res is not ok", () => {
  //  const mockJasonPromise =Promise.resolve({error:["error message1" ,"error message2" ]});
  //   const mockSuccessResponse ={ok :false , status:"successfully" , statusText:"get success message", json:()=>{return mockJasonPromise }};
  //   const mockJsonPromise = Promise.resolve(mockSuccessResponse);
  //   global.fetch = require('jest-fetch-mock');
  //   fetch.mockResponse(mockJsonPromise);
  //   const PostMock = jest.spyOn(PostDataMock, "postDataToAPI").mockReturnValue(mockJsonPromise);
  //   const preventDefaultMock = jest.fn();
  //   let wrapper;
  //   return mockJsonPromise.then(() => {
  //      wrapper = mount(
  //       <Router>
  //         <CreateDocumentClass />
  //       </Router>
  //     );
  //     expect(wrapper.find(TextField).at(0).props().value).toBe("");
  //   act(() => {
  //     wrapper
  //       .find(TextField)
  //       .at(0)
  //       .props()
  //       .onChange({ target: { value: "test2" } });
  //   });
  //   wrapper.update();
  //   expect(wrapper.find(TextField).at(0).props().value).toBe("test2");
  //   //click the button
  //   act(() => {
  //     wrapper
  //       .find(".onSubmitForm")
  //       .at(0)
  //       .props()
  //       .onSubmit({
  //         target: { value: "" },
  //         preventDefault: preventDefaultMock,
  //       });
  //   });
  //   }).then(() => {
  //     wrapper.update();
  //     wrapper.render();
  //     //expectation
      
  //   expect(PostMock).toHaveBeenCalledTimes(1);
  //   expect(PostMock.mock.calls[0][0]).toStrictEqual(
  //     "/api/DocumentClass/AddNewDocumentClass"
  //   );
  //   expect(PostMock.mock.calls[0][1]).toStrictEqual({
  //     documentClassName: "test2",
  //     "error": false,
  //      "errorMessage":  [],
  //       "open": false,
  //     redirect: null,
  //   });
  //   expect(preventDefaultMock).toHaveBeenCalledTimes(1);
  //   expect(wrapper.find(Redirect).length).toBe(0);
  //   }).then(() => {
  //     wrapper.update();
  //     wrapper.render();
  //   expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
  //   expect(wrapper.find("#notification").at(0).props().error).toBeTruthy();
  //   expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual(["error message1" ,"error message2" ]);
  //   });;
  // });
});
