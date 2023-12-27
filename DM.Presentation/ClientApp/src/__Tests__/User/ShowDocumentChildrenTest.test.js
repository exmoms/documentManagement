import React from "react";
import ReactDom from "react-dom";
import SearchDocumentByFreeText from "../../components/User/SearchDocumentByFreeText";
import BrowseAggregatedDocsPopUp from "../../components/User/BrowseAggregatedDocsPopUp";
import ShowDocumentChildren from "../../components/User/ShowDocumentChildren";
import DateValue from "../../components/User/DateValue";
import BoolValue from "../../components/User/BoolValue";
import NumberValue from "../../components/User/NumberValue";
import StringValue from "../../components/User/StringValue";
import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
afterEach(cleanup);
describe("ShowDocumentChildren", () => { 
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    let updater = jest.fn();
    let updateDocument = jest.fn();
    let documents=[{childMetadataModelId:1,childDocumentVersionId:2,documentName:"documentName A"}];
    let option=true;
    const div = document.createElement("div");
    ReactDom.render(
      <ShowDocumentChildren
      updater ={updater} updateDocument ={updateDocument} documents ={documents} option ={option}>
      </ShowDocumentChildren>,
      div
    );
  });
  
  test("ShowDocumentChildren matches snapshot", () => {
    let updater = jest.fn();
    let updateDocument = jest.fn();
    let documents=[{childMetadataModelId:1,childDocumentVersionId:2,documentName:"documentName A"}];
    let option=true;
    const component = renderer.create(
        <ShowDocumentChildren
        updater ={updater} updateDocument ={updateDocument} documents ={documents} option ={option}>
        </ShowDocumentChildren>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });  

  test("intializations",  () =>{
    let updater = jest.fn();
    let updateDocument = jest.fn();
    let documents=[{childMetadataModelId:1,childDocumentVersionId:2,documentName:"documentName A" , aggregateName:"aggregateName A" , documentName:"documentName A"}];
    let option=true;
    let wrapper = mount(
      <ShowDocumentChildren updater ={updater} updateDocument ={updateDocument} documents ={documents} option ={option}/>
    );
    expect(wrapper.find(TableRow).length).toBe(2);
    expect(wrapper.find(TableBody).find(TableCell).at(0).text()).toBe("aggregateName A");
    expect(wrapper.find(TableBody).find(TableCell).at(1).text()).toBe("documentName A");
    expect(wrapper.find(TableCell).find(Button).at(0).props().disabled).toBeFalsy();
    expect(wrapper.find(TableCell).find(Button).at(1).props().disabled).toBeFalsy();

    expect(wrapper.find(BrowseAggregatedDocsPopUp).length).toBe(1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).at(0).props().modelId).toBe(-1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).at(0).props().show).toBeFalsy();
});

test("changeChildDocOnClickHandler",  () =>{
    let updater = jest.fn();
    let updateDocument = jest.fn();
    let documents=[{childMetadataModelId:1,childDocumentVersionId:2,documentName:"documentName A" , aggregateName:"aggregateName A" , documentName:"documentName A"}];
    let option=true;
    let wrapper = mount(
      <ShowDocumentChildren updater ={updater} updateDocument ={updateDocument} documents ={documents} option ={option}/>
    );
    //calling handleChange
   act(() => {
    wrapper
      .find(TableCell).find(Button)
      .at(0)
      .props()
      .onClick();
  });
  wrapper.update();
  wrapper.render();

    expect(wrapper.find(TableBody).find(TableCell).at(0).text()).toBe("aggregateName A");
    expect(wrapper.find(TableBody).find(TableCell).at(1).text()).toBe("documentName A");
    expect(wrapper.find(TableCell).find(Button).at(0).props().disabled).toBeFalsy();
    expect(wrapper.find(TableCell).find(Button).at(1).props().disabled).toBeFalsy();

    expect(wrapper.find(BrowseAggregatedDocsPopUp).length).toBe(1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).at(0).props().modelId).toBe(1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).at(0).props().show).toBeTruthy();
});

test("updateChildDocOnClickHandler",  () =>{
    let updater = jest.fn();
    let updateDocument = jest.fn();
    let documents=[{childMetadataModelId:1,childDocumentVersionId:2,documentName:"documentName A" , aggregateName:"aggregateName A" , documentName:"documentName A"}];
    let option=true;
    const consoleMock = jest.spyOn(console, "log")
    let wrapper = mount(
      <ShowDocumentChildren updater ={updater} updateDocument ={updateDocument} documents ={documents} option ={option}/>
    );
    //calling handleChange
   act(() => {
    wrapper
      .find(TableCell).find(Button)
      .at(1)
      .props()
      .onClick();
  });
  wrapper.update();
  wrapper.render();

    expect(wrapper.find(TableBody).find(TableCell).at(0).text()).toBe("aggregateName A");
    expect(wrapper.find(TableBody).find(TableCell).at(1).text()).toBe("documentName A");
    expect(wrapper.find(TableCell).find(Button).at(0).props().disabled).toBeFalsy();
    expect(wrapper.find(TableCell).find(Button).at(1).props().disabled).toBeFalsy();

    expect(wrapper.find(BrowseAggregatedDocsPopUp).length).toBe(1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).at(0).props().modelId).toBe(-1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).at(0).props().show).toBeFalsy();
    expect(updateDocument).toHaveBeenCalledTimes(1);
    expect(updateDocument.mock.calls[0][0]).toBe(2);

    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock.mock.calls[0][0]).toBe("form ShowDocumentChildern:");
    expect(consoleMock.mock.calls[0][1]).toBe(2);
});

test("updateStateFromChild when (attribName === show) ",  () =>{
    let updater = jest.fn();
    let updateDocument = jest.fn();
    let documents=[{childMetadataModelId:1,childDocumentVersionId:2,documentName:"documentName A" , aggregateName:"aggregateName A" , documentName:"documentName A"}];
    let option=true;
    let wrapper = mount(
      <ShowDocumentChildren updater ={updater} updateDocument ={updateDocument} documents ={documents} option ={option}/>
    );
    expect(wrapper.find(BrowseAggregatedDocsPopUp).at(0).props().show).toBeFalsy();
    let attribName="show";
    let newState=true;
    //calling updateStateFromChild
   act(() => {
    wrapper
      .find(BrowseAggregatedDocsPopUp)
      .at(0)
      .props()
      .action(attribName,newState);
  });
  wrapper.update();
  wrapper.render();

    expect(wrapper.find(TableBody).find(TableCell).at(0).text()).toBe("aggregateName A");
    expect(wrapper.find(TableBody).find(TableCell).at(1).text()).toBe("documentName A");
    expect(wrapper.find(TableCell).find(Button).at(0).props().disabled).toBeFalsy();
    expect(wrapper.find(TableCell).find(Button).at(1).props().disabled).toBeFalsy();

    expect(wrapper.find(BrowseAggregatedDocsPopUp).length).toBe(1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).at(0).props().modelId).toBe(-1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).at(0).props().show).toBeTruthy();
});

test("updateStateFromChild when (attribName === addDoc) and (index === -1)  and(process.env.NODE_ENV === development)",  () =>{
    let updater = jest.fn();
    let updateDocument = jest.fn();
    let documents=[{childMetadataModelId:1,childDocumentVersionId:2,documentName:"documentName A" , aggregateName:"aggregateName A" , documentName:"documentName A"}];
    let option=true;
    const consoleMock = jest.spyOn(console, "log")
    let wrapper = mount(
      <ShowDocumentChildren updater ={updater} updateDocument ={updateDocument} documents ={documents} option ={option}/>
    );
    let attribName="addDoc";
    let newState={modelId:2,selectedDoc:{id:1}};
    process.env.NODE_ENV="development";
    //calling updateStateFromChild
   act(() => {
    wrapper
      .find(BrowseAggregatedDocsPopUp)
      .at(0)
      .props()
      .action(attribName,newState);
  });
  wrapper.update();
  wrapper.render();

    expect(wrapper.find(TableBody).find(TableCell).at(0).text()).toBe("aggregateName A");
    expect(wrapper.find(TableBody).find(TableCell).at(1).text()).toBe("documentName A");
    expect(wrapper.find(TableCell).find(Button).at(0).props().disabled).toBeFalsy();
    expect(wrapper.find(TableCell).find(Button).at(1).props().disabled).toBeFalsy();

    expect(wrapper.find(BrowseAggregatedDocsPopUp).length).toBe(1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).at(0).props().modelId).toBe(-1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).at(0).props().show).toBeFalsy();
    expect(consoleMock).toHaveBeenCalled();
    //unexpected behaviour according to the compiler
    // expect(consoleMock.mock.calls[0][0]).toBe("[ERROR] Can't find the newState.modelId:");
    // expect(consoleMock.mock.calls[0][1]).toBe(2);
});

test("updateStateFromChild when (attribName === addDoc) and (index === -1)  and(process.env.NODE_ENV !== development)",  () =>{
    let updater = jest.fn();
    let updateDocument = jest.fn();
    let documents=[{childMetadataModelId:1,childDocumentVersionId:2,documentName:"documentName A" , aggregateName:"aggregateName A" , documentName:"documentName A"}];
    let option=true;
    const consoleMock = jest.spyOn(console, "log")
    let wrapper = mount(
      <ShowDocumentChildren updater ={updater} updateDocument ={updateDocument} documents ={documents} option ={option}/>
    );
    let attribName="addDoc";
    let newState={modelId:2,selectedDoc:{id:1}};
    process.env.NODE_ENV="";
    //calling updateStateFromChild
   act(() => {
    wrapper
      .find(BrowseAggregatedDocsPopUp)
      .at(0)
      .props()
      .action(attribName,newState);
  });
  wrapper.update();
  wrapper.render();

    expect(wrapper.find(TableBody).find(TableCell).at(0).text()).toBe("aggregateName A");
    expect(wrapper.find(TableBody).find(TableCell).at(1).text()).toBe("documentName A");
    expect(wrapper.find(TableCell).find(Button).at(0).props().disabled).toBeFalsy();
    expect(wrapper.find(TableCell).find(Button).at(1).props().disabled).toBeFalsy();

    expect(wrapper.find(BrowseAggregatedDocsPopUp).length).toBe(1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).at(0).props().modelId).toBe(-1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).at(0).props().show).toBeFalsy();
    expect(consoleMock).toHaveBeenCalledTimes(0);
});

test("updateStateFromChild when (attribName === addDoc) and (index !== -1) and (process.env.NODE_ENV === development)",  () =>{
    let updater = jest.fn();
    let updateDocument = jest.fn();
    let documents=[{childMetadataModelId:1,childDocumentVersionId:2,documentName:"documentName A" , aggregateName:"aggregateName A" , documentName:"documentName A"}];
    let option=true;
    const consoleMock = jest.spyOn(console, "log")
    let wrapper = mount(
      <ShowDocumentChildren updater ={updater} updateDocument ={updateDocument} documents ={documents} option ={option}/>
    );
    let attribName="addDoc";
    let newState={modelId:1,selectedDoc:{id:1}};
    process.env.NODE_ENV="development";
    //calling updateStateFromChild
   act(() => {
    wrapper
      .find(BrowseAggregatedDocsPopUp)
      .at(0)
      .props()
      .action(attribName,newState);
  });
  wrapper.update();
  wrapper.render();

    expect(wrapper.find(TableBody).find(TableCell).at(0).text()).toBe("aggregateName A");
    expect(wrapper.find(TableBody).find(TableCell).at(1).text()).toBe("documentName A");
    expect(wrapper.find(TableCell).find(Button).at(0).props().disabled).toBeFalsy();
    expect(wrapper.find(TableCell).find(Button).at(1).props().disabled).toBeFalsy();

    expect(wrapper.find(BrowseAggregatedDocsPopUp).length).toBe(1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).at(0).props().modelId).toBe(-1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).at(0).props().show).toBeFalsy();
    expect(consoleMock).toHaveBeenCalled();
    //unexpected behaviour according to the compiler
    // expect(consoleMock.mock.calls[0][0]).toBe("[SUCCESS] Update with the newState.modelId");
    // expect(consoleMock.mock.calls[0][1]).toBe(1);
    // expect(consoleMock.mock.calls[0][2]).toBe("with selected id:");
    // expect(consoleMock.mock.calls[0][3]).toBe(1);

    expect(updater).toHaveBeenCalledTimes(1);
    expect(updater.mock.calls[0][0]).toStrictEqual([{"aggregateName": "aggregateName A", "childDocumentVersionId": undefined, "childMetadataModelId": 1, "documentName": undefined}]);
});

test("updateStateFromChild when (attribName === addDoc) and (index !== -1) and (process.env.NODE_ENV !== development)",  () =>{
    let updater = jest.fn();
    let updateDocument = jest.fn();
    let documents=[{childMetadataModelId:1,childDocumentVersionId:2,documentName:"documentName A" , aggregateName:"aggregateName A" , documentName:"documentName A"}];
    let option=true;
    const consoleMock = jest.spyOn(console, "log")
    let wrapper = mount(
      <ShowDocumentChildren updater ={updater} updateDocument ={updateDocument} documents ={documents} option ={option}/>
    );
    let attribName="addDoc";
    let newState={modelId:1,selectedDoc:{id:1}};
    process.env.NODE_ENV="";
    //calling updateStateFromChild
   act(() => {
    wrapper
      .find(BrowseAggregatedDocsPopUp)
      .at(0)
      .props()
      .action(attribName,newState);
  });
  wrapper.update();
  wrapper.render();

    expect(wrapper.find(TableBody).find(TableCell).at(0).text()).toBe("aggregateName A");
    expect(wrapper.find(TableBody).find(TableCell).at(1).text()).toBe("documentName A");
    expect(wrapper.find(TableCell).find(Button).at(0).props().disabled).toBeFalsy();
    expect(wrapper.find(TableCell).find(Button).at(1).props().disabled).toBeFalsy();

    expect(wrapper.find(BrowseAggregatedDocsPopUp).length).toBe(1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).at(0).props().modelId).toBe(-1);
    expect(wrapper.find(BrowseAggregatedDocsPopUp).at(0).props().show).toBeFalsy();
    expect(consoleMock).toHaveBeenCalledTimes(0);

    expect(updater).toHaveBeenCalledTimes(1);
    expect(updater.mock.calls[0][0]).toStrictEqual([{"aggregateName": "aggregateName A", "childDocumentVersionId": undefined, "childMetadataModelId": 1, "documentName": undefined}]);
});
}); 