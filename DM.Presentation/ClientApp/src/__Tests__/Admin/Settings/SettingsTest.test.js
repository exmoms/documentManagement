import React from "react";
import ReactDom from "react-dom";
import Settings from "../../../components/Admin/Settings/Settings";
import ConfigEmail from "../../../components/Admin/Settings/ConfigEmail";
import SingUp from "../../../components/Admin/Settings/SingUp";
import UsersTable from "../../../components/Admin/Settings/UsersTable";
import { cleanup } from "@testing-library/react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
afterEach(cleanup);
describe("Settings", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(
        <Settings />,
      div
    );
  });

  test("matches snapshot", () => {
    const wrapper = shallow(
        <Settings />
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  test("intialization ProfilePopUpByAdmin", () => {
  let  wrapper = mount(<Settings /> , { attachTo: document.body }) ;
  expect(wrapper.find(ConfigEmail).length).toBe(1);
  expect(wrapper.find(SingUp).length).toBe(1);
  expect(wrapper.find(UsersTable).length).toBe(1);
});
});