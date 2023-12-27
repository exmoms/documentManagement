/**
 * @file Contains AddToSetDialog component implementaion
 * @author Ali Daghman <ali.daghman@lit-co.net>
 * @version 1.0
 */

import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import AddIcon from "@material-ui/icons/Add";
import { blue } from "@material-ui/core/colors";
import { FOLDER, FILE } from "../utils/constants";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

export default function AddToSetDialog(props) {
  const classes = useStyles();
  const { show, set } = props;

  const handleClose = () => {
    props.action();
  };

  const { t } = useTranslation();
  let lang = localStorage.getItem("i18nextLng");
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={show}
      maxWidth={"xs"}
    >
      <div
        style={lang === "ar" ? { textAlign: "right" } : { textAlign: "left" }}
      >
        <DialogTitle id="simple-dialog-title">{t("actions")}</DialogTitle>
      </div>
      <List>
        <ListItem autoFocus button onClick={() => props.action(FOLDER, true)}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={t("documentset_addnewdocumentset")} />
        </ListItem>

        {set.id !== 0 ? (
          <Fragment>
            <ListItem
              autoFocus
              button
              onClick={() => props.action(FOLDER, false)}
            >
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={t("add_existing_set")} />
            </ListItem>
            <ListItem autoFocus button onClick={() => props.action(FILE)}>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={t("add_document_to_set")} />
            </ListItem>
          </Fragment>
        ) : (
          ""
        )}
      </List>
    </Dialog>
  );
}
