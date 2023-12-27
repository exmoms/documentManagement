/**
 * @file Contains AddDocumentToSet component implementaion
 * @author Ali Daghman <ali.daghman@lit-co.net>
 * @version 1.0
 */

import React, { Component } from "react";
import DocumentTable from "../DocumentTable";
import SearchDocuments from "../SearchDocuments";
import CREATE_DOC_STYLES from "../Styles";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";
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

const styles = CREATE_DOC_STYLES;

class AddDocumentToSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [],
    };
    this.updateParentState = this.props.action;
  }

  getDocumentList = (list, columns) => {
    this.setState({
      data: list,
      columns: columns,
    });
  };

  handleClose = () => {
    this.setState(
      {
        data: [],
        columns: [],
      },
      this.updateParentState()
    );
  };

  /**
   * @todo Could we reduce rendering this component, once it renders two times
   * each time we update state
   */

  t = this.props["t"];
  render() {
    const { classes } = this.props;
    let lang = localStorage.getItem("i18nextLng");
    return (
      <div>
        <Dialog
          position="centerCenter"
          open={this.props.show}
          onClose={() => this.handleClose()}
          aria-labelledby="form-dialog-title"
        >
          <div
            style={
              lang === "ar" ? { textAlign: "right" } : { textAlign: "left" }
            }
          >
            <DialogTitle id="form-dialog-title">
              {this.t("documentset_addDocumentsToSet_title")}
            </DialogTitle>
          </div>
          <DialogContent>
            <div
              style={
                lang === "ar" ? { textAlign: "right" } : { textAlign: "left" }
              }
            >
              <DialogContentText>
                {this.t("documentset_addDocumentsToSet_Content")}
              </DialogContentText>
            </div>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableBody>
                  <TableRow key="search-form">
                    <TableCell>
                      <SearchDocuments
                        getDocumentList={this.getDocumentList}
                        action="add-to-documentset"
                        setIdExclude={this.props.set.id}
                      />
                      <DocumentTable
                        data={this.state.data}
                        columns={this.state.columns}
                        set={this.props.set}
                        action="add-to-documentset"
                        handleClose={this.handleClose}
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
              onClick={() => this.handleClose()}
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

export default withStyles(styles)(withTranslation()(AddDocumentToSet));
