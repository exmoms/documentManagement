import React from "react";
import ReactDom from "react-dom";
import UsersTable from "../../../components/Admin/Settings/UsersTable";
import EditProfilePopup from "../../../components/Admin/Settings/EditProfilePopup";
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
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import LinearProgress from "@material-ui/core/LinearProgress";
import MaterialTable from "material-table";
afterEach(cleanup);
describe("UsersTable", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(
        <UsersTable />,
      div
    );
  });

  test("matches snapshot", () => {
    const wrapper = shallow(
        <UsersTable/>
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test("intialization UsersTable", () => {
    let  wrapper = mount(<UsersTable/>) ;
    expect(wrapper.find(MaterialTable).at(0).props().data).toStrictEqual([]);
    expect(wrapper.find(MaterialTable).at(0).props().columns[0].title).toBe("userid");
    expect(wrapper.find(MaterialTable).at(0).props().columns[0].field).toBe("userId");

    expect(wrapper.find(MaterialTable).at(0).props().columns[1].title).toBe("username");
    expect(wrapper.find(MaterialTable).at(0).props().columns[1].field).toBe("userName");

    expect(wrapper.find(MaterialTable).at(0).props().columns[2].title).toBe("role_label");
    expect(wrapper.find(MaterialTable).at(0).props().columns[2].field).toBe("role");
    expect(wrapper.find(MaterialTable).at(0).props().columns[2].hidden).toBeTruthy();

    expect(wrapper.find(EditProfilePopup).at(0).props().show).toBeFalsy();
    expect(wrapper.find(EditProfilePopup).at(0).props().user).toStrictEqual({
        userId: 0,
        userName: "",
      });
  });
   
  test("componentDidMount", () => {
    const mockSuccessResponse = [{id:1 , name:"Name A"} , {id:2 , name:"Name B"}];
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise);
    let wrapper;
    return mockJsonPromise.then(() => {
      wrapper = mount(<UsersTable />) ;
    }).then(() => {
        wrapper.render();
        wrapper.update();
        expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe("/api/user/lessRoleUsers");
      expect(wrapper.find(MaterialTable).at(0).props().data).toStrictEqual(mockSuccessResponse);
    expect(wrapper.find(EditProfilePopup).at(0).props().show).toBeFalsy();
    expect(wrapper.find(EditProfilePopup).at(0).props().user).toStrictEqual({
        userId: 0,
        userName: "",
      });
    });
});

test("showPopup functionality", () => {
    let  wrapper = mount(<UsersTable/>) ;
    expect(wrapper.find(MaterialTable).at(0).props().data).toStrictEqual([]);
    expect(wrapper.find(MaterialTable).at(0).props().columns[0].title).toBe("userid");
    expect(wrapper.find(MaterialTable).at(0).props().columns[0].field).toBe("userId");

    expect(wrapper.find(MaterialTable).at(0).props().columns[1].title).toBe("username");
    expect(wrapper.find(MaterialTable).at(0).props().columns[1].field).toBe("userName");

    expect(wrapper.find(MaterialTable).at(0).props().columns[2].title).toBe("role_label");
    expect(wrapper.find(MaterialTable).at(0).props().columns[2].field).toBe("role");
    expect(wrapper.find(MaterialTable).at(0).props().columns[2].hidden).toBeTruthy();

    expect(wrapper.find(EditProfilePopup).at(0).props().show).toBeFalsy();
    expect(wrapper.find(EditProfilePopup).at(0).props().user).toStrictEqual({
        userId: 0,
        userName: "",
      });
      act(() => {
        wrapper
          .find(EditProfilePopup)
          .at(0)
          .props()
          .action(true);
      });
      wrapper.render();
        wrapper.update();
    expect(wrapper.find(MaterialTable).at(0).props().data).toStrictEqual([]);
    expect(wrapper.find(MaterialTable).at(0).props().columns[0].title).toBe("userid");
    expect(wrapper.find(MaterialTable).at(0).props().columns[0].field).toBe("userId");

    expect(wrapper.find(MaterialTable).at(0).props().columns[1].title).toBe("username");
    expect(wrapper.find(MaterialTable).at(0).props().columns[1].field).toBe("userName");

    expect(wrapper.find(MaterialTable).at(0).props().columns[2].title).toBe("role_label");
    expect(wrapper.find(MaterialTable).at(0).props().columns[2].field).toBe("role");
    expect(wrapper.find(MaterialTable).at(0).props().columns[2].hidden).toBeTruthy();

    expect(wrapper.find(EditProfilePopup).at(0).props().show).toBeTruthy();
    expect(wrapper.find(EditProfilePopup).at(0).props().user).toStrictEqual({
        userId: 0,
        userName: "",
      });
  });
  test("editUserProfile functionality", () => {
    let  wrapper = mount(<UsersTable/>) ;
    act(() => {
        wrapper.find(MaterialTable).props().actions[0].onClick({ target: { value: ''} } , {
            userId: 1,
            userName: "testedValue",
            roles:["Admin"]
          })
      });
      wrapper.update();
      wrapper.render();
    expect(wrapper.find(MaterialTable).at(0).props().data).toStrictEqual([]);
    expect(wrapper.find(MaterialTable).at(0).props().columns[0].title).toBe("userid");
    expect(wrapper.find(MaterialTable).at(0).props().columns[0].field).toBe("userId");

    expect(wrapper.find(MaterialTable).at(0).props().columns[1].title).toBe("username");
    expect(wrapper.find(MaterialTable).at(0).props().columns[1].field).toBe("userName");

    expect(wrapper.find(MaterialTable).at(0).props().columns[2].title).toBe("role_label");
    expect(wrapper.find(MaterialTable).at(0).props().columns[2].field).toBe("role");
    expect(wrapper.find(MaterialTable).at(0).props().columns[2].hidden).toBeTruthy();

    expect(wrapper.find(EditProfilePopup).at(0).props().show).toBeTruthy();
    expect(wrapper.find(EditProfilePopup).at(0).props().user).toStrictEqual({
      userId: 1,
      userName: "testedValue",
      roles:["Admin"]
    });
    expect(wrapper.find(EditRolePopup).at(0).props().show).toBeFalsy();
    expect(wrapper.find(EditRolePopup).at(0).props().user).toStrictEqual({
      userId: 1,
      userName: "testedValue",
      roles:["Admin"]
    });
  });

  test("composeTableActions functionality ", () => {
    const mockSuccessResponse = [{id:1 , name:"Name A"} , {id:2 , name:"Name B"}];
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise);
    const mockJson = "SuperAdmin";
    const getItemMock =  jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => mockJson);
    let  wrapper = mount(<UsersTable/>) ;
    // expect(getItemMock).toHaveBeenCalledTimes(2);
    // expect(getItemMock.mock.calls[0][0]).toBe("userRole");
    expect(wrapper.find(MaterialTable).props().actions.length).toBe(2)
    act(() => {
      wrapper.find(MaterialTable).props().actions[1].onClick({ target: { value: ''} } , {
          userId: 1,
          userName: "testedValue",
          roles:["Admin"]
        })
    });
    wrapper.update();
    wrapper.render();
    expect(wrapper.find(EditRolePopup).at(0).props().show).toBeTruthy();
    expect(wrapper.find(EditRolePopup).at(0).props().user).toStrictEqual({
      userId: 1,
      userName: "testedValue",
      roles:["Admin"]
    });
    let flag1=false;
    let show1 = false;
    act(() => {
      wrapper.find(EditRolePopup).props().action(show1,flag1)
    });
    wrapper.update();
    wrapper.render();
    expect(wrapper.find(EditRolePopup).at(0).props().show).toBeFalsy();
    return mockJsonPromise.then(() => {
      let flag2=true;
    let show2 = true;
      act(() => {
        wrapper.find(EditRolePopup).props().action(show2,flag2)
      });
    }).then(() => {
      wrapper.render();
      wrapper.update();
      expect(fetchMock).toHaveBeenCalledTimes(3);
      expect(fetchMock.mock.calls[0][0]).toBe("/api/user/lessRoleUsers");
      expect(fetchMock.mock.calls[1][0]).toBe("/api/user/1");
      expect(fetchMock.mock.calls[2][0]).toBe("/api/user/lessRoleUsers");
      expect(wrapper.find(EditRolePopup).at(0).props().show).toBeTruthy();
      expect(wrapper.find(MaterialTable).at(0).props().data).toStrictEqual(mockSuccessResponse);
    });
  });
  });
