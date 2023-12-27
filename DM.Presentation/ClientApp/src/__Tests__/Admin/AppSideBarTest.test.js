
import React from "react";
import ReactDom from "react-dom";
import AppSideBar from "../../components/Admin/AppSideBar";
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
afterEach(cleanup);
describe("AppSideBar", () => {
   afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    const onClose = jest.fn();
    let user={role:"Admin"};
    let open = true;
    ReactDom.render(
        <Router> <AppSideBar user={user} open={open} onClose={onClose}/></Router>,
      div
    );
  });

  test("matches snapshot", () => {
    const onClose = jest.fn();
    let user={role:"Admin"};
    let open = true;
    const wrapper = shallow(
        <Router> <AppSideBar user={user} open={open} onClose={onClose}/></Router>
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  
  test("intialization AppSideBar when role ia admin", () => {
    const onClose = jest.fn();
    let user={role:"Admin"};
    let open = true;
    let  wrapper = mount(<Router> <AppSideBar user={user} open={open} onClose={onClose}/></Router>) ;
    expect(wrapper.find("#drawer1").at(0).props().container).toBe();
    expect(wrapper.find("#drawer1").at(0).props().open).toBeTruthy();
    expect(wrapper.find(List).length).toBe(4);
  });

  test("intialization AppSideBar when role ia user", () => {
    const onClose = jest.fn();
    let user={role:"User"};
    let open = true;
    let  wrapper = mount(<Router> <AppSideBar user={user} open={open} onClose={onClose}/></Router>) ;
    expect(wrapper.find("#drawer1").at(0).props().container).toBe();
    expect(wrapper.find("#drawer1").at(0).props().open).toBeTruthy();
    expect(wrapper.find(List).length).toBe(2);
  });
});