/**
 * @file Contains BrowseAggregatedDocsPopUp component implementaion
 * @author Youssef Shaaban <y.shaaban@lit-co.net>
 * @version 1.0
 */

import React, { Component } from "react";
import DocumentTable from "./DocumentTable";
import SearchDocuments from "./SearchDocuments";
import CREATE_DOC_STYLES from "./Styles";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";

import { withTranslation } from "react-i18next";

const styles = CREATE_DOC_STYLES;

class BrowseAggregatedDocsPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      obj: {
        id: -1,
        name: "...",
        latest_version: -1,
      },
      data: [],
      columns: [],
    };
    this.updateParentState = this.props.action;
  }
  t = this.props["t"];

  getDocumentList = (list, columns) => {
    this.setState({
      data: list,
      columns: columns,
    });
  };

  toggleShow = (show) => {
    this.updateParentState("show", show);
  };

  handleSelect = (value) => {
    if (value !== null) {
      this.updateParentState("addDoc", {
        modelId: this.props.modelId,
        selectedDoc: value,
      });

      this.toggleShow(false);
    }
  };

  /**
   * @todo Could we reduce rendering this component, once it renders two times
   * each time we update state
   */
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          position="centerCenter"
          open={this.props.show}
          onClose={() => this.toggleShow(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {this.t("addaggregateddoc")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.t("dialog_selectaggregateddocument")} <strong>Hint:</strong>{" "}
              {this.t("dialog_previewchooseddocument")}
            </DialogContentText>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableBody>
                  <TableRow key="search-form">
                    <TableCell>
                      <SearchDocuments
                        getDocumentList={this.getDocumentList}
                        action="update-document"
                        modelId={this.props.modelId}
                      />
                      <DocumentTable
                        data={this.state.data}
                        columns={this.state.columns}
                        action="update-document"
                        handleSelect={this.handleSelect}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button
              id="CancelButton"
              onClick={() => this.toggleShow(false)}
              color="primary"
            >
              {this.t("button_cancel")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(withTranslation()(BrowseAggregatedDocsPopUp));
