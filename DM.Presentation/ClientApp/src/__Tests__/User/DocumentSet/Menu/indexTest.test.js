import React from "react";
import ReactDom from "react-dom";
import Menu from "../../../../components/User/DocumentSet/Menu/index.js";
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
import { Container, Logo, Img, Name } from "../../../../components/User/DocumentSet/Icon/styles";
import FileIcon from "../../../../components/User/DocumentSet/assets/img/file.png";
import FolderIcon from "../../../../components/User/DocumentSet/assets/img/folder.png";
import UpdateOrPreviewDocumentDialog from "../../../../components/User/UpdateOrPreviewDocumentDialog";
import PrintDocument from "../../../../components/User/PrintDocument";
afterEach(cleanup);

describe("Menu", () => {
    test("renders without crashing", () => {
        let style={};
        const content0 = jest.fn();
        let content=[{info:1,style:{},onClick:content0}];
        const div = document.createElement("div");
        ReactDom.render(<Menu style={style} content={content}/>, div);
      });

    test("Menu matches snapshot", () => {
        let style={};
        const content0 = jest.fn();
        let content=[{info:1,style:{},onClick:content0}];
    const renderedValue = createMount()(
        <Menu style={style} content={content}/>
      );
      expect(renderedValue.html()).toMatchSnapshot();
    });
    
    test("onClick", () => {
        let style={};
        const content0 = jest.fn();
        let content=[{info:1,style:{},onClick:content0}];
        const wrapper = mount(
            <Menu style={style} content={content}/>
          );
          act(() => {
            wrapper
              .find(".content")
              .at(0)
              .props()
              .onClick();
          });
          wrapper.update();
          wrapper.render();
          expect(content0).toHaveBeenCalledTimes(1);


      });
});