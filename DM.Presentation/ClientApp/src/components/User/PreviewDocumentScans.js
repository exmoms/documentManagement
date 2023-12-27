import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import CREATE_DOC_STYLES from "./Styles";
import { withTranslation } from "react-i18next";
const style_ = CREATE_DOC_STYLES;

class PreviewDocumentScans extends Component {
  constructor(props) {
    super(props);
    this.scannedDocInput = React.createRef();
  }
  t = this.props["t"];
  render() {
    const { classes, scannedDoc } = this.props;

    return (
      <div style={{ padding: "20px 5px" }}>
        <input
          type="file"
          id="upload-scanned-doc-input"
          required
          accept="image/*"
          ref={(ref) => (this.scannedDocInput = ref)}
          style={{ display: "none" }}
          multiple
        />
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2" align="left">
              {this.t("previewdoc_scanneddoc")}
            </Typography>
          </CardContent>
          <React.Fragment>
            {/* @todo don't display this element until the image is selected */}
            {/*       the scanned doc may contain multi-page, so we have multi-img */}
            {/* multi-page may need a button to add new part in case user didn't use multiple selection */}
            {scannedDoc.length !== 0 && (
              <div className={classes.buttonUploadScannedDoc}>
                {scannedDoc.map((imageURI, index) => (
                  <div className={classes.docMediaContainer} key={index}>
                    <CardMedia
                      component="img"
                      image={imageURI}
                      className={classes.media}
                      id="scanned-doc-img-card"
                      title={this.t("previewdoc_scanneddoc")}
                    />
                  </div>
                ))}
              </div>
            )}
          </React.Fragment>
        </Card>
      </div>
    );
  }
}

export default withStyles(style_)(withTranslation()(PreviewDocumentScans));
