import React, { Component } from "react";
import { forwardRef } from "react";
import { postDataToAPI } from "../../api/PostData";
import { Notification } from "../Admin/Notifications";
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
import VisibilityIcon from "@material-ui/icons/Visibility";
import UpdateIcon from "@material-ui/icons/Update";
import ArchiveIcon from "@material-ui/icons/Archive";
import CheckIcon from "@material-ui/icons/Check";
import EmailIcon from "@material-ui/icons/Email";
import PrintIcon from "@material-ui/icons/Print";
import HistoryIcon from "@material-ui/icons/History";
import GetAppIcon from "@material-ui/icons/GetApp";
import AttachmentIcon from "@material-ui/icons/Attachment";
import TableBodyRow from "../Shared/materialTableRow";
import TableBodyToolbar from "../Shared/materialTableToolbar";

import EmailPopUP from "./EmailPopUp";
import PrintDocument from "./PrintDocument";
import DocumentHistory from "./DocumentHistory";
import MaterialTable from "material-table";
import UpdateOrPreviewDocumentDialog from "./UpdateOrPreviewDocumentDialog";
import DownloadDocument from "./DownloadDocument";
import DocumentAttachments from "./DocumentAttachments";
import ConfirmOperationDialog from "./ConfirmOperationDialog";
import { withTranslation } from "react-i18next";
import { Redirect } from "react-router";

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

class DocumentTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEmailPopUP: false,
      open: false,
      option: 1,
      documentId: -1,
      documentVersionId: -1,
      columns: this.props.columns,
      dataToSend: [],
      scans: [],
      documentName: null,
      printPopUp: false,
      showHistoryPopUp: false,
      showDownloadPopUp: false,
      showAttachmentsPopUp: false,
      showConfirmOperationDialog: false,
      confirmDialogContent: {},
      documentToBeDeleted: {},
      redirectToDocumentSet: false,
      openNotifiction: false,
      error: false,
      errorMessage: [],
    };
  }

  // translation object
  t = this.props["t"];

  // define the Table Action
  ViewDocumentAction = {
    icon: VisibilityIcon,
    tooltip: this.t("view_document"),
    position: "row",
    onClick: (event, rowData) => {
      this.setState({
        open: true,
        option: 0,
        documentVersionId: rowData.latestVersion,
      });
    },
  };

  UpdateDocumentAction = {
    icon: UpdateIcon,
    tooltip: this.t("update_document"),
    position: "row",
    onClick: (event, rowData) => {
      this.setState({
        open: true,
        option: 1,
        documentVersionId: rowData.latestVersion,
      });
    },
  };

  DeleteDocumentAction = {
    icon: DeleteIcon,
    tooltip: this.t("documenttable_deletedoc"),
    position: "row",
    onClick: (event, rowData) => {
      this.showConfirmOperationDialog(rowData, "delete");
    },
  };

  ArchiveDocumentAction = {
    icon: ArchiveIcon,
    tooltip: this.t("documenttable_archivedoc"),
    position: "row",
    onClick: (event, rowData) => {
      this.showConfirmOperationDialog(rowData, "archive");
    },
  };

  EmailDocumentsAction = {
    icon: EmailIcon,
    tooltip: this.t("email_document"),
    position: "toolbarOnSelect",
    onClick: (event, rowData) => {
      this.emailDocs(rowData);
    },
  };

  EmailDocumentAction = {
    icon: EmailIcon,
    tooltip: this.t("email_document"),
    position: "row",
    onClick: (event, rowData) => {
      this.emailDocs(rowData);
    },
  };

  PrintDocumentsAction = {
    icon: PrintIcon,
    tooltip: this.t("print_document"),
    position: "toolbarOnSelect",
    onClick: (event, rowData) => {
      this.printDocument(rowData);
    },
  };

  PrintDocumentAction = {
    icon: PrintIcon,
    tooltip: this.t("print_document"),
    position: "row",
    onClick: (event, rowData) => {
      this.printDocument(rowData);
    },
  };

  ViewDocumentHistoryAction = {
    icon: HistoryIcon,
    tooltip: this.t("view_doc_history"),
    position: "row",
    onClick: (event, rowData) => {
      this.showDocumentHistory(rowData.documentId);
    },
  };

  DownloadDocumentAction = {
    icon: GetAppIcon,
    tooltip: this.t("download_document_as_PDF"),
    position: "row",
    onClick: (event, rowData) => {
      this.downloadDocument(rowData);
    },
  };

  SelectDocumentAction = {
    icon: CheckIcon,
    tooltip: this.t("select_document"),
    position: "row",
    onClick: (event, rowData) => {
      this.props.handleSelect({
        id: rowData.documentId,
        name: rowData.documentName,
        latest_version: rowData.latestVersion,
      });
    },
  };

  AddDocumentsToSetAction = {
    icon: AddBox,
    tooltip: this.t("add_document_to_set"),
    position: "toolbarOnSelect",
    onClick: (event, rowData) => {
      this.addDocumentToSet(rowData);
    },
  };

  AddDocumentToSetAction = {
    icon: AddBox,
    tooltip: this.t("add_document_to_set"),
    position: "row",
    onClick: (event, rowData) => {
      this.addDocumentToSet(rowData);
    },
  };

  ViewAttachmentsAction = {
    icon: AttachmentIcon,
    tooltip: this.t("view_attachments"),
    position: "row",
    onClick: (event, rowData) => {
      this.setState({
        documentId: rowData.documentId,
        showAttachmentsPopUp: true,
      });
    },
  };

  componentDidUpdate() {
    if (this.state.redirectToDocumentSet) {
      this.setState(
        {
          redirectToDocumentSet: false,
        },
        this.props.handleClose()
      );
    }
  }

  composeTableActions = (action) => {
    let actions = [];

    switch (action) {
      case "browse-document":
        actions = [
          this.ViewDocumentAction,
          this.UpdateDocumentAction,
          this.DeleteDocumentAction,
          this.ArchiveDocumentAction,
          this.EmailDocumentsAction,
          this.EmailDocumentAction,
          this.PrintDocumentsAction,
          this.PrintDocumentAction,
          this.ViewDocumentHistoryAction,
          this.DownloadDocumentAction,
          this.ViewAttachmentsAction,
        ];
        break;
      case "show-history":
        actions = [
          this.ViewDocumentAction,
          this.UpdateDocumentAction,
          this.EmailDocumentsAction,
          this.EmailDocumentAction,
          this.PrintDocumentsAction,
          this.PrintDocumentAction,
        ];
        break;
      case "update-document":
        actions = [this.ViewDocumentAction, this.SelectDocumentAction];
        break;
      case "add-to-documentset":
        actions = [
          this.ViewDocumentAction,
          this.AddDocumentToSetAction,
          this.AddDocumentsToSetAction,
        ];
        break;
      default:
        actions = [];
    }
    return actions;
  };

  updateTableDataByNewSerch = () => {
    let SearchButton = document.getElementById("search-document-button");
    if (SearchButton !== null) {
      document.getElementById("search-document-button").click();
    } else {
      this.setState({
        openNotifiction: true,
        error: true,
        errorMessage: [
          "[Error] : Can not Refresh Search Result .. Please Press Search Button",
        ],
      });
    }
  };

  updateData = (id, message) => {
    let { documentVersionId } = this.state;
    let { data } = this.props;
    let index = -1;
    // find the index of the updated doucment version in the table data.
    index = data.findIndex((item) => {
      return item.latestVersion === documentVersionId;
    });
    if (index !== -1) {
      // if the action is update document from histiory table then we add a new row to the table date
      let row = {
        latestVersion: id,
        versionMessage: message,
        documentId: data[index].documentId,
        documentName: data[index].documentName,
        addedDate: data[index].addedDate,
        tableData: { id: index },
      };

      data.push(row);
    }
    return data;
  };

  CloseUpdateDialog = (id, message, neededUpdateId) => {
    // current document version did not updated, and no child document has to be updated
    if (id === -1 && neededUpdateId === -1) {
      this.setState({
        open: false,
        documentVersionId: -1,
      });
    }
    // current document version updated successfully, and no child document need to be updated
    else if (id !== -1 && neededUpdateId === -1) {
      if (this.props.action === "show-history") {
        let data = this.updateData(id, message);
        this.props.updateTableData(data, id);
      } else {
        this.updateTableDataByNewSerch();
      }

      this.setState({
        open: false,
        documentVersionId: -1,
        openNotifiction: true,
      });
    }
    // current document version did not updated, but child document need to be updated
    else if (id === -1 && neededUpdateId !== -1) {
      this.setState({
        open: true,
        option: 1,
        documentVersionId: neededUpdateId,
      });
    }
    // current document version updated successfully, and child document need to be updated
    else {
      if (this.props.action === "show-history") {
        let data = this.updateData(id, message);
        this.props.updateTableData(data, id);
      } else {
        this.updateTableDataByNewSerch();
      }

      this.setState({
        open: true,
        option: 1,
        documentVersionId: neededUpdateId,
      });
    }
  };

  handleCloseAttachmentsDialog = () => {
    this.setState({
      showAttachmentsPopUp: false,
      documentId: -1,
    });
  };

  showConfirmOperationDialog = (rowData, option) => {
    option === "delete"
      ? this.setState({
          showConfirmOperationDialog: true,
          documentToBeDeleted: rowData,
          confirmDialogContent: {
            title: this.t("dialog_deleteConfirmation"),
            contentText: this.t("dialog_doucmentTable_confirmDeleteDocument"),
            buttonText: this.t("delete"),
          },
        })
      : this.setState({
          showConfirmOperationDialog: true,
          documentToBeDeleted: rowData,
          confirmDialogContent: {
            type: option,
            title: this.t("dialog_archiveConfirmation"),
            contentText: this.t("dialog_doucmentTable_confirmArchiveDocument"),
            buttonText: this.t("archive_document"),
          },
        });
  };

  handleCloseConfirmOperationDialog = async (ok, option) => {
    if (ok) {
      option === "delete"
        ? await this.deleteDocument(this.state.documentToBeDeleted)
        : await this.archiveDocument(this.state.documentToBeDeleted);
    } else {
      this.setState({
        showConfirmOperationDialog: false,
        documentToBeDeleted: {},
      });
    }
  };

  deleteDocument = async (rowData) => {
    console.log("deleteDocument rowData", rowData);
    let response = await postDataToAPI(
      `/api/Document/DeleteDocument?docId=${rowData.documentId}`,
      null
    );

    if (response.ok) {
      this.setState(
        {
          showConfirmOperationDialog: false,
          documentToBeDeleted: {},
          openNotifiction: true,
        },
        () => {
          this.updateTableDataByNewSerch();
        }
      );
    } else {
      let json = await response.json();
      this.setState({
        openNotifiction: true,
        error: true,
        errorMessage: json.error,
        showConfirmOperationDialog: false,
        documentToBeDeleted: {},
      });
    }
  };

  archiveDocument = async (rowData) => {
    let response = await postDataToAPI(
      `/api/Document/ArchiveDocument?docId=${rowData.documentId}`,
      null
    );

    if (response.ok) {
      this.setState(
        {
          showConfirmOperationDialog: false,
          documentToBeDeleted: {},
          openNotifiction: true,
        },
        () => {
          this.updateTableDataByNewSerch();
        }
      );
    } else {
      let json = await response.json();
      this.setState({
        openNotifiction: true,
        error: true,
        errorMessage: json.error,
      });
    }
  };

  toggleShow = (show) => {
    this.setState({ showEmailPopUP: show });
  };

  emailDocs = (rowData) => {
    this.setState({
      dataToSend: Array.isArray(rowData) ? rowData : [rowData],
      showEmailPopUP: true,
    });
  };

  handleClosePrintDialog = () => {
    this.setState({ scans: [], printPopUp: false });
  };

  handleCloseDownloadDialog = () => {
    this.setState({
      scans: [],
      documentName: null,
      showDownloadPopUp: false,
    });
  };

  handleCloseHistoryDialog = (id) => {
    if (id === -1) {
      this.setState({
        documentId: -1,
        showHistoryPopUp: false,
      });
    } else {
      this.updateTableDataByNewSerch();
      this.setState({
        documentId: -1,
        showHistoryPopUp: false,
      });
    }
  };

  fetchDocumentsScans = async (rowData) => {
    let payload = [];
    if (Array.isArray(rowData)) {
      rowData.forEach((value, index) => {
        payload.push(rowData[index].latestVersion);
      });
    } else {
      payload.push(rowData.latestVersion);
    }

    // Send list of LatestVersions to api and receive list of scans
    let response = await postDataToAPI(
      "api/Document/GetDocumentScansByVersionIds",
      payload
    );

    return response;
  };

  printDocument = async (rowData) => {
    let response = await this.fetchDocumentsScans(rowData);
    if (response.ok) {
      let json = await response.json();
      let list = [];
      json.forEach((scan, index) => {
        scan.imgs.forEach((url, idx) => {
          list.push(url);
        });
      });
      this.setState({
        scans: list,
        printPopUp: true,
      });
    } else {
      let json = await response.json();
      this.setState({
        openNotifiction: true,
        error: true,
        errorMessage: json.error,
      });
    }
  };

  downloadDocument = async (rowData) => {
    let response = await this.fetchDocumentsScans(rowData);

    if (response.ok) {
      let json = await response.json();
      this.setState({
        scans: json,
        documentName: rowData.documentName,
        showDownloadPopUp: true,
      });
    } else {
      let json = await response.json();
      this.setState({
        openNotifiction: true,
        error: true,
        errorMessage: json.error,
      });
    }
  };

  showDocumentHistory = (docId) => {
    this.setState({
      documentId: docId,
      showHistoryPopUp: true,
    });
  };

  addDocumentToSet = async (rowData) => {
    let documentsList = [];
    if (Array.isArray(rowData)) {
      rowData.forEach((doc, index) => documentsList.push(doc.documentId));
    } else {
      documentsList.push(rowData.documentId);
    }
    let response = await postDataToAPI(
      `/api/DocumentSet/AddDocumentToDocumentSet?document_set_Id=${this.props.set.id}`,
      documentsList
    );

    if (response.ok) {
      this.setState(
        {
          redirectToDocumentSet: true,
          openNotifiction: true,
        } //,
        //this.props.handleClose()
      );
    } else {
      let json = await response.json();
      this.setState(
        {
          redirectToDocumentSet: true,
          openNotifiction: true,
          error: true,
          errorMessage: json.error,
        } //,
        //this.props.handleClose()
      );
    }
  };

  setOpenNotification = (value) => {
    this.setState({ openNotifiction: value });
  };

  render() {
    return (
      <div style={{ maxWidth: "100%" }}>
        <Notification
          id="notification"
          open={this.state.openNotifiction} // must be a "state" to show notification message [true or false]
          setOpen={this.setOpenNotification} // this function changes the state "open" value.
          error={this.state.error} // if error message put [true] else for success put [false]
          errorMessage={this.state.errorMessage} // the recived error message (array of string) from server.
        />
        <MaterialTable
          title={this.t("browsedocuments")}
          icons={tableIcons}
          columns={this.props.columns}
          components={{
            Row: TableBodyRow,
            Toolbar: TableBodyToolbar,
          }}
          data={this.props.data}
          actions={this.composeTableActions(this.props.action)}
          options={{
            actionsColumnIndex: -1,
            exportButton: true,
            selection: true,
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

        {this.state.showEmailPopUP && (
          <EmailPopUP
            dataToSend={this.state.dataToSend}
            show={this.state.showEmailPopUP}
            toggleShow={this.toggleShow}
          />
        )}
        {this.state.open && (
          <UpdateOrPreviewDocumentDialog
            open={this.state.open}
            option={this.state.option}
            documentVersionId={this.state.documentVersionId}
            handler={this.CloseUpdateDialog}
          />
        )}
        {this.state.printPopUp && (
          <PrintDocument
            open={this.state.printPopUp}
            scannedDoc={this.state.scans}
            handleClose={this.handleClosePrintDialog}
          />
        )}
        {this.state.showHistoryPopUp && (
          <DocumentHistory
            open={this.state.showHistoryPopUp}
            documentId={this.state.documentId}
            handleClose={this.handleCloseHistoryDialog}
          />
        )}
        {this.state.showDownloadPopUp && (
          <DownloadDocument
            open={this.state.showDownloadPopUp}
            scannedDoc={this.state.scans}
            documentName={this.state.documentName}
            handleClose={this.handleCloseDownloadDialog}
          />
        )}
        {this.state.showAttachmentsPopUp && (
          <DocumentAttachments
            documentId={this.state.documentId}
            show={this.state.showAttachmentsPopUp}
            handleClose={this.handleCloseAttachmentsDialog}
          />
        )}
        {this.state.showConfirmOperationDialog && (
          <ConfirmOperationDialog
            open={this.state.showConfirmOperationDialog}
            content={this.state.confirmDialogContent}
            handleClose={this.handleCloseConfirmOperationDialog}
          />
        )}
        {this.state.redirectToDocumentSet && (
          <Redirect
            to={{
              pathname: "/document-set",
              state: {
                id: this.props.set.id,
                name: this.props.set.name,
                openNotifiction: this.state.openNotifiction,
                error: this.state.error,
                errorMessage: this.state.errorMessage,
              },
            }}
          />
        )}
      </div>
    );
  }
}

export default withTranslation()(DocumentTable);
