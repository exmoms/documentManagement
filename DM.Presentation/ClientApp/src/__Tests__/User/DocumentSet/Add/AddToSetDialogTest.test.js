import React from "react";
import ReactDom from "react-dom";
import AddToSetDialog from "../../../../components/User/DocumentSet/Add/AddToSetDialog";
import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import { createMount } from '@material-ui/core/test-utils';
import Dialog from "@material-ui/core/Dialog";
import { Fragment } from "react";
import ListItem from "@material-ui/core/ListItem";
import { FOLDER, FILE } from "../../../../components/User/DocumentSet/utils/constants";
afterEach(cleanup);

describe("AddToSetDialog", () => {

    test("renders without crashing", () => {
        let show = true;
        let set={id:1};
        const action = jest.fn();
        const div = document.createElement("div");
        ReactDom.render(<AddToSetDialog show={show} set={set} action={action}/>, div);
      });

    test("AddToSetDialog matches snapshot", () => {
        let show = true;
        let set={id:1};
        const action = jest.fn();
    const renderedValue = createMount()(
        <AddToSetDialog show={show} set={set} action={action}/>
      );
      expect(renderedValue.html()).toMatchSnapshot();
    });
   
    test("AddToSetDialog test intialization", () => {
        let show = true;
        let set1={id:0};
        const action = jest.fn();
        const wrapper = mount(
            <AddToSetDialog show={show} set={set1} action={action}/>
          );
          expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
          expect(wrapper.find(ListItem).length).toBe(1);
          wrapper.setProps({set:{id:1}});
          wrapper.update();
          wrapper.render();
          expect(wrapper.find(ListItem).length).toBe(3);
      });
     
      test("handleClose prop", () => {
        let show = true;
        let set1={id:1};
        const action = jest.fn();
        const wrapper = mount(
            <AddToSetDialog show={show} set={set1} action={action}/>
          );
          act(() => {
            wrapper
              .find(Dialog)
              .at(0)
              .props()
              .onClose();
          });
          wrapper.render();
          wrapper.update();
          expect(action).toHaveBeenCalledTimes(1);
          expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
          expect(wrapper.find(ListItem).length).toBe(3);
      });

      test("action(FOLDER, true) prop", () => {
        let show = true;
        let set1={id:1};
        const action = jest.fn();
        const wrapper = mount(
            <AddToSetDialog show={show} set={set1} action={action}/>
          );
          act(() => {
            wrapper
              .find(ListItem)
              .at(0)
              .props()
              .onClick();
          });
          wrapper.render();
          wrapper.update();
          expect(action).toHaveBeenCalledTimes(1);
          expect(action.mock.calls[0][0]).toBe(FOLDER);
          expect(action.mock.calls[0][1]).toBeTruthy();
          expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
          expect(wrapper.find(ListItem).length).toBe(3);
      });
      
      test("action(FILE) prop", () => {
        let show = true;
        let set1={id:1};
        const action = jest.fn();
        const wrapper = mount(
            <AddToSetDialog show={show} set={set1} action={action}/>
          );
          act(() => {
            wrapper
              .find(ListItem)
              .at(2)
              .props()
              .onClick();
          });
          wrapper.render();
          wrapper.update();
          expect(action).toHaveBeenCalledTimes(1);
          expect(action.mock.calls[0][0]).toBe(FILE);
          expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
          expect(wrapper.find(ListItem).length).toBe(3);
      });

}); 