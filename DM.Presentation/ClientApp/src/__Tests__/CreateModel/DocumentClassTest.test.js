import React from "react";
import ReactDom from "react-dom";
import DocumentClass from "../../components/CreateModel/DocumentClass";
import { cleanup } from "@testing-library/react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import TextField from "@material-ui/core/TextField";
import { act } from "react-dom/test-utils";
import Button from "@material-ui/core/Button";
import * as PostDataMock from "../../api/PostData";
import { BrowserRouter as Router } from "react-router-dom";
import { getDocumentClasses } from "../../api/FetchData";
import CreateDocumentClass from "../../components/CreateModel/DocumentClassComponents/CreateDocumentClass";
import * as FetchMock from "../../api/FetchData";
import { Route, Switch } from "react-router-dom";
import DisplayTable from "../../components/Dispaly/DisplayTable";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { render, fireEvent } from "@testing-library/react";
import { store } from "react-notifications-component";
import { withTranslation , useTranslation  } from "react-i18next";
afterEach(cleanup);
describe("DocumentClass", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(
      <Router>
        <DocumentClass />
      </Router>,
      div
    );
  });

  test("matches snapshot", () => {
    const wrapper = shallow(
      <Router>
        <DocumentClass />
      </Router>
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test("componentDidMount functionality mock getDocumentClasses for DocumentClass", () => {
    const mockSuccessResponse = [
      { documentClass: "document 1" },
      { documentClass: "document 2" },
    ];
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const fetchMock =  jest.spyOn(FetchMock, "fetchData")
      .mockImplementation(() => mockJsonPromise);
      let wrapper;
      return mockJsonPromise.then(() => {
        wrapper = mount(<Router>
            <DocumentClass />
          </Router>,{ attachTo: document.body }) ;
           fireEvent.click(document.getElementById("CreateNewDocumentClass"));
      }).then(() => {
        wrapper.render();
        wrapper.update();
        //expectation
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(wrapper.find("#location-display").at(0).props().Data).toBe(
      mockSuccessResponse
    );
    expect(wrapper.find("#location-display").at(0).props().Columns[0].title).toBe("documentclassid");
    expect(wrapper.find("#location-display").at(0).props().Columns[0].field).toBe("id");

    expect(wrapper.find("#location-display").at(0).props().Columns[1].title).toBe("documentparagraph");
    expect(wrapper.find("#location-display").at(0).props().Columns[1].field).toBe("documentClassName");

    expect(wrapper.find("#location-display").at(0).props().Columns[2].title).toBe("userid");
    expect(wrapper.find("#location-display").at(0).props().Columns[2].field).toBe("userID");
   
    expect(wrapper.find("#location-display").at(0).props().Columns[3].title).toBe("addeddate");
    expect(wrapper.find("#location-display").at(0).props().Columns[3].field).toBe("addedDate");

    expect(wrapper.find("#location-display").at(0).props().TableTitle).toBe(
      "browsedocumentclasses"
    );
    expect(wrapper.find("#location-display").at(0).props().DeleteUrl).toBe(
      "/api/DocumentClass/DeleteDocumentClass?classId="
    );
    expect(wrapper.find("#location-display").at(0).props().loading).toBeFalsy();
      });
    
  });

 test("ComponentDidUpdate functionality mock getDocumentClasses for DocumentClass", () => {
  const mockSuccessResponse = [
    { documentClass: "document 1" },
    { documentClass: "document 2" },
  ];
  const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
  const mockSuccessResponseSecond = [
    { documentClass: "document 3" },
    { documentClass: "document 4" },
    { documentClass: "document 5" }
  ];
  const mockJsonPromiseSecond = Promise.resolve(mockSuccessResponseSecond); // 2
  const fetchMock =    jest.spyOn(FetchMock, "fetchData")
    .mockImplementation(() => mockJsonPromise).mockImplementation(() => mockJsonPromiseSecond);
    let wrapper;
    return mockJsonPromise.then(() => {
      wrapper = mount(<Router>
          <DocumentClass />
        </Router>);
    }).then(() => {
      wrapper.render();
      wrapper.update();
      //expectation
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(wrapper.find("#location-display").at(0).props().Data).toBe(
    mockSuccessResponseSecond
  );
  //TBD
  expect(wrapper.find("#location-display").at(0).props().Columns[0].title).toBe("documentclassid");
    expect(wrapper.find("#location-display").at(0).props().Columns[0].field).toBe("id");

    expect(wrapper.find("#location-display").at(0).props().Columns[1].title).toBe("documentparagraph");
    expect(wrapper.find("#location-display").at(0).props().Columns[1].field).toBe("documentClassName");

    expect(wrapper.find("#location-display").at(0).props().Columns[2].title).toBe("userid");
    expect(wrapper.find("#location-display").at(0).props().Columns[2].field).toBe("userID");
   
    expect(wrapper.find("#location-display").at(0).props().Columns[3].title).toBe("addeddate");
    expect(wrapper.find("#location-display").at(0).props().Columns[3].field).toBe("addedDate");
  expect(wrapper.find("#location-display").at(0).props().TableTitle).toBe(
    "browsedocumentclasses"
  );
  expect(wrapper.find("#location-display").at(0).props().DeleteUrl).toBe(
    "/api/DocumentClass/DeleteDocumentClass?classId="
  );
  expect(wrapper.find("#location-display").at(0).props().loading).toBeFalsy();
    });
  
});

test("handleSubmit functionality for DocumentClass", () => {
  const mockSuccessResponse = [
    { documentClass: "document 1" },
    { documentClass: "document 2" },
  ];
  const data = [
    { documentClass: "document 3" },
    { documentClass: "document 4" },
  ];
  let notificationMsg="Notifications"
  const notificationMock =    jest.spyOn(store, "addNotification")
  const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
  const mockJsonPromiseSecondCall = Promise.resolve(data); // 2
  const fetchMock =   jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise);
    let wrapper;
    return mockJsonPromise.then(() => {
      wrapper = mount(<Router>
          <DocumentClass />
        </Router>);
    }).then(() => {
      wrapper.render();
      wrapper.update();
      //expectation
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(wrapper.find("#location-display").at(0).props().Data).toBe(
    mockSuccessResponse
  );
  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromiseSecondCall);
  return mockJsonPromiseSecondCall.then(() => {
    act(() => {
      wrapper
        .find("#location-display")
        .at(0)
        .props()
        .onSubmit(notificationMsg);
    });
  }).then(() => {
    wrapper.render();
    wrapper.update();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(notificationMock).toHaveBeenCalledTimes(1);
    expect(notificationMock.mock.calls[0][0].message).toBe(notificationMsg);
    expect(wrapper.find("#location-display").at(0).props().Data).toBe(
      data
    );

  });

    });
});
});

 
