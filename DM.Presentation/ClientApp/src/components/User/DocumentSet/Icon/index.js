import React, { Component, createRef } from "react";
import Menu from "../Menu";
import UpdateOrPreviewDocumentDialog from "../../UpdateOrPreviewDocumentDialog";
import PrintDocument from "../../PrintDocument";
import ConfirmOperationDialog from "../../ConfirmOperationDialog";
import { postDataToAPI } from "../../../../api/PostData";
import { FILE, FOLDER } from "../utils/constants";
import FileIcon from "../assets/img/file.png";
import FolderIcon from "../assets/img/folder.png";
import { withTranslation } from "react-i18next";
import { Container, Logo, Img, Name } from "./styles";

class Icon extends Component {
  nodeRef = createRef();
  t = this.props["t"];

  state = {
    visible: false,
    showPreviewDocumentDialog: false,
    documentScans: [],
    showPrintDocumentDialog: false,
    showConfirmOperationDialog: false,
    confirmDialogContent: {},
    entryIdToDelete: -1,
  };

  _handleContextMenu = (event) => {
    event.preventDefault();

    const path = event.composedPath();

    const wasOutside = !path.includes(this.nodeRef.current) || false;

    if (wasOutside) {
      this.setState({
        visible: false,
      });
      return;
    }

    this.setState({
      visible: true,
    });
  };

  _handleMouseLeave = (event) => {
    const { visible } = this.state;
    const wasOutside = !(event.target.contains === this.nodeRef.current);

    if (wasOutside && visible)
      this.setState({
        visible: false,
      });
  };

  componentDidMount() {
    document.addEventListener("contextmenu", this._handleContextMenu);

    document.addEventListener("click", this._handleMouseLeave);
  }

  UNSAFE_componentWillUnmount() {
    document.removeEventListener("contextmenu", this._handleContextMenu);

    document.removeEventListener("click", this._handleMouseLeave);
  }

  _handleClick = (event) => {
    const { visible } = this.state;
    const wasOutside = !(event.target.contains === this.nodeRef);

    if (wasOutside && visible)
      this.setState({
        visible: false,
      });
  };

  _handleScroll = () => {
    const { visible } = this.state;

    if (visible)
      this.setState({
        visible: false,
      });
  };

  buildMenuContent = (type, entry) => {
    let { set } = this.props;
    let content = [];
    if (type === FILE) {
      content.push({
        info: this.t("dialog_previewdocument"),
        onClick: () => {
          this.showPreviewDocumentDialog();
        },
      });
      content.push({
        info: this.t("print"),
        onClick: () => {
          this.showPrintDocumentDialog(entry);
        },
      });

      if (set.id !== 0) {
        content.push({
          info: this.t("deleteFromHere"),
          style: { color: "red" },
          onClick: () => {
            this.showConfirmOperationDialog(entry, "delete-document");
          },
        });
      }
    } else {
      content.push({
        info: this.t("open"),
        onClick: () => {
          this.enterFolder(entry.id, entry.name);
        },
      });
      content.push({
        info: this.t("deletePermanently"),
        style: { color: "red" },
        onClick: () => {
          this.showConfirmOperationDialog(entry, "delete-set-permanent");
        },
      });
      if (set.id !== 0) {
        content.push({
          info: this.t("deleteFromHere"),
          style: { color: "red" },
          onClick: () => {
            this.showConfirmOperationDialog(entry, "delete-set-here");
          },
        });
      }
    }
    return content;
  };

  enterFolder = (id, name) => {
    this.props.enterFolder(id, name);
  };

  showConfirmOperationDialog = (entry, option) => {
    let contentText = null;
    switch (option) {
      case "delete-document":
        contentText = this.t("dialog_documentSet_confirmDeleteDocumentFromSet");
        break;
      case "delete-set-here":
        contentText = this.t(
          "dialog_documentSet_confirmDeleteDocumentSetFromDocumentSet"
        );
        break;
      case "delete-set-permanent":
        contentText = this.t(
          "dialog_documentSet_confirmDeleteDocumentSetPermanently"
        );
        break;
      default:
        contentText = "Are you sure to Delete";
    }

    this.setState({
      showConfirmOperationDialog: true,
      entryIdToDelete: entry.id,
      confirmDialogContent: {
        type: option,
        title: this.t("dialog_deleteConfirmation"),
        contentText: contentText,
        buttonText: this.t("delete"),
      },
    });
  };

  handleCloseConfirmOperationDialog = async (ok, option) => {
    if (ok) {
      switch (option) {
        case "delete-document":
          await this.deleteDocumentFormSet(this.state.entryIdToDelete);
          break;
        case "delete-set-here":
          await this.deleteSetFormSet(this.state.entryIdToDelete);
          break;
        case "delete-set-permanent":
          await this.deleteSetPermanently(this.state.entryIdToDelete);
          break;
        default:
      }
    } else {
      this.setState({
        showConfirmOperationDialog: false,
        entryIdToDelete: -1,
        confirmDialogContent: {},
      });
    }
  };

  deleteSetFormSet = async (id) => {
    let { set } = this.props;

    let response = await postDataToAPI(
      `/api/DocumentSet/RemoveDocumentSetFromDocumentSet?Parent_documentSet_Id=${set.id}&child_documentSet_Id=${id}`,
      null,
      "DELETE"
    );

    if (response.ok) {
      this.setState(
        {
          showConfirmOperationDialog: false,
        },
        () => this.props.refreshSet(set)
      );
    } else {
      let json = await response.json();
      this.props.showNotification(true, true, json.error);
    }
  };

  deleteDocumentFormSet = async (id) => {
    let { set } = this.props;
    let response = await postDataToAPI(
      `/api/DocumentSet/RemoveDocumentFromDocumentSet?document_Id=${id}&document_set_Id=${set.id}`,
      null,
      "DELETE"
    );
    if (response.ok) {
      this.setState(
        {
          showConfirmOperationDialog: false,
        },
        () => this.props.refreshSet(set)
      );
    } else {
      let json = await response.json();
      this.props.showNotification(true, true, json.error);
    }
  };

  deleteSetPermanently = async (id) => {
    let { set } = this.props;
    let response = await postDataToAPI(
      `/api/DocumentSet/DeleteDocumentSet?document_set_id=${id}`,
      null,
      "DELETE"
    );
    if (response.ok) {
      this.setState(
        {
          showConfirmOperationDialog: false,
        },
        () => this.props.refreshSet(set)
      );
    } else {
      let json = await response.json();
      this.props.showNotification(true, true, json.error);
    }
  };

  showPreviewDocumentDialog = () => {
    this.setState({ showPreviewDocumentDialog: true });
  };

  ClosePreviewDocumentDialog = () => {
    this.setState({ showPreviewDocumentDialog: false });
  };

  fetchDocumentsScans = async (latestVersion) => {
    // Send list of LatestVersions to api and receive list of scans
    let payload = [];
    payload.push(latestVersion);
    let response = await postDataToAPI(
      "api/Document/GetDocumentScansByVersionIds",
      payload
    );
    return response;
  };

  showPrintDocumentDialog = async (entry) => {
    let response = await this.fetchDocumentsScans(entry.latestVersion);
    if (response.ok) {
      let scans = await response.json();
      let list = [];
      scans.forEach((scan, index) => {
        scan.imgs.forEach((url, idx) => {
          list.push(url);
        });
      });
      this.setState({
        showPrintDocumentDialog: true,
        documentScans: list,
      });
    } else {
      let json = await response.json();
      this.props.showNotification(true, true, json.error);
    }
  };

  ClosePrintDocumentDialog = () => {
    this.setState({
      documentScans: [],
      showPrintDocumentDialog: false,
    });
  };

  render() {
    const { entry, type } = this.props;
    return (
      <Container ref={this.nodeRef}>
        <Logo
          onDoubleClick={() => {
            if (type === FOLDER) {
              this.enterFolder(entry.id, entry.name);
            } else {
              this.showPreviewDocumentDialog();
            }
          }}
        >
          <Img src={type === FOLDER ? FolderIcon : FileIcon} />
        </Logo>
        <Name>{type === FOLDER ? entry.name : entry.documentName}</Name>
        {this.state.visible && (
          <Menu content={this.buildMenuContent(type, entry)} />
        )}

        {this.state.showPreviewDocumentDialog && (
          <UpdateOrPreviewDocumentDialog
            open={this.state.showPreviewDocumentDialog}
            option={0}
            documentVersionId={entry.latestVersion}
            handler={this.ClosePreviewDocumentDialog}
          />
        )}
        {this.state.showPrintDocumentDialog && (
          <PrintDocument
            open={this.state.showPrintDocumentDialog}
            scannedDoc={this.state.documentScans}
            handleClose={this.ClosePrintDocumentDialog}
          />
        )}
        {this.state.showConfirmOperationDialog && (
          <ConfirmOperationDialog
            open={this.state.showConfirmOperationDialog}
            content={this.state.confirmDialogContent}
            handleClose={this.handleCloseConfirmOperationDialog}
          />
        )}
      </Container>
    );
  }
}

export default withTranslation()(Icon);
