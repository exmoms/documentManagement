import React from "react";
import ReactDom from "react-dom";
import ScannedDocumentSelector from "../../components/User/ScannedDocumentSelector";
import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import TextField from "@material-ui/core/TextField";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
afterEach(cleanup);
describe("ScannedDocumentSelector", () => { 
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    let updateScannedFilesMock = jest.fn();

    const div = document.createElement("div");
    ReactDom.render(
      <ScannedDocumentSelector
        updateScannedFiles={updateScannedFilesMock}
      ></ScannedDocumentSelector>,
      div
    );
  });

  test("ScannedDocumentSelector matches snapshot", () => {
    let updateScannedFilesMock = jest.fn();
  
    const component = renderer.create(
      <ScannedDocumentSelector updateScannedFiles={updateScannedFilesMock} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("ScannedDocumentSelector, onChange functionality",  () =>{
    const updateScannedFilesMock = jest.fn();
    let mockValue = React.createRef();
    const mockSuccessResponse = ["image11" , "image22"];
    const mockJsonPromise = Promise.resolve(
      mockSuccessResponse
    );
    const PromiseMock = jest.spyOn(Promise, "all").mockImplementation(() => mockJsonPromise);
    const fileContents       = 'file contents';
    let wrapper = mount(
      <ScannedDocumentSelector updateScannedFiles={updateScannedFilesMock} />
    );

    return mockJsonPromise.then(() => {
      wrapper
      .find("#upload-scanned-doc-input")
      .at(0)
      .props()
      .onChange({ target: { files: [ new Blob([fileContents], {type : 'text/plain'}) ] , value : mockValue } });
    }).then(() => {
      wrapper.render();
      wrapper.update();
      //expect the side effects 
    const files = Array.from([ new Blob([fileContents], {type : 'text/plain'}) ]);
    var tempFiles = new Set();
    files.forEach((item) => tempFiles.add(item));
    expect(mockValue).toStrictEqual({"current": null});
    expect(PromiseMock).toHaveBeenCalledTimes(1);
      expect(updateScannedFilesMock).toHaveBeenCalledTimes(1);
      expect(updateScannedFilesMock.mock.calls[0][0]).toStrictEqual(Array.from(tempFiles));
    expect(updateScannedFilesMock.mock.calls[0][1]).toBe(null);
    expect(wrapper.find(CardMedia).length).toBe(2);
    });

  });

  test("ScannedDocumentSelector, onChange functionality when FileReader is a mock", () => {
    const updateScannedFilesMock = jest.fn();
    const fileContents       = 'file contents';
    const expectedFinalState = {fileContents: fileContents};
    const file               = new Blob([fileContents], {type : 'text/plain'});
    const addEventListener   = jest.fn();
    const readAsDataURL         = jest.fn();
    const dummyFileReader    = {addEventListener, readAsDataURL};
    window.FileReader        = jest.fn(() => dummyFileReader);
    let wrapper = mount(
      <ScannedDocumentSelector updateScannedFiles={updateScannedFilesMock} />
    );
    act(() => {
      wrapper
        .find("#upload-scanned-doc-input")
        .at(0)
        .props()
        .onChange({ target: { files: [ new Blob([fileContents], {type : 'text/plain'}) ] } });
    });
    wrapper.update();

    expect(addEventListener).toHaveBeenCalledTimes(2);
      expect(addEventListener.mock.calls[0][0]).toBe("load");
      expect(addEventListener.mock.calls[1][0]).toBe("error");
    expect(readAsDataURL).toHaveBeenCalledTimes(1);
    expect(readAsDataURL.mock.calls[0][0]).toStrictEqual(new Blob([fileContents], {type : 'text/plain'}));
    //expect the side effects 
    expect(updateScannedFilesMock).toHaveBeenCalledTimes(0);
    expect(wrapper.find(CardMedia).length).toBe(0);
  });

  test("ScannedDocumentSelector, removePage functionality",  () =>{
    const updateScannedFilesMock = jest.fn();
    const mockSuccessResponse = ["image11" , "image22"];
    const mockJsonPromise = Promise.resolve(
      mockSuccessResponse
    );
    const PromiseMock = jest.spyOn(Promise, "all").mockImplementation(() => mockJsonPromise);
    const fileContents       = 'file contents';
    let wrapper = mount(
      <ScannedDocumentSelector updateScannedFiles={updateScannedFilesMock} />
    );

    return mockJsonPromise.then(() => {
      wrapper
      .find("#upload-scanned-doc-input")
      .at(0)
      .props()
      .onChange({ target: { files: [ new Blob([fileContents], {type : 'text/plain'}) ] } });
    }).then(() => {
      wrapper.render();
      wrapper.update();
      //expect the side effects 
    const files = Array.from([ new Blob([fileContents], {type : 'text/plain'}) ]);
    var tempFiles = new Set();
    files.forEach((item) => tempFiles.add(item));
      expect(updateScannedFilesMock).toHaveBeenCalledTimes(1);
      expect(updateScannedFilesMock.mock.calls[0][0]).toStrictEqual(Array.from(tempFiles));
    expect(updateScannedFilesMock.mock.calls[0][1]).toBe(null);
    expect(wrapper.find(CardMedia).length).toBe(2);

    //click removeDutton 
    const stopPropagationMock = jest.fn();
    const preventDefaultMock = jest.fn();
    act(() => {
      wrapper
        .find("#IconButton0")
        .at(0)
        .props()
        .onClick({
          target: { id: 1, files: [{ name: "file1" }] },
          stopPropagation: stopPropagationMock,
          preventDefault: preventDefaultMock,
        });
    });
    wrapper.update();
    //expectations
    expect(stopPropagationMock).toHaveBeenCalledTimes(1);
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    var temp = new Set([]);
    mockSuccessResponse.forEach((item) => temp.add(item));
    let scannedDoc =Array.from(temp);
    let valid = true;
    scannedDoc.splice(0, 1);
    if (scannedDoc.length === 0) {
      valid = false;
    }
    //test the update on scannedDoc
    expect(wrapper.find(CardMedia).length).toBe(1);
   //test the clalling for
   expect(updateScannedFilesMock).toHaveBeenCalledTimes(2);
    expect(updateScannedFilesMock.mock.calls[1][0]).toBe(null);
    expect(updateScannedFilesMock.mock.calls[1][1]).toBe(0);
    });
    
  });
});
afterEach(cleanup);
describe("ScannedDocumentSelector", () => { 
  afterEach(() => {
    jest.clearAllMocks();
  });
//TBD
// test("uploadScannedDoc, onClick for scannedDocInputRef functionality", () => {
//   const updateScannedFilesMock = jest.fn();
//   let wrapper = mount(
//     <ScannedDocumentSelector updateScannedFiles={updateScannedFilesMock} />
//   );
//   const clickInputSpy = jest.spyOn(HTMLInputElement.prototype, 'click');
//   act(() => {
//     wrapper
//       .find("#uploadScannedDoc")
//       .at(0)
//       .props()
//       .onClick({ target: { value: "" } });
//   });
//   wrapper.update();
//   expect(clickInputSpy).toHaveBeenCalledTimes(1);
// });
});