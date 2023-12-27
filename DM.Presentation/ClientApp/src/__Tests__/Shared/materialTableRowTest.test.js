
import ReactDom from "react-dom";
import TableBodyRow from "../../components/Shared/materialTableRow";
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
describe("TableBodyRow", () => {
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
    let rowStyleMock= jest.fn();
    let options={detailPanelColumnAlignment:"right", actionsCellStyle:"actionsCellStyle" , selectionProps : true , rowStyle: rowStyleMock , padding:"default", selection:true, actionsColumnIndex:-1}
    let level= 1;
    let index= 1;
    let hasAnyEditingRow = true;
    let treeDataMaxLevel= 1;
    let path="path";
    let onRowSelected= jest.fn();
    let onTreeExpandChanged= jest.fn();
    let detailPanel=[];
    let  showDetailPanelMock = jest.fn();
    let columns=[{hidden:true , field:true , export:true , title:"title" , tableData:{id:1 , groupOrder: 2}}];
    let data={id:1 , data:"Data A" , tableData:{id:2 , showDetailPanel:showDetailPanelMock , childRows:[{id:1 , tableData:{editing:true}}] , checked:true }  ,checked:true , isTreeExpanded:true};
    const getFieldValue = jest.fn();
    const onToggleDetailPanel = jest.fn();
    let onRowClick= true;
    let actions=[{position:"toolbar" },{position:"row" },{position:"toolbarOnSelect" }];
    let components={Cell: forwardRef((props, ref) => <AddBox {...props} ref={ref} />) 
                   ,Actions: forwardRef((props, ref) => <Check {...props} ref={ref} />) 
                   ,DetailPanel: forwardRef((props, ref) => <Clear {...props} ref={ref} />) };
    ReactDom.render(<TableBodyRow 
        columns={columns} data={data}  getFieldValue={getFieldValue} 
        localization={localization}  actions={actions}
        components={components}
        options={options}
        level={level}
        index={index}
        hasAnyEditingRow={hasAnyEditingRow}
        treeDataMaxLevel={treeDataMaxLevel}
        path={path}
        onRowSelected={onRowSelected}
        onTreeExpandChanged={onTreeExpandChanged}
        onRowClick={onRowClick}
        detailPanel={detailPanel}
        onToggleDetailPanel={onToggleDetailPanel}
    />,
      div
    );
  });

  test("matches snapshot", () => {
    let rowStyleMock= jest.fn();
    let options={detailPanelColumnAlignment:"right", actionsCellStyle:"actionsCellStyle" , selectionProps : true , rowStyle: rowStyleMock , padding:"default", selection:true, actionsColumnIndex:-1}
    let level= 1;
    let index= 1;
    let hasAnyEditingRow = true;
    let treeDataMaxLevel= 1;
    let path="path";
    let onRowSelected= jest.fn();
    let onTreeExpandChanged= jest.fn();
    let detailPanel=[];
    let  showDetailPanelMock = jest.fn();
    let columns=[{hidden:true , field:true , export:true , title:"title" , tableData:{id:1 , groupOrder: 2}}];
    let data={id:1 , data:"Data A" , tableData:{id:2 , showDetailPanel:showDetailPanelMock , childRows:[{id:1 , tableData:{editing:true}}] , checked:true }  ,checked:true , isTreeExpanded:true};
    const getFieldValue = jest.fn();
    const onToggleDetailPanel = jest.fn();
    let onRowClick= true;
    let actions=[{position:"toolbar" },{position:"row" },{position:"toolbarOnSelect" }];
    let components={Cell: forwardRef((props, ref) => <AddBox {...props} ref={ref} />) 
                   ,Actions: forwardRef((props, ref) => <Check {...props} ref={ref} />) 
                   ,DetailPanel: forwardRef((props, ref) => <Clear {...props} ref={ref} />) };
    const wrapper = shallow(
        <TableBodyRow 
        columns={columns} data={data}  getFieldValue={getFieldValue} 
        localization={localization}  actions={actions}
        components={components}
        options={options}
        level={level}
        index={index}
        hasAnyEditingRow={hasAnyEditingRow}
        treeDataMaxLevel={treeDataMaxLevel}
        path={path}
        onRowSelected={onRowSelected}
        onTreeExpandChanged={onTreeExpandChanged}
        onRowClick={onRowClick}
        detailPanel={detailPanel}
        onToggleDetailPanel={onToggleDetailPanel}
    />
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test("intializations", () => {
    let rowStyleMock= jest.fn();
    let options={detailPanelColumnAlignment:"right", actionsCellStyle:"actionsCellStyle" , selectionProps : true , rowStyle: rowStyleMock , padding:"", selection:true, actionsColumnIndex:-1}
    let level= 1;
    let index= 1;
    let hasAnyEditingRow = true;
    let treeDataMaxLevel= 1;
    let path="path";
    let onRowSelected= jest.fn();
    let onTreeExpandChanged= jest.fn();
    let detailPanel=[];
    let  showDetailPanelMock = jest.fn();
    let isTreeData= true;
    let columns=[{hidden:true , field:true , export:true , title:"title" , tableData:{id:1 , groupOrder: 2}}];
    let data={id:1 , data:"Data A" , tableData:{id:2 , showDetailPanel:showDetailPanelMock , 
        childRows:[{id:1 , tableData:{editing:true}} , {id:2 , tableData:{editing:false}}] , checked:true , isTreeExpanded:true } };
    const getFieldValue = jest.fn();
    const onToggleDetailPanel = jest.fn();
    let onRowClick= true;
    let actions=[{position:"toolbar" },{position:"row" },{position:"toolbarOnSelect" }];
    let components={Cell: forwardRef((props, ref) => <AddBox {...props} ref={ref} />) 
                   ,Actions: forwardRef((props, ref) => <Check {...props} ref={ref} />) 
                   ,DetailPanel: forwardRef((props, ref) => <Clear {...props} ref={ref} />)
                ,EditRow: forwardRef((props, ref) => <FilterList {...props} ref={ref} />) 
                ,Row: forwardRef((props, ref) => <LastPage {...props} ref={ref} />)};
    let onEditingCanceled="onEditingCanceled";
    let onEditingApproved="onEditingApproved";
    let  wrapper = mount(<TableBodyRow 
        columns={columns} data={data}  getFieldValue={getFieldValue} 
        localization={localization}  actions={actions}
        components={components}
        options={options}
        level={level}
        index={index}
        hasAnyEditingRow={hasAnyEditingRow}
        treeDataMaxLevel={treeDataMaxLevel}
        path={path}
        onRowSelected={onRowSelected}
        onTreeExpandChanged={onTreeExpandChanged}
        onRowClick={onRowClick}
        detailPanel={detailPanel}
        onToggleDetailPanel={onToggleDetailPanel}
        onEditingCanceled={onEditingCanceled}
        onEditingApproved={onEditingApproved}
        icons={tableIcons}
        isTreeData={isTreeData}
    />);

    expect(wrapper.find("#tableRow1").at(0).props().selected).toBeTruthy();
    expect(wrapper.find("#tableRow1").at(0).props().hover).toBeTruthy();
    expect(wrapper.find(FilterList).length).toBe(1);
    expect(wrapper.find(FilterList).at(0).props().columns).toStrictEqual([]);
    expect(wrapper.find(FilterList).at(0).props().components).toStrictEqual(components);
    expect(wrapper.find(FilterList).at(0).props().data).toStrictEqual({id:1 , tableData:{editing:true}});
    expect(wrapper.find(FilterList).at(0).props().icons).toStrictEqual(tableIcons);
    expect(wrapper.find(FilterList).at(0).props().localization).toStrictEqual(localization);
    expect(wrapper.find(FilterList).at(0).props().mode).toBeTruthy();
    expect(wrapper.find(FilterList).at(0).props().options).toStrictEqual(options);
    expect(wrapper.find(FilterList).at(0).props().isTreeData).toBeTruthy();
    expect(wrapper.find(FilterList).at(0).props().detailPanel).toStrictEqual(detailPanel);
    expect(wrapper.find(FilterList).at(0).props().onEditingCanceled).toStrictEqual(onEditingCanceled);
    expect(wrapper.find(FilterList).at(0).props().onEditingApproved).toStrictEqual(onEditingApproved);

    expect(wrapper.find(LastPage).length).toBe(1);
    expect(wrapper.find(LastPage).at(0).props().index).toStrictEqual(1);
    expect(wrapper.find(LastPage).at(0).props().level).toStrictEqual(level+1);
    expect(wrapper.find(LastPage).at(0).props().path).toStrictEqual([...path, 1]);
    expect(wrapper.find(LastPage).at(0).props().columns).toStrictEqual(
       [
           {
            "export": true,
            "field": true,
           "hidden": true,
            "tableData":  {
               "groupOrder": 2,
             "id": 1,
            },
             "title": "title",
          },
        ]
    );
    expect(wrapper.find(LastPage).at(0).props().components).toStrictEqual(components);
    expect(wrapper.find(LastPage).at(0).props().data).toStrictEqual({id:2 , tableData:{editing:false}});
    expect(wrapper.find(LastPage).at(0).props().hasAnyEditingRow).toStrictEqual(hasAnyEditingRow);
    expect(wrapper.find(LastPage).at(0).props().onEditingCanceled).toStrictEqual(onEditingCanceled);
    expect(wrapper.find(LastPage).at(0).props().treeDataMaxLevel).toStrictEqual(treeDataMaxLevel);
    expect(wrapper.find(LastPage).at(0).props().onEditingApproved).toStrictEqual(onEditingApproved);
   
  });

  test("intializations , renderColumns when all the conditions is true", () => {
    jest.clearAllMocks();
    const createElementMock= jest.spyOn( React , "createElement");
    let rowStyleMock= jest.fn();
    let selectionPropsMock =jest.fn();
    let stopPropagationMock=jest.fn();
    let stopPropagationMock2=jest.fn();
    let stopPropagationMock3=jest.fn();
    let options={detailPanelColumnAlignment:"right", actionsCellStyle:"actionsCellStyle" , selectionProps : selectionPropsMock , rowStyle: true , padding:"default", selection:true, actionsColumnIndex:-1}
    let level= 1;
    let index= 1;
    let hasAnyEditingRow = true;
    let treeDataMaxLevel= 1;
    let path="path";
    let onRowSelected= jest.fn();
    let showDetailPanelMock= jest.fn();
    let onTreeExpandChanged= jest.fn();
    let detailPanel=[{render:"" , openIcon:"openIcon" , icon:"icon"}];
    let isTreeData= true;
    let columns=[{hidden:false , field:true , export:true , title:"title" , tableData:{id:1 , groupOrder: -1}} , {hidden:false , field:true , export:true , title:"title" , tableData:{id:1 , groupOrder: 2}}];
    let data={id:1 , data:"Data A" , tableData:{id:2 , showDetailPanel:showDetailPanelMock , 
        childRows:[{id:1 , tableData:{editing:true}} , {id:2 , tableData:{editing:false}}] , checked:true , isTreeExpanded:true } };
    const getFieldValue = jest.fn();
    const onToggleDetailPanel = jest.fn();
    let onRowClick=  jest.fn();
    let actions=[{position:"toolbar" },{position:"row" },{position:"toolbarOnSelect" }];
    let components={Cell: forwardRef((props, ref) => <AddBox {...props} ref={ref} />) 
                   ,Actions: forwardRef((props, ref) => <Check {...props} ref={ref} />) 
                   ,DetailPanel: forwardRef((props, ref) => <Clear {...props} ref={ref} />)
                ,EditRow: forwardRef((props, ref) => <FilterList {...props} ref={ref} />) 
                ,Row: forwardRef((props, ref) => <LastPage {...props} ref={ref} />)};
    let onEditingCanceled="onEditingCanceled";
    let onEditingApproved="onEditingApproved";
    let  wrapper = mount(<TableBodyRow 
        columns={columns} data={data}  getFieldValue={getFieldValue} 
        localization={localization}  actions={actions}
        components={components}
        options={options}
        level={level}
        index={index}
        hasAnyEditingRow={hasAnyEditingRow}
        treeDataMaxLevel={treeDataMaxLevel}
        path={path}
        onRowSelected={onRowSelected}
        onTreeExpandChanged={onTreeExpandChanged}
        onRowClick={onRowClick}
        detailPanel={detailPanel}
        onToggleDetailPanel={onToggleDetailPanel}
        onEditingCanceled={onEditingCanceled}
        onEditingApproved={onEditingApproved}
        icons={tableIcons}
        isTreeData={isTreeData}
    />);

    expect(wrapper.find("#tableRow1").at(0).props().selected).toBeTruthy();
    expect(wrapper.find("#tableRow1").at(0).props().hover).toBeTruthy();
    expect(wrapper.find(FilterList).length).toBe(1);
    expect(wrapper.find(LastPage).length).toBe(1);

    //expectations for renderColumns functionality
    expect(getFieldValue).toHaveBeenCalledTimes(1);
    expect(getFieldValue.mock.calls[0][0]).toStrictEqual(data);
    expect(getFieldValue.mock.calls[0][1]).toStrictEqual({hidden:false , field:true , export:true , title:"title" , tableData:{id:1 , groupOrder: -1}});
    expect(wrapper.find(AddBox).length).toBe(1);
    expect(wrapper.find(AddBox).at(0).props().size).toBe("medium");
    expect(wrapper.find(AddBox).at(0).props().icons).toStrictEqual(tableIcons);
    expect(wrapper.find(AddBox).at(0).props().columnDef).toStrictEqual({hidden:false , field:true , export:true , title:"title" , tableData:{id:1 , groupOrder: -1}});
    expect(wrapper.find(AddBox).at(0).props().rowData).toStrictEqual(data);
    //expectations for renderSelectionColumn functionality
    expect(selectionPropsMock).toHaveBeenCalledTimes(1);
    expect(selectionPropsMock.mock.calls[0][0]).toStrictEqual(data);
    expect(wrapper.find("#tableCellRenderSelectionColumn").at(0).length).toBe(1);
    expect(wrapper.find("#tableCellRenderSelectionColumn").at(0).props().size).toBe("medium");
    expect(wrapper.find("#tableCellRenderSelectionColumn").at(0).props().style).toStrictEqual({"width": 42});
    expect(wrapper.find("#checkBoxRenderSelectionColumn").at(0).length).toBe(1);
    expect(wrapper.find("#checkBoxRenderSelectionColumn").at(0).props().size).toBe("medium");
    expect(wrapper.find("#checkBoxRenderSelectionColumn").at(0).props().checked).toBeTruthy();
    expect(wrapper.find("#checkBoxRenderSelectionColumn").at(0).props().value).toBe("2");
    act(() => {
      wrapper
        .find("#checkBoxRenderSelectionColumn")
        .at(0)
        .props()
        .onClick({ stopPropagation: stopPropagationMock });
    });
    wrapper.render();
    wrapper.update();
    expect(stopPropagationMock).toHaveBeenCalledTimes(1);
    act(() => {
      wrapper
        .find("#checkBoxRenderSelectionColumn")
        .at(0)
        .props()
        .onChange({ stopPropagation: stopPropagationMock });
    });
    wrapper.render();
    wrapper.update();
    expect(onRowSelected).toHaveBeenCalledTimes(1);
    expect(onRowSelected.mock.calls[0][0]).toStrictEqual({ stopPropagation: stopPropagationMock });
    expect(onRowSelected.mock.calls[0][1]).toStrictEqual(path);
    expect(onRowSelected.mock.calls[0][2]).toStrictEqual(data);
    //expectations for renderActions functionality
    expect(wrapper.find(Check).length).toBe(1);
    expect(wrapper.find(Check).at(0).props().data).toStrictEqual(data);
    expect(wrapper.find(Check).at(0).props().actions).toStrictEqual([{position:"row" }]);
    expect(wrapper.find(Check).at(0).props().components).toStrictEqual(components);
//expectations for  this.props.data.tableData.childRows && this.props.data.tableData.childRows.length > 0 condition
    expect(wrapper.find("#detailPanelOfIconButton").at(0).length).toBe(1);
    expect(wrapper.find("#detailPanelOfIconButton").at(0).props().style).toStrictEqual({
      transition: "all ease 200ms",
      marginLeft: level * 9,
      transform:"rotate(90deg)",
    });

    act(() => {
      wrapper
        .find("#detailPanelOfIconButton")
        .at(0)
        .props()
        .onClick({ stopPropagation: stopPropagationMock2 });
    });
    wrapper.render();
    wrapper.update();
    expect(stopPropagationMock2).toHaveBeenCalledTimes(1);
    expect(onTreeExpandChanged).toHaveBeenCalledTimes(1);
    expect(onTreeExpandChanged.mock.calls[0][0]).toStrictEqual(path);
    expect(onTreeExpandChanged.mock.calls[0][1]).toStrictEqual(data);
    //expectations for renderDetailPanelColumn functionality
    expect(wrapper.find("#iconButton1RenderDetailPanelColumn").length).toBe(0);
    expect(wrapper.find("#tableCell2renderDetailPanelColumn").at(0).length).toBe(1);
    expect(wrapper.find("#iconButton2RenderDetailPanelColumn").at(0).length).toBe(1);
    expect(wrapper.find("#iconButton2RenderDetailPanelColumn").at(0).text()).toBe("icon");
    expect(createElementMock).toHaveBeenCalled();
    act(() => {
      wrapper
        .find("#iconButton2RenderDetailPanelColumn")
        .at(0)
        .props()
        .onClick({ stopPropagation: stopPropagationMock3 });
    });
    wrapper.render();
    wrapper.update();
    expect(stopPropagationMock3).toHaveBeenCalledTimes(1);
    expect(onToggleDetailPanel).toHaveBeenCalledTimes(1);
    expect(onToggleDetailPanel.mock.calls[0][0]).toStrictEqual(path);
    expect(onToggleDetailPanel.mock.calls[0][1]).toStrictEqual("");
    expect(wrapper.find("#groupOrderGreaterThanZero").length).toBe(3);
    //expectations for getStyle when (this.props.options.rowStyle)  and all the condition are setted to true 
    expect(wrapper.find("#tableRow1").at(0).props().style).toStrictEqual({"cursor": "pointer", "opacity": 0.2, "transition": "all ease 300ms"});
    act(() => {
      wrapper
        .find("#tableRow1")
        .at(0)
        .props()
        .onClick({ stopPropagation: stopPropagationMock3 });
    });
    wrapper.render();
    wrapper.update();
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick.mock.calls[0][0]).toStrictEqual({ stopPropagation: stopPropagationMock3 });
    expect(onRowClick.mock.calls[0][1]).toStrictEqual(data);
  });
  
  test("intializations , renderColumns when all the conditions is true , cover subBranches", () => {
    jest.clearAllMocks();
    const createElementMock= jest.spyOn( React , "createElement");
    let rowStyleMock= jest.fn();
    let selectionPropsMock =jest.fn();
    let stopPropagationMock=jest.fn();
    let stopPropagationMock2=jest.fn();
    let stopPropagationMock3=jest.fn();
    let options={detailPanelColumnAlignment:"right", actionsCellStyle:"actionsCellStyle" , selectionProps :function(){selectionPropsMock}  , rowStyle: function( data, index , level) {rowStyleMock(data,index,level)} , padding:"", selection:true, actionsColumnIndex:2}
    let level= 1;
    let index= 1;
    let hasAnyEditingRow = false;
    let treeDataMaxLevel= 1;
    let path="path";
    let onRowSelected= jest.fn();
    let showDetailPanelMock= jest.fn();
    let onTreeExpandChanged= jest.fn();
    let panelMock=jest.fn();
    let detailPanel=[{render:"" , openIcon:"openIcon" , icon:"icon" , tooltip:"tooltip"} , function(data){ panelMock(data); return {render:""  , icon:"icon" , tooltip:"tooltip"}; } ];
    let isTreeData= true;
    let columns=[{hidden:false , field:true , export:true , title:"title" , tableData:{id:1 , groupOrder: -1}} , {hidden:false , field:true , export:true , title:"title" , tableData:{id:1 , groupOrder: 2}}];
    let data={id:1 , data:"Data A" , tableData:{id:2  , 
        childRows:[] , checked:true , isTreeExpanded:true } };
    const getFieldValue = jest.fn();
    const onToggleDetailPanel = jest.fn();
    let onRowClick=  jest.fn();
    let actions=[{position:"toolbar" },{position:"row" },{position:"toolbarOnSelect" }];
    let components={Cell: forwardRef((props, ref) => <AddBox {...props} ref={ref} />) 
                   ,Actions: forwardRef((props, ref) => <Check {...props} ref={ref} />) 
                   ,DetailPanel: forwardRef((props, ref) => <Clear {...props} ref={ref} />)
                ,EditRow: forwardRef((props, ref) => <FilterList {...props} ref={ref} />) 
                ,Row: forwardRef((props, ref) => <LastPage {...props} ref={ref} />)};
    let onEditingCanceled="onEditingCanceled";
    let onEditingApproved="onEditingApproved";
    let  wrapper = mount(<TableBodyRow 
        columns={columns} data={data}  getFieldValue={getFieldValue} 
        localization={localization}  actions={actions}
        components={components}
        options={options}
        level={level}
        index={index}
        hasAnyEditingRow={hasAnyEditingRow}
        treeDataMaxLevel={treeDataMaxLevel}
        path={path}
        onRowSelected={onRowSelected}
        onTreeExpandChanged={onTreeExpandChanged}
        detailPanel={detailPanel}
        onToggleDetailPanel={onToggleDetailPanel}
        onEditingCanceled={onEditingCanceled}
        onEditingApproved={onEditingApproved}
        icons={tableIcons}
        isTreeData={isTreeData}
    />);

    //expectations for renderSelectionColumn functionality when is function
    expect(selectionPropsMock).toHaveBeenCalledTimes(0);
    expect(wrapper.find("#tableCellRenderSelectionColumn").at(0).length).toBe(1);
    expect(wrapper.find("#tableCellRenderSelectionColumn").at(0).props().size).toBe("small");
    expect(wrapper.find("#tableCellRenderSelectionColumn").at(0).props().style).toStrictEqual({"width": 26});
    expect(wrapper.find("#checkBoxRenderSelectionColumn").at(0).length).toBe(1);
    expect(wrapper.find("#checkBoxRenderSelectionColumn").at(0).props().size).toBe("small");
    expect(wrapper.find("#checkBoxRenderSelectionColumn").at(0).props().checked).toBeTruthy();
    expect(wrapper.find("#checkBoxRenderSelectionColumn").at(0).props().value).toBe("2");
    
    //expectations for renderActions functionality
    expect(wrapper.find(Check).length).toBe(1);
    expect(wrapper.find(Check).at(0).props().data).toStrictEqual(data);
    expect(wrapper.find(Check).at(0).props().actions).toStrictEqual([{position:"row" }]);
    expect(wrapper.find(Check).at(0).props().components).toStrictEqual(components);
//expectations for  this.props.data.tableData.childRows && this.props.data.tableData.childRows.length > 0 is false condition
    expect(wrapper.find("#key-tree-data-column").at(0).length).toBe(1);
    
    //expectations for renderDetailPanelColumn functionality
    expect(wrapper.find("#tooltipPanel").length).toBe(4);
    expect(wrapper.find("#iconButton1RenderDetailPanelColumn").length).toBe(0);
    expect(wrapper.find("#tableCell2renderDetailPanelColumn").at(0).length).toBe(1);
    expect(wrapper.find("#iconButton2RenderDetailPanelColumn").at(0).length).toBe(1);
    expect(wrapper.find("#iconButton2RenderDetailPanelColumn").at(0).props().style).toStrictEqual({"transform": "none", "transition": "all ease 200ms"});
    expect(wrapper.find("#iconButton2RenderDetailPanelColumn").at(0).text()).toBe("openIcon");
    expect(createElementMock).toHaveBeenCalled();
    expect(wrapper.find("#groupOrderGreaterThanZero").length).toBe(3);
    //expectations for getStyle when (this.props.options.rowStyle)  and all the condition are setted to true 
    expect(wrapper.find("#tableRow1").at(0).props().style).toStrictEqual({"transition": "all ease 300ms"});
    expect(rowStyleMock).toHaveBeenCalledTimes(1);
    expect(rowStyleMock.mock.calls[0][0]).toStrictEqual(data);
    expect(rowStyleMock.mock.calls[0][1]).toStrictEqual(index);
    expect(rowStyleMock.mock.calls[0][1]).toStrictEqual(level);
  });

  test("intializations , when detailPanel is a function", () => {
    jest.clearAllMocks();
    const createElementMock= jest.spyOn( React , "createElement");
    let rowStyleMock= jest.fn();
    let selectionPropsMock =jest.fn();
    let stopPropagationMock=jest.fn();
    let stopPropagationMock2=jest.fn();
    let stopPropagationMock3=jest.fn();
    let options={detailPanelColumnAlignment:"right", actionsCellStyle:"actionsCellStyle" , selectionProps :function(){selectionPropsMock}  , rowStyle: function( data, index , level) {rowStyleMock(data,index,level)} , padding:"", selection:true, actionsColumnIndex:2}
    let level= 1;
    let index= 1;
    let hasAnyEditingRow = false;
    let treeDataMaxLevel= 1;
    let path="path";
    let onRowSelected= jest.fn();
    let showDetailPanelMock= jest.fn();
    let onTreeExpandChanged= jest.fn();
    let panelMock=jest.fn();
    let detailPanelMock= jest.fn();
    let detailPanel=function(){ detailPanelMock };
    let isTreeData= true;
    let columns=[{hidden:false , field:true , export:true , title:"title" , tableData:{id:1 , groupOrder: -1}} , {hidden:false , field:true , export:true , title:"title" , tableData:{id:1 , groupOrder: 2}}];
    let data={id:1 , data:"Data A" , tableData:{id:2  , 
        childRows:[] , checked:true , isTreeExpanded:true } };
    const getFieldValue = jest.fn();
    const onToggleDetailPanel = jest.fn();
    let onRowClick=  jest.fn();
    let actions=[{position:"toolbar" },{position:"row" },{position:"toolbarOnSelect" }];
    let components={Cell: forwardRef((props, ref) => <AddBox {...props} ref={ref} />) 
                   ,Actions: forwardRef((props, ref) => <Check {...props} ref={ref} />) 
                   ,DetailPanel: forwardRef((props, ref) => <Clear {...props} ref={ref} />)
                ,EditRow: forwardRef((props, ref) => <FilterList {...props} ref={ref} />) 
                ,Row: forwardRef((props, ref) => <LastPage {...props} ref={ref} />)};
    let onEditingCanceled="onEditingCanceled";
    let onEditingApproved="onEditingApproved";
    let  wrapper = mount(<TableBodyRow 
        columns={columns} data={data}  getFieldValue={getFieldValue} 
        localization={localization}  actions={actions}
        components={components}
        options={options}
        level={level}
        index={index}
        hasAnyEditingRow={hasAnyEditingRow}
        treeDataMaxLevel={treeDataMaxLevel}
        path={path}
        onRowSelected={onRowSelected}
        onTreeExpandChanged={onTreeExpandChanged}
        detailPanel={detailPanel}
        onToggleDetailPanel={onToggleDetailPanel}
        onEditingCanceled={onEditingCanceled}
        onEditingApproved={onEditingApproved}
        icons={tableIcons}
        isTreeData={isTreeData}
    />);
 
    //expectations for renderDetailPanelColumn functionality
    expect(wrapper.find("#iconButton1RenderDetailPanelColumn").length).toBe(5);
    expect(wrapper.find("#iconButton1RenderDetailPanelColumn").at(0).props().style).toStrictEqual({"transform": "none", "transition": "all ease 200ms"});
    act(() => {
      wrapper
        .find("#iconButton1RenderDetailPanelColumn")
        .at(0)
        .props()
        .onClick({ stopPropagation: stopPropagationMock });
    });
    wrapper.render();
    wrapper.update();
    expect(stopPropagationMock).toHaveBeenCalledTimes(1);
    expect(onToggleDetailPanel).toHaveBeenCalledTimes(1);
    expect(onToggleDetailPanel.mock.calls[0][0]).toStrictEqual("path");
    expect(onToggleDetailPanel.mock.calls[0][1]).toStrictEqual(detailPanel);
  });

  test("intializations , renderColumns when all the conditions is false", () => {
    let rowStyleMock= jest.fn();
    let selectionPropsMock =jest.fn();
    let stopPropagationMock=jest.fn();
    let stopPropagationMock2=jest.fn();
    let stopPropagationMock3=jest.fn();
    let options={detailPanelColumnAlignment:"left", actionsCellStyle:"actionsCellStyle" , selectionProps : selectionPropsMock , rowStyle: true , padding:"default", selection:false, actionsColumnIndex:-1}
    let level= 1;
    let index= 1;
    let hasAnyEditingRow = true;
    let treeDataMaxLevel= 1;
    let path="path";
    let onRowSelected= jest.fn();
    let showDetailPanelMock= jest.fn();
    let onTreeExpandChanged= jest.fn();
    let detailPanel=[{render:"" , openIcon:"openIcon" , icon:"icon"}];
    let isTreeData= false;
    let columns=[{hidden:false , field:true , export:true , title:"title" , tableData:{id:1 , groupOrder: -1}} , {hidden:false , field:true , export:true , title:"title" , tableData:{id:1 , groupOrder: 2}}];
    let data={id:1 , data:"Data A" , tableData:{id:2 , showDetailPanel:showDetailPanelMock , 
        childRows:[{id:1 , tableData:{editing:true}} , {id:2 , tableData:{editing:false}}] , checked:true , isTreeExpanded:true } };
    const getFieldValue = jest.fn();
    const onToggleDetailPanel = jest.fn();
    let onRowClick=  jest.fn();
    let actions=[{position:"toolbar" },{position:"toolbarOnSelect" }];
    let components={Cell: forwardRef((props, ref) => <AddBox {...props} ref={ref} />) 
                   ,Actions: forwardRef((props, ref) => <Check {...props} ref={ref} />) 
                   ,DetailPanel: forwardRef((props, ref) => <Clear {...props} ref={ref} />)
                ,EditRow: forwardRef((props, ref) => <FilterList {...props} ref={ref} />) 
                ,Row: forwardRef((props, ref) => <LastPage {...props} ref={ref} />)};
    let onEditingCanceled="onEditingCanceled";
    let onEditingApproved="onEditingApproved";
    let  wrapper = mount(<TableBodyRow 
        columns={columns} data={data}  getFieldValue={getFieldValue} 
        localization={localization}  actions={actions}
        components={components}
        options={options}
        level={level}
        index={index}
        hasAnyEditingRow={hasAnyEditingRow}
        treeDataMaxLevel={treeDataMaxLevel}
        path={path}
        onRowSelected={onRowSelected}
        onTreeExpandChanged={onTreeExpandChanged}
        onRowClick={onRowClick}
        detailPanel={detailPanel}
        onToggleDetailPanel={onToggleDetailPanel}
        onEditingCanceled={onEditingCanceled}
        onEditingApproved={onEditingApproved}
        icons={tableIcons}
        isTreeData={isTreeData}
    />);

    expect(wrapper.find("#tableRow1").at(0).props().selected).toBeTruthy();
    expect(wrapper.find(FilterList).length).toBe(1);
    expect(wrapper.find(LastPage).length).toBe(1);

    //expectations for renderColumns functionality
    expect(getFieldValue).toHaveBeenCalledTimes(1);
    expect(getFieldValue.mock.calls[0][0]).toStrictEqual(data);
    expect(getFieldValue.mock.calls[0][1]).toStrictEqual({hidden:false , field:true , export:true , title:"title" , tableData:{id:1 , groupOrder: -1}});
    expect(wrapper.find(AddBox).length).toBe(1);
    expect(wrapper.find(AddBox).at(0).props().size).toBe("medium");
    expect(wrapper.find(AddBox).at(0).props().icons).toStrictEqual(tableIcons);
    expect(wrapper.find(AddBox).at(0).props().columnDef).toStrictEqual({hidden:false , field:true , export:true , title:"title" , tableData:{id:1 , groupOrder: -1}});
    expect(wrapper.find(AddBox).at(0).props().rowData).toStrictEqual(data);
    //expectations for renderSelectionColumn functionality
    expect(selectionPropsMock).toHaveBeenCalledTimes(0);
    expect(wrapper.find("#tableCellRenderSelectionColumn").at(0).length).toBe(0);
    expect(wrapper.find("#checkBoxRenderSelectionColumn").at(0).length).toBe(0);

    //expectations for renderActions functionality
    expect(wrapper.find(Check).length).toBe(0);
    //expectations for isTreeData is false conditiob
    expect(wrapper.find("#detailPanelOfIconButton").at(0).length).toBe(0);
    //expectations for renderDetailPanelColumn functionality
    expect(wrapper.find("#iconButton1RenderDetailPanelColumn").length).toBe(0);
    expect(wrapper.find("#tableCell2renderDetailPanelColumn").at(0).length).toBe(1);
    expect(wrapper.find("#iconButton2RenderDetailPanelColumn").at(0).length).toBe(1);
    expect(wrapper.find("#iconButton2RenderDetailPanelColumn").at(0).text()).toBe("icon");
  });
});