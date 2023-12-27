import React from "react";
import ReactDom from "react-dom";
import Icon from "../../../../components/User/DocumentSet/Icon/index.js";
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
import Menu from "../../../../components/User/DocumentSet/Menu";
afterEach(cleanup);

describe("Index", () => {
    test("renders without crashing", () => {
        let set={id:1};
        const enterFolder = jest.fn();
        const refreshSet = jest.fn();
        const showNotification = jest.fn();
        let entry={id:1 , name:"name A" , documentName:"documentName A" ,latestVersion :2};
        let type=FOLDER;
        const div = document.createElement("div");
        ReactDom.render(<Icon set={set} enterFolder={enterFolder} refreshSet={refreshSet} showNotification={showNotification} entry={entry} type={type}/>, div);
      });

    test("Icon matches snapshot", () => {
        let set={id:1};
        const enterFolder = jest.fn();
        const refreshSet = jest.fn();
        const showNotification = jest.fn();
        let entry={id:1 , name:"name A" , documentName:"documentName A" ,latestVersion :2};
        let type=FOLDER;
    const renderedValue = createMount()(
        <Icon set={set} enterFolder={enterFolder} refreshSet={refreshSet} showNotification={showNotification} entry={entry} type={type}/>
      );
      expect(renderedValue.html()).toMatchSnapshot();
    });
   
    test("intializations", () => {
        let set={id:1};
        const enterFolder = jest.fn();
        const refreshSet = jest.fn();
        const showNotification = jest.fn();
        let entry={id:1 , name:"name A" , documentName:"documentName A" ,latestVersion :2};
        let type=FOLDER;
        const wrapper = mount(
            <Icon set={set} enterFolder={enterFolder} refreshSet={refreshSet} showNotification={showNotification} entry={entry} type={type}/>
          );
          expect(wrapper.find(Img).at(0).props().src).toBe(FolderIcon);
          expect(wrapper.find(Name).text()).toBe("name A");
          expect(wrapper.find(Menu).length).toBe(0);
          expect(wrapper.find(UpdateOrPreviewDocumentDialog).length).toBe(0);
          expect(wrapper.find(PrintDocument).length).toBe(0);
          wrapper.setProps({type:FILE});
          wrapper.update();
          wrapper.render();
          expect(wrapper.find(Img).at(0).props().src).toBe(FileIcon);
          expect(wrapper.find(Name).text()).toBe("documentName A");
          expect(wrapper.find(Menu).length).toBe(0);
          expect(wrapper.find(UpdateOrPreviewDocumentDialog).length).toBe(0);
          expect(wrapper.find(PrintDocument).length).toBe(0);

      });
       //TBD
      test("componentDidMount", () => {
        let set={id:1};
        const enterFolder = jest.fn();
        const refreshSet = jest.fn();
        const showNotification = jest.fn();
        let entry={id:1 , name:"name A" , documentName:"documentName A" ,latestVersion :2};
        let type=FOLDER;
        const map = {};
           window.addEventListener = jest.fn((event, cb) => {
          map[event] = cb;
          });
        const addEventListenerMock = jest.spyOn(document, 'addEventListener');
          const preventDefaultMock = jest.fn();
          const composedPathMock = jest.fn(()=>{return []});
          var event = new Event("contextmenu", { preventDefault: preventDefaultMock, composedPath:composedPathMock ,clientX:1, clientY:1});
        const wrapper = mount(
            <Icon set={set} enterFolder={enterFolder} refreshSet={refreshSet} showNotification={showNotification} entry={entry} type={type}/> , { attachTo: document.body });
         // map.contextmenu({ preventDefault: preventDefaultMock, composedPath:composedPathMock ,clientX:1, clientY:1})
         document.dispatchEvent(event);
         expect(addEventListenerMock).toHaveBeenCalledTimes(2);
          expect(addEventListenerMock.mock.calls[0][0]).toBe('contextmenu');
          expect(addEventListenerMock.mock.calls[1][0]).toBe('click');
        });
      
        test("onDoubleClick", () => {
          let set={id:1};
          const enterFolder = jest.fn();
          const refreshSet = jest.fn();
          const showNotification = jest.fn();
          let entry={id:1 , name:"name A" , documentName:"documentName A" ,latestVersion :2};
          let type=FOLDER;
          const wrapper = mount(
              <Icon set={set} enterFolder={enterFolder} refreshSet={refreshSet} showNotification={showNotification} entry={entry} type={type}/>
            );
            expect(wrapper.find(Img).at(0).props().src).toBe(FolderIcon);
            expect(wrapper.find(Name).text()).toBe("name A");
            expect(wrapper.find(Menu).length).toBe(0);
            expect(wrapper.find(UpdateOrPreviewDocumentDialog).length).toBe(0);
            expect(wrapper.find(PrintDocument).length).toBe(0);
            act(() => {
              wrapper
                .find(Logo)
                .at(0)
                .props()
                .onDoubleClick();
            });
            wrapper.update();
            wrapper.render();
            expect(enterFolder).toHaveBeenCalledTimes(1);
            expect(enterFolder.mock.calls[0][0]).toBe(1);
            expect(enterFolder.mock.calls[0][1]).toBe("name A");
        });

        test("onDoubleClick when type is FILE and handler", () => {
          let set={id:1};
          const enterFolder = jest.fn();
          const refreshSet = jest.fn();
          const showNotification = jest.fn();
          let entry={id:1 , name:"name A" , documentName:"documentName A" ,latestVersion :2};
          let type=FILE;
          const wrapper = mount(
              <Icon set={set} enterFolder={enterFolder} refreshSet={refreshSet} showNotification={showNotification} entry={entry} type={type}/>
            );
            expect(wrapper.find(Img).at(0).props().src).toBe(FileIcon);
            expect(wrapper.find(Name).text()).toBe("documentName A");
            expect(wrapper.find(Menu).length).toBe(0);
            expect(wrapper.find(UpdateOrPreviewDocumentDialog).length).toBe(0);
            expect(wrapper.find(PrintDocument).length).toBe(0);
            act(() => {
              wrapper
                .find(Logo)
                .at(0)
                .props()
                .onDoubleClick();
            });
            wrapper.update();
            wrapper.render();
            expect(wrapper.find(UpdateOrPreviewDocumentDialog).length).toBe(1);
            expect(wrapper.find(UpdateOrPreviewDocumentDialog).at(0).props().open).toBeTruthy();

            act(() => {
              wrapper
                .find(UpdateOrPreviewDocumentDialog)
                .at(0)
                .props()
                .handler();
            });
            wrapper.update();
            wrapper.render();
            expect(wrapper.find(UpdateOrPreviewDocumentDialog).length).toBe(0);
        });
});