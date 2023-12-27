import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchData } from "../../../api/FetchData";
import ReviewModel from "./ReviewModel";
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CustomizedDialogs(props) {
  const [metaDataModelName, setMetaDataModelName] = useState("");
  const [documentClassSelected, setDocumentClassSelected] = useState({
    documentClassName: "",
  });

  const [isCompound, setIsCompound] = useState(false);
  const [isAggregated, setIsAggregated] = useState(false);
  const [
    aggregateMetaDataModelsPart,
    setAggregateMetaDataModelsParts,
  ] = useState([{ aggregateName: "" }]);
  const [compoundModels, setCompoundModels] = useState([
    { isRequired: false, caption: "" },
  ]);
  const [selectedMetaDataModels, setSelectedMetaDataModel] = useState([
    { metaDataModelName: "" },
  ]);
  const [metaDataAttribute, setmetaDataAttribute] = useState([
    {
      metaDataAttributeName: "",
      isRequired: false,
      dataTypeID: "",
    },
  ]);

  useEffect(() => {
    if (props.id !== -1) {
      fetchData(`/api/MetaDataModel/${props.id}`)
        .then((value) => {
          setMetaDataModelName(value.metaDataModelName);
          setDocumentClassSelected({
            documentClassName: value.documentClassName,
          });

          setIsCompound(value.compoundModels.length !== 0 ? true : false);
          setIsAggregated(
            value.childMetaDataModels.length !== 0 ? true : false
          );
          if (
            value.childMetaDataModels &&
            value.childMetaDataModels.length !== 0
          ) {
            var selected_models = [];
            for (var i = 0; i < value.childMetaDataModels.length; i++) {
              selected_models.push({
                metaDataModelName:
                  value.childMetaDataModels[i].childMetaDataModelName,
              });
            }
            setSelectedMetaDataModel(selected_models);
            setAggregateMetaDataModelsParts(value.childMetaDataModels);
          }
          if (value.compoundModels) {
            setCompoundModels(value.compoundModels);
          }

          setmetaDataAttribute(value.metaDataAttributes);
        })
        .catch((e) => console.log(e));
    }
  }, [props.id]);

  const { t } = useTranslation();
  return (
    <Dialog
      onClose={props.handleClose}
      aria-labelledby="customized-dialog-title"
      open={props.open}
    >
      <DialogTitle id="customized-dialog-title" onClose={props.handleClose} />

      <ReviewModel
        value={{
          metaDataModelName: metaDataModelName,
          documentClassSelected: documentClassSelected,
          isCompound: isCompound,
          isAggregated: isAggregated,
          aggregateMetaDataModelsParts: aggregateMetaDataModelsPart,
          compoundModels: compoundModels,
          selectedMetaDataModels: selectedMetaDataModels,
          metaDataAttribute: metaDataAttribute,
        }}
      />

      <DialogActions>
        <Button
          autoFocus
          onClick={() => {
            window.print();
          }}
          color="primary"
        >
          {/* print */}
          {t("print")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
