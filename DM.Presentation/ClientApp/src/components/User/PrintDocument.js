import React, { Component } from "react";
import ReactToPrint from "react-to-print";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withTranslation } from "react-i18next";

class PrintDocument extends Component {
  handleCloseDialog = () => {
    this.props.handleClose();
  };

  t = this.props["t"];

  render() {
    const { scannedDoc } = this.props;
    let lang = localStorage.getItem("i18nextLng");
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div
            style={
              lang === "ar" ? { textAlign: "right" } : { textAlign: "left" }
            }
          >
            <DialogTitle id="alert-dialog-title">
              {this.t("doc_print")}
            </DialogTitle>
          </div>

          <DialogContent>
            <Card ref={(el) => (this.componentRef = el)}>
              <React.Fragment>
                {scannedDoc.length !== 0 && (
                  <div>
                    {scannedDoc.map((imageURI, index) => (
                      <div
                        style={{ pageBreakBefore: "always", margin: 25 }}
                        key={index}
                      >
                        <CardMedia
                          component="img"
                          image={imageURI}
                          id="scanned-doc-img-card"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </React.Fragment>
            </Card>
          </DialogContent>
          <DialogActions>
            <ReactToPrint
              trigger={() => (
                <Button color="primary" variant="contained">
                  {this.t("print")}
                </Button>
              )}
              content={() => this.componentRef}
            />
            <Button
              onClick={this.handleCloseDialog}
              color="primary"
              id="handelCloseDialogButton"
            >
              {this.t("cancel")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withTranslation()(PrintDocument);
