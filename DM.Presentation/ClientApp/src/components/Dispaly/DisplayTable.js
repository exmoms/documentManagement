import LinearProgress from "@material-ui/core/LinearProgress";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { withStyles } from "@material-ui/styles";
//import VisibilityIcon from "@material-ui/icons/Visibility";
import MaterialTable from "material-table";
import React, { forwardRef } from "react";
import { withTranslation } from "react-i18next";
//import Autocomplete from "@material-ui/lab/Autocomplete";
//import TextField from "@material-ui/core/TextField";
import { deleteFromApi } from "../../api/FetchData";
import ConfirmOperationDialog from "../User/ConfirmOperationDialog";
import { Notification } from "../Admin/Notifications";

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

const style = (theme) => ({
  select: {
    margin: "26px",
    marginLeft: "0px",
  },
});

class DisplayTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      id: 1,
      showConfirmOperationDialog: false,
      confirmDialogContent: {},
      classIdToDelete: -1,
      openNotifiction: false,
      error: false,
      errorMessage: [],
    };
  }

  t = this.props["t"];
  handleClose = () => {
    this.setState({ open: false });
  };

  showConfirmOperationDialog = (rowData) => {
    this.setState({
      showConfirmOperationDialog: true,
      classIdToDelete: rowData.id,
      confirmDialogContent: {
        type: "delete",
        title: this.t("dialog_deleteConfirmation"),
        contentText: this.t("dialog_documentClass_confirmDeleteDocumentClass"),
        buttonText: this.t("delete"),
      },
    });
  };

  handleCloseConfirmOperationDialog = async (ok, option) => {
    if (ok) {
      await this.deleteDocumentClass(this.state.classIdToDelete);
    } else {
      this.setState({
        showConfirmOperationDialog: false,
        entryIdToDelete: -1,
        confirmDialogContent: {},
      });
    }
  };

  deleteDocumentClass = async (id) => {
    let response = await deleteFromApi(this.props.DeleteUrl + id);
    if (response.ok) {
      this.setState(
        {
          showConfirmOperationDialog: false,
          entryIdToDelete: -1,
          confirmDialogContent: {},
          openNotifiction: true,
        },
        () => {
          this.props.onSubmit("Deleted successfully");
        }
      );
    } else {
      let json = await response.json();
      this.setState({
        showConfirmOperationDialog: false,
        entryIdToDelete: -1,
        confirmDialogContent: {},
        openNotifiction: true,
        error: true,
        errorMessage: json.error,
      });
    }
  };

  setOpenNotification = (value) => {
    this.setState({ openNotifiction: value });
  };

  render() {
    // const { classes } = this.props;
    return (
      <div style={{ maxWidth: "100%" }}>
        {this.props.loading && <LinearProgress color="secondary" />}
        <Notification
          open={this.state.openNotifiction} // must be a "state" to show notification message [true or false]
          setOpen={this.setOpenNotification} // this function changes the state "open" value.
          error={this.state.error} // if error message put [true] else for success put [false]
          errorMessage={this.state.errorMessage} // the recived error message (array of string) from server.
        />
        <MaterialTable
          title={this.props.TableTitle}
          icons={tableIcons}
          columns={this.props.Columns}
          data={this.props.Data}
          actions={[
            {
              icon: DeleteIcon,
              tooltip: "Delete",
              onClick: (event, rowData) => {
                console.log("action");
                this.showConfirmOperationDialog(rowData);
              },
            },
          ]}
          options={{
            actionsColumnIndex: -1,
            exportButton: true,
            exportAllData: true,
            exportFileName: this.props.TableTitle,
          }}
          localization={{
            pagination: {
              labelRowsSelect: this.t("rows"),
              firstAriaLabel: this.t("first_page"),
              firstTooltip: this.t("first_page"),
              previousAriaLabel: this.t("previous_page"),
              previousTooltip: this.t("previous_page"),
              nextAriaLabel: this.t("next_page"),
              nextTooltip: this.t("next_page"),
              lastAriaLabel: this.t("last_page"),
              lastTooltip: this.t("last_page"),
            },
            toolbar: {
              nRowsSelected: "{0}" + this.t("selected_row"),
              searchTooltip: this.t("search"),
              searchPlaceholder: this.t("search"),
              exportTitle: this.t("export_as_csv"),
            },
            header: {
              actions: this.t("actions"),
            },
            body: {
              emptyDataSourceMessage: this.t("no_records"),
            },
          }}
        />
        {this.state.showConfirmOperationDialog && (
          <ConfirmOperationDialog
            open={this.state.showConfirmOperationDialog}
            content={this.state.confirmDialogContent}
            handleClose={this.handleCloseConfirmOperationDialog}
          />
        )}
      </div>
    );
  }
}

export default withStyles(style)(withTranslation()(DisplayTable));
