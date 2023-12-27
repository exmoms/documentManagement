import React from "react";
import ReactDom from "react-dom";
import BrowseDocuments from "../../components/User/BrowseDocuments";
import { cleanup } from "@testing-library/react";
import { shallow, mount } from "enzyme";
afterEach(cleanup);
it("matches the snapshot", () => {
  const wrapper = mount(<BrowseDocuments data={1} />);
  expect(wrapper).toMatchSnapshot();
});

describe("BrowseDocuments", () => {
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(<BrowseDocuments></BrowseDocuments>, div);
  });
});
