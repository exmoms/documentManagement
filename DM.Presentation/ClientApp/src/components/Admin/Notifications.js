import React from "react";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";
import CloseIcon from "@material-ui/icons/Close";
import { Alert } from "@material-ui/lab";
import IconButton from "@material-ui/core/IconButton";

export function Notification(props) {
  const { t } = useTranslation();
  const { open, error, setOpen, errorMessage } = props;
  return (
    <>
      {open && (
        <Alert
          severity={error ? "error" : "success"}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <Typography variant="subtitle1" align="left" color="primary">
            {error && (
              <ol>
                {errorMessage.map((item, index) => (
                  <li key={index} id={"errorMessageItem"+index}>{item}</li>
                ))}
              </ol>
            )}
            {!error && t("successful_msg")}
          </Typography>
        </Alert>
      )}
    </>
  );
}
