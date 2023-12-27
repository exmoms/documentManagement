import React from "react";
import ReactDom from "react-dom";
import Add from "../../../../components/User/DocumentSet/Add/index";
import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import { createMount } from '@material-ui/core/test-utils';
import Dialog from "@material-ui/core/Dialog";
import { Fragment } from "react";
import ListItem from "@material-ui/core/ListItem";
import { FOLDER, FILE } from "../../../../components/User/DocumentSet/utils/constants";
import AddToSetDialog from "../../../../components/User/DocumentSet/Add/AddToSetDialog";
import AddDocumentToSet from "../../../../components/User/DocumentSet/AddDocumentToSet";
import AddExistingSetToSet from "../../../../components/User/DocumentSet/AddExistingSetToSet";
import CreateDocumentSet from "../../../../components/User/DocumentSet/CreateDocumentSet";
afterEach(cleanup);

describe("index", () => {

    test("renders without crashing", () => {
        let set={id:1};
        const div = document.createElement("div");
        ReactDom.render(<Add set={set}/>, div);
      });

    test("index matches snapshot", () => {
        let set={id:1};
    const renderedValue = createMount()(
        <Add set={set}/>
      );
      expect(renderedValue.html()).toMatchSnapshot();
    });
   
    test("index test intialization", () => {
        let set={id:1};
        const wrapper = mount(
            <Add set={set}/>
          );
          expect(wrapper.find(AddToSetDialog).length).toBe(1);
          expect(wrapper.find(AddToSetDialog).at(0).props().set).toStrictEqual(set);
          expect(wrapper.find(AddToSetDialog).at(0).props().show).toBeFalsy();

          expect(wrapper.find(AddDocumentToSet).length).toBe(0);

          expect(wrapper.find(AddExistingSetToSet).length).toBe(0);

          expect(wrapper.find(CreateDocumentSet).length).toBe(0);
      });

      test("handleChoice when (type === FOLDER) and isNew", () => {
        let set={id:1};
        let type=FOLDER;
        let isNew=true;
        const wrapper = mount(
            <Add set={set}/>
          );

          act(() => {
            wrapper
              .find(AddToSetDialog)
              .at(0)
              .props()
              .action(type,isNew);
          });
          wrapper.render();
          wrapper.update();
          expect(wrapper.find(AddToSetDialog).length).toBe(1);
          expect(wrapper.find(AddToSetDialog).at(0).props().set).toStrictEqual(set);
          expect(wrapper.find(AddToSetDialog).at(0).props().show).toBeFalsy();

          expect(wrapper.find(AddDocumentToSet).length).toBe(0);

          expect(wrapper.find(AddExistingSetToSet).length).toBe(0);

          expect(wrapper.find(CreateDocumentSet).length).toBe(1);
          expect(wrapper.find(CreateDocumentSet).at(0).props().set).toStrictEqual(set);
          expect(wrapper.find(CreateDocumentSet).at(0).props().show).toBeTruthy();
      });

      test("handleChoice when (type === FOLDER) and isNew == false", () => {
        let set={id:1};
        let type=FOLDER;
        let isNew=false;
        const wrapper = mount(
            <Add set={set}/>
          );

          act(() => {
            wrapper
              .find(AddToSetDialog)
              .at(0)
              .props()
              .action(type,isNew);
          });
          wrapper.render();
          wrapper.update();
          expect(wrapper.find(AddToSetDialog).length).toBe(1);
          expect(wrapper.find(AddToSetDialog).at(0).props().set).toStrictEqual(set);
          expect(wrapper.find(AddToSetDialog).at(0).props().show).toBeFalsy();

          expect(wrapper.find(AddDocumentToSet).length).toBe(0);

          expect(wrapper.find(AddExistingSetToSet).length).toBe(1);
          expect(wrapper.find(AddExistingSetToSet).at(0).props().set).toStrictEqual(set);
          expect(wrapper.find(AddExistingSetToSet).at(0).props().show).toBeTruthy();

          expect(wrapper.find(CreateDocumentSet).length).toBe(0);
      });
     
      test("handleChoice when (type === FILE)", () => {
        let set={id:1};
        let type=FILE;
        let isNew=false;
        const wrapper = mount(
            <Add set={set}/>
          );

          act(() => {
            wrapper
              .find(AddToSetDialog)
              .at(0)
              .props()
              .action(type,isNew);
          });
          wrapper.render();
          wrapper.update();
          expect(wrapper.find(AddToSetDialog).length).toBe(1);
          expect(wrapper.find(AddToSetDialog).at(0).props().set).toStrictEqual(set);
          expect(wrapper.find(AddToSetDialog).at(0).props().show).toBeFalsy();

          expect(wrapper.find(AddDocumentToSet).length).toBe(1);
          expect(wrapper.find(AddDocumentToSet).at(0).props().set).toStrictEqual(set);
          expect(wrapper.find(AddDocumentToSet).at(0).props().show).toBeTruthy();

          expect(wrapper.find(AddExistingSetToSet).length).toBe(0);

          expect(wrapper.find(CreateDocumentSet).length).toBe(0);
      });
     
      test("handleChoice when (type is not FOLDER , FILE )", () => {
        let set={id:1};
        let type="";
        let isNew=false;
        const wrapper = mount(
            <Add set={set}/>
          );

          act(() => {
            wrapper
              .find(AddToSetDialog)
              .at(0)
              .props()
              .action(type,isNew);
          });
          wrapper.render();
          wrapper.update();
          expect(wrapper.find(AddToSetDialog).length).toBe(1);
          expect(wrapper.find(AddToSetDialog).at(0).props().set).toStrictEqual(set);
          expect(wrapper.find(AddToSetDialog).at(0).props().show).toBeFalsy();

          expect(wrapper.find(AddDocumentToSet).length).toBe(0);

          expect(wrapper.find(AddExistingSetToSet).length).toBe(0);

          expect(wrapper.find(CreateDocumentSet).length).toBe(0);
      });
    
      test("closeAddDocument", () => {
        let set={id:1};
        let type=FILE;
        let isNew=false;
        const wrapper = mount(
            <Add set={set}/>
          );

          act(() => {
            wrapper
              .find(AddToSetDialog)
              .at(0)
              .props()
              .action(type,isNew);
          });
          wrapper.render();
          wrapper.update();
          expect(wrapper.find(AddToSetDialog).length).toBe(1);
          expect(wrapper.find(AddToSetDialog).at(0).props().set).toStrictEqual(set);
          expect(wrapper.find(AddToSetDialog).at(0).props().show).toBeFalsy();

          expect(wrapper.find(AddDocumentToSet).length).toBe(1);
          expect(wrapper.find(AddDocumentToSet).at(0).props().set).toStrictEqual(set);
          expect(wrapper.find(AddDocumentToSet).at(0).props().show).toBeTruthy();

          expect(wrapper.find(AddExistingSetToSet).length).toBe(0);

          expect(wrapper.find(CreateDocumentSet).length).toBe(0);
          act(() => {
            wrapper
              .find(AddDocumentToSet)
              .at(0)
              .props()
              .action();
          });
          wrapper.render();
          wrapper.update();

          expect(wrapper.find(AddDocumentToSet).length).toBe(0);
      });
      
      test("closeAddExistingSet", () => {
        let set={id:1};
        let type=FOLDER;
        let isNew=false;
        const wrapper = mount(
            <Add set={set}/>
          );

          act(() => {
            wrapper
              .find(AddToSetDialog)
              .at(0)
              .props()
              .action(type,isNew);
          });
          wrapper.render();
          wrapper.update();
          expect(wrapper.find(AddToSetDialog).length).toBe(1);
          expect(wrapper.find(AddToSetDialog).at(0).props().set).toStrictEqual(set);
          expect(wrapper.find(AddToSetDialog).at(0).props().show).toBeFalsy();

          expect(wrapper.find(AddDocumentToSet).length).toBe(0);

          expect(wrapper.find(AddExistingSetToSet).length).toBe(1);
          expect(wrapper.find(AddExistingSetToSet).at(0).props().set).toStrictEqual(set);
          expect(wrapper.find(AddExistingSetToSet).at(0).props().show).toBeTruthy();

          expect(wrapper.find(CreateDocumentSet).length).toBe(0);

          act(() => {
            wrapper
              .find(AddExistingSetToSet)
              .at(0)
              .props()
              .action();
          });
          wrapper.render();
          wrapper.update();

          expect(wrapper.find(AddExistingSetToSet).length).toBe(0);
      });
     
      test("closeAddNewSet", () => {
        let set={id:1};
        let type=FOLDER;
        let isNew=true;
        const wrapper = mount(
            <Add set={set}/>
          );

          act(() => {
            wrapper
              .find(AddToSetDialog)
              .at(0)
              .props()
              .action(type,isNew);
          });
          wrapper.render();
          wrapper.update();
          expect(wrapper.find(AddToSetDialog).length).toBe(1);
          expect(wrapper.find(AddToSetDialog).at(0).props().set).toStrictEqual(set);
          expect(wrapper.find(AddToSetDialog).at(0).props().show).toBeFalsy();

          expect(wrapper.find(AddDocumentToSet).length).toBe(0);

          expect(wrapper.find(AddExistingSetToSet).length).toBe(0);

          expect(wrapper.find(CreateDocumentSet).length).toBe(1);
          expect(wrapper.find(CreateDocumentSet).at(0).props().set).toStrictEqual(set);
          expect(wrapper.find(CreateDocumentSet).at(0).props().show).toBeTruthy();

          act(() => {
            wrapper
              .find(CreateDocumentSet)
              .at(0)
              .props()
              .action();
          });
          wrapper.render();
          wrapper.update();
          expect(wrapper.find(CreateDocumentSet).length).toBe(0);
      });

});