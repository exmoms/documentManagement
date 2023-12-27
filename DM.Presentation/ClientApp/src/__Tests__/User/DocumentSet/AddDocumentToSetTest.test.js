import React from "react";
import ReactDom from "react-dom";
import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import { createMount } from '@material-ui/core/test-utils';
import Dialog from "@material-ui/core/Dialog";
import { Fragment } from "react";
import ListItem from "@material-ui/core/ListItem";
import AddDocumentToSet from "../../../components/User/DocumentSet/AddDocumentToSet";
import SearchDocuments from "../../../components/User/SearchDocuments";
import DocumentTable from "../../../components/User/DocumentTable";
import Button from "@material-ui/core/Button";
afterEach(cleanup);

describe("AddDocumentToSet", () => {
    test("renders without crashing", () => {
        let show=true;
        const action = jest.fn();
        let set={id:1};
        const div = document.createElement("div");
        ReactDom.render(<AddDocumentToSet show={show} action={action} set={set}/>, div);
      });

    test("AddDocumentToSet matches snapshot", () => {
        let show=true;
        const action = jest.fn();
        let set={id:1};
    const renderedValue = createMount()(
        <AddDocumentToSet show={show} action={action} set={set}/>
      );
      expect(renderedValue.html()).toMatchSnapshot();
    });

    test("intializations", () => {
      let show=true;
      const action = jest.fn();
      let set={id:1};
      let wrapper = mount(
        <AddDocumentToSet
        show={show} action={action} set={set}
        />
      );
      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
      expect(wrapper.find(SearchDocuments).at(0).props().setIdExclude).toBe(1);
      expect(wrapper.find(DocumentTable).at(0).props().set).toBe(set);
      expect(wrapper.find(DocumentTable).at(0).props().data).toStrictEqual([]);
      expect(wrapper.find(DocumentTable).at(0).props().columns).toStrictEqual([]);
    });

    test("getDocumentList and handleClose for dialog", () => {
      let show=true;
      const action = jest.fn();
      let set={id:1};
      let list=[{id: 1},{id: 2}];
      let columns=[{id: 3},{id: 4}];
      let wrapper = mount(
        <AddDocumentToSet
        show={show} action={action} set={set}
        />
      );
      act(() => {
        wrapper
          .find(SearchDocuments)
          .at(0)
          .props()
          .getDocumentList(list,columns);
      });
      wrapper.update();
      wrapper.render();
      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
      expect(wrapper.find(SearchDocuments).at(0).props().setIdExclude).toBe(1);
      expect(wrapper.find(DocumentTable).at(0).props().set).toBe(set);
      expect(wrapper.find(DocumentTable).at(0).props().data).toStrictEqual(list);
      expect(wrapper.find(DocumentTable).at(0).props().columns).toStrictEqual(columns);

      act(() => {
        wrapper
          .find(Dialog)
          .at(0)
          .props()
          .onClose();
      });
      wrapper.update();
      wrapper.render();

      expect(wrapper.find(DocumentTable).at(0).props().data).toStrictEqual([]);
      expect(wrapper.find(DocumentTable).at(0).props().columns).toStrictEqual([]);
      expect(action).toHaveBeenCalledTimes(1);
    })

    test("getDocumentList and handleClose for DocumentTable", () => {
      let show=true;
      const action = jest.fn();
      let set={id:1};
      let list=[{id: 1},{id: 2}];
      let columns=[{id: 3},{id: 4}];
      let wrapper = mount(
        <AddDocumentToSet
        show={show} action={action} set={set}
        />
      );
      act(() => {
        wrapper
          .find(SearchDocuments)
          .at(0)
          .props()
          .getDocumentList(list,columns);
      });
      wrapper.update();
      wrapper.render();
      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
      expect(wrapper.find(SearchDocuments).at(0).props().setIdExclude).toBe(1);
      expect(wrapper.find(DocumentTable).at(0).props().set).toBe(set);
      expect(wrapper.find(DocumentTable).at(0).props().data).toStrictEqual(list);
      expect(wrapper.find(DocumentTable).at(0).props().columns).toStrictEqual(columns);

      act(() => {
        wrapper
          .find(DocumentTable)
          .at(0)
          .props()
          .handleClose();
      });
      wrapper.update();
      wrapper.render();

      expect(wrapper.find(DocumentTable).at(0).props().data).toStrictEqual([]);
      expect(wrapper.find(DocumentTable).at(0).props().columns).toStrictEqual([]);
      expect(action).toHaveBeenCalledTimes(1);
    })

    test("getDocumentList and handleClose", () => {
      let show=true;
      const action = jest.fn();
      let set={id:1};
      let list=[{id: 1},{id: 2}];
      let columns=[{id: 3},{id: 4}];
      let wrapper = mount(
        <AddDocumentToSet
        show={show} action={action} set={set}
        />
      );
      act(() => {
        wrapper
          .find(SearchDocuments)
          .at(0)
          .props()
          .getDocumentList(list,columns);
      });
      wrapper.update();
      wrapper.render();
      expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
      expect(wrapper.find(SearchDocuments).at(0).props().setIdExclude).toBe(1);
      expect(wrapper.find(DocumentTable).at(0).props().set).toBe(set);
      expect(wrapper.find(DocumentTable).at(0).props().data).toStrictEqual(list);
      expect(wrapper.find(DocumentTable).at(0).props().columns).toStrictEqual(columns);

      act(() => {
        wrapper
          .find(DocumentTable)
          .at(0)
          .props()
          .handleClose();
      });
      wrapper.update();
      wrapper.render();

      expect(wrapper.find(DocumentTable).at(0).props().data).toStrictEqual([]);
      expect(wrapper.find(DocumentTable).at(0).props().columns).toStrictEqual([]);
      expect(action).toHaveBeenCalledTimes(1);
    })

});