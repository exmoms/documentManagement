import React from "react";
import ReactDom from "react-dom";
import PrintDocument from "../../components/User/PrintDocument";
import { cleanup, fireEvent } from "@testing-library/react";
import renderer from "react-test-renderer";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { createMount } from '@material-ui/core/test-utils';
import Dialog from "@material-ui/core/Dialog";
import CardMedia from "@material-ui/core/CardMedia";
import ReactToPrint from "react-to-print";
afterEach(cleanup);
describe("PrintDocument", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
      let open = true;
      let scannedDoc=["url 1" , "url 2"]
    const handleClose = jest.fn();
    const div = document.createElement("div");
    ReactDom.render(
      <PrintDocument
      open={open}
      scannedDoc={scannedDoc}
      handleClose={handleClose}
      />,
      div
    );
  });
  test("PrintDocument matches snapshot", () => {
    let open = true;
      let scannedDoc=["url 1" , "url 2"]
    const handleClose = jest.fn();
    const renderedValue = createMount()(
        <PrintDocument
        open={open}
        scannedDoc={scannedDoc}
        handleClose={handleClose}
        />
      );
      expect(renderedValue.html()).toMatchSnapshot();
  });
  
  test("test intialization", () => {
    let open = true;
      let scannedDoc=["url 1" , "url 2"]
    const handleClose = jest.fn();
    const wrapper = mount(
        <PrintDocument
        open={open}
        scannedDoc={scannedDoc}
        handleClose={handleClose}
        />
      );
      expect(wrapper.find(Dialog).props().open).toBeTruthy();
      expect(wrapper.find(CardMedia).length).toBe(2);
      expect(wrapper.find(CardMedia).at(0).props().image).toBe("url 1");
      expect(wrapper.find(CardMedia).at(1).props().image).toBe("url 2");
  });

  test("test intialization , handleClose mock  with Dialog", () => {
    let open = true;
      let scannedDoc=["url 1" , "url 2"]
    const handleClose = jest.fn();
    const wrapper = mount(
        <PrintDocument
        open={open}
        scannedDoc={scannedDoc}
        handleClose={handleClose}
        />
      );
      act(() => {
        wrapper
          .find(Dialog)
          .at(0)
          .props()
          .onClose();
      });
      wrapper.update();
      expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test("test intialization , handleClose mock  with the Button", () => {
    let open = true;
      let scannedDoc=["url 1" , "url 2"]
    const handleClose = jest.fn();
    const wrapper = mount(
        <PrintDocument
        open={open}
        scannedDoc={scannedDoc}
        handleClose={handleClose}
        />
      );
      act(() => {
        wrapper
          .find("#handelCloseDialogButton")
          .at(0)
          .props()
          .onClick();
      });
      wrapper.update();
      expect(handleClose).toHaveBeenCalledTimes(1);
  });
});