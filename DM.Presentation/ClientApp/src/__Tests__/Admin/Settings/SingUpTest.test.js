import React from "react";
import ReactDom from "react-dom";
import SingUp from "../../../components/Admin/Settings/SingUp";
import { cleanup } from "@testing-library/react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import TextField from "@material-ui/core/TextField";
import { act } from "react-dom/test-utils";
import Button from "@material-ui/core/Button";
import { BrowserRouter as Router } from "react-router-dom";
import * as FetchMock from "../../../api/FetchData";
import * as PostDataMock from "../../../api/PostData";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import LinearProgress from "@material-ui/core/LinearProgress";
afterEach(cleanup);
describe("SingUp", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(
        <SingUp />,
      div
    );
  });

  test("matches snapshot", () => {
    const wrapper = shallow(
        <SingUp/>
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test("intialization ProfilePopUpByAdmin", () => {
  let  wrapper = mount(<SingUp/>) ;
  expect(wrapper.find("#demo-simple-select-outlined").at(0).props().value).toBe("");
  expect(wrapper.find(LinearProgress).length).toBe(0);
  expect(wrapper.find("#notification").at(0).props().open).toBeFalsy();
  expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
  expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]);
});

test("handelSubmit functionality when userName.length === 0", () => {
    let  wrapper = mount(<SingUp/>) ;
    const preventDefaultMock = jest.fn();
    act(() => {
        wrapper
          .find("#submitNewUserForm")
          .at(0)
          .props()
          .onSubmit({ preventDefault:preventDefaultMock});
      });
      wrapper.render();
        wrapper.update();
        expect(preventDefaultMock).toHaveBeenCalledTimes(1);
        expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
        expect(wrapper.find("#notification").at(0).props().error).toBeTruthy();
        expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual(["userName_error"]);
  });

  test("handelSubmit functionality when (email.indexOf(@) === -1 || email.indexOf(.) === -1) and onchange when name:signup-userName ; name=signup-email", () => {
    let  wrapper = mount(<SingUp/>) ;
    const preventDefaultMock = jest.fn();
    act(() => {
        wrapper
          .find("#signup-firstName")
          .at(0)
          .props()
          .onChange({ target: { value: "userName" ,name:"signup-userName"} });
      });
        wrapper.update();
        act(() => {
            wrapper
              .find("#signup-firstName")
              .at(0)
              .props()
              .onChange({ target: { value: "unvalidEmailValue" ,name:"signup-email"} });
          });
            wrapper.update();
    act(() => {
        wrapper
          .find("#submitNewUserForm")
          .at(0)
          .props()
          .onSubmit({ preventDefault:preventDefaultMock});
      });
      wrapper.render();
        wrapper.update();
        expect(preventDefaultMock).toHaveBeenCalledTimes(1);
        expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
        expect(wrapper.find("#notification").at(0).props().error).toBeTruthy();
        expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual(["email_error"]);
  });

  test("handelSubmit functionality when (role === ....) ", () => {
    let  wrapper = mount(<SingUp/>) ;
    const preventDefaultMock = jest.fn();
    act(() => {
        wrapper
          .find("#signup-firstName")
          .at(0)
          .props()
          .onChange({ target: { value: "userName" ,name:"signup-userName"} });
      });
        wrapper.update();
        act(() => {
            wrapper
              .find("#signup-firstName")
              .at(0)
              .props()
              .onChange({ target: { value: "test.tested@hotmail.com" ,name:"signup-email"} });
          });
            wrapper.update();
    act(() => {
        wrapper
          .find("#submitNewUserForm")
          .at(0)
          .props()
          .onSubmit({ preventDefault:preventDefaultMock});
      });
      wrapper.render();
        wrapper.update();
        expect(preventDefaultMock).toHaveBeenCalledTimes(1);
        expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
        expect(wrapper.find("#notification").at(0).props().error).toBeTruthy();
        expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual(["role_error"]);
  });

  test("handelSubmit functionality when (password.length < 8 || confirmPassword.length > 12) and onchange when name:signup-userName ; name=signup-email ; name=role", () => {
    let  wrapper = mount(<SingUp/>) ;
    const preventDefaultMock = jest.fn();
    act(() => {
        wrapper
          .find("#signup-firstName")
          .at(0)
          .props()
          .onChange({ target: { value: "userName" ,name:"signup-userName"} });
      });
        wrapper.update();
        act(() => {
            wrapper
              .find("#signup-firstName")
              .at(0)
              .props()
              .onChange({ target: { value: "test.tested@hotmail.com" ,name:"signup-email"} });
          });
            wrapper.update();
            act(() => {
                wrapper
                  .find("#signup-firstName")
                  .at(0)
                  .props()
                  .onChange({ target: { value: "role" ,name:"role"} });
              });
                wrapper.update();
                act(() => {
                    wrapper
                      .find("#signup-firstName")
                      .at(0)
                      .props()
                      .onChange({ target: { value: "unvalid" ,name:"signup-password"} });
                  });
                    wrapper.update();
    act(() => {
        wrapper
          .find("#submitNewUserForm")
          .at(0)
          .props()
          .onSubmit({ preventDefault:preventDefaultMock});
      });
      wrapper.render();
        wrapper.update();
        expect(preventDefaultMock).toHaveBeenCalledTimes(1);
        expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
        expect(wrapper.find("#notification").at(0).props().error).toBeTruthy();
        expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual(["password_charachters_no"]);
  });

  test("handelSubmit functionality when (password !== confirmPassword) and onchange when name:signup-userName ; name=signup-email ; name=role , name=signup-password ,name:signup-confirmPassword ", () => {
    let  wrapper = mount(<SingUp/>) ;
    const preventDefaultMock = jest.fn();
    act(() => {
        wrapper
          .find("#signup-firstName")
          .at(0)
          .props()
          .onChange({ target: { value: "userName" ,name:"signup-userName"} });
      });
        wrapper.update();
        act(() => {
            wrapper
              .find("#signup-firstName")
              .at(0)
              .props()
              .onChange({ target: { value: "test.tested@hotmail.com" ,name:"signup-email"} });
          });
            wrapper.update();
            act(() => {
                wrapper
                  .find("#signup-firstName")
                  .at(0)
                  .props()
                  .onChange({ target: { value: "role" ,name:"role"} });
              });
                wrapper.update();
                act(() => {
                    wrapper
                      .find("#signup-firstName")
                      .at(0)
                      .props()
                      .onChange({ target: { value: "validPassword" ,name:"signup-password"} });
                  });
                    wrapper.update();
                    act(() => {
                        wrapper
                          .find("#signup-firstName")
                          .at(0)
                          .props()
                          .onChange({ target: { value: "mismatch" ,name:"signup-confirmPassword"} });
                      });
                        wrapper.update();
    act(() => {
        wrapper
          .find("#submitNewUserForm")
          .at(0)
          .props()
          .onSubmit({ preventDefault:preventDefaultMock});
      });
      wrapper.render();
        wrapper.update();
        expect(preventDefaultMock).toHaveBeenCalledTimes(1);
        expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
        expect(wrapper.find("#notification").at(0).props().error).toBeTruthy();
        expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual(["password_mismatch"]);
  });

  test("handelSubmit functionality when is ok ", () => {
    const updateUserTable = jest.fn();
    let  wrapper = mount(<SingUp updateUserTable ={updateUserTable}/>) ;
    const preventDefaultMock = jest.fn();
    const mockSuccessResponsePost ={ok :true};
    const mockJsonPromisePost = Promise.resolve(mockSuccessResponsePost);
    const PostMock=  jest.spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromisePost);
    act(() => {
        wrapper
          .find("#signup-firstName")
          .at(0)
          .props()
          .onChange({ target: { value: "userName" ,name:"signup-userName"} });
      });
        wrapper.update();
        act(() => {
            wrapper
              .find("#signup-firstName")
              .at(0)
              .props()
              .onChange({ target: { value: "test.tested@hotmail.com" ,name:"signup-email"} });
          });
            wrapper.update();
            act(() => {
                wrapper
                  .find("#signup-firstName")
                  .at(0)
                  .props()
                  .onChange({ target: { value: "Admin" ,name:"role"} });
              });
                wrapper.update();
                act(() => {
                    wrapper
                      .find("#signup-firstName")
                      .at(0)
                      .props()
                      .onChange({ target: { value: "Password1" ,name:"signup-password"} });
                  });
                    wrapper.update();
                    act(() => {
                        wrapper
                          .find("#signup-firstName")
                          .at(0)
                          .props()
                          .onChange({ target: { value: "Password1" ,name:"signup-confirmPassword"} });
                      });
                        wrapper.update();
    return mockJsonPromisePost.then(() => {
    act(() => {
        wrapper
          .find("#submitNewUserForm")
          .at(0)
          .props()
          .onSubmit({ preventDefault:preventDefaultMock});
      });
    }).then(() => {
      wrapper.update();
      wrapper.render();
        // expect(onreadystatechangeMock).toHaveBeenCalledTimes(1);
        expect(preventDefaultMock).toHaveBeenCalledTimes(1);
        expect(PostMock).toHaveBeenCalledTimes(1);
      expect(PostMock.mock.calls[0][0]).toBe("/api/user/Register");
      expect(PostMock.mock.calls[0][1]).toStrictEqual({"ConfirmPassword": "Password1", "Email": "test.tested@hotmail.com", "Password": "Password1", "Roles": [{"isSelected": true, "roleName": "Admin"}, {"isSelected": false, "roleName": "User"}], "UserName": "userName"});
      expect(updateUserTable).toHaveBeenCalledTimes(1);
      expect(updateUserTable.mock.calls[0][0]).toBeTruthy();
      expect(wrapper.find(LinearProgress).length).toBe(0);
      expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
      expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]);
    });
  });

  test("handelSubmit functionality when role =user and isn't ok", (done) =>  {
    
    const preventDefaultMock = jest.fn();
    let mockSuccessErrorPromise = { error: ["errorMessage"] };
    let mockSuccessError = Promise.resolve(mockSuccessErrorPromise);
    const mockSuccessResponsePost = Promise.resolve({
      ok: false,
      json: () => mockSuccessError,
    });
    const PostMock = jest
      .spyOn(PostDataMock, "postDataToAPI")
      .mockReturnValue(mockSuccessResponsePost);
      let  wrapper = shallow(<SingUp/>) ;
    act(() => {
        wrapper
          .find("#signup-firstName")
          .at(0)
          .props()
          .onChange({ target: { value: "userName" ,name:"signup-userName"} });
      });
        wrapper.update();
        act(() => {
            wrapper
              .find("#signup-firstName")
              .at(0)
              .props()
              .onChange({ target: { value: "test.tested@hotmail.com" ,name:"signup-email"} });
          });
            wrapper.update();
            act(() => {
                wrapper
                  .find("#signup-firstName")
                  .at(0)
                  .props()
                  .onChange({ target: { value: "User" ,name:"role"} });
              });
                wrapper.update();
                act(() => {
                    wrapper
                      .find("#signup-firstName")
                      .at(0)
                      .props()
                      .onChange({ target: { value: "Password1" ,name:"signup-password"} });
                  });
                    wrapper.update();
                    act(() => {
                        wrapper
                          .find("#signup-firstName")
                          .at(0)
                          .props()
                          .onChange({ target: { value: "Password1" ,name:"signup-confirmPassword"} });
                      });
                        wrapper.update();
    act(() => {
        wrapper
          .find("#submitNewUserForm")
          .at(0)
          .props()
          .onSubmit({ preventDefault:preventDefaultMock});
      });
      ;
        wrapper.update();
        wrapper.render()
        //expect(onreadystatechangeMock).toHaveBeenCalledTimes(1);
        expect(preventDefaultMock).toHaveBeenCalledTimes(1);
        expect(PostMock).toHaveBeenCalledTimes(1);
      expect(PostMock.mock.calls[0][0]).toBe("/api/user/Register");
      expect(PostMock.mock.calls[0][1]).toStrictEqual({"ConfirmPassword": "Password1", "Email": "test.tested@hotmail.com", "Password": "Password1", "Roles": [{"isSelected": false, "roleName": "Admin"}, {"isSelected": true, "roleName": "User"}], "UserName": "userName"});
      process.nextTick(() => {

        expect(wrapper.find("#notification").props().open).toBeTruthy();
        expect(wrapper.find("#notification").props().error).toBeTruthy();
        expect(wrapper.find("#notification").props().errorMessage).toStrictEqual([
          "errorMessage",
        ]);
        done(); 
      });
    });
});