import React, { Component } from "react";
import DocumentToPDF from "./DocumentToPDF";
import { BlobProvider } from "@react-pdf/renderer";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withTranslation } from "react-i18next";
class DownloadDocument extends Component {
  handleCloseDialog = () => {
    this.props.handleClose();
  };

  t = this.props["t"];

  render() {
    const { scannedDoc } = this.props;
    const imgs = scannedDoc[0].imgs;
    const fileName = `${this.props.documentName}.pdf`;
    let lang = localStorage.getItem("i18nextLng");
    return (
      <div>
        <BlobProvider document={<DocumentToPDF scans={imgs} />}>
          {({ blob, url, loading, error }) => {
            return (
              <a
                style={{ display: "none" }}
                href={url}
                download={fileName}
                id="blogProviderLink"
              >
                <button id="download-file-button" type="submit">
                  {this.t("download")}
                </button>
              </a>
            );
          }}
        </BlobProvider>

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
              {this.t("doc_download")}
            </DialogTitle>
          </div>

          <DialogContent>
            <Card ref={(el) => (this.componentRef = el)}>
              <React.Fragment>
                {scannedDoc.length !== 0 && (
                  <div>
                    {imgs.map((imageURI, index) => (
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
            <Button
              onClick={() =>
                document.getElementById("download-file-button").click()
              }
              variant="contained"
              color="primary"
              id="clickReferenceEvent"
            >
              {this.t("download")}
            </Button>
            <Button onClick={this.handleCloseDialog} color="primary">
              {this.t("cancel")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withTranslation()(DownloadDocument);
