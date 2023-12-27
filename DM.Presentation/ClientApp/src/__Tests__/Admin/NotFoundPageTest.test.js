
import React from "react";
import ReactDom from "react-dom";
import NotFoundPage from "../../components/Admin/NotFoundPage";
import { cleanup } from "@testing-library/react";
import { shallow , mount} from "enzyme";
import toJSON from "enzyme-to-json";

afterEach(cleanup);
describe("NotFoundPage", () => {
   afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(<NotFoundPage/>,div
    );
  });

  test("matches snapshot", () => {
    const wrapper = shallow(
        <NotFoundPage/>
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
   
  test("Returned value", () => {
    let  wrapper = mount(<NotFoundPage/>);
    expect(wrapper.text()).toBe("404 Not found Page!");
  });

});