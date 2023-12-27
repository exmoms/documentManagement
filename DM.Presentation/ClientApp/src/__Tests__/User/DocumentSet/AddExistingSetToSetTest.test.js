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
import AddExistingSetToSet from "../../../components/User/DocumentSet/AddExistingSetToSet";
import SearchDocuments from "../../../components/User/SearchDocuments";
import DocumentTable from "../../../components/User/DocumentTable";
import Button from "@material-ui/core/Button";
import * as FetchMock from "../../../api/FetchData";
import ListItemText from "@material-ui/core/ListItemText";
import * as PostDataMock from "../../../api/PostData";
import List from "@material-ui/core/List";
import { BrowserRouter as Router } from "react-router-dom";
import { Redirect } from "react-router";
afterEach(cleanup);

describe("AddExistingSetToSet", () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    test("renders without crashing", () => {
        let show=true;
        let set={id:1, name:"Name A"};
        const div = document.createElement("div");
        ReactDom.render(<AddExistingSetToSet show={show} set={set}/>, div);
      });

    test("AddExistingSetToSet matches snapshot", () => {
        let show=true;
        let set={id:1, name:"Name A"};
    const renderedValue = createMount()(
        <AddExistingSetToSet show={show}  set={set}/>
      );
      expect(renderedValue.html()).toMatchSnapshot();
    });
    test("componentDidMount functionality when redirectToDocumentSet is false",  () =>{
        let show=true;
        let set={id:0, name:"Name A"};
    
        const mockSuccessResponseMetaDataModel = [
            {id:2, name:"Name B"}
          ];
          const mockJsonPromiseMetaDataModel = Promise.resolve(
            mockSuccessResponseMetaDataModel
          ); // 2
          const fetchingMetaDataModel = jest
            .spyOn(FetchMock, "fetchData")
            .mockImplementation(() => mockJsonPromiseMetaDataModel);
        let wrapper;
          return mockJsonPromiseMetaDataModel.then(() => {
             wrapper = mount(
                <AddExistingSetToSet show={show}  set={set}/>
              );
              wrapper.setProps({set:{id:0, name:"Name C"}});
          }).then(() => {
            wrapper.render();
            wrapper.update();
        //expectations
        expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
        expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/DocumentSet/GetAllSetsExcludingSetsOfSet?Parent_documentSet_Id=0');
        expect(wrapper.find(ListItemText).at(0).props().primary).toBe("Name B");
        expect(wrapper.find(Redirect).length).toBe(0);
       });
        
    })

   
    test("addSetToSet functionalities when res is ok",  () =>{
      let show=true;
      let set={id:0, name:"Name A"};
      let action = jest.fn();
      const mockSuccessResponseMetaDataModel = [
          {id:2, name:"Name B"}
        ];
        const mockJsonPromiseMetaDataModel = Promise.resolve(
          mockSuccessResponseMetaDataModel
        ); // 2
        const fetchingMetaDataModel = jest
          .spyOn(FetchMock, "fetchData")
          .mockImplementation(() => mockJsonPromiseMetaDataModel);

          let mockJsonPromisepostDataToAPI2={ok:true , json:()=>{ return {error:["error"]} }};
          const mockJsonPromisepostDataToAPI = Promise.resolve(
            mockJsonPromisepostDataToAPI2
          ); // 2
          const postDataToAPIMock = jest
              .spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromisepostDataToAPI);;
      let wrapper;
        return mockJsonPromiseMetaDataModel.then(() => {
           wrapper = mount(
             <Router><AddExistingSetToSet show={show}  set={set} action={action}/> </Router>
              
            );
           wrapper.setProps({set:{id:0, name:"Name C"}});
        }).then(() => {
          wrapper.render();
          wrapper.update();
      //expectations
      expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
      expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/DocumentSet/GetAllSetsExcludingSetsOfSet?Parent_documentSet_Id=0');
      expect(wrapper.find(ListItemText).at(0).props().primary).toBe("Name B");
      expect(wrapper.find(Redirect).length).toBe(0);
      return mockJsonPromisepostDataToAPI.then(() => {
        act(() => {
          wrapper
            .find(ListItem)
            .at(0)
            .props()
            .onClick();
        });
      }).then(() => {  
        wrapper.update();
        wrapper.render();
        expect(postDataToAPIMock).toHaveBeenCalledTimes(1);
        expect(postDataToAPIMock.mock.calls[0][0]).toBe('/api/DocumentSet/AddDocumentSetToDocumentSet?Parent_documentSet_Id=0&child_documentSet_Id=2');
        expect(wrapper.find(Redirect).length).toBe(0);    
        expect(action).toHaveBeenCalledTimes(1);
        expect(wrapper.find(ListItemText).at(0).props().primary).toBe("documentset_noSetFound");  
      });
     });
    });
     
    test("addSetToSet functionalities when res isn't ok",  () =>{
      let show=true;
      let set={id:0, name:"Name A"};
      let action = jest.fn();
      const mockSuccessResponseMetaDataModel = [
          {id:2, name:"Name B"}
        ];
        const mockJsonPromiseMetaDataModel = Promise.resolve(
          mockSuccessResponseMetaDataModel
        ); // 2
        const fetchingMetaDataModel = jest
          .spyOn(FetchMock, "fetchData")
          .mockImplementation(() => mockJsonPromiseMetaDataModel);

          let mockJsonPromisepostDataToAPI2={ok:false , json:()=>{ return {error:["error"]} }};
          const mockJsonPromisepostDataToAPI = Promise.resolve(
            mockJsonPromisepostDataToAPI2
          ); // 2
          const postDataToAPIMock = jest
              .spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromisepostDataToAPI);;
      let wrapper;
        return mockJsonPromiseMetaDataModel.then(() => {
           wrapper = mount(
             <Router><AddExistingSetToSet show={show}  set={set} action={action}/> </Router>
              
            );
           wrapper.setProps({set:{id:0, name:"Name C"}});
        }).then(() => {
          wrapper.render();
          wrapper.update();
      //expectations
      expect(fetchingMetaDataModel).toHaveBeenCalledTimes(1);
      expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/DocumentSet/GetAllSetsExcludingSetsOfSet?Parent_documentSet_Id=0');
      expect(wrapper.find(ListItemText).at(0).props().primary).toBe("Name B");
      expect(wrapper.find(Redirect).length).toBe(0);
      return mockJsonPromisepostDataToAPI.then(() => {
        act(() => {
          wrapper
            .find(ListItem)
            .at(0)
            .props()
            .onClick();
        });
      }).then(() => {  
        wrapper.update();
        wrapper.render();
        expect(postDataToAPIMock).toHaveBeenCalledTimes(1);
        expect(postDataToAPIMock.mock.calls[0][0]).toBe('/api/DocumentSet/AddDocumentSetToDocumentSet?Parent_documentSet_Id=0&child_documentSet_Id=2');
        expect(wrapper.find(Redirect).length).toBe(0);    
        expect(action).toHaveBeenCalledTimes(0);
        expect(wrapper.find(ListItemText).at(0).props().primary).toBe("Name B");  
      });
     });
});
});