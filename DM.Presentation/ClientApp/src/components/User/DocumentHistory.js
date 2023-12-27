import React, { Component } from "react";
import DocumentTable from "./DocumentTable";
import { fetchData } from "../../api/FetchData";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withTranslation } from "react-i18next";

class DocumentHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      documentId: -1,
      data: [],
      latestVersionId: -1,
    };
  }

  componentDidMount() {
    this.showDocumentHistory(this.props.documentId);
  }

  componentDidUpdate() {
    if (
      this.props.documentId !== this.state.documentId &&
      this.props.documentId > 0
    )
      this.showDocumentHistory(this.props.documentId);
  }

  getDocumentList = (data, id) => {
    this.setState({ data: data, latestVersionId: id });
  };

  handleCloseDialog() {
    this.props.handleClose(this.state.latestVersionId);
  }

  showDocumentHistory = (docId) => {
    fetchData(`/api/Document/GetDocumentHistory?docId=${docId}`)
      .then((list) => {
        let data = list.map((value, index) => {
          return {
            latestVersion: value.versionId,
            versionMessage: value.versionMessage,
            documentId: value.documentId,
            documentName: value.documentName,
            addedDate: value.addedDate,
          };
        });
        this.setState({
          documentId: docId,
          data: data,
        });
      })
      .catch((e) => console.log(e));
  };

  t = this.props["t"];

  render() {
    let lang = localStorage.getItem("i18nextLng");
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={() => {
            this.handleCloseDialog();
          }}
          aria-labelledby="history-dialog-title"
          aria-describedby="history-dialog-description"
          maxWidth={false}
        >
          <div
            style={
              lang === "ar" ? { textAlign: "right" } : { textAlign: "left" }
            }
          >
            <DialogTitle id="alert-dialog-title">
              {" "}
              {this.t("document_history")}
            </DialogTitle>
          </div>
          <DialogContent>
            <DocumentTable
              data={this.state.data}
              columns={[
                {
                  title: this.t("documenttable_docname"),
                  field: "documentName",
                },
                {
                  title: this.t("documenttable_docid"),
                  field: "documentId",
                  hidden: true,
                },
                { title: this.t("version_message"), field: "versionMessage" },
                { title: this.t("added_date"), field: "addedDate" },
                {
                  title: this.t("version_id"),
                  field: "latestVersion",
                },
              ]}
              action="show-history"
              updateTableData={this.getDocumentList}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.handleCloseDialog();
              }}
              color="primary"
            >
              {this.t("cancel")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withTranslation()(DocumentHistory);
