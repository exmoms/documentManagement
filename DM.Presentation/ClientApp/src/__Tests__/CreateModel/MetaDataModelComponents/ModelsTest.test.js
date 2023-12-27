import React from "react";
import ReactDom from "react-dom";
import Models from "../../../components/CreateModel/MetaDataModelComponent/Models.js";
import { cleanup } from "@testing-library/react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import { act } from "react-dom/test-utils";
import ViewModel from "../../../components/CreateModel/MetaDataModelComponent/ViewModel";
import * as FetchMock from "../../../api/FetchData";
import { getMetaDataModels } from "../../../api/FetchData";
import { getDocumentClasses } from "../../../api/FetchData";
import { getMetaDataModelsByClassId } from "../../../api/FetchData";
import { deleteModel } from "../../../api/FetchData";
import MaterialTable from "material-table";
import Autocomplete from "@material-ui/lab/Autocomplete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { BrowserRouter as Router } from "react-router-dom";
import ConfirmOperationDialog from "../../../components/User/ConfirmOperationDialog";
afterEach(cleanup);
describe("Models", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(<Router><Models /></Router>, div);
  });

  test("matches snapshot", () => {
    const wrapper = shallow(<Router><Models /></Router>);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test("componentDidMount tests with getMetaDataModels mocking", () => {
    //mock first component getMetaDataModels
    const mockSuccessResponseMetaDataModel = [
      { id: 1, metaDataModel: "Model A" },
      { id: 2, metaDataModel: "Model B" },
    ];
    const mockJsonPromiseMetaDataModel = Promise.resolve(
      mockSuccessResponseMetaDataModel
    ); // 2
    const fetchingMetaDataModel = jest
      .spyOn(FetchMock, "fetchData")
      .mockImplementation(() => mockJsonPromiseMetaDataModel);
      let wrapper;
      return mockJsonPromiseMetaDataModel.then(() => {
         wrapper = mount(<Router><Models /></Router>); 
      }).then(() => {
        wrapper.render();
        wrapper.update();
      //test intialization
    expect(wrapper.find(ViewModel).props().id).toBe(-1);
    expect(wrapper.find(ViewModel).props().open).toBeFalsy();
    //expectations
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
    expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentClass/');
    expect(wrapper.find(MaterialTable).props().data).toBe(
      mockSuccessResponseMetaDataModel
    );
   });
  });
  
  test("componentDidMount tests with getDocumentClasses mocking", () => {

    //mock second component getDocumentClasses
    const mockSuccessResponseDocumentClass = [
      { id: 1, documentClassName: "Class A" },
     { id: 2, documentClassName: "Class B" } 
    ];
    const mockJsonPromiseDocumentClass = Promise.resolve(
      mockSuccessResponseDocumentClass
    ); // 2
    const fetchingMetaDataModel = jest
      .spyOn(FetchMock, "fetchData")
      .mockImplementation(() => mockJsonPromiseDocumentClass);
    let wrapper;
    return mockJsonPromiseDocumentClass.then(() => {
      wrapper = mount(<Router><Models /></Router>); 
   }).then(() => {
     wrapper.render();
     wrapper.update();
   //test intialization
 expect(wrapper.find(ViewModel).props().id).toBe(-1);
 expect(wrapper.find(ViewModel).props().open).toBeFalsy();
 //expectations
 expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
 expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentClass/');
 const Result = [
  { id: -1, documentClassName: "all_models" },
  { id: 1, documentClassName: "Class A","tableData": {  "id": 0, }},
  { id: 2, documentClassName: "Class B" ,"tableData": {  "id": 1, }},
];
 expect(wrapper.find(Autocomplete).props().options).toStrictEqual(
  Result
);
});
});

  test("componentDidUpdate tests when this.state.classId != -1 with onChange functionality", () => {
    //mock first component getMetaDataModels
    const mockSuccessResponseMetaDataModel = [
      { id: 1, metaDataModel: "Model A" },
      { id: 2, metaDataModel: "Model B" },
    ];
    const mockJsonPromiseMetaDataModel = Promise.resolve(
      mockSuccessResponseMetaDataModel
    );
    
    //mock the second call
    const mockSuccessResponseMetaDataModelsByClassId = [
      { id: 1, metaDataModel: "Model C" },
      { id: 2, metaDataModel: "Model D" },
    ];
    const mockJsonPromiseMetaDataModelsByClassId = Promise.resolve(
      mockSuccessResponseMetaDataModelsByClassId
    );
    const fetchingMetaDataModel = jest
      .spyOn(FetchMock, "fetchData")
      .mockImplementation(() => mockJsonPromiseMetaDataModel);
      let wrapper;
    return mockJsonPromiseMetaDataModel.then(() => {
      wrapper = mount(<Router><Models /></Router>); 
   }).then(() => {
     wrapper.render();
     wrapper.update();
   //test intialization
 expect(wrapper.find(ViewModel).props().id).toBe(-1);
 expect(wrapper.find(ViewModel).props().open).toBeFalsy();
 //test intialization
 expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
 expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
 expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentClass/');
 expect(wrapper.find(MaterialTable).props().data).toBe(
  mockSuccessResponseMetaDataModel
);
jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromiseMetaDataModelsByClassId);
//to call componentDidUpdate , change the value of classId by calling onChange on Autocomplete
return mockJsonPromiseMetaDataModelsByClassId.then(() => {
  wrapper
  .find(Autocomplete)
  .props()
  .onChange({ target: { value: "" } }, { id: 1 });
}).then(() => {
  wrapper.render();
  wrapper.update();
  expect(fetchingMetaDataModel).toHaveBeenCalledTimes(3);
    expect(fetchingMetaDataModel.mock.calls[2][0]).toBe('/api/MetaDataModel/GetMetaDataModelsByClassId?ClassId=1');
    expect(wrapper.find(MaterialTable).props().data).toBe(
      mockSuccessResponseMetaDataModelsByClassId
    );
});
});
  });

  test("componentDidUpdate tests when this.state.classId == -1 with onChange functionality", () => {
    //mock first component getMetaDataModels
    const mockSuccessResponseMetaDataModel = [
      { id: 1, metaDataModel: "Model A" },
      { id: 2, metaDataModel: "Model B" },
    ];
    const mockJsonPromiseMetaDataModel = Promise.resolve(
      mockSuccessResponseMetaDataModel
    );

    const mockSuccessResponseMetaDataModelSecond = [
      { id: 3, metaDataModel: "Model C" },
      { id: 4, metaDataModel: "Model D" },
    ];
    const mockJsonPromiseMetaDataModelSecond = Promise.resolve(
      mockSuccessResponseMetaDataModelSecond
    );
    const fetchingMetaDataModel = jest
      .spyOn(FetchMock, "fetchData") .mockImplementation(() => mockJsonPromiseMetaDataModel);
    let wrapper;
      return mockJsonPromiseMetaDataModel.then(() => {
        wrapper = mount(<Router><Models /></Router>); 
        wrapper
      .find(Autocomplete)
       .props()
        .onChange({ target: { value: "" } }, { id: 1 });
     }).then(() => {
       wrapper.render();
      wrapper.update();
     //test intialization
   expect(wrapper.find(ViewModel).props().id).toBe(-1);
   expect(wrapper.find(ViewModel).props().open).toBeFalsy();
   expect(fetchingMetaDataModel).toHaveBeenCalledTimes(3);
   expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
 expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentClass/');
 expect(fetchingMetaDataModel.mock.calls[2][0]).toBe('/api/MetaDataModel/GetMetaDataModelsByClassId?ClassId=1');
  //to call componentDidUpdate , change the value of classId by calling onChange on Autocomplete
  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromiseMetaDataModelSecond);
  return mockJsonPromiseMetaDataModelSecond.then(() => {
    wrapper
    .find(Autocomplete)
    .props()
    .onChange({ target: { value: "" } }, { id: -1 });
  }).then(() => {
    wrapper.render();
    wrapper.update();
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(4);
    expect(fetchingMetaDataModel.mock.calls[3][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
      expect(wrapper.find(MaterialTable).props().data).toBe(
        mockSuccessResponseMetaDataModelSecond
      );
  });
  });
  });

  test("MaterialTable tests for actions[0]", () => {
    let wrapper = mount(<Router><Models /></Router>);
    //test intialization
    expect(wrapper.find(ViewModel).props().id).toBe(-1);
    expect(wrapper.find(ViewModel).props().open).toBeFalsy();
    act(() => {
      wrapper
        .find(MaterialTable)
        .props()
        .actions[0].onClick({ target: { value: "" } }, { id: 1 });
    });
    wrapper.update();
    expect(wrapper.find(ViewModel).props().id).toBe(1);
    expect(wrapper.find(ViewModel).props().open).toBeTruthy();

  });

  test("MaterialTable tests for actions[1] when res is success", () => {
     //mock first component getMetaDataModels
     const mockSuccessResponseMetaDataModel = [
      { id: 1, metaDataModel: "Model A" },
      { id: 2, metaDataModel: "Model B" },
    ];
    const mockJsonPromiseMetaDataModel = Promise.resolve(
      mockSuccessResponseMetaDataModel
    ); // 2
    const fetchingMetaDataModel = jest
      .spyOn(FetchMock, "fetchData")
      .mockImplementation(() => mockJsonPromiseMetaDataModel);
      //mock deleteModel
      const mockSuccessResponse = { status: 200 };
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const fetchingMock = jest
      .spyOn(FetchMock, "deleteFromApi")
      .mockImplementation(() => mockJsonPromise);
      let wrapper;
      return mockJsonPromiseMetaDataModel.then(() => {
         wrapper = mount(<Router><Models /></Router>); 
      }).then(() => {
        wrapper.render();
        wrapper.update();
      //test intialization
    expect(wrapper.find(ViewModel).props().id).toBe(-1);
    expect(wrapper.find(ViewModel).props().open).toBeFalsy();
    //expectations for calling getMetaDataModels mock
    expect(fetchingMetaDataModel).toHaveBeenCalledTimes(2);
    expect(fetchingMetaDataModel.mock.calls[0][0]).toBe('/api/MetaDataModel/GetMetaDataModelsIdName');
    expect(fetchingMetaDataModel.mock.calls[1][0]).toBe('/api/DocumentClass/');
    expect(wrapper.find(MaterialTable).props().data).toBe(
      mockSuccessResponseMetaDataModel
    ); 
    //caliing deleteModel
    return mockJsonPromise.then(() => {
      act(() => {
        wrapper
          .find(MaterialTable)
          .props()
          .actions[1].onClick(
            { target: { value: "" } },
            { id: 1, metaDataModel: "Model A" }
          );
      });
   }).then(() => {
     wrapper.render();
     wrapper.update();
      expect(wrapper.find(ConfirmOperationDialog).at(0).props().open).toBeTruthy();
      expect(wrapper.find(ConfirmOperationDialog).at(0).props().content).toStrictEqual({
        type: "delete",
        title: ("dialog_deleteConfirmation"),
        contentText: ("dialog_metaDataModel_confirmDeleteMetaDataModel"),
        buttonText: ("delete"),
      });
      expect(wrapper.find(ViewModel).props().id).toBe(-1);
    expect(wrapper.find(ViewModel).props().open).toBeFalsy();
    });
    
   });

  });

});
