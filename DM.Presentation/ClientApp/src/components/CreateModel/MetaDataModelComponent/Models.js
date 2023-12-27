import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
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
import VisibilityIcon from "@material-ui/icons/Visibility";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { withStyles } from "@material-ui/styles";
import MaterialTable from "material-table";
import React, { forwardRef } from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { deleteFromApi, fetchData } from "../../../api/FetchData";
import ViewModel from "./ViewModel";
import ConfirmOperationDialog from "../../User/ConfirmOperationDialog";
import { Notification } from "../../Admin/Notifications";

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
  button: {
    marginRight: "15px",
  },
});

class ModelsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      id: -1,
      MetaDataModels: [],
      DocumentClasses: [],
      loading: true,
      classId: -1,
      showConfirmOperationDialog: false,
      confirmDialogContent: {},
      modelIdToDelete: -1,
      openNotifiction: false,
      error: false,
      errorMessage: [],
    };
  }
  t = this.props["t"];
  componentDidMount() {
    // Get all models
    fetchData("/api/MetaDataModel/GetMetaDataModelsIdName")
      .then((value) => {
        this.setState({ MetaDataModels: value });
        this.setState({ loading: false });
      })
      .catch((e) => console.log(e));

    var first_element = [{ id: -1, documentClassName: this.t("all_models") }];

    fetchData("/api/DocumentClass/")
      .then((value) => {
        this.setState({ DocumentClasses: first_element.concat(value) });
      })
      .catch((e) => console.log(e));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.classId !== prevState.classId) {
      if (this.state.classId === -1) {
        // Get all models
        fetchData("/api/MetaDataModel/GetMetaDataModelsIdName")
          .then((value) => {
            this.setState({ MetaDataModels: value });
            this.setState({ loading: false });
          })
          .catch((e) => console.log(e));
      } else {
        // Get models according to class id
        fetchData(
          `/api/MetaDataModel/GetMetaDataModelsByClassId?ClassId=${this.state.classId}`
        )
          .then((value) => {
            this.setState({ MetaDataModels: value });
            this.setState({ loading: false });
          })
          .catch((e) => console.log(e));
      }
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  showConfirmOperationDialog = (rowData) => {
    this.setState({
      showConfirmOperationDialog: true,
      modelIdToDelete: rowData.id,
      confirmDialogContent: {
        type: "delete",
        title: this.t("dialog_deleteConfirmation"),
        contentText: this.t("dialog_metaDataModel_confirmDeleteMetaDataModel"),
        buttonText: this.t("delete"),
      },
    });
  };

  handleCloseConfirmOperationDialog = async (ok, option) => {
    if (ok) {
      await this.deleteMetaDataModel(this.state.modelIdToDelete);
    } else {
      this.setState({
        showConfirmOperationDialog: false,
        entryIdToDelete: -1,
        confirmDialogContent: {},
      });
    }
  };

  removeRow = (modelId) => {
    new Promise((resolve, reject) => {
      setTimeout(() => {
        {
          let data = this.state.MetaDataModels;
          const index = data.findIndex((item) => {
            return item.id === modelId;
          });
          data.splice(index, 1);
          this.setState(
            {
              MetaDataModels: data,
              showConfirmOperationDialog: false,
              entryIdToDelete: -1,
              confirmDialogContent: {},
              openNotifiction: true,
              error: false,
              errorMessage: [],
            },
            () => resolve()
          );
        }
        resolve();
      }, 1000);
    });
  };

  deleteMetaDataModel = async (id) => {
    let response = await deleteFromApi(
      `/api/MetaDataModel/DeleteMetaDataModel?meta_data_id=${id}`
    );
    if (response.ok) {
      this.removeRow();
    } else {
      let json = await response.json();
      this.setState({
        showConfirmOperationDialog: false,
        openNotifiction: true,
        error: true,
        errorMessage: json.error,
      });
    }
  };

  onChange = (event, value) => {
    if (value) {
      if (value.id !== this.state.classId) {
        this.setState({ classId: value.id, loading: true });
      }
    }
  };

  setOpenNotification = (value) => {
    this.setState({
      openNotifiction: value,
      error: false,
      errorMessage: [],
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div style={{ maxWidth: "100%" }}>
        <div className={classes.select}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={7}>
              <Autocomplete
                id="combo-box-demo"
                options={this.state.DocumentClasses}
                getOptionLabel={(option) => option.documentClassName}
                onChange={this.onChange}
                style={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={this.t("selectclass")}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <Button
                variant="contained"
                color="primary"
                // onClick={handleNext}
                className={classes.button}
                startIcon={<AddIcon />}
                component={Link}
                to="/metadata-model/create-model"
              >
                {this.t("button_createnewmodel")}
              </Button>
            </Grid>
          </Grid>
        </div>
        {this.state.loading && <LinearProgress color="secondary" />}
        <Notification
          id="notification"
          open={this.state.openNotifiction} // must be a "state" to show notification message [true or false]
          setOpen={this.setOpenNotification} // this function changes the state "open" value.
          error={this.state.error} // if error message put [true] else for success put [false]
          errorMessage={this.state.errorMessage} // the recived error message (array of string) from server.
        />
        <MaterialTable
          title={this.t("metadata_brows_models")}
          icons={tableIcons}
          columns={[
            { title: this.t("metadata_model_id"), field: "id" },
            {
              title: this.t("metadata_model_name"),
              field: "metaDataModelName",
            },
          ]}
          data={this.state.MetaDataModels}
          actions={[
            {
              icon: VisibilityIcon,
              tooltip: this.t("metadata_view_model"),
              onClick: (event, rowData) => {
                this.setState({
                  open: true,
                  id: rowData.id,
                });
              },
            },
            {
              icon: DeleteIcon,
              tooltip: this.t("metadata_delete_model"),
              onClick: (event, rowData) => {
                this.showConfirmOperationDialog(rowData);
              },
            },
          ]}
          options={{
            actionsColumnIndex: -1,
            exportButton: true,
            exportAllData: true,
            exportFileName: "All models in Database",
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

        <ViewModel
          id={this.state.id}
          handleClose={this.handleClose}
          open={this.state.open}
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

export default withStyles(style)(withTranslation()(ModelsTable));
