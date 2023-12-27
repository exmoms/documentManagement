import React from "react";
import ReactDom from "react-dom";
import EditProfilePopup from "../../../components/Admin/Settings/EditProfilePopup";
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
import EditUserProfileByAdmin from "../../../components/Admin/Settings/EditUserProfileByAdmin";
afterEach(cleanup);
describe("EditProfilePopup", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    let user={userId:1 , userName:"userName A"};
    let show= true;
    const action = jest.fn();
    ReactDom.render(
        <EditProfilePopup user={user} show={show} action={action}/>,
      div
    );
  });

  test("matches snapshot", () => {
    let user={userId:1 , userName:"userName A"};
    let show= true;
    const action = jest.fn();
    const wrapper = shallow(
        <EditProfilePopup user={user} show={show} action={action} />
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
   
  test("intialization ProfilePopUp", () => {
    let user={userId:1 , userName:"userName A"};
    let show= true;
    const action = jest.fn();
  let  wrapper = mount(<EditProfilePopup user={user} show={show} action={action} />) ;
  expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
  expect(wrapper.find(Typography).at(0).text()).toBe("edit_user_profile : userName A");
  expect(wrapper.find(EditUserProfileByAdmin).at(0).props().profileData).toBe(null);
  expect(wrapper.find(EditUserProfileByAdmin).at(0).props().errors).toStrictEqual({ confirmErrors: "", newPasswordErrors: "",  submissionErrors: ""});
  expect(wrapper.find("#notification").at(0).props().open).toBeFalsy();
  expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
  expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual("");
});

test("componentDidUpdate", () => {
    let user={userId:1 , userName:"userName A"};
    let user2={userId:2 , userName:"userName B"};
    let show= true;
    const action = jest.fn();
    const mockSuccessResponse = {email:"test@hotmail.com" , phoneNumber:9888000000};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise);
    let wrapper;
    return mockJsonPromise.then(() => {
      wrapper = mount(<EditProfilePopup user={user} show={show} action={action} />) ;
      wrapper.setProps({user:user2});
    }).then(() => {
        wrapper.render();
        wrapper.update();
        expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe("/api/user/2");
      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
      expect(wrapper.find(Typography).at(0).text()).toBe("edit_user_profile : userName B");
      expect(wrapper.find(EditUserProfileByAdmin).at(0).props().profileData).toStrictEqual({email:"test@hotmail.com" , phoneNumber:9888000000});
      expect(wrapper.find(EditUserProfileByAdmin).at(0).props().errors).toStrictEqual({ confirmErrors: "", newPasswordErrors: "",submissionErrors: ""});
      expect(wrapper.find("#notification").at(0).props().open).toBeFalsy();
      expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual("");
    });
});

test("toggleShow", () => {
    let user={userId:1 , userName:"userName A"};
    let show= true;
    const action = jest.fn();
    let wrapper;
    wrapper = mount(<EditProfilePopup user={user} show={show} action={action} />) ;
    act(() => {
        wrapper
          .find(Dialog)
          .at(0)
          .props()
          .onClose();
      }); 
      wrapper.render();
      wrapper.update();
      expect(action).toHaveBeenCalledTimes(1);
      expect(action.mock.calls[0][0]).toBeFalsy();
});

test("handelSubmit when res is ok", () => {
    let user={userId:1 , userName:"userName A"};
    let user2={userId:2 , userName:"userName B"};
    let show= true;
    const action = jest.fn();
    const preventDefaultMock = jest.fn();
    const mockSuccessResponse = {email:"test@hotmail.com" , phoneNumber:9888000000};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise);
    const mockSuccessResponsePostDataOk = Promise.resolve({ok:true, json:()=>{return  Promise.resolve( {error:["error"]})}});
    const mockSuccessResponsePostDataNotOk = Promise.resolve({ok:false, json:()=>{return  Promise.resolve( {error:["error"]})}});
    const PostMock=  jest.spyOn(PostDataMock, "postDataToAPI").mockReturnValueOnce(mockSuccessResponsePostDataOk).mockReturnValueOnce(mockSuccessResponsePostDataNotOk);
    const formData = {
        userId: 2,
        email: "test.value@hotmail.com",
        phoneNumber: "9858444444",
        NewPassword: "",
        ConfirmPassword: "",
      };
      const formDataNotOk = {
        userId: 2,
        email: "test@hotmail.com",
        phoneNumber: "9888000000",
        NewPassword: "",
        ConfirmPassword: "",
      };
    let wrapper;
    return mockJsonPromise.then(() => {
      wrapper = mount(<EditProfilePopup user={user} show={show} action={action} /> ,{ attachTo: document.body }) ;
      wrapper.setProps({user:user2});
    }).then(() => {
        wrapper.render();
        wrapper.update();
        expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe("/api/user/2");
      return mockSuccessResponsePostDataOk.then(() => {
        document.getElementById("edit-profile-by-admin-email").value="test.value@hotmail.com";
        document.getElementById("edit-profile-by-admin-tel").value="9858444444";
        document.getElementById("edit-profile-by-admin-outlined-adornment-password").value="";
        document.getElementById("edit-profile-by-admin-confirmPassword").value="";
        expect(wrapper.find("#notification").at(0).props().open).toBeFalsy();
      expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual("");
        act(() => {
            wrapper
              .find("#edit-profile-form")
              .at(0)
              .props()
              .onSubmit({ preventDefault: preventDefaultMock });
          }); 
    }).then(() => {
        wrapper.render();
      wrapper.update();
      expect(preventDefaultMock).toHaveBeenCalledTimes(1);
      expect(PostMock).toHaveBeenCalledTimes(1);
      expect(PostMock.mock.calls[0][0]).toBe("/api/user/EditUserProfileByAdmin");
      expect(PostMock.mock.calls[0][1]).toStrictEqual(formData);
      expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
    }).then(() => {
        wrapper.render();
      wrapper.update();
      expect(action).toHaveBeenCalledTimes(1);
      expect(action.mock.calls[0][0]).toBeFalsy();
      expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
      expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual("");
      //when the res is not ok 
      return mockSuccessResponsePostDataNotOk.then(() => {
        // document.getElementById("edit-profile-by-admin-email").value="test.value@hotmail.com";
        // document.getElementById("edit-profile-by-admin-tel").value="9858444444";
        // document.getElementById("edit-profile-by-admin-outlined-adornment-password").value="";
        // document.getElementById("edit-profile-by-admin-confirmPassword").value="";
        expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
      expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
      expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual("");
        act(() => {
            wrapper
              .find("#edit-profile-form")
              .at(0)
              .props()
              .onSubmit({ preventDefault: preventDefaultMock });
          }); 
    }).then(() => {
        wrapper.render();
      wrapper.update();
      expect(preventDefaultMock).toHaveBeenCalledTimes(2);
      expect(PostMock).toHaveBeenCalledTimes(2);
      expect(PostMock.mock.calls[1][0]).toBe("/api/user/EditUserProfileByAdmin");
      expect(PostMock.mock.calls[1][1]).toStrictEqual(formDataNotOk);
      expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
    }).then(() => {
        wrapper.render();
      wrapper.update();
      expect(action).toHaveBeenCalledTimes(2);
      expect(action.mock.calls[0][0]).toBeFalsy();
      expect(action.mock.calls[1][0]).toBeFalsy();
      expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
      expect(wrapper.find("#notification").at(0).props().error).toBeTruthy();
      expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual(["error"]);
      //when the password is unvalid 
      //test case 1
      document.getElementById("edit-profile-by-admin-email").value="test.value@hotmail.com"; 
      document.getElementById("edit-profile-by-admin-tel").value="9858444444"; 
      document.getElementById("edit-profile-by-admin-outlined-adornment-password").value="..///.";
       document.getElementById("edit-profile-by-admin-confirmPassword").value="password2";
        wrapper .find("#edit-profile-form") .at(0) .props() .onSubmit({ preventDefault: preventDefaultMock }); 
        wrapper.render();
        wrapper.update();
    expect(preventDefaultMock).toHaveBeenCalledTimes(3);
     expect(PostMock).toHaveBeenCalledTimes(2);
     expect(wrapper.find(EditUserProfileByAdmin).at(0).props().errors).toStrictEqual({"confirmErrors": "password_mismatchingWithComfirm",
     "newPasswordErrors": "password_formateError"});
  
    });      
     }); 
    }); 
    });
});