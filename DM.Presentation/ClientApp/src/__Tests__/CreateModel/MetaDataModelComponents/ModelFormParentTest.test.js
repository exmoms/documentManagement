import React from "react";
import ReactDom from "react-dom";
import ModelFormParent from "../../../components/CreateModel/MetaDataModelComponent/ModelFormParent";
import ModelName from "../../../components/CreateModel/MetaDataModelComponent/NewModel";
import ModelAttachments from "../../../components/CreateModel/MetaDataModelComponent/ModelAttatchments";
import AddFields from "../../../components/CreateModel/MetaDataModelComponent/AddFields";
import ReviewModel from "../../../components/CreateModel/MetaDataModelComponent/ReviewModel";
import { cleanup } from "@testing-library/react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import * as PostDataMock from "../../../api/PostData";
import FakeXMLHttpRequest from "fake-xml-http-request";
afterEach(cleanup);
describe("ModelFormParent", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(
      <Router>
        <ModelFormParent />
      </Router>,
      div
    );
  });

  test("matches snapshot", () => {
    const wrapper = shallow(
      <Router>
        <ModelFormParent />
      </Router>
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test("send Data functionality when res is ok", () => {
    let wrapper = mount(
      <Router>
        <ModelFormParent />
      </Router>
    );
    const jsonFile =  {"childMetaDataModels": [], "compoundModels": [], "documentClassId": "1", "metaDataAttributes": [{"dataTypeID": "1", "isRequired": true, "metaDataAttributeName": "name 1"}], "metaDataModelName": "test"};
    const mockSuccessResponsePost ={ok :true};
    const mockJsonPromisePost = Promise.resolve(mockSuccessResponsePost);
    const PostMock = jest.spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromisePost);

    act(() => {
      //set ModelName values
      wrapper
        .find(ModelFormParent)
        .find(ModelName)
        .props()
        .onSetModelName("test");
      wrapper
        .find(ModelFormParent)
        .find(ModelName)
        .props()
        .onSetModelClassId("1");
      wrapper
        .find(ModelFormParent)
        .find(ModelName)
        .props()
        .handeldocumentClassSelected("[{documentClassId: 1}]");
    });
    wrapper.update();
    //check the values which are setted
    expect(
      wrapper.find(ModelFormParent).find(ModelName).props().value
        .metaDataModelName
    ).toBe("test");
    expect(
      wrapper.find(ModelFormParent).find(ModelName).props().value
        .documentClassId
    ).toBe("1");
    expect(
      wrapper.find(ModelFormParent).find(ModelName).props().value
        .documentClassSelected
    ).toBe("[{documentClassId: 1}]");
    act(() => {
      //click next button
      expect(wrapper.find(ModelFormParent).find(Button).at(1).props().text).toBe("Next")
      wrapper.find(ModelFormParent).find(Button).at(1).props().onClick();
    });
    wrapper.update();

    act(() => {
      //set ModelAttachments values
      wrapper
        .find(ModelFormParent)
        .find(ModelAttachments)
        .props()
        .handelisCompound(false);
      wrapper
        .find(ModelFormParent)
        .find(ModelAttachments)
        .props()
        .handelisAggregated(false);
    });
    wrapper.update();
    //check the values which are setted
    expect(
      wrapper.find(ModelFormParent).find(ModelAttachments).props().value
        .isCompound
    ).toBeFalsy();
    expect(
      wrapper.find(ModelFormParent).find(ModelAttachments).props().value
        .isAggregated
    ).toBeFalsy();
    expect(wrapper.find(ModelFormParent).find(Button).at(0).props().text).toBe(
      "Back"
    );
    expect(wrapper.find(ModelFormParent).find(Button).at(1).props().text).toBe(
      "Cancel"
    );
    expect(wrapper.find(ModelFormParent).find(Button).at(2).props().text).toBe(
      "Next"
    );
    act(() => {
      //click next button
      wrapper
      .find(ModelFormParent).find(Button).at(2).props()
        .onClick();
    });
    wrapper.update();
    act(() => {
      //set AddFields values
      wrapper
        .find(ModelFormParent)
        .find(AddFields)
        .at(0)
        .props()
        .handelmetaDataAttribute([
          {
            metaDataAttributeName: "name 1",
            isRequired: true,
            dataTypeID: "1",
          },
        ]);
    });
    wrapper.update();
    //check the values which are setted
    expect(
      wrapper.find(ModelFormParent).find(AddFields).props().value
        .metaDataAttribute
    ).toStrictEqual([
      {
        metaDataAttributeName: "name 1",
        isRequired: true,
        dataTypeID: "1",
      },
    ]);
    expect(wrapper.find(ModelFormParent).find(Button).at(4).props().text).toBe(
      "Next"
    );
    act(() => {
      //click next button
      wrapper.find(ModelFormParent).find(Button).at(4).props().onClick();
    });
    wrapper.update();
    expect(wrapper.find(ModelFormParent).find(ReviewModel).length).toBe(1);
    expect(wrapper.find(ModelFormParent).find(Button).at(2).props().text).toBe(
      "Create"
    );
    return mockJsonPromisePost.then(() => {
    act(() => {
      //click submit button
      wrapper.find(ModelFormParent).find(Button).at(2).props().onClick();
    });
  }).then(() => {
    wrapper.render();
    wrapper.update();
    expect(PostMock).toHaveBeenCalledTimes(1);
    expect(PostMock.mock.calls[0][0]).toStrictEqual(
      "/api/MetaDataModel/AddNewMetaDataModel"
    );
    expect(PostMock.mock.calls[0][1]).toStrictEqual(jsonFile);
    expect(wrapper.find("#notification").props().open).toBeTruthy(); 
      expect(wrapper.find("#notification").props().error).toBeFalsy(); 
      expect(wrapper.find("#notification").props().errorMessage).toStrictEqual([]); 
});
});

});