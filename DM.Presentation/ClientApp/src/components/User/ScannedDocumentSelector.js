import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import MuiAlert from "@material-ui/lab/Alert";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import CREATE_DOC_STYLES from "./Styles";
const style_ = CREATE_DOC_STYLES;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class ScannedDocumentSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scannedDoc: [],
      scannedDocFiles: this.props.scannedDocFiles,
    };
    this.scannedDocInput = React.createRef();
    this.updateScannedFiles = this.props.updateScannedFiles;
  }
  t = this.props["t"];

  componentDidUpdate(prevProps) {
    if (prevProps.scannedDocFiles !== this.props.scannedDocFiles) {
      let scannedDocs_ = [];
      /* Map each file to a promise that resolves to an array of image URI's */
      Promise.all(
        this.props.scannedDocFiles.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener("load", (ev) => {
              resolve(ev.target.result);
            });
            reader.addEventListener("error", reject);
            reader.readAsDataURL(file);
          });
        })
      ).then(
        (images) => {
          /* Once all promises are resolved, update state with image URI array */
          images.forEach((item) => scannedDocs_.push(item));
          this.setState({
            scannedDoc: scannedDocs_,
            scannedDocFiles: this.props.scannedDocFiles,
          });
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  uploadScannedDoc = (event) => {
    // handle selected file to upload later
    var fileUploader = this.scannedDocInput;
    fileUploader.click();
  };

  onChangeFile = (event) => {
    if (event.target.files) {
      /* Get files in array form */
      const files = Array.from(event.target.files);

      /* save as files to post in submission process*/
      var tempFiles = new Set(this.state.scannedDocFiles);
      files.forEach((item) => tempFiles.add(item));

      /* Map each file to a promise that resolves to an array of image URI's */
      Promise.all(
        files.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener("load", (ev) => {
              resolve(ev.target.result);
            });
            reader.addEventListener("error", reject);
            reader.readAsDataURL(file);
          });
        })
      ).then(
        (images) => {
          /* Once all promises are resolved, update state with image URI array */
          var temp = new Set(this.state.scannedDoc);
          images.forEach((item) => temp.add(item));
          this.setState({
            scannedDoc: Array.from(temp),
          });
          this.updateScannedFiles(Array.from(tempFiles), null);
        },
        (error) => {
          console.error(error);
        }
      );
      /* the following statement is import to allow re-select the last removed image */
      event.target.value = null;
    }
  };

  removePage = (event, index) => {
    event.stopPropagation();
    event.preventDefault();
    const { scannedDoc } = this.state;
    scannedDoc.splice(index, 1);

    this.setState({
      scannedDoc,
    });
    this.updateScannedFiles(null, index);
  };

  render() {
    const { classes } = this.props;
    const { scannedDoc } = this.state;
    return (
      <div style={{ padding: "20px 5px" }}>
        <input
          type="file"
          id="upload-scanned-doc-input"
          required
          accept="image/*"
          ref={(ref) => (this.scannedDocInput = ref)}
          style={{ display: "none" }}
          onChange={this.onChangeFile}
          multiple
        />
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2" align="left">
              {this.t("previewdoc_scanneddoc")}
            </Typography>
            {this.props.error && (
              <Alert severity="error">{this.t("upload_error")}</Alert>
            )}
          </CardContent>
          <React.Fragment>
            {/* @todo don't display this element until the image is selected */}
            {/*       the scanned doc may contain multi-page, so we have multi-img */}
            {/* multi-page may need a button to add new part in case user didn't use multiple selection */}
            {scannedDoc.length !== 0 && (
              <div className={classes.buttonUploadScannedDoc}>
                {scannedDoc.map((imageURI, index) => (
                  <div className={classes.docMediaContainer} key={index}>
                    <IconButton
                      id={"IconButton" + index}
                      onClick={(event) => {
                        this.removePage(event, index);
                      }}
                      className={classes.deleteImgBtn}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                    <CardMedia
                      component="img"
                      image={imageURI}
                      className={classes.media}
                      id="scanned-doc-img-card"
                      title={this.t("previewdoc_uploadcopy")}
                    />
                  </div>
                ))}
              </div>
            )}
          </React.Fragment>
          <CardActions className={classes.buttonUploadScannedDoc}>
            <Button
              id="uploadScannedDoc"
              onClick={this.uploadScannedDoc}
              color="primary"
              size="small"
            >
              {this.t("previewdoc_uploadacopy")}
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(style_)(withTranslation()(ScannedDocumentSelector));
