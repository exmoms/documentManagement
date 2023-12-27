import React from "react";
import ReactDom from "react-dom";
import EditUserProfileByAdmin from "../../../components/Admin/Settings/EditUserProfileByAdmin";
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
afterEach(cleanup);
describe("EditUserProfileByAdmin", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    let profileData={email:"testedValue@gmail.com" , phoneNumber:123456788};
    let errors={newPasswordErrors:"newPasswordErrors" , confirmErrors:"confirmErrors"};
    ReactDom.render(
        <EditUserProfileByAdmin profileData={profileData} errors={errors}/>,
      div
    );
  });

  test("matches snapshot", () => {
    let profileData={email:"testedValue@gmail.com" , phoneNumber:123456788};
    let errors={newPasswordErrors:"newPasswordErrors" , confirmErrors:"confirmErrors"};
    const wrapper = shallow(
        <EditUserProfileByAdmin profileData={profileData} errors={errors}/>
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
 
  test("intialization ProfilePopUpByAdmin", () => {
    let profileData={email:"testedValue@gmail.com" , phoneNumber:123456788};
    let errors={newPasswordErrors:"newPasswordErrors" , confirmErrors:"confirmErrors"};
  let  wrapper = mount(<EditUserProfileByAdmin profileData={profileData} errors={errors} />) ;
  expect(wrapper.find("#edit-profile-by-admin-email").at(0).props().value).toBe("testedValue@gmail.com");
  expect(wrapper.find("#edit-profile-by-admin-tel").at(0).props().value).toBe(123456788);
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().type).toBe("password");
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().value).toBe("");
  expect(wrapper.find(Visibility).length).toBe(0);
  expect(wrapper.find(VisibilityOff).length).toBe(1);
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password-helper-text").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().helperText).toBe("confirmErrors");
});
test("intialization ProfilePopUpByAdmin when phoneNumber==null", () => {
    let profileData={email:"testedValue@gmail.com" , phoneNumber:null};
    let errors={newPasswordErrors:"newPasswordErrors" , confirmErrors:"confirmErrors"};
  let  wrapper = mount(<EditUserProfileByAdmin profileData={profileData} errors={errors} />) ;
  expect(wrapper.find("#edit-profile-by-admin-email").at(0).props().value).toBe("testedValue@gmail.com");
  expect(wrapper.find("#edit-profile-by-admin-tel").at(0).props().value).toBe("");
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().type).toBe("password");
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().value).toBe("");
  expect(wrapper.find(Visibility).length).toBe(0);
  expect(wrapper.find(VisibilityOff).length).toBe(1);
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password-helper-text").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().helperText).toBe("confirmErrors");
});
test("intialization ProfilePopUpByAdmin when profileData==null", () => {
    let profileData=null;
    let errors={newPasswordErrors:"newPasswordErrors" , confirmErrors:"confirmErrors"};
  let  wrapper = mount(<EditUserProfileByAdmin profileData={profileData} errors={errors} />) ;
  expect(wrapper.find("#edit-profile-by-admin-email").at(0).props().value).toBe("");
  expect(wrapper.find("#edit-profile-by-admin-tel").at(0).props().value).toBe("");
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().type).toBe("password");
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().value).toBe("");
  expect(wrapper.find(Visibility).length).toBe(0);
  expect(wrapper.find(VisibilityOff).length).toBe(1);
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password-helper-text").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().helperText).toBe("confirmErrors");
});
test("onChange functionality when event.target.name === edit-profile-by-admin-email", () => {
    let profileData={email:"testedValue@gmail.com" , phoneNumber:123456788};
    let errors={newPasswordErrors:"newPasswordErrors" , confirmErrors:"confirmErrors"};
  let  wrapper = mount(<EditUserProfileByAdmin profileData={profileData} errors={errors} />) ;
  expect(wrapper.find("#edit-profile-by-admin-email").at(0).props().value).toBe("testedValue@gmail.com");
  expect(wrapper.find("#edit-profile-by-admin-tel").at(0).props().value).toBe(123456788);
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().type).toBe("password");
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().value).toBe("");
  expect(wrapper.find(Visibility).length).toBe(0);
  expect(wrapper.find(VisibilityOff).length).toBe(1);
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password-helper-text").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().helperText).toBe("confirmErrors");

  act(() => {
    wrapper
      .find("#edit-profile-by-admin-email")
      .at(0)
      .props()
      .onChange({ target: { value: "testedValue2@gmail.com" ,name:"edit-profile-by-admin-email"} });
  });
  wrapper.render();
    wrapper.update();

    expect(wrapper.find("#edit-profile-by-admin-email").at(0).props().value).toBe("testedValue2@gmail.com");
    expect(wrapper.find("#edit-profile-by-admin-tel").at(0).props().value).toBe(123456788);
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().error).toBeTruthy();
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().type).toBe("password");
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().value).toBe("");
    expect(wrapper.find(Visibility).length).toBe(0);
    expect(wrapper.find(VisibilityOff).length).toBe(1);
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password-helper-text").at(0).props().error).toBeTruthy();
    expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().error).toBeTruthy();
    expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().helperText).toBe("confirmErrors");
});

test("onChange functionality when event.target.name === edit-profile-by-admin-tel", () => {
    let profileData={email:"testedValue@gmail.com" , phoneNumber:123456788};
    let errors={newPasswordErrors:"newPasswordErrors" , confirmErrors:"confirmErrors"};
  let  wrapper = mount(<EditUserProfileByAdmin profileData={profileData} errors={errors} />) ;
  expect(wrapper.find("#edit-profile-by-admin-email").at(0).props().value).toBe("testedValue@gmail.com");
  expect(wrapper.find("#edit-profile-by-admin-tel").at(0).props().value).toBe(123456788);
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().type).toBe("password");
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().value).toBe("");
  expect(wrapper.find(Visibility).length).toBe(0);
  expect(wrapper.find(VisibilityOff).length).toBe(1);
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password-helper-text").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().helperText).toBe("confirmErrors");

  act(() => {
    wrapper
      .find("#edit-profile-by-admin-email")
      .at(0)
      .props()
      .onChange({ target: { value: "000000077777" ,name:"edit-profile-by-admin-tel"} });
  });
  wrapper.render();
    wrapper.update();

    expect(wrapper.find("#edit-profile-by-admin-email").at(0).props().value).toBe("testedValue@gmail.com");
    expect(wrapper.find("#edit-profile-by-admin-tel").at(0).props().value).toBe("000000077777");
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().error).toBeTruthy();
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().type).toBe("password");
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().value).toBe("");
    expect(wrapper.find(Visibility).length).toBe(0);
    expect(wrapper.find(VisibilityOff).length).toBe(1);
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password-helper-text").at(0).props().error).toBeTruthy();
    expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().error).toBeTruthy();
    expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().helperText).toBe("confirmErrors");
});

test("handleChange functionality", () => {
    let profileData={email:"testedValue@gmail.com" , phoneNumber:123456788};
    let errors={newPasswordErrors:"newPasswordErrors" , confirmErrors:"confirmErrors"};
  let  wrapper = mount(<EditUserProfileByAdmin profileData={profileData} errors={errors} />) ;
  expect(wrapper.find("#edit-profile-by-admin-email").at(0).props().value).toBe("testedValue@gmail.com");
  expect(wrapper.find("#edit-profile-by-admin-tel").at(0).props().value).toBe(123456788);
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().type).toBe("password");
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().value).toBe("");
  expect(wrapper.find(Visibility).length).toBe(0);
  expect(wrapper.find(VisibilityOff).length).toBe(1);
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password-helper-text").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().helperText).toBe("confirmErrors");

  act(() => {
    wrapper
      .find("#edit-profile-by-admin-outlined-adornment-password")
      .at(0)
      .props()
      .onChange({ target: { value: "newPassword"} });
  });
  wrapper.render();
    wrapper.update();

    expect(wrapper.find("#edit-profile-by-admin-email").at(0).props().value).toBe("testedValue@gmail.com");
    expect(wrapper.find("#edit-profile-by-admin-tel").at(0).props().value).toBe(123456788);
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().error).toBeTruthy();
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().type).toBe("password");
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().value).toBe("newPassword");
    expect(wrapper.find(Visibility).length).toBe(0);
    expect(wrapper.find(VisibilityOff).length).toBe(1);
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password-helper-text").at(0).props().error).toBeTruthy();
    expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().error).toBeTruthy();
    expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().helperText).toBe("confirmErrors");
});

test("handleClickShowPassword functionality", () => {
    let profileData={email:"testedValue@gmail.com" , phoneNumber:123456788};
    let errors={newPasswordErrors:"newPasswordErrors" , confirmErrors:"confirmErrors"};
  let  wrapper = mount(<EditUserProfileByAdmin profileData={profileData} errors={errors} />) ;
  expect(wrapper.find("#edit-profile-by-admin-email").at(0).props().value).toBe("testedValue@gmail.com");
  expect(wrapper.find("#edit-profile-by-admin-tel").at(0).props().value).toBe(123456788);
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().type).toBe("password");
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().value).toBe("");
  expect(wrapper.find(Visibility).length).toBe(0);
  expect(wrapper.find(VisibilityOff).length).toBe(1);
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password-helper-text").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().helperText).toBe("confirmErrors");

  act(() => {
    wrapper
      .find("#iconButton")
      .at(0)
      .props()
      .onClick();
  });
  wrapper.render();
    wrapper.update();

    expect(wrapper.find("#edit-profile-by-admin-email").at(0).props().value).toBe("testedValue@gmail.com");
    expect(wrapper.find("#edit-profile-by-admin-tel").at(0).props().value).toBe(123456788);
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().error).toBeTruthy();
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().type).toBe("text");
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().value).toBe("");
    expect(wrapper.find(Visibility).length).toBe(1);
    expect(wrapper.find(VisibilityOff).length).toBe(0);
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password-helper-text").at(0).props().error).toBeTruthy();
    expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().error).toBeTruthy();
    expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().helperText).toBe("confirmErrors");
});

test("handleMouseDownPassword functionality", () => {
    let profileData={email:"testedValue@gmail.com" , phoneNumber:123456788};
    let errors={newPasswordErrors:"newPasswordErrors" , confirmErrors:"confirmErrors"};
    const preventDefaultMock = jest.fn();
  let  wrapper = mount(<EditUserProfileByAdmin profileData={profileData} errors={errors} />) ;
  expect(wrapper.find("#edit-profile-by-admin-email").at(0).props().value).toBe("testedValue@gmail.com");
  expect(wrapper.find("#edit-profile-by-admin-tel").at(0).props().value).toBe(123456788);
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().type).toBe("password");
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().value).toBe("");
  expect(wrapper.find(Visibility).length).toBe(0);
  expect(wrapper.find(VisibilityOff).length).toBe(1);
  expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password-helper-text").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().error).toBeTruthy();
  expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().helperText).toBe("confirmErrors");

  act(() => {
    wrapper
      .find("#iconButton")
      .at(0)
      .props()
      .onMouseDown({ preventDefault: preventDefaultMock });
  });
  wrapper.render();
    wrapper.update();
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    expect(wrapper.find("#edit-profile-by-admin-email").at(0).props().value).toBe("testedValue@gmail.com");
    expect(wrapper.find("#edit-profile-by-admin-tel").at(0).props().value).toBe(123456788);
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().error).toBeTruthy();
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().type).toBe("password");
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password").at(0).props().value).toBe("");
    expect(wrapper.find(Visibility).length).toBe(0);
    expect(wrapper.find(VisibilityOff).length).toBe(1);
    expect(wrapper.find("#edit-profile-by-admin-outlined-adornment-password-helper-text").at(0).props().error).toBeTruthy();
    expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().error).toBeTruthy();
    expect(wrapper.find("#edit-profile-by-admin-confirmPassword").at(0).props().helperText).toBe("confirmErrors");
});
});
   