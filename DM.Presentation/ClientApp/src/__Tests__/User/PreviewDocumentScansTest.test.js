import React from "react";
import ReactDom from "react-dom";
import PreviewDocumentScans from "../../components/User/PreviewDocumentScans";
import { cleanup, fireEvent } from "@testing-library/react";
import renderer from "react-test-renderer";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { createMount } from '@material-ui/core/test-utils';
import Dialog from "@material-ui/core/Dialog";
import CardMedia from "@material-ui/core/CardMedia";
import ReactToPrint from "react-to-print";
import * as PostDataMock from "../../api/PostData";
import { DialogContentText } from "@material-ui/core";
afterEach(cleanup);
describe("PreviewDocumentScans", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
      let classes = {buttonUploadScannedDoc:"buttonUploadScannedDoc" , docMediaContainer: "docMediaContainer" , media:"media"};
      let scannedDoc = ["imageURI 1" , "imageURI 2"];
    const div = document.createElement("div");
    ReactDom.render(
      <PreviewDocumentScans
      classes={classes}
      scannedDoc={scannedDoc}
      />,
      div
    );
  });
  test("PreviewDocumentScans matches snapshot", () => {
    let classes = {buttonUploadScannedDoc:"buttonUploadScannedDoc" , docMediaContainer: "docMediaContainer" , media:"media"};
      let scannedDoc = ["imageURI 1" , "imageURI 2"];
    const renderedValue = createMount()(
        <PreviewDocumentScans
        classes={classes}
        scannedDoc={scannedDoc}
      />
      );
      expect(renderedValue.html()).toMatchSnapshot();
  });

  test("Form tests of Document History", () => {
    let classes = {buttonUploadScannedDoc:"buttonUploadScannedDoc" , docMediaContainer: "docMediaContainer" , media:"media"};
    let scannedDoc = ["imageURI 1" , "imageURI 2"];
    const wrapper = mount(
        <PreviewDocumentScans
        classes={classes}
        scannedDoc={scannedDoc}
      />
    );
    expect(wrapper.find(".buttonUploadScannedDoc").length).toBe(1);
    expect(wrapper.find(".docMediaContainer").length).toBe(2);
    expect(wrapper.find(CardMedia).length).toBe(2);
    expect(wrapper.find(CardMedia).at(0).props().image).toBe("imageURI 1");
    expect(wrapper.find(CardMedia).at(1).props().image).toBe("imageURI 2");
  });
  
});