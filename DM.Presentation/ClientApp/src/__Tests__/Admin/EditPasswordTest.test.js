
import React from "react";
import ReactDom from "react-dom";
import EditPassword from "../../components/Admin/EditPassword";
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
afterEach(cleanup);
describe("EditPassword", () => {
   afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(
        <EditPassword/>,
      div
    );
  });

  test("matches snapshot", () => {
    const wrapper = shallow(
         <EditPassword />
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test("intialization AppSideBar when role ia admin", () => {
    let  wrapper = mount(<EditPassword />);
    expect(wrapper.find("#outlined-adornment-password").at(0).props().value).toBe("");
    expect(wrapper.find("#outlined-adornment-password").at(0).props().type).toBe("password");
    expect(wrapper.find(Visibility).length).toBe(0);
    expect(wrapper.find(VisibilityOff).length).toBe(1);
    expect(wrapper.find("#notification").at(0).props().open).toBeFalsy();
  expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
  expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]);
  });

  test("handleClickShowPassword", () => {
    let  wrapper = mount(<EditPassword />);
    act(() => {
        wrapper
          .find("#iconButton1")
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
    expect(wrapper.find("#notification").at(0).props().open).toBeFalsy();
  expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
  expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]);
  });

  test("handleMouseDownPassword", () => {
    let  wrapper = mount(<EditPassword />);
    const preventDefaultMock = jest.fn();
    act(() => {
        wrapper
          .find("#iconButton1")
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
        expect(wrapper.find("#notification").at(0).props().open).toBeFalsy();
      expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]);
  });

  test("setOpen", () => {
    let  wrapper = mount(<EditPassword />);
    expect(wrapper.find("#outlined-adornment-password").at(0).props().value).toBe("");
        expect(wrapper.find("#outlined-adornment-password").at(0).props().type).toBe("password");
        expect(wrapper.find(Visibility).length).toBe(0);
        expect(wrapper.find(VisibilityOff).length).toBe(1);
        expect(wrapper.find("#notification").at(0).props().open).toBeFalsy();
      expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]);
    act(() => {
        wrapper
          .find("#notification")
          .at(0)
          .props()
          .setOpen(true);
      });
      wrapper.render();
        wrapper.update();
        expect(wrapper.find("#outlined-adornment-password").at(0).props().value).toBe("");
        expect(wrapper.find("#outlined-adornment-password").at(0).props().type).toBe("password");
        expect(wrapper.find(Visibility).length).toBe(0);
        expect(wrapper.find(VisibilityOff).length).toBe(1);
        expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
      expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]);
  });

  test("handleChange", () => {
    let  wrapper = mount(<EditPassword />);
    expect(wrapper.find("#outlined-adornment-password").at(0).props().value).toBe("");
        expect(wrapper.find("#outlined-adornment-password").at(0).props().type).toBe("password");
        expect(wrapper.find(Visibility).length).toBe(0);
        expect(wrapper.find(VisibilityOff).length).toBe(1);
        expect(wrapper.find("#notification").at(0).props().open).toBeFalsy();
      expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]);
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
        expect(wrapper.find("#notification").at(0).props().open).toBeFalsy();
      expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]);
  });

  test("onchange and handleSubmit when no error", () => {
    let  wrapper = mount(<EditPassword />);
    const preventDefaultMock = jest.fn();
    const logMock=  jest.spyOn(console, "log")
    //first branch when name:"password"
    act(() => {
        wrapper
          .find("#password")
          .at(0)
          .props()
          .onChange({ target: { value: "passwordA" ,name:"password"} });
      });
        wrapper.update();
         //second branch when name:"confirmPassword"
        act(() => {
            wrapper
              .find("#password")
              .at(0)
              .props()
              .onChange({ target: { value: "passwordv" ,name:"confirmPassword"} });
          });
          //setting Values.password
          act(() => {
            wrapper
              .find("#outlined-adornment-password")
              .at(0)
              .props()
              .onChange({ target: { value:  "passwordv" } });
          });
            wrapper.update();
            //calling submit help expect the setted values.
            act(() => {
                wrapper
                  .find("#submitForm")
                  .at(0)
                  .props()
                  .onSubmit({ preventDefault:preventDefaultMock});
              });
                wrapper.update();
                expect(preventDefaultMock).toHaveBeenCalledTimes(1);
                expect(wrapper.find(Visibility).length).toBe(0);
                expect(wrapper.find(VisibilityOff).length).toBe(1);
                expect(wrapper.find("#notification").at(0).props().open).toBeFalsy();
              expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
              expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]);
  });

  test("handleSubmit when (password.length < 8 || password.length > 12)", () => {
    let  wrapper = mount(<EditPassword />);
    const mockSuccessResponse ={ok :false};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const PostMock = jest.spyOn(PostDataMock, "postDataToAPI").mockReturnValue(mockJsonPromise);
    const preventDefaultMock = jest.fn();
    const logMock=  jest.spyOn(console, "log")
    expect(wrapper.find("#notification").at(0).props().open).toBeFalsy();
    expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
   expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]);
    act(() => {
        wrapper
          .find("#password")
          .at(0)
          .props()
          .onChange({ target: { value: "unValidPassword" ,name:"password"} });
      });
        wrapper.update();
            //calling submit help expect the setted values.
            return mockJsonPromise.then(() => {
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
                expect(preventDefaultMock).toHaveBeenCalledTimes(1);
                expect(logMock).toHaveBeenCalledTimes(0);
                expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
                expect(wrapper.find("#notification").at(0).props().error).toBeTruthy();
                expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual(["password_charachters_no"]);
  });
});

  // test("onchange and handleSubmit when (values.password.length < 8 || confirmPassword.length > 12)", () => {
  //   const mockSuccessResponse ={ok :true};
  //   const mockJsonPromise = Promise.resolve(mockSuccessResponse);
  //   global.fetch = require('jest-fetch-mock');
  //   fetch.mockResponse(mockJsonPromise);
  //   let  wrapper = mount(<EditPassword />);
  //   const preventDefaultMock = jest.fn();
  //   const logMock=  jest.spyOn(console, "log")
  //   //first branch when name:"password"
  //   act(() => {
  //       wrapper
  //         .find("#password")
  //         .at(0)
  //         .props()
  //         .onChange({ target: { value: "passwordA" ,name:"password"} });
  //     });
  //       wrapper.update();
  //        //second branch when name:"confirmPassword"
  //       act(() => {
  //           wrapper
  //             .find("#password")
  //             .at(0)
  //             .props()
  //             .onChange({ target: { value: "unValidConfirm" ,name:"confirmPassword"} });
  //         });
  //         //setting Values.password
  //         act(() => {
  //           wrapper
  //             .find("#outlined-adornment-password")
  //             .at(0)
  //             .props()
  //             .onChange({ target: { value:  "passwordv" } });
  //         });
  //           wrapper.update();
  //           //calling submit help expect the setted values.
  //           act(() => {
  //               wrapper
  //                 .find("#submitForm")
  //                 .at(0)
  //                 .props()
  //                 .onSubmit({ preventDefault:preventDefaultMock});
  //             });
  //               wrapper.update();
  //               expect(preventDefaultMock).toHaveBeenCalledTimes(1);
  //               expect(logMock).toHaveBeenCalledTimes(0);
  //               expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
  //               expect(wrapper.find("#notification").at(0).props().error).toBeTruthy();
  //               expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual(["password_charachters_no"]);
  // });

  // test("onchange and handleSubmit when  (values.password !== confirmPassword)", () => {
  //   const mockSuccessResponse ={ok :true};
  //   const mockJsonPromise = Promise.resolve(mockSuccessResponse);
  //   global.fetch = require('jest-fetch-mock');
  //   fetch.mockResponse(mockJsonPromise);
  //   let  wrapper = mount(<EditPassword />);
  //   const preventDefaultMock = jest.fn();
  //   const logMock=  jest.spyOn(console, "log")
  //   //first branch when name:"password"
  //   act(() => {
  //       wrapper
  //         .find("#password")
  //         .at(0)
  //         .props()
  //         .onChange({ target: { value: "passwordA" ,name:"password"} });
  //     });
  //       wrapper.update();
  //        //second branch when name:"confirmPassword"
  //       act(() => {
  //           wrapper
  //             .find("#password")
  //             .at(0)
  //             .props()
  //             .onChange({ target: { value: "passwordW" ,name:"confirmPassword"} });
  //         });
  //         //setting Values.password
  //         act(() => {
  //           wrapper
  //             .find("#outlined-adornment-password")
  //             .at(0)
  //             .props()
  //             .onChange({ target: { value:  "passwordv" } });
  //         });
  //           wrapper.update();
  //           //calling submit help expect the setted values.
  //           act(() => {
  //               wrapper
  //                 .find("#submitForm")
  //                 .at(0)
  //                 .props()
  //                 .onSubmit({ preventDefault:preventDefaultMock});
  //             });
  //               wrapper.update();
  //               expect(logMock).toHaveBeenCalledTimes(0);
  //               expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
  //               expect(wrapper.find("#notification").at(0).props().error).toBeTruthy();
  //               expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual(["password_mismatch"]);
  // });
});