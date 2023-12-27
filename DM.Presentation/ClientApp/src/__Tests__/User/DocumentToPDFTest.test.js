import React from "react";
import ReactDom from "react-dom";
import DocumentToPDF from "../../components/User/DocumentToPDF";
import { cleanup } from "@testing-library/react";
import { mount } from "enzyme";
import { shallow } from "enzyme";
import { act } from "react-dom/test-utils";
import { Document, Page, StyleSheet, Image, View } from "@react-pdf/renderer";
afterEach(cleanup);
describe("DocumentToPDF", () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    let scans = ["ImageSrc1" , "ImageSrc2"];
    ReactDom.render(
      <DocumentToPDF
      scans={scans}
      />,
      div
    );
  });

  it("matches the snapshot", () => {
    let scans = ["ImageSrc1" , "ImageSrc2"];
    const wrapper = mount(
        <DocumentToPDF
      scans={scans}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  test("Form tests of Document History", () => {
    let scans = ["ImageSrc1" , "ImageSrc2"];
    const wrapper = mount(
        <DocumentToPDF
      scans={scans}
      />
    );
    expect(wrapper.find(Page).length).toBe(2);
    expect(wrapper.find(Image).length).toBe(2);
    expect(wrapper.find(Image).at(0).props().src).toBe("ImageSrc1");
    expect(wrapper.find(Image).at(1).props().src).toBe("ImageSrc2");
  });
});