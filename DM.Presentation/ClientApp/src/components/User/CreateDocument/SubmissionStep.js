/**
 * @file Contains SubmissionStep component implementaion
 * @author Youssef Shaaban <y.shaaban@lit-co.net>
 * @version 1.0
 */
import { Button, CircularProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { Notification } from "../../Admin/Notifications";
import CREATE_DOC_STYLES from "../Styles";

const useStyles = makeStyles(CREATE_DOC_STYLES);

const SubmissionStep = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [redirect, setredirect] = useState(false);
  const [open, setopen] = useState(false);

  const { response, uploading, errors } = props;

  useEffect(() => {
    setopen(response !== null);
  }, [response]);

  switch (uploading) {
    case true:
      return (
        <div>
          <div
            style={{
              margin: "50px",
              padding: "30px 150px",
            }}
          >
            <CircularProgress className={classes.circle} />
          </div>
          <Typography variant="h5" gutterBottom align="center">
            {t("creatdocument_uploadingfilleddoc")}
          </Typography>
        </div>
      );
    case false:
      if (response !== null && response.ok) {
        /* add a button that to create a new doc */
        /* handle submission status */
        return (
          <div>
            <Notification
              id="notifications"
              open={open}
              setOpen={(show) => setopen(show)}
              error={!response.ok}
              errorMessage={errors}
            />
            <div
              style={{
                padding: "30px 150px",
              }}
            >
              <Button
                color="primary"
                onClick={() => {
                  props.handleReset();
                  setredirect(true);
                }}
                className={classes.buttonForm}
              >
                {t("creatdocument_addnewdoc")}
              </Button>
            </div>
            {redirect && <Redirect to="/create-document" />}
          </div>
        );
      } else if (response !== null) {
        return (
          <div>
            <Notification
              id="notifications"
              open={open}
              setOpen={(show) => setopen(show)}
              error={!response.ok}
              errorMessage={errors}
            />
            <div className={classes.buttons}>
              <Button
                color="primary"
                onClick={() => {
                  props.handleReset();
                  setredirect(true);
                }}
                className={classes.buttonForm}
              >
                {t("reset_doc")}
              </Button>
            </div>
            {redirect && <Redirect to="/create-document" />}
          </div>
        );
      }
      break;

    default:
      break;
  }
  return <div></div>;
};

export default SubmissionStep;
