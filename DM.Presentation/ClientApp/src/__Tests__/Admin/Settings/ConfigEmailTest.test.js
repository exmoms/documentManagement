import React from "react";
import ReactDom from "react-dom";
import ConfigEmail from "../../../components/Admin/Settings/ConfigEmail";
import { cleanup } from "@testing-library/react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import TextField from "@material-ui/core/TextField";
import { act } from "react-dom/test-utils";
import Button from "@material-ui/core/Button";
import { BrowserRouter as Router } from "react-router-dom";
import * as FetchMock from "../../../api/FetchData";
import * as PostDataMock from "../../../api/PostData";
import { OutlinedInput, IconButton} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
afterEach(cleanup);
describe("ConfigEmail", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(
        <ConfigEmail />,
      div
    );
  });

  test("matches snapshot", () => {
    const wrapper = shallow(
        <ConfigEmail />
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
 
  test("componentDidMount + handelSubmit", () => {
    const preventDefaultMock = jest.fn();
    const mockSuccessResponse = {email:"email" , server:"server", port:"port", password:"password"};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const fetchMock =  jest.spyOn(FetchMock, "fetchData")
      .mockImplementation(() => mockJsonPromise);
      const mockSuccessResponsePostData = {status:200, json:()=>{return  Promise.resolve( {error:["error"]})}};
      const mockSuccessResponsePostDataNotOk = Promise.resolve({status:300, json:()=>{return  Promise.resolve( {error:["error"]})}});
  const mockJsonPromisePostData = Promise.resolve(mockSuccessResponsePostData); 
  const PostMock=  jest.spyOn(PostDataMock, "postDataToAPI").mockReturnValueOnce(mockJsonPromisePostData).mockReturnValueOnce(mockJsonPromisePostData).mockReturnValueOnce(mockSuccessResponsePostDataNotOk);
      let wrapper;
      return mockJsonPromise.then(() => {
     wrapper = mount(<ConfigEmail />,{ attachTo: document.body }) ;
    }).then(() => {
        wrapper.render();
        wrapper.update();
        //expectation
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/Mail/GetConfig");
    expect(wrapper.find(Visibility).length).toBe(0);
    expect(wrapper.find(VisibilityOff).length).toBe(1);
    expect(document.getElementById("email").value).toBe("email");
    expect(document.getElementById("server").value).toBe("server");
    expect(wrapper.find("#port").at(0).props().error).toBeFalsy();
    expect(wrapper.find("#port").at(0).props().helperText).toBe("");
    expect(wrapper.find("#port").at(0).props().type).toBe("number");
    expect(wrapper.find("#OutlinedInput").at(0).props().type).toBe("password");
    expect(wrapper.find("#OutlinedInput").at(0).props().value).toBe("password");
    //expect(document.getElementById("port").value).toBe("port"); //failed test
    //set buttonCase to test
    act(() => {
        wrapper
          .find("#buttonTest")
          .at(0)
          .props()
          .onClick();
      }); 
      wrapper.update();
    return mockJsonPromise.then(() => {
        expect(wrapper.find("#notification").at(0).props().open).toBeFalsy(); 
        act(() => {
            //first branch when buttonCase is "test" and status is 2000
            wrapper
              .find("#submitForm")
              .at(0)
              .props()
              .onSubmit({ preventDefault: preventDefaultMock });
          });
    }).then(() => {
        wrapper.render();
      wrapper.update();
        expect(PostMock).toHaveBeenCalledTimes(1);
        expect(PostMock.mock.calls[0][0]).toBe("/api/Mail/TestConnection");
        expect(PostMock.mock.calls[0][1]).toStrictEqual( {"Password": "password", "Port": NaN, "Server": "server", "email": "email"});
        expect(preventDefaultMock).toHaveBeenCalledTimes(1);
        expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
        expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
        //set buttonCase to test
    act(() => {
        wrapper
          .find("#buttonSetUP")
          .at(0)
          .props()
          .onClick();
      }); 
      wrapper.update();
        act(() => {
            //second branch when buttonCase is "setup" and status is 200
            wrapper
              .find("#submitForm")
              .at(0)
              .props()
              .onSubmit({ preventDefault: preventDefaultMock });
          });
          wrapper.render();
         wrapper.update();
        expect(PostMock).toHaveBeenCalledTimes(2);
        expect(PostMock.mock.calls[1][0]).toBe("/api/Mail/AddConfig");
        expect(PostMock.mock.calls[1][1]).toStrictEqual( {"Password": "password", "Port": NaN, "Server": "server", "email": "email"});
        expect(preventDefaultMock).toHaveBeenCalledTimes(2);
        expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
        expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
        expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]);
        return mockSuccessResponsePostDataNotOk.then(() => {
            act(() => {
                //third branch when buttonCase is "setup" and status isn't 200
                wrapper
                  .find("#submitForm")
                  .at(0)
                  .props()
                  .onSubmit({ preventDefault: preventDefaultMock });
              });
        }).then(() => {
        wrapper.render();
         wrapper.update();
        expect(PostMock).toHaveBeenCalledTimes(3);
        expect(PostMock.mock.calls[2][0]).toBe("/api/Mail/AddConfig");
        expect(PostMock.mock.calls[2][1]).toStrictEqual( {"Password": "password", "Port": NaN, "Server": "server", "email": "email"});
        expect(preventDefaultMock).toHaveBeenCalledTimes(3);
        expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
        expect(wrapper.find("#notification").at(0).props().error).toBeTruthy();
        expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual(["Mail_con_err"]);
      });
    });
    });

  });

  test("handlePassword", () => {
      let wrapper;
     wrapper = mount(<ConfigEmail />) ;
     expect(wrapper.find("#OutlinedInput").at(0).props().value).toBe("");
    act(() => {
        wrapper
          .find("#OutlinedInput")
          .at(0)
          .props()
          .onChange({ target: { value: "testedVlaue" } });
      }); 
      wrapper.render();
      wrapper.update();
      expect(wrapper.find("#OutlinedInput").at(0).props().value).toBe("testedVlaue");
});

test("handleClickShowPassword", () => {
    let wrapper;
   wrapper = mount(<ConfigEmail />) ;
   expect(wrapper.find(Visibility).length).toBe(0);
    expect(wrapper.find(VisibilityOff).length).toBe(1);
  act(() => {
      wrapper
        .find(IconButton)
        .at(0)
        .props()
        .onClick();
    }); 
    wrapper.render();
    wrapper.update();
    expect(wrapper.find(Visibility).length).toBe(1);
    expect(wrapper.find(VisibilityOff).length).toBe(0);
});

test("handleMouseDownPassword", () => {
    let wrapper;
   wrapper = mount(<ConfigEmail />) ;
   const preventDefaultMock = jest.fn();
  act(() => {
      wrapper
        .find(IconButton)
        .at(0)
        .props()
        .onMouseDown({ preventDefault: preventDefaultMock });
    }); 
    wrapper.render();
    wrapper.update();
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
});

test("onChangePort", () => {
    let wrapper;
   wrapper = mount(<ConfigEmail />) ;
  act(() => {
      wrapper
        .find("#port")
        .at(0)
        .props()
        .onChange({ target: { value: null } });
    }); 
    wrapper.render();
    wrapper.update();
    expect(wrapper.find("#port").at(0).props().error).toBeTruthy();
    expect(wrapper.find("#port").at(0).props().helperText).toBe("invalid_port");
    act(() => {
        wrapper
          .find("#port")
          .at(0)
          .props()
          .onChange({ target: { value: 123 } });
      }); 
      wrapper.render();
      wrapper.update();
      expect(wrapper.find("#port").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#port").at(0).props().helperText).toBe("");
});
test("handelSubmit not ok branches", () => {
    const preventDefaultMock = jest.fn();
    const mockSuccessResponse = {email:"email" , server:"server", port:"port", password:"password"};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const fetchMock =  jest.spyOn(FetchMock, "fetchData")
      .mockImplementation(() => mockJsonPromise);
      const mockSuccessResponsePostDataNotOk = Promise.resolve({status:300, json:()=>{return  Promise.resolve( {error:["error"]})}});
  const PostMock=  jest.spyOn(PostDataMock, "postDataToAPI").mockReturnValueOnce(mockSuccessResponsePostDataNotOk);
      let wrapper;
      return mockJsonPromise.then(() => {
     wrapper = mount(<ConfigEmail />) ;
    }).then(() => {
        wrapper.render();
        wrapper.update();
        //expectation
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/Mail/GetConfig");
    //set buttonCase to test
    act(() => {
        wrapper
          .find("#buttonTest")
          .at(0)
          .props()
          .onClick();
      }); 
      wrapper.update();
    return mockSuccessResponsePostDataNotOk.then(() => {
        expect(wrapper.find("#notification").at(0).props().open).toBeFalsy(); 
        expect(wrapper.find("#notification").at(0).props().error).toBeFalsy(); 
        expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]);
        act(() => {
            //when testedSuccess is not success
            wrapper
              .find("#submitForm")
              .at(0)
              .props()
              .onSubmit({ preventDefault: preventDefaultMock });
          });
    }).then(() => {
        wrapper.render();
      wrapper.update();
        expect(PostMock).toHaveBeenCalledTimes(1);
        expect(PostMock.mock.calls[0][0]).toBe("/api/Mail/TestConnection");
        expect(PostMock.mock.calls[0][1]).toStrictEqual( {"Password": "password", "Port": NaN, "Server": "server", "email": "email"});
        expect(preventDefaultMock).toHaveBeenCalledTimes(1);
        expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
        expect(wrapper.find("#notification").at(0).props().error).toBeTruthy();
        expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual(["Mail_con_test_err"]);
       //set buttonCase to test
    act(() => {
        wrapper
          .find("#buttonSetUP")
          .at(0)
          .props()
          .onClick();
      }); 
      wrapper.update();

      act(() => {
        //when testedSuccess is false
        wrapper
          .find("#submitForm")
          .at(0)
          .props()
          .onSubmit({ preventDefault: preventDefaultMock });
      });
      wrapper.render();
      wrapper.update();
      expect(PostMock).toHaveBeenCalledTimes(1);
      expect(preventDefaultMock).toHaveBeenCalledTimes(2);
      expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
        expect(wrapper.find("#notification").at(0).props().error).toBeTruthy();
        expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual(["Mail_con_test"]);
        //calling setOpen 
        act(() => {
            wrapper
              .find("#notification")
              .at(0)
              .props()
              .setOpen();
          });
          wrapper.render();
          wrapper.update();
          expect(wrapper.find("#notification").at(0).props().open).toBeFalsy();
    });
    });
});
test("handelSubmit when default case", () => {
    let wrapper;
   wrapper = mount(<ConfigEmail />) ;
   const preventDefaultMock = jest.fn();
   const logMock =  jest.spyOn(console, "log")
   act(() => {
    //when testedSuccess is false
    wrapper
      .find("#submitForm")
      .at(0)
      .props()
      .onSubmit({ preventDefault: preventDefaultMock });
  });
  wrapper.render();
  wrapper.update();
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    expect(logMock).toHaveBeenCalledTimes(1);
    expect(logMock.mock.calls[0][0]).toBe("");
});
});