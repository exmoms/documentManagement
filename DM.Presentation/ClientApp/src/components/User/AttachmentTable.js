/**
 * @file Contains AttachmentTable component implementaion
 * @author Ali Daghman <ali.daghman@lit-co.net>
 * @version 1.0
 */

import React, { Component, forwardRef } from "react";
import MaterialTable from "material-table";
import { Notification } from "../Admin/Notifications";
import { postDataToAPI, postAttachmentData } from "../../api/PostData";

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
import GetAppIcon from "@material-ui/icons/GetApp";
import UpdateIcon from "@material-ui/icons/Update";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { withTranslation } from "react-i18next";

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

class AttachmentTable extends Component {
  inputRefs = new Set();
  constructor(props) {
    super(props);
    this.state = {
      openNotifiction: false,
      error: false,
      errorMessage: [],
    };
    this.updateParentAttachments = this.props.updateAttachments;
  }

  t = this.props["t"];

  deleteRow = (rowData) => {
    new Promise((resolve, reject) => {
      setTimeout(() => {
        {
          let attachments = this.props.attachments;
          const index = attachments.indexOf(rowData);
          attachments.splice(index, 1);
          this.setState(
            {
              openNotifiction: true,
            },
            this.updateParentAttachments(attachments)
          );
        }
        resolve();
      }, 1000);
    });
  };

  deleteAttachment = async (rowData) => {
    let response = await postDataToAPI(
      `/api/Document/DeleteAttachments?id=${rowData.id}`,
      null
    );

    if (response.ok) {
      this.deleteRow(rowData);
    } else {
      let json = await response.json();
      this.setState({
        openNotifiction: true,
        error: true,
        errorMessage: json.error,
      });
    }
  };

  updateAttachmentcOnClickHandler = (attachment) => {
    var temp = [...this.inputRefs];
    var index = temp.findIndex((item) => {
      if (item === null) {
        return false;
      } else {
        return parseInt(item.id) === attachment.id;
      }
    });
    if (index !== -1) {
      var fileUploader = temp[index];
      fileUploader.click();
    }
  };

  onChangeFile =  async(event) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    let id_ = parseInt(event.target.id);

    if (file !== undefined && file !== null) {
      var index_ = -1;
      index_ = this.props.attachments.findIndex((item) => {
        return item.id === id_;
      });

      if (index_ === -1) {
        if (process.env.NODE_ENV === "development") {
          console.log("[ERROR] Can't find the event.target.id:", id_);
        }
      } else {
        let url = `/api/Document/UpdateAttachment`;
        let payload = { id: id_ };

        let response =  await postAttachmentData(payload, file, url);

        if (response.ok) {
          let temp = this.props.attachments;
          temp[index_].name = file.name;
          temp[index_].contentType = file.type;
          this.setState(
            {
              openNotifiction: true,
            },
            this.updateParentAttachments(temp)
          );
        } else {
          let json = response.json();
          this.setState({
            openNotifiction: true,
            error: true,
            errorMessage: json.error,
          });
        }
      }
    }
  };

  generateDownloadLinks(attachments) {
    let links = attachments.map((attachment, index) => {
      return (
        <a
        id={"link" + index}
          key={index}
          style={{ display: "none" }}
          href={attachment.attachmentFile}
          download={attachment.name}
        >
          <button
            id={`download-attachment-button${attachment.id}`}
            type="submit"
          >
            {this.t("download")}
          </button>
        </a>
      );
    });
    return links;
  }

  generateInputFiles(attachments) {
    let links = attachments.map((attachment, index) => {
      return (
        <input
          type="file"
          className={"onChangeFile" + attachment.id}
          id={attachment.id}
          key={attachment.id}
          ref={(ref) => {
            this.inputRefs.add(ref);
          }}
          style={{ display: "none" }}
          onChange={this.onChangeFile}
        />
      );
    });
    return links;
  }

  setOpenNotification = (value) => {
    this.setState({
      openNotifiction: value,
      error: false,
      errorMessage: [],
    });
  };

  render() {
    return (
      <div>
        {this.generateDownloadLinks(this.props.attachments)}
        {this.generateInputFiles(this.props.attachments)}
        <Notification
        id="notifications"
          open={this.state.openNotifiction} // must be a "state" to show notification message [true or false]
          setOpen={this.setOpenNotification} // this function changes the state "open" value.
          error={this.state.error} // if error message put [true] else for success put [false]
          errorMessage={this.state.errorMessage} // the recived error message (array of string) from server.
        />
        <MaterialTable
          title={this.t("attachment_table")}
          icons={tableIcons}
          columns={[
            { title: this.t("attachment_id"), field: "id", hidden: true },
            { title: this.t("caption"), field: "caption" },
            { title: this.t("attachment_name"), field: "name" },
            { title: this.t("content_type"), field: "contentType" },
            {
              title: this.t("attachment_file"),
              field: "attachmentFile",
              hidden: true,
            },
            { title: this.t("added_date"), field: "addedDate" },
          ]}
          data={this.props.attachments}
          actions={[
            {
              icon: DeleteIcon,
              tooltip: this.t("delete"),
              onClick: (event, rowData) => {
                this.deleteAttachment(rowData);
              },
            },
            {
              icon: GetAppIcon,
              tooltip: this.t("delete"),
              onClick: (event, rowData) => {
                document
                  .getElementById(`download-attachment-button${rowData.id}`)
                  .click();
              },
            },
            {
              icon: UpdateIcon,
              tooltip: this.t("update"),
              onClick: (event, rowData) => {
                this.updateAttachmentcOnClickHandler(rowData);
              },
            },
          ]}
          options={{
            actionsColumnIndex: -1,
            exportButton: true,
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
      </div>
    );
  }
}

export default withTranslation()(AttachmentTable);
