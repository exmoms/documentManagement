
import ReactDom from "react-dom";
import TableBodyToolbar from "../../components/Shared/materialTableToolbar";
import { cleanup } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { shallow , mount} from "enzyme";
import toJSON from "enzyme-to-json";
import { MemoryRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { Link } from "react-router-dom";
import { Suspense } from "react";
import * as FetchMock from "../../api/FetchData";
import * as PostDataMock from "../../api/PostData";
import * as ContextAuth from "../../context/auth";
import MenuItem from "@material-ui/core/MenuItem";
import { act } from "react-dom/test-utils";
import Toolbar from "@material-ui/core/Toolbar";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import { default as Check } from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import { default as Edit, default as EditIcon } from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import React, { Component, forwardRef } from "react";
import * as CsvBuilderMock from "filefy";
afterEach(cleanup);
describe("TableBodyToolbar", () => {
  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  };
  let localization={
    addRemoveColumns: "Add or remove columns",
    nRowsSelected: "3",
    showColumnsTitle: "Show Columns",
    showColumnsAriaLabel: "Show Columns",
    exportTitle: "Export",
    exportAriaLabel: "Export",
    exportName: "Export as CSV",
    searchTooltip: "Search",
    searchPlaceholder: "Search",
  };
   afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    
    const div = document.createElement("div");
    let columns=[{hidden:true , field:true , export:true , title:"title"}];
    let data=[{id:1 , data:"Data A"} , {id:2 , data:"Data B"}];
    let renderData=[{id:1 , data:"renderData A"} , {id:2 , data:"renderData B"}];
    let exportAllData= true;
    const getFieldValue = jest.fn();
    let exportFileName="exportFileName";
    let title= "ExportedTitle";
    let exportDelimiter="exportDelimiter";
    let exportCsv= true;
    const exportCsvMock = jest.fn();
    let search = false;
    let searchFieldAlignment="left";
    let showTitle= false;
    let classes={searchField:"searchField"};
    let searchText="searchText";
    const onSearchChanged = jest.fn();
    let searchFieldStyle={};
    let columnsButton= false;
    const onColumnsChanged = jest.fn();
    let exportButton= false;
    let actions=[{position:"toolbar" , position:"row" , position:"toolbarOnSelect" }];
    let components={Actions: forwardRef((props, ref) => <AddBox {...props} ref={ref} />) };
    let selectedRows=[{id:1 ,data:"Data "} , {id:2 ,data:"Data "}];
    let showTextRowsSelected= true;
    let toolbarButtonAlignment="left";
    ReactDom.render(<TableBodyToolbar 
        columns={columns} data={data} renderData={renderData} exportAllData={exportAllData} getFieldValue={getFieldValue} 
        exportFileName={exportFileName} title={title} exportDelimiter={exportDelimiter} exportCsv={exportCsv} exportCsv={exportCsvMock}
        localization={localization} search={search} searchFieldAlignment={searchFieldAlignment} showTitle={showTitle}
        classes={classes} searchText={searchText} onSearchChanged={onSearchChanged} searchFieldStyle={searchFieldStyle}
        columnsButton={columnsButton} onColumnsChanged={onColumnsChanged} exportButton={exportButton} actions={actions}
        components={components} selectedRows={selectedRows} showTextRowsSelected={showTextRowsSelected} toolbarButtonAlignment={toolbarButtonAlignment}
        icons={tableIcons}
    />,
      div
    );
  });

  test("matches snapshot", () => {
    let columns=[{hidden:true , field:true , export:true , title:"title"}];
    let data=[{id:1 , data:"Data A"} , {id:2 , data:"Data B"}];
    let renderData=[{id:1 , data:"renderData A"} , {id:2 , data:"renderData B"}];
    let exportAllData= true;
    const getFieldValue = jest.fn();
    let exportFileName="exportFileName";
    let title= "ExportedTitle";
    let exportDelimiter="exportDelimiter";
    let exportCsv= true;
    const exportCsvMock = jest.fn();

    let search = true;
    let searchFieldAlignment="left";
    let showTitle= false;
    let classes={searchField:"searchField"};
    let searchText="searchText";
    const onSearchChanged = jest.fn();
    let searchFieldStyle={};
    let columnsButton= true;
    const onColumnsChanged = jest.fn();
    let exportButton= true;
    let actions=[{position:"toolbar" , position:"row" , position:"toolbarOnSelect" }];
    let components={Actions: forwardRef((props, ref) => <AddBox {...props} ref={ref} />) };
    let selectedRows=[{id:1 ,data:"Data "} , {id:2 ,data:"Data "}];
    let showTextRowsSelected= true;
    let toolbarButtonAlignment="left";
    const wrapper = shallow(
        <TableBodyToolbar
        columns={columns} data={data} renderData={renderData} exportAllData={exportAllData} getFieldValue={getFieldValue} 
        exportFileName={exportFileName} title={title} exportDelimiter={exportDelimiter} exportCsv={exportCsv} exportCsv={exportCsvMock}
        localization={localization} search={search} searchFieldAlignment={searchFieldAlignment} showTitle={showTitle}
        classes={classes} searchText={searchText} onSearchChanged={onSearchChanged} searchFieldStyle={searchFieldStyle}
        columnsButton={columnsButton} onColumnsChanged={onColumnsChanged} exportButton={exportButton} actions={actions}
        components={components} selectedRows={selectedRows} showTextRowsSelected={showTextRowsSelected} toolbarButtonAlignment={toolbarButtonAlignment}
        icons={tableIcons}
        />
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  
  test("renderSearch when search is false", () => {
    let columns=[{hidden:true , field:true , export:true , title:"title"}];
    let data=[{id:1 , data:"Data A"} , {id:2 , data:"Data B"}];
    let renderData=[{id:1 , data:"renderData A"} , {id:2 , data:"renderData B"}];
    let exportAllData= true;
    const getFieldValue = jest.fn();
    let exportFileName="exportFileName";
    let title= "ExportedTitle";
    let exportDelimiter="exportDelimiter";
    let exportCsv= true;
    const exportCsvMock = jest.fn();
    let search = false;
    let searchFieldAlignment="left";
    let showTitle= false;
    let classes={searchField:"searchField"};
    let searchText="searchText";
    const onSearchChanged = jest.fn();
    let searchFieldStyle={};
    let columnsButton= true;
    const onColumnsChanged = jest.fn();
    let exportButton= true;
    let actions=[{position:"toolbar" , position:"row" , position:"toolbarOnSelect" }];
    let components={Actions: forwardRef((props, ref) => <AddBox {...props} ref={ref} />) };
    let selectedRows=[{id:1 ,data:"Data "} , {id:2 ,data:"Data "}];
    let showTextRowsSelected= true;
    let toolbarButtonAlignment="left";
    let  wrapper = mount(<TableBodyToolbar
        columns={columns} data={data} renderData={renderData} exportAllData={exportAllData} getFieldValue={getFieldValue} 
        exportFileName={exportFileName} title={title} exportDelimiter={exportDelimiter} exportCsv={exportCsv} exportCsv={exportCsvMock}
        localization={localization} search={search} searchFieldAlignment={searchFieldAlignment} showTitle={showTitle}
        classes={classes} searchText={searchText} onSearchChanged={onSearchChanged} searchFieldStyle={searchFieldStyle}
        columnsButton={columnsButton} onColumnsChanged={onColumnsChanged} exportButton={exportButton} actions={actions}
        components={components} selectedRows={selectedRows} showTextRowsSelected={showTextRowsSelected} toolbarButtonAlignment={toolbarButtonAlignment}
        icons={tableIcons}
        />);

        expect(wrapper.find("#textFieldrRenderSearch").length).toBe(0);
  });

  test("renderSearch when search is true", () => {
    let columns=[{hidden:true , field:true , export:true , title:"title"}];
    let data=[{id:1 , data:"Data A"} , {id:2 , data:"Data B"}];
    let renderData=[{id:1 , data:"renderData A"} , {id:2 , data:"renderData B"}];
    let exportAllData= true;
    const getFieldValue = jest.fn();
    let exportFileName="exportFileName";
    let title= "ExportedTitle";
    let exportDelimiter="exportDelimiter";
    let exportCsv= true;
    const exportCsvMock = jest.fn();
    let search = true;
    let searchFieldAlignment="left";
    let showTitle= false;
    let classes={searchField:"searchField"};
    let searchText="searchText";
    const onSearchChanged = jest.fn();
    let searchFieldStyle={};
    let columnsButton= true;
    const onColumnsChanged = jest.fn();
    let exportButton= true;
    let actions=[{position:"toolbar" , position:"row" , position:"toolbarOnSelect" }];
    let components={Actions: forwardRef((props, ref) => <AddBox {...props} ref={ref} />) };
    let selectedRows=[{id:1 ,data:"Data "} , {id:2 ,data:"Data "}];
    let showTextRowsSelected= true;
    let toolbarButtonAlignment="left";
    let  wrapper = mount(<TableBodyToolbar
        columns={columns} data={data} renderData={renderData} exportAllData={exportAllData} getFieldValue={getFieldValue} 
        exportFileName={exportFileName} title={title} exportDelimiter={exportDelimiter} exportCsv={exportCsv} exportCsv={exportCsvMock}
        localization={localization} search={search} searchFieldAlignment={searchFieldAlignment} showTitle={showTitle}
        classes={classes} searchText={searchText} onSearchChanged={onSearchChanged} searchFieldStyle={searchFieldStyle}
        columnsButton={columnsButton} onColumnsChanged={onColumnsChanged} exportButton={exportButton} actions={actions}
        components={components} selectedRows={selectedRows} showTextRowsSelected={showTextRowsSelected} toolbarButtonAlignment={toolbarButtonAlignment}
        icons={tableIcons}
        />);
        expect(wrapper.find("#textFieldrRenderSearch").at(0).props().className).toBe(null);
        expect(wrapper.find("#textFieldrRenderSearch").at(0).props().value).toBe(searchText);
        expect(wrapper.find("#tooltipRenderSearch").at(0).props().title).toBe(localization.searchTooltip);
        expect(wrapper.find("#iconButtonRenderSearch").at(0).props().disabled).toBeFalsy();
  });

  test("renderSearch when search is true ; showTitle is true", () => {
    let columns=[{hidden:true , field:true , export:true , title:"title"}];
    let data=[{id:1 , data:"Data A"} , {id:2 , data:"Data B"}];
    let renderData=[{id:1 , data:"renderData A"} , {id:2 , data:"renderData B"}];
    let exportAllData= true;
    const getFieldValue = jest.fn();
    let exportFileName="exportFileName";
    let title= "ExportedTitle";
    let exportDelimiter="exportDelimiter";
    let exportCsv= true;
    const exportCsvMock = jest.fn();
    let search = true;
    let searchFieldAlignment="left";
    let showTitle= true;
    let classes={searchField:"searchField"};
    let searchText="searchText";
    const onSearchChanged = jest.fn();
    let searchFieldStyle={};
    let columnsButton= true;
    const onColumnsChanged = jest.fn();
    let exportButton= true;
    let actions=[{position:"toolbar" , position:"row" , position:"toolbarOnSelect" }];
    let components={Actions: forwardRef((props, ref) => <AddBox {...props} ref={ref} />) };
    let selectedRows=[{id:1 ,data:"Data "} , {id:2 ,data:"Data "}];
    let showTextRowsSelected= true;
    let toolbarButtonAlignment="left";
    let  wrapper = mount(<TableBodyToolbar
        columns={columns} data={data} renderData={renderData} exportAllData={exportAllData} getFieldValue={getFieldValue} 
        exportFileName={exportFileName} title={title} exportDelimiter={exportDelimiter} exportCsv={exportCsv} exportCsv={exportCsvMock}
        localization={localization} search={search} searchFieldAlignment={searchFieldAlignment} showTitle={showTitle}
        classes={classes} searchText={searchText} onSearchChanged={onSearchChanged} searchFieldStyle={searchFieldStyle}
        columnsButton={columnsButton} onColumnsChanged={onColumnsChanged} exportButton={exportButton} actions={actions}
        components={components} selectedRows={selectedRows} showTextRowsSelected={showTextRowsSelected} toolbarButtonAlignment={toolbarButtonAlignment}
        icons={tableIcons}
        />);
        act(() => {
          wrapper
            .find("#textFieldrRenderSearch")
            .at(0)
            .props()
            .onChange({ target: { value:  "onSearchChanged" } });
        });
        wrapper.render();
          wrapper.update();
          expect(onSearchChanged).toHaveBeenCalledTimes(1);
          expect(onSearchChanged.mock.calls[0][0]).toBe("onSearchChanged");
          act(() => {
            wrapper
              .find("#iconButtonRenderSearch")
              .at(0)
              .props()
              .onClick();
          });
          wrapper.render();
            wrapper.update();
            expect(onSearchChanged).toHaveBeenCalledTimes(2);
            expect(onSearchChanged.mock.calls[1][0]).toBe("");
        expect(wrapper.find("#textFieldrRenderSearch").at(0).props().className).toBe("TableBodyToolbar-searchField-6 searchField");
        expect(wrapper.find("#textFieldrRenderSearch").at(0).props().value).toBe(searchText);
        expect(wrapper.find("#tooltipRenderSearch").at(0).props().title).toBe(localization.searchTooltip);
        expect(wrapper.find("#iconButtonRenderSearch").at(0).props().disabled).toBeFalsy();
  });

  test("renderActions when renderSelectedActions", () => {
    let columns=[{hidden:true , field:true , export:true , title:"title"}];
    let data=[{id:1 , data:"Data A"} , {id:2 , data:"Data B"}];
    let renderData=[{id:1 , data:"renderData A"} , {id:2 , data:"renderData B"}];
    let exportAllData= true;
    const getFieldValue = jest.fn();
    let exportFileName="exportFileName";
    let title= "ExportedTitle";
    let exportDelimiter="exportDelimiter";
    let exportCsv= true;
    const exportCsvMock = jest.fn();
    let search = false;
    let searchFieldAlignment="left";
    let showTitle= false;
    let classes={searchField:"searchField"};
    let searchText="searchText";
    const onSearchChanged = jest.fn();
    let searchFieldStyle={};
    let columnsButton= true;
    const onColumnsChanged = jest.fn();
    let exportButton= true;
    let actions=[{position:"row"} , {position:"toolbar"} , {position:"toolbarOnSelect" }];
    let components={Actions: forwardRef((props, ref) => <AddBox {...props} ref={ref} />) };
    let selectedRows=[{id:1 ,data:"Data "} , {id:2 ,data:"Data "}];
    let showTextRowsSelected= true;
    let toolbarButtonAlignment="left";
    let  wrapper = mount(<TableBodyToolbar
        columns={columns} data={data} renderData={renderData} exportAllData={exportAllData} getFieldValue={getFieldValue} 
        exportFileName={exportFileName} title={title} exportDelimiter={exportDelimiter} exportCsv={exportCsv} exportCsv={exportCsvMock}
        localization={localization} search={search} searchFieldAlignment={searchFieldAlignment} showTitle={showTitle}
        classes={classes} searchText={searchText} onSearchChanged={onSearchChanged} searchFieldStyle={searchFieldStyle}
        columnsButton={columnsButton} onColumnsChanged={onColumnsChanged} exportButton={exportButton} actions={actions}
        components={components} selectedRows={selectedRows} showTextRowsSelected={showTextRowsSelected} toolbarButtonAlignment={toolbarButtonAlignment}
        icons={tableIcons}
        />);

        expect(wrapper.find(AddBox).length).toBe(1);
        expect(wrapper.find(AddBox).at(0).props().actions).toStrictEqual([{"position": "toolbarOnSelect"}]);
        expect(wrapper.find(AddBox).at(0).props().data).toStrictEqual(selectedRows);
        expect(wrapper.find(AddBox).at(0).props().components).toStrictEqual(components);
  });

  test("renderActions when renderDefaultActions", () => {
    let columns=[{id:1 , hidden:true , field:true , export:true , title:"title" , tableData:{id:1} , removable:false}];
    let data=[{id:1 , data:"Data A"} , {id:2 , data:"Data B"}];
    let renderData=[{id:1 , data:"renderData A"} , {id:2 , data:"renderData B"}];
    let exportAllData= true;
    const getFieldValue = jest.fn();
    let exportFileName="exportFileName";
    let title= "ExportedTitle";
    let exportDelimiter="exportDelimiter";
    let exportCsv= true;
    const exportCsvMock = jest.fn();
    let search = false;
    let searchFieldAlignment="left";
    let showTitle= false;
    let classes={searchField:"searchField"};
    let searchText="searchText";
    const onSearchChanged = jest.fn();
    let searchFieldStyle={};
    let columnsButton= true;
    const onColumnsChanged = jest.fn();
    let exportButton= true;
    let actions=[{position:"row"} , {position:"toolbar"} , {position:"toolbarOnSelect" }];
    let components={Actions: forwardRef((props, ref) => <AddBox {...props} ref={ref} />) };
    let selectedRows=[];
    let showTextRowsSelected= true;
    let toolbarButtonAlignment="left";
    let  wrapper = mount(<TableBodyToolbar
      columns={columns} data={data} renderData={renderData} exportAllData={exportAllData} getFieldValue={getFieldValue} 
        exportFileName={exportFileName} title={title} exportDelimiter={exportDelimiter} exportCsv={exportCsv} exportCsv={exportCsvMock}
        localization={localization} search={search} searchFieldAlignment={searchFieldAlignment} showTitle={showTitle}
        classes={classes} searchText={searchText} onSearchChanged={onSearchChanged} searchFieldStyle={searchFieldStyle}
        columnsButton={columnsButton} onColumnsChanged={onColumnsChanged} exportButton={exportButton} actions={actions}
        components={components} selectedRows={selectedRows} showTextRowsSelected={showTextRowsSelected} toolbarButtonAlignment={toolbarButtonAlignment}
        icons={tableIcons}
        />);
        //expectations
        expect(wrapper.find("#menu1RenderDefaultActions").at(0).props().anchorEl).toStrictEqual(null);
        expect(wrapper.find("#menu1RenderDefaultActions").at(0).props().open).toBeFalsy();
        expect(wrapper.find("#menu2RenderDefaultActions").at(0).props().anchorEl).toStrictEqual(null);
        expect(wrapper.find("#menu2RenderDefaultActions").at(0).props().open).toBeFalsy();
        expect(wrapper.find(AddBox).length).toBe(1);
        expect(wrapper.find(AddBox).at(0).props().actions).toStrictEqual([{"position": "toolbar"}]);
        expect(wrapper.find(AddBox).at(0).props().components).toStrictEqual(components);
      // set State for columnsButtonAnchorEl
      act(() => {
        wrapper
          .find("#iconButton1RenderDefaultActions").at(0)
          .props().onClick({ currentTarget: []});
      });
      wrapper.update();
      wrapper.render();
      expect(wrapper.find("#menu1RenderDefaultActions").at(0).props().anchorEl).toStrictEqual([]);
      expect(wrapper.find("#menu1RenderDefaultActions").at(0).props().open).toBeTruthy();
      expect(wrapper.find("#columnsRenderDefaultActions"+columns[0].id).at(0).props().disabled).toBeTruthy();
      //TBD
      //expect(wrapper.find("#columnsRenderDefaultActions"+columns[0].id).at(0).props().key).toBe(columns[0].tableData.id);
      //onColumnsChanged
      act(() => {
        wrapper
          .find("#columnsRenderDefaultActions"+columns[0].id).at(0)
          .props().onClick();
      });
      wrapper.update();
      wrapper.render();
      expect(onColumnsChanged).toHaveBeenCalledTimes(1);
      expect(onColumnsChanged.mock.calls[0][0]).toStrictEqual({id:1 , hidden:true , field:true , export:true , title:"title" , tableData:{id:1} , removable:false});
      expect(onColumnsChanged.mock.calls[0][1]).toBeFalsy();
      // onClose for columnsButtonAnchorEl
      act(() => {
        wrapper
          .find("#menu1RenderDefaultActions").at(0)
          .props().onClose();
      });
      wrapper.update();
      wrapper.render();
      expect(wrapper.find("#menu1RenderDefaultActions").at(0).props().anchorEl).toStrictEqual(null);
      expect(wrapper.find("#menu1RenderDefaultActions").at(0).props().open).toBeFalsy();
       // set State for exportButtonAnchorEl
       act(() => {
        wrapper
          .find("#iconButton2RenderDefaultActions").at(0)
          .props().onClick({ currentTarget: []});
      });
      wrapper.update();
      wrapper.render();
      expect(wrapper.find("#menu2RenderDefaultActions").at(0).props().anchorEl).toStrictEqual([]);
      expect(wrapper.find("#menu2RenderDefaultActions").at(0).props().open).toBeTruthy();
       // onClose for exportButtonAnchorEl
       act(() => {
        wrapper
          .find("#menu2RenderDefaultActions").at(0)
          .props().onClose();
      });
      wrapper.update();
      wrapper.render();
      expect(wrapper.find("#menu2RenderDefaultActions").at(0).props().anchorEl).toStrictEqual(null);
      expect(wrapper.find("#menu2RenderDefaultActions").at(0).props().open).toBeFalsy();
  });

  test("renderActions when renderDefaultActions and exportCsv", () => {
    let columns=[{id:1 , hidden:true , field:true , export:true , title:"title" , tableData:{id:1} , removable:false}];
    let data=[{id:1 , data:"Data A"} , {id:2 , data:"Data B"}];
    let renderData=[{id:1 , data:"renderData A"} , {id:2 , data:"renderData B"}];
    let exportAllData= true;
    const getFieldValue = jest.fn();
    let exportFileName="exportFileName";
    let title= "ExportedTitle";
    let exportDelimiter="exportDelimiter";
    let exportCsv= true;
    const exportCsvMock = jest.fn();
    let search = false;
    let searchFieldAlignment="left";
    let showTitle= false;
    let classes={searchField:"searchField"};
    let searchText="searchText";
    const onSearchChanged = jest.fn();
    let searchFieldStyle={};
    let columnsButton= true;
    const onColumnsChanged = jest.fn();
    let exportButton= true;
    let actions=[{position:"row"} , {position:"toolbar"} , {position:"toolbarOnSelect" }];
    let components={Actions: forwardRef((props, ref) => <AddBox {...props} ref={ref} />) };
    let selectedRows=[];
    let showTextRowsSelected= true;
    let toolbarButtonAlignment="left";
    let  wrapper = mount(<TableBodyToolbar
      columns={columns} data={data} renderData={renderData} exportAllData={exportAllData} getFieldValue={getFieldValue} 
        exportFileName={exportFileName} title={title} exportDelimiter={exportDelimiter} exportCsv={exportCsv} exportCsv={exportCsvMock}
        localization={localization} search={search} searchFieldAlignment={searchFieldAlignment} showTitle={showTitle}
        classes={classes} searchText={searchText} onSearchChanged={onSearchChanged} searchFieldStyle={searchFieldStyle}
        columnsButton={columnsButton} onColumnsChanged={onColumnsChanged} exportButton={exportButton} actions={actions}
        components={components} selectedRows={selectedRows} showTextRowsSelected={showTextRowsSelected} toolbarButtonAlignment={toolbarButtonAlignment}
        icons={tableIcons}
        />);
        //expectations
        expect(wrapper.find("#menu1RenderDefaultActions").at(0).props().anchorEl).toStrictEqual(null);
        expect(wrapper.find("#menu1RenderDefaultActions").at(0).props().open).toBeFalsy();
        expect(wrapper.find("#menu2RenderDefaultActions").at(0).props().anchorEl).toStrictEqual(null);
        expect(wrapper.find("#menu2RenderDefaultActions").at(0).props().open).toBeFalsy();
        expect(wrapper.find(AddBox).length).toBe(1);
        expect(wrapper.find(AddBox).at(0).props().actions).toStrictEqual([{"position": "toolbar"}]);
        expect(wrapper.find(AddBox).at(0).props().components).toStrictEqual(components);
     
    /// set State for exportButtonAnchorEl
    act(() => {
      wrapper
        .find("#iconButton2RenderDefaultActions").at(0)
        .props().onClick({ currentTarget: []});
    });
    wrapper.update();
    wrapper.render();
    expect(wrapper.find("#menu2RenderDefaultActions").at(0).props().anchorEl).toStrictEqual([]);
    expect(wrapper.find("#menu2RenderDefaultActions").at(0).props().open).toBeTruthy();
    //exportCsv
    act(() => {
      wrapper
        .find("#exportCsvMenuItem").at(0)
        .props().onClick();
    });
    wrapper.update();
    wrapper.render();
    expect(exportCsvMock).toHaveBeenCalledTimes(1);
      expect(exportCsvMock.mock.calls[0][0]).toStrictEqual(columns);
      expect(exportCsvMock.mock.calls[0][1]).toStrictEqual(data);
      expect(wrapper.find("#menu2RenderDefaultActions").at(0).props().anchorEl).toBe(null);
    expect(wrapper.find("#menu2RenderDefaultActions").at(0).props().open).toBeFalsy();
  });

  test("renderActions when renderDefaultActions and exportCsv when defaultExportCsv", () => {
    //TBD
    // let setDelimeterMock = () => {return ""} ;
    // let setColumnsMock = jest.fn();
    // let addRowsMock = jest.fn();
    // let exportFileMock = jest.fn();
    // let builder={
    //   setDelimeter:setDelimeterMock,
    //   setColumns:setColumnsMock,
    //   addRows:addRowsMock,
    //   exportFile:exportFileMock,
    // }
    // const BuilderMock= jest.spyOn( CsvBuilderMock , "CsvBuilder");
    let columns=[{id:1 , hidden:false , field:true , export:true , title:"title" , tableData:{id:1 , columnOrder:1} , removable:false} ,
    {id:1 , hidden:false , field:true , export:true , title:"title" , tableData:{id:1 , columnOrder:4} , removable:false} ,
    {id:1 , hidden:false , field:true , export:true , title:"title" , tableData:{id:1 , columnOrder:3} , removable:false}];
    let data=[{id:1 , data:"Data A"} , {id:2 , data:"Data B"}];
    let renderData=[{id:1 , data:"renderData A"} , {id:2 , data:"renderData B"}];
    let exportAllData= true;
    const getFieldValue = jest.fn();
    let exportFileName="exportFileName";
    let title= "ExportedTitle";
    let exportDelimiter="exportDelimiter";
    let exportCsv= false;
    const exportCsvMock = jest.fn();
    let search = false;
    let searchFieldAlignment="left";
    let showTitle= false;
    let classes={searchField:"searchField"};
    let searchText="searchText";
    const onSearchChanged = jest.fn();
    let searchFieldStyle={};
    let columnsButton= true;
    const onColumnsChanged = jest.fn();
    let exportButton= true;
    let actions=[{position:"row"} , {position:"toolbar"} , {position:"toolbarOnSelect" }];
    let components={Actions: forwardRef((props, ref) => <AddBox {...props} ref={ref} />) };
    let selectedRows=[];
    let showTextRowsSelected= true;
    let toolbarButtonAlignment="left";
    let  wrapper = mount(<TableBodyToolbar
      columns={columns} data={data} renderData={renderData} exportAllData={exportAllData} getFieldValue={getFieldValue} 
        exportFileName={exportFileName} title={title} exportDelimiter={exportDelimiter} exportCsv={exportCsv} 
        localization={localization} search={search} searchFieldAlignment={searchFieldAlignment} showTitle={showTitle}
        classes={classes} searchText={searchText} onSearchChanged={onSearchChanged} searchFieldStyle={searchFieldStyle}
        columnsButton={columnsButton} onColumnsChanged={onColumnsChanged} exportButton={exportButton} actions={actions}
        components={components} selectedRows={selectedRows} showTextRowsSelected={showTextRowsSelected} toolbarButtonAlignment={toolbarButtonAlignment}
        icons={tableIcons}
        />);
        //expectations
        expect(wrapper.find("#menu1RenderDefaultActions").at(0).props().anchorEl).toStrictEqual(null);
        expect(wrapper.find("#menu1RenderDefaultActions").at(0).props().open).toBeFalsy();
        expect(wrapper.find("#menu2RenderDefaultActions").at(0).props().anchorEl).toStrictEqual(null);
        expect(wrapper.find("#menu2RenderDefaultActions").at(0).props().open).toBeFalsy();
        expect(wrapper.find(AddBox).length).toBe(1);
        expect(wrapper.find(AddBox).at(0).props().actions).toStrictEqual([{"position": "toolbar"}]);
        expect(wrapper.find(AddBox).at(0).props().components).toStrictEqual(components);
     
    /// set State for exportButtonAnchorEl
    act(() => {
      wrapper
        .find("#iconButton2RenderDefaultActions").at(0)
        .props().onClick({ currentTarget: []});
    });
    wrapper.update();
    wrapper.render();
    expect(wrapper.find("#menu2RenderDefaultActions").at(0).props().anchorEl).toStrictEqual([]);
    expect(wrapper.find("#menu2RenderDefaultActions").at(0).props().open).toBeTruthy();
    //exportCsv
    act(() => {
      wrapper
        .find("#exportCsvMenuItem").at(0)
        .props().onClick();
    });
    wrapper.update();
    wrapper.render();
    expect(exportCsvMock).toHaveBeenCalledTimes(0);
    expect(getFieldValue).toHaveBeenCalledTimes(6);
    expect(getFieldValue.mock.calls[0][0]).toStrictEqual({"data": "Data A", "id": 1});
    expect(getFieldValue.mock.calls[0][1]).toStrictEqual({"export": true, "field": true, "hidden": false, "id": 1, "removable": false, "tableData": {"columnOrder": 1, "id": 1}, "title": "title"});

    expect(getFieldValue.mock.calls[1][0]).toStrictEqual({"data": "Data A", "id": 1});
    expect(getFieldValue.mock.calls[1][1]).toStrictEqual({"export": true, "field": true, "hidden": false, "id": 1, "removable": false, "tableData": {"columnOrder": 3, "id": 1}, "title": "title"});

    expect(getFieldValue.mock.calls[2][0]).toStrictEqual({"data": "Data A", "id": 1});
    expect(getFieldValue.mock.calls[2][1]).toStrictEqual({"export": true, "field": true, "hidden": false, "id": 1, "removable": false, "tableData": {"columnOrder": 4, "id": 1}, "title": "title"});

    expect(getFieldValue.mock.calls[3][0]).toStrictEqual( {id:2 , data:"Data B"});
    expect(getFieldValue.mock.calls[3][1]).toStrictEqual({"export": true, "field": true, "hidden": false, "id": 1, "removable": false, "tableData": {"columnOrder": 1, "id": 1}, "title": "title"});

    expect(getFieldValue.mock.calls[4][0]).toStrictEqual( {id:2 , data:"Data B"});
    expect(getFieldValue.mock.calls[4][1]).toStrictEqual({"export": true, "field": true, "hidden": false, "id": 1, "removable": false, "tableData": {"columnOrder": 3, "id": 1}, "title": "title"});

    expect(getFieldValue.mock.calls[5][0]).toStrictEqual( {id:2 , data:"Data B"});
    expect(getFieldValue.mock.calls[5][1]).toStrictEqual({"export": true, "field": true, "hidden": false, "id": 1, "removable": false, "tableData": {"columnOrder": 4, "id": 1}, "title": "title"});
      expect(wrapper.find("#menu2RenderDefaultActions").at(0).props().anchorEl).toBe(null);
    expect(wrapper.find("#menu2RenderDefaultActions").at(0).props().open).toBeFalsy();
    //  expect(BuilderMock).toHaveBeenCalledTimes(1);
    
  });
});
