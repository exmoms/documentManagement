import React from "react";
import ReactDom from "react-dom";
import DisplayTable from "../../components/Dispaly/DisplayTable";
import ConfirmOperationDialog from "../../components/User/ConfirmOperationDialog";
import { cleanup } from "@testing-library/react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import TextField from "@material-ui/core/TextField";
import { act } from "react-dom/test-utils";
import Button from "@material-ui/core/Button";
import * as FetchMock from "../../api/FetchData";
import { deleteFromApi } from "../../api/FetchData";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { render, fireEvent } from "@testing-library/react";
import MaterialTable from "material-table";

//imports for tableIcons
import { forwardRef } from "react";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import DeleteIcon from "@material-ui/icons/Delete";
import ViewColumn from "@material-ui/icons/ViewColumn";
afterEach(cleanup);
describe("DisplayTable", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    let columnsArray = [
      { title: "Document Class Id", field: "id" },
      { title: "Document Class Name", field: "documentClassName" },
      { title: "User Id", field: "userID" },
      { title: "Added Date", field: "addedDate" },
    ];
    let data = [
      { documentClass: "document 1" },
      { documentClass: "document 2" },
    ];
    let tableTitle = "Brows Document Classes";
    let deletedUrl = "/api/DocumentClass/DeleteDocumentClass?classId=";
    let loading = true;
    ReactDom.render(
      <DisplayTable
        Data={data}
        Columns={columnsArray}
        TableTitle={tableTitle}
        DeleteUrl={deletedUrl}
        loading={loading}
      />,
      div
    );
  });

  test("matches snapshot", () => {
    let columnsArray = [
      { title: "Document Class Id", field: "id" },
      { title: "Document Class Name", field: "documentClassName" },
      { title: "User Id", field: "userID" },
      { title: "Added Date", field: "addedDate" },
    ];
    let data = [
      { documentClass: "document 1" },
      { documentClass: "document 2" },
    ];
    let tableTitle = "Brows Document Classes";
    let deletedUrl = "/api/DocumentClass/DeleteDocumentClass?classId=";
    let loading = true;
    const wrapper = shallow(
      <DisplayTable
        Data={data}
        Columns={columnsArray}
        TableTitle={tableTitle}
        DeleteUrl={deletedUrl}
        loading={loading}
      />
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test("DisplayTable,test intilization", () => {
    let columnsArray = [
      { title: "Document Class Id", field: "id" },
      { title: "Document Class Name", field: "documentClassName" },
      { title: "User Id", field: "userID" },
      { title: "Added Date", field: "addedDate" },
    ];
    let data = [
      { documentClass: "document 1" },
      { documentClass: "document 2" },
    ];
    let tableTitle = "Brows Document Classes";
    let deletedUrl = "/api/DocumentClass/DeleteDocumentClass?classId=";
    let loading = true;
    let props = {
      Data: data,
      loading: loading,
      TableTitle: tableTitle,
      Columns: columnsArray,
      DeleteUrl: deletedUrl,
    };
    const tableIcons = {
      Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
      Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
      Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
      Delete: forwardRef((props, ref) => (
        <DeleteOutline {...props} ref={ref} />
      )),
      DetailPanel: forwardRef((props, ref) => (
        <ChevronRight {...props} ref={ref} />
      )),
      Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
      Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
      Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
      FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
      LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
      NextPage: forwardRef((props, ref) => (
        <ChevronRight {...props} ref={ref} />
      )),
      PreviousPage: forwardRef((props, ref) => (
        <ChevronLeft {...props} ref={ref} />
      )),
      ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
      Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
      SortArrow: forwardRef((props, ref) => (
        <ArrowDownward {...props} ref={ref} />
      )),
      ThirdStateCheck: forwardRef((props, ref) => (
        <Remove {...props} ref={ref} />
      )),
      ViewColumn: forwardRef((props, ref) => (
        <ViewColumn {...props} ref={ref} />
      )),
    };
    let wrapper = mount(
      <DisplayTable
        Data={data}
        Columns={columnsArray}
        TableTitle={tableTitle}
        DeleteUrl={deletedUrl}
        loading={loading}
      />
    );
    //expectations
    expect(wrapper.find(MaterialTable).props().title).toBe(tableTitle);
    expect(JSON.stringify(wrapper.find(MaterialTable).props().icons)).toBe(
      JSON.stringify(tableIcons)
    );
    expect(wrapper.find(MaterialTable).props().columns).toBe(columnsArray);
    expect(wrapper.find(MaterialTable).props().data).toBe(data);
    expect(wrapper.find(MaterialTable).props().options).toStrictEqual({
      actionsColumnIndex: -1,
      exportButton: true,
      exportAllData: true,
      exportFileName: tableTitle,
    });
  });

  test("DisplayTable, delete event", () => {
    let columnsArray = [
      { title: "Document Class Id", field: "id" },
      { title: "Document Class Name", field: "documentClassName" },
      { title: "User Id", field: "userID" },
      { title: "Added Date", field: "addedDate" },
    ];
    let data = [
      { id: 1, documentClass: "document 1" },
      { id: 2, documentClass: "document 2" },
    ];
    let tableTitle = "Brows Document Classes";
    let deletedUrl = "/api/DocumentClass/DeleteDocumentClass?classId=";
    let loading = true;
    const mockSuccessResponse = { status: 200 };
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const fetchingMock = jest
      .spyOn(FetchMock, "deleteFromApi")
      .mockImplementation(() => mockJsonPromise);
    let wrapper = mount(
      <DisplayTable
        Data={data}
        Columns={columnsArray}
        TableTitle={tableTitle}
        DeleteUrl={deletedUrl}
        loading={loading}
      />
    );
    act(() => {
      wrapper.find(MaterialTable).props().actions[0].onClick({ target: { value: ''} } , { id: 1, documentClass :"document 1"})
    });
    wrapper.update();
    wrapper.render();
    expect(wrapper.find(ConfirmOperationDialog).length).toBe(1);
    expect(wrapper.find(ConfirmOperationDialog).at(0).props().open).toBeTruthy();
    expect(wrapper.find(ConfirmOperationDialog).at(0).props().content).toStrictEqual({
      type: "delete",
      title: "dialog_deleteConfirmation",
      contentText: "dialog_documentClass_confirmDeleteDocumentClass",
      buttonText: "delete",
    });
  });
});
