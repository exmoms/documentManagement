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
import CreateDocumentSet from "../../../components/User/DocumentSet/CreateDocumentSet";
import SearchDocuments from "../../../components/User/SearchDocuments";
import DocumentTable from "../../../components/User/DocumentTable";
import Button from "@material-ui/core/Button";
import * as FetchMock from "../../../api/FetchData";
import ListItemText from "@material-ui/core/ListItemText";
import * as PostDataMock from "../../../api/PostData";
import List from "@material-ui/core/List";
import { BrowserRouter as Router } from "react-router-dom";
import { Redirect } from "react-router";
import { Typography } from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import { TextField } from "@material-ui/core";
afterEach(cleanup);

describe("CreateDocumentSet", () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    test("renders without crashing", () => {
        let show=true;
        let set={id:1, name:"Name A"};
        let action = jest.fn();
        const div = document.createElement("div");
        ReactDom.render(<CreateDocumentSet show={show} set={set}  action={action}/>, div);
      });

    test("CreateDocumentSet matches snapshot", () => {
        let show=true;
        let set={id:1, name:"Name A"};
        let action = jest.fn();
    const renderedValue = createMount()(
        <CreateDocumentSet show={show}  set={set}  action={action}/>
      );
      expect(renderedValue.html()).toMatchSnapshot();
    });

    test("intializations",  () =>{
        let show=true;
        let set={id:1, name:"Name A"};
        let action = jest.fn();
        let classes ={Typography:"Typography" , root:"root",box:"box",textField:"textField",Button:"Button"}
        let  wrapper = mount(
                <CreateDocumentSet show={show}  set={set} action={action} classes={classes}/>
              );
    expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
    expect(wrapper.find(TextField).at(0).props().value).toBe(""); 
    expect(wrapper.find(Redirect).length).toBe(0);
    })

    test("handleChange",  () =>{
        let show=true;
        let set={id:1, name:"Name A"};
        let action = jest.fn();
        let classes ={Typography:"Typography" , root:"root",box:"box",textField:"textField",Button:"Button"}
        let  wrapper = mount(
                <CreateDocumentSet show={show}  set={set} action={action} classes={classes}/>
              );

              act(() => {
                wrapper
                  .find(TextField)
                  .at(0)
                  .props()
                  .onChange({ target: { value: "tested Value" } });
              });
              
            wrapper.update();
            wrapper.render();
    expect(wrapper.find(Dialog).at(0).props().open).toBeTruthy();
    expect(wrapper.find(TextField).at(0).props().value).toBe("tested Value"); 
    expect(wrapper.find(Redirect).length).toBe(0);
    })

    test("handleSubmit functionalities when res is ok",  () =>{
        let show=true;
        let set={id:1, name:"Name A"};
        let action = jest.fn();
          let mockJsonPromisepostDataToAPI={ok:true , json:()=>{ return [] }};
          const mockJsonPromisePost = Promise.resolve(
            mockJsonPromisepostDataToAPI ); 
          const postDataToAPIMock = jest
              .spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromisePost);
        let wrapper = mount(
            <Router><CreateDocumentSet show={show}  set={set} action={action}/> </Router>);  
            act(() => {
                wrapper
                  .find(TextField)
                  .at(0)
                  .props()
                  .onChange({ target: { value: "tested Value" } });
              });
            wrapper.update();
            wrapper.render();
            return mockJsonPromisePost.then(() => {
             act(() => {
                wrapper
                  .find(Button)
                  .at(0)
                  .props()
                  .onClick({ target: { value: "" } });
              });
            }).then(() => {
            wrapper.update();
            wrapper.render();
            expect(postDataToAPIMock).toHaveBeenCalledTimes(1);
            expect(postDataToAPIMock.mock.calls[0][0]).toBe('/api/DocumentSet/AddNewDocumentSet');
            expect(postDataToAPIMock.mock.calls[0][1]).toStrictEqual({Name:"tested Value" ,"ParentDocumentSet": 1,});
             //redirectToDocumentSet is resetted to false because of update functionality
            expect(wrapper.find(Redirect).length).toBe(0);    
           expect(wrapper.find(TextField).at(0).props().value).toBe("");  
           expect(action).toHaveBeenCalledTimes(1);
          });
    });

    test("handleSubmit functionalities when res isn't ok",  () =>{
        let show=true;
        let set={id:0, name:"Name A"};
        let action = jest.fn();
          let mockJsonPromisepostDataToAPI={ok:false , json:()=>{ return {error:["error"]} }};
          const mockJsonPromisePost = Promise.resolve(
            mockJsonPromisepostDataToAPI ); 
          const postDataToAPIMock = jest
              .spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromisePost);
        let wrapper = mount(
            <Router><CreateDocumentSet show={show}  set={set} action={action}/> </Router>);  
            act(() => {
                wrapper
                  .find(TextField)
                  .at(0)
                  .props()
                  .onChange({ target: { value: "tested Value" } });
              });
            wrapper.update();
            wrapper.render();
            return mockJsonPromisePost.then(() => {
             act(() => {
                wrapper
                  .find(Button)
                  .at(0)
                  .props()
                  .onClick({ target: { value: "" } });
              });
            }).then(() => {
            wrapper.update();
            wrapper.render();
            expect(postDataToAPIMock).toHaveBeenCalledTimes(1);
            expect(postDataToAPIMock.mock.calls[0][0]).toBe('/api/DocumentSet/AddNewDocumentSet');
            expect(postDataToAPIMock.mock.calls[0][1]).toStrictEqual({Name:"tested Value"});
            //redirectToDocumentSet is resetted to false because of update functionality
            expect(wrapper.find(Redirect).length).toBe(0);   
           expect(wrapper.find(TextField).at(0).props().value).toBe("tested Value");  
           expect(action).toHaveBeenCalledTimes(0);
          });
    });
});