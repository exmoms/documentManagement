import React from "react";
import ReactDom from "react-dom";
import TableView from "../../../components/CreateModel/MetaDataModelComponent/TableView.js";
import { cleanup } from "@testing-library/react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import { act } from "react-dom/test-utils";
import TablePagination from "@material-ui/core/TablePagination";
afterEach(cleanup);
describe("Table View", () => {
  test("renders without crashing", () => {
    const div = document.createElement("div");
    const Columns = [
      { id: "AggregateName", label: "Aggregation Name", minWidth: 170 },
      { id: "metaDataModelName", label: "Aggregated Model", minWidth: 100 },
    ];
    const Rows = [
      {
        metaDataModelName: "Meta Data Model test 1",
        AggregateName: " Aggregated Name 1",
      },
      {
        metaDataModelName: "Meta Data Model test 2",
        AggregateName: " Aggregated Name 2",
      },
    ];
    ReactDom.render(<TableView rows={Rows} columns={Columns} />, div);
  });

  test("matches snapshot", () => {
    const Columns = [
      { id: "AggregateName", label: "Aggregation Name", minWidth: 170 },
      { id: "metaDataModelName", label: "Aggregated Model", minWidth: 100 },
    ];
    const Rows = [
      {
        metaDataModelName: "Meta Data Model test 1",
        AggregateName: " Aggregated Name 1",
      },
      {
        metaDataModelName: "Meta Data Model test 2",
        AggregateName: " Aggregated Name 2",
      },
    ];
    const wrapper = shallow(<TableView rows={Rows} columns={Columns} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test("TablePagination tests", () => {
    const Columns = [
      { id: "AggregateName", label: "Aggregation Name", minWidth: 170 },
      { id: "metaDataModelName", label: "Aggregated Model", minWidth: 100 },
    ];
    const Rows = [
      {
        metaDataModelName: "Meta Data Model test 1",
        AggregateName: " Aggregated Name 1",
      },
      {
        metaDataModelName: "Meta Data Model test 2",
        AggregateName: " Aggregated Name 2",
      },
    ];
    const wrapper = shallow(<TableView rows={Rows} columns={Columns} />);
    //click onChangePage
    expect(wrapper.find(TablePagination).props().page).toBe(0);
    act(() => {
      wrapper
        .find(TablePagination)
        .props()
        .onChangePage({ target: { value: "" } }, 1);
    });
    expect(wrapper.find(TablePagination).props().page).toBe(1);
    //click onChangeRowsPerPage
    expect(wrapper.find(TablePagination).props().rowsPerPage).toBe(10);
    act(() => {
      wrapper
        .find(TablePagination)
        .props()
        .onChangeRowsPerPage({ target: { value: 5 } });
    });
    expect(wrapper.find(TablePagination).props().rowsPerPage).toBe(5);
    expect(wrapper.find(TablePagination).props().page).toBe(0);
    //check the props of TablePagination
    expect(
      wrapper.find(TablePagination).props().rowsPerPageOptions
    ).toStrictEqual([5, 10, 15]);
    expect(wrapper.find(TablePagination).props().count).toBe(2);
  });
});
