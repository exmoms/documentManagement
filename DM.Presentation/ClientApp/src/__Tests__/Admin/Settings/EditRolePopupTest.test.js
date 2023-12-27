import React from "react";
import ReactDom from "react-dom";
import EditRolePopup from "../../../components/Admin/Settings/EditRolePopup";
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
import DialogTitle from "@material-ui/core/DialogTitle";
import {
    FormControl,
    Input,
    InputLabel,
    MenuItem,
    Select,
  } from "@material-ui/core";
afterEach(cleanup);
describe("EditProfilePopup", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    let user={userId:1 , userName:"userName A" , roles:["Admin"]};
    let action = jest.fn();
    let show= true;
    ReactDom.render(
        <EditRolePopup user={user} show={show} action={action}/>,
      div
    );
  });

  test("matches snapshot", () => {
    let user={userId:1 , userName:"userName A" , roles:["Admin"]};
    let action = jest.fn();
    let show= true;
    const wrapper = shallow(
        <EditRolePopup user={user} show={show} action={action} />
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  test("intialization EditRolePopup , onClose ,onChange", () => {
    let user={userId:1 , userName:"userName A" , roles:["Admin"]};
    let user2={userId:1 , userName:"userName B" , roles:["SuperAdmin"]};
    let action = jest.fn();
    let show= true;
  let  wrapper = mount(<EditRolePopup user={user} show={show} action={action}/>) ;
  expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
  expect(wrapper.find(DialogTitle).at(0).text()).toBe("edit_user_role : userName A");
  expect(wrapper.find("#demo-mutiple-chip").at(0).props().value).toBe("");
  expect(wrapper.find("#notification").at(0).props().open).toBeFalsy();
  expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
  expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]);
  act(()=>{
    wrapper.setProps({user:user2});
  })
  
  wrapper.render();
  wrapper.update();
  expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
  expect(wrapper.find(DialogTitle).at(0).text()).toBe("edit_user_role : userName B");
  expect(wrapper.find("#demo-mutiple-chip").at(0).props().value).toBe("SuperAdmin");
  expect(wrapper.find("#notification").at(0).props().open).toBeFalsy();
  expect(wrapper.find("#notification").at(0).props().error).toBeFalsy();
  expect(wrapper.find("#notification").at(0).props().errorMessage).toStrictEqual([]);
  act(()=>{
    wrapper.find(Dialog).at(0).props().onClose();
  })
  
  wrapper.render();
  wrapper.update();
  expect(action).toHaveBeenCalledTimes(1);
 expect(action.mock.calls[0][0]).toBeFalsy();
 expect(action.mock.calls[0][1]).toBeFalsy();
 act(()=>{
    wrapper.find("#demo-mutiple-chip").at(0).props().onChange({ target: { value: 'SuperAdmins'} });
  })
  
  wrapper.render();
  wrapper.update();
  expect(wrapper.find("#demo-mutiple-chip").at(0).props().value).toBe("SuperAdmins");
});
test("handelSubmit when  res is ok and this.state.currentRole !== this.state.selectedRole is false", () => {
    const mockSuccessResponsePost ={ok :true};
    const mockJsonPromisePost = Promise.resolve(mockSuccessResponsePost);
    const PostMock = jest.spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromisePost);
    const preventDefaultMock = jest.fn();
    let user={userId:1 , userName:"userName A" , roles:["Admin"]};
    let user2={userId:1 , userName:"userName B" , roles:["SuperAdmin"]};
    let action = jest.fn();
    let show= true;
    let  wrapper = mount(<EditRolePopup user={user} show={show} action={action}/>);
    act(()=>{
        wrapper.setProps({user:user2});
      })
      wrapper.render();
      wrapper.update();
    return mockJsonPromisePost.then(() => {
        act(() => {
            wrapper
              .find("#submit-btn")
              .at(0)
              .props()
              .onClick({ preventDefault:preventDefaultMock});
          });
    }).then(() => {
        wrapper.render();
        wrapper.update();
        
        expect(preventDefaultMock).toHaveBeenCalledTimes(1);
        expect(PostMock).toHaveBeenCalledTimes(1);
        expect(PostMock.mock.calls[0][0]).toBe("/api/user/EditUserRoles");
        expect(PostMock.mock.calls[0][1]).toStrictEqual({"AssignedRoles": [], "UnassignedRoles": [], "userId": 1});
        expect(wrapper.find("#notification").at(0).props().open).toBeTruthy();
    });

  });

//   test("handelSubmit when  res isn' ok ", (done) => {
//     let mockSuccessErrorPromise = { error: ["errorMessage"] };
//     let mockSuccessError = Promise.resolve(mockSuccessErrorPromise);
//     const mockSuccessResponsePost = Promise.resolve({
//       ok: false,
//       json: () => mockSuccessError,
//     });
//     const PostMock = jest
//       .spyOn(PostDataMock, "postDataToAPI")
//       .mockReturnValue(mockSuccessResponsePost);
//     const preventDefaultMock = jest.fn();
//     let user={userId:1 , userName:"userName A" , roles:["user"]};
//     let user2={userId:1 , userName:"userName B" , roles:["Admin"]};
//     let action = jest.fn();
//     let show= true;
//     let wrapper = shallow(<EditRolePopup user={user} show={show} action={action}/>);
//     act(()=>{
//         wrapper.setProps({user:user2});
//       })
//       wrapper.render();
//       wrapper.update();
//     act(()=>{
//         wrapper.find("#demo-mutiple-chip").at(0).props().onChange({ target: { value: 'SuperAdmin'} });
//       })
//       wrapper.render();
//       wrapper.update();
//       expect(wrapper.find("#demo-mutiple-chip").at(0).props().value).toBe("SuperAdmin");
//     act(() => {
//         wrapper
//           .find("#submit-btn")
//           .at(0)
//           .props()
//           .onClick({ preventDefault:preventDefaultMock});
//       });
//     wrapper.update();
//     wrapper.render();

//     expect(preventDefaultMock).toHaveBeenCalledTimes(1);
//         expect(PostMock).toHaveBeenCalledTimes(1);
//         expect(PostMock.mock.calls[0][0]).toBe("/api/user/EditUserRoles");
//     expect(PostMock.mock.calls[0][1]).toStrictEqual();
//     process.nextTick(() => {

//       expect(wrapper.find("#notification").props().open).toBeTruthy();
//       expect(wrapper.find("#notification").props().error).toBeTruthy();
//       expect(wrapper.find("#notification").props().errorMessage).toStrictEqual([
//         "errorMessage",
//       ]);
//       expect(action).toHaveBeenCalledTimes(1);
//         expect(action.mock.calls[0][0]).toBeFalsy();
//       done(); 
//     });
//   });
});