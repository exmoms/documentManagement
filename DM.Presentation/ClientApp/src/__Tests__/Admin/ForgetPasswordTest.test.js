
import React from "react";
import ReactDom from "react-dom";
import ForgetPassword from "../../components/Admin/ForgetPassword";
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
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {Redirect } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
afterEach(cleanup);
describe("ForgetPassword", () => {
   afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    jest.spyOn(ContextAuth, "useAuth").mockImplementation(()=>true);
    const div = document.createElement("div");
    ReactDom.render(
        <Router><ForgetPassword/></Router>,div
    );
  });

  test("matches snapshot", () => {
    jest.spyOn(ContextAuth, "useAuth").mockImplementation(()=>true);
    const wrapper = shallow(
        <Router><ForgetPassword/></Router>
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  test("authenticated is true", () => {
      let authenticated = true;
    let setAuthenticated = jest.fn()
    let value ={authenticated,setAuthenticated};
    const useAuth =  jest.spyOn(ContextAuth, "useAuth").mockImplementation(()=>value);
    let  wrapper = mount(<Router><ForgetPassword/></Router>);
    expect(useAuth).toHaveBeenCalledTimes(1);
    expect(wrapper.find(Redirect).length).toBe(1);
  });

  test("authenticated is false and  (isReset === false)", () => {
    const useAuth = jest.spyOn(ContextAuth, "useAuth").mockImplementation(()=>false);
    let  wrapper = mount(<Router><ForgetPassword/></Router>);
    expect(useAuth).toHaveBeenCalledTimes(1);
    expect(wrapper.find(Redirect).length).toBe(0);
    expect(wrapper.find(Typography).at(0).text()).toBe("forgetpassword_enterEmail_msg");
    expect(wrapper.find(LinearProgress).length).toBe(0);
  });

  test("onChange and handelSubmit when response is not ok", () => {
    const useAuth = jest.spyOn(ContextAuth, "useAuth").mockImplementation(()=>false);
    const mockSuccessResponsePost ={ok :false};
const mockJsonPromisePost = Promise.resolve(mockSuccessResponsePost);
const mockSuccessResponsePost2 ={ok :false};
const mockJsonPromisePost2 = Promise.resolve(mockSuccessResponsePost2);
    const PostMock = jest.spyOn(PostDataMock, "postDataToAPI").mockReturnValueOnce(mockJsonPromisePost).mockReturnValueOnce(mockJsonPromisePost2);
    const preventDefaultMock = jest.fn();
    let  wrapper = mount(<Router><ForgetPassword/></Router>);
    act(() => {
        wrapper
          .find("#email")
          .at(0)
          .props()
          .onChange({ target: { value: "test.tested@hotmail.com" ,name:"email"} });
      });
      wrapper.update();
      //first branch when loading is false
      return mockJsonPromisePost.then(() => {
        act(() => {
          wrapper
            .find("#submitForm")
            .at(0)
            .props()
            .onSubmit({ preventDefault:preventDefaultMock});
        });
      }).then(() => {
        wrapper.update();
        wrapper.render();
      expect(useAuth).toHaveBeenCalled();
      expect(wrapper.find(Redirect).length).toBe(0);
      expect(wrapper.find(Typography).at(0).text()).toBe("forgetpassword_enterEmail_msg");
      expect(wrapper.find(LinearProgress).length).toBe(0);
      expect(preventDefaultMock).toHaveBeenCalledTimes(1);
      expect(PostMock).toHaveBeenCalledTimes(1);
      expect(PostMock.mock.calls[0][0]).toBe("/api/user/SendResetPasswordEmail?email=test.tested@hotmail.com");
      return mockJsonPromisePost.then(() => {  
        //second ranch when oading is true
    act(() => {
      wrapper
        .find("#submitForm")
        .at(0)
        .props()
        .onSubmit({ preventDefault:preventDefaultMock});
    });
      }).then(() => {
        wrapper.update();
      wrapper.render();
      expect(wrapper.find(LinearProgress).length).toBe(0);
      expect(wrapper.find("#notification").props().open).toBeTruthy(); 
      expect(wrapper.find("#notification").props().error).toBeTruthy(); 
      expect(wrapper.find("#notification").props().errorMessage).toStrictEqual(["Errrrror"]); 
      });
    });

  });

  test("onChange and handelSubmit when status is 200", () => {
    const useAuth = jest.spyOn(ContextAuth, "useAuth").mockImplementation(()=>false);
    const mockSuccessResponsePost ={ok :true};
const mockJsonPromisePost = Promise.resolve(mockSuccessResponsePost);
const mockSuccessResponsePost2 ={ok :true};
const mockJsonPromisePost2 = Promise.resolve(mockSuccessResponsePost2);
    const PostMock = jest.spyOn(PostDataMock, "postDataToAPI").mockReturnValueOnce(mockJsonPromisePost).mockReturnValueOnce(mockJsonPromisePost2);
    const preventDefaultMock = jest.fn();
    let  wrapper ;
    return mockJsonPromisePost.then(() => {
      wrapper = mount(<Router><ForgetPassword/></Router>);
    act(() => {
        wrapper
          .find("#email")
          .at(0)
          .props()
          .onChange({ target: { value: "test.tested@hotmail.com" ,name:"email"} });
      });
      wrapper.update();
      act(() => {
        wrapper
          .find("#submitForm")
          .at(0)
          .props()
          .onSubmit({ preventDefault:preventDefaultMock});
      });
    }).then(() => {
      wrapper.update();
      wrapper.render();
      expect(wrapper.find("#container").length).toBe(3);
    expect(wrapper.find(Redirect).length).toBe(0);
    expect(wrapper.find(Typography).at(0).text()).toBe("forgetpassword_toContinue_checkMail_msg");
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    expect(PostMock).toHaveBeenCalledTimes(1);
    expect(PostMock.mock.calls[0][0]).toBe("/api/user/SendResetPasswordEmail?email=test.tested@hotmail.com");
});  
});


});