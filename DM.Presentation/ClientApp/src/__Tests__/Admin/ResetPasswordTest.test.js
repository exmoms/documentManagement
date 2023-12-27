
import React from "react";
import ReactDom from "react-dom";
import ResetPassword from "../../components/Admin/ResetPassword";
import { cleanup } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { shallow , mount} from "enzyme";
import toJSON from "enzyme-to-json";
import { MemoryRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { Link } from "react-router-dom";
import { Suspense } from "react";
import * as FetchMock from "../../api/FetchData";
import * as PostDataMock from "../../api/PostData";
import * as ContextAuth from "../../context/auth";
import MenuItem from "@material-ui/core/MenuItem";
import { act } from "react-dom/test-utils";
import List from "@material-ui/core/List";
import {Redirect } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
afterEach(cleanup);
describe("ResetPassword", () => {
   afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(
        <ResetPassword/>,div
    );
  });

  test("matches snapshot", () => {
    const wrapper = shallow(
        <ResetPassword/>
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  
  test("intialization when sent_successfuly is false", () => {
    let  wrapper = mount(<ResetPassword/>);
    expect(wrapper.find("#outlined-adornment-password").at(0).props().value).toBe("");
    expect(wrapper.find("#outlined-adornment-password").at(0).props().type).toBe("password");
    expect(wrapper.find(Visibility).length).toBe(0);
    expect(wrapper.find(VisibilityOff).length).toBe(1);
    expect(wrapper.find(LinearProgress).length).toBe(0);
  });

  test("handleClickShowPassword", () => {
    let  wrapper = mount(<ResetPassword />);
    act(() => {
        wrapper
          .find(IconButton)
          .at(0)
          .props()
          .onClick();
      });
      wrapper.render();
        wrapper.update();
    expect(wrapper.find("#outlined-adornment-password").at(0).props().value).toBe("");
    expect(wrapper.find("#outlined-adornment-password").at(0).props().type).toBe("text");
    expect(wrapper.find(Visibility).length).toBe(1);
    expect(wrapper.find(VisibilityOff).length).toBe(0);
    expect(wrapper.find(LinearProgress).length).toBe(0);
  });

  test("handleMouseDownPassword", () => {
    let  wrapper = mount(<ResetPassword />);
    const preventDefaultMock = jest.fn();
    act(() => {
        wrapper
          .find(IconButton)
          .at(0)
          .props()
          .onMouseDown({ preventDefault:preventDefaultMock});
      });
      wrapper.render();
        wrapper.update();
        expect(preventDefaultMock).toHaveBeenCalledTimes(1);
        expect(wrapper.find("#outlined-adornment-password").at(0).props().value).toBe("");
    expect(wrapper.find("#outlined-adornment-password").at(0).props().type).toBe("password");
    expect(wrapper.find(Visibility).length).toBe(0);
    expect(wrapper.find(VisibilityOff).length).toBe(1);
    expect(wrapper.find(LinearProgress).length).toBe(0);
  });

  test("handleChange", () => {
    let  wrapper = mount(<ResetPassword />);
    expect(wrapper.find("#outlined-adornment-password").at(0).props().value).toBe("");
    expect(wrapper.find("#outlined-adornment-password").at(0).props().type).toBe("password");
    expect(wrapper.find(Visibility).length).toBe(0);
    expect(wrapper.find(VisibilityOff).length).toBe(1);
    act(() => {
        wrapper
          .find("#outlined-adornment-password")
          .at(0)
          .props()
          .onChange({ target: { value:  "password" } });
      });
      wrapper.render();
        wrapper.update();
        expect(wrapper.find("#outlined-adornment-password").at(0).props().value).toBe("password");
        expect(wrapper.find("#outlined-adornment-password").at(0).props().type).toBe("password");
        expect(wrapper.find(Visibility).length).toBe(0);
        expect(wrapper.find(VisibilityOff).length).toBe(1);
        expect(wrapper.find(LinearProgress).length).toBe(0);
  });

  test("handelSubmit when  (values.password !== confirmPassword) ", () => {
    const preventDefaultMock = jest.fn();
    const logMock=  jest.spyOn(console, "log");
    const alertMock=  jest.spyOn(window, "alert");
    let  wrapper = mount(<ResetPassword />);
    //set the password
    act(() => {
        wrapper
          .find("#outlined-adornment-password")
          .at(0)
          .props()
          .onChange({ target: { value:  "password" } });
      });
      wrapper.render();
      wrapper.update();
    expect(wrapper.find("#outlined-adornment-password").at(0).props().value).toBe("password");
    // set confirm Password
    act(() => {
        wrapper
          .find("#confirmPassword")
          .at(0)
          .props()
          .onChange({ target: { value: "confirmPassword" ,name:"confirmPassword"} });
      });
        wrapper.update();
    act(() => {
        wrapper
          .find("#formSubmit")
          .at(0)
          .props()
          .onSubmit({ preventDefault:preventDefaultMock});
      });
      wrapper.render();
        wrapper.update();
        expect(preventDefaultMock).toHaveBeenCalledTimes(1);
        expect(wrapper.find("#outlined-adornment-password").at(0).props().value).toBe("password");
        expect(wrapper.find("#outlined-adornment-password").at(0).props().type).toBe("password");
        expect(wrapper.find(Visibility).length).toBe(0);
        expect(wrapper.find(VisibilityOff).length).toBe(1);
        expect(wrapper.find(LinearProgress).length).toBe(1);
       expect(wrapper.find("#notification").props().open).toBeTruthy(); 
      expect(wrapper.find("#notification").props().error).toBeTruthy(); 
      expect(wrapper.find("#notification").props().errorMessage).toStrictEqual(["password mismatch"]); 
  });

  test("handelSubmit when  res is ok and onchange", () => {
    const mockSuccessResponsePost ={ok :true};
    const mockJsonPromisePost = Promise.resolve(mockSuccessResponsePost);
    const PostMock = jest.spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromisePost);
    const preventDefaultMock = jest.fn();
    const logMock=  jest.spyOn(console, "log");
    const alertMock=  jest.spyOn(window, "alert");
    let  wrapper = mount(<Router><ResetPassword /></Router>);
    //set the password
    act(() => {
        wrapper
          .find("#outlined-adornment-password")
          .at(0)
          .props()
          .onChange({ target: { value:  "passwordA" } });
      });
      wrapper.render();
      wrapper.update();
    // set confirm Password
    act(() => {
        wrapper
          .find("#confirmPassword")
          .at(0)
          .props()
          .onChange({ target: { value: "passwordA" ,name:"confirmPassword"} });
      });
        wrapper.update();
    return mockJsonPromisePost.then(() => {
        act(() => {
            wrapper
              .find("#formSubmit")
              .at(0)
              .props()
              .onSubmit({ preventDefault:preventDefaultMock});
          });
    }).then(() => {
        wrapper.render();
        wrapper.update();
        
        expect(preventDefaultMock).toHaveBeenCalledTimes(1);
        expect(PostMock).toHaveBeenCalledTimes(1);
        expect(PostMock.mock.calls[0][0]).toBe("/api/user/ResetPassword");
        expect(PostMock.mock.calls[0][1]).toStrictEqual({"confirmPassword": "passwordA", "email": "/localhost/", "password": "passwordA", "token": "http:"});
        expect(wrapper.find(Redirect).length).toBe(1);
    });

        
  });

  test("handelSubmit when  res isn' ok and onchange", (done) => {
    let mockSuccessErrorPromise = { error: ["errorMessage"] };
    let mockSuccessError = Promise.resolve(mockSuccessErrorPromise);
    const mockSuccessResponsePost = Promise.resolve({
      ok: false,
      json: () => mockSuccessError,
    });
    const PostMock = jest
      .spyOn(PostDataMock, "postDataToAPI")
      .mockReturnValue(mockSuccessResponsePost);
    const preventDefaultMock = jest.fn();
    const logMock = jest.spyOn(console, "log");
    const alertMock = jest.spyOn(window, "alert");
    let wrapper = shallow(<ResetPassword />);
    //set the password
    act(() => {
      wrapper
        .find("#outlined-adornment-password")
        .at(0)
        .props()
        .onChange({ target: { value: "passwordA" } });
    });
    wrapper.update();
    wrapper.render();

    // set confirm Password
    act(() => {
      wrapper
        .find("#confirmPassword")
        .at(0)
        .props()
        .onChange({ target: { value: "passwordA", name: "confirmPassword" } });
    });
    wrapper.update();
    wrapper.render();

    act(() => {
      wrapper
        .find("#formSubmit")
        .at(0)
        .props()
        .onSubmit({ preventDefault: preventDefaultMock });
    });
    wrapper.update();
    wrapper.render();

    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    expect(PostMock).toHaveBeenCalledTimes(1);
    expect(PostMock.mock.calls[0][0]).toBe("/api/user/ResetPassword");
    expect(PostMock.mock.calls[0][1]).toStrictEqual({
      confirmPassword: "passwordA",
      email: "/localhost/",
      password: "passwordA",
      token: "http:",
    });
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
