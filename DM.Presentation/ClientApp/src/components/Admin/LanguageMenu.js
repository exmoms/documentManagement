import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import TranslateIcon from "@material-ui/icons/Translate";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import "../../i18n";
import { useTranslation } from "react-i18next";
import { postDataToAPI } from "../../api/PostData";
import { Notification } from "../Admin/Notifications";

const langMap = { en: "English", ar: "العربية", de: "Deutsch" };

export default function LanguageMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { i18n } = useTranslation();

  const [cookies] = useCookies(["lang"]);
  var lang = cookies.lang ? cookies.lang.substring(2, 4) : "en";

  localStorage.setItem("i18nextLng", lang);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [open, setOpen] = useState(false);
  const [errorMessage, seterrorMessage] = useState([]);
  const [error, seterror] = useState(false);

  const setLanguage = async (event, langCode) => {
    lang = langCode;
    let response = await postDataToAPI("/api/User/ChangeLanguage?lang=" + lang);
    if (response.ok) {
      handleClose();
      i18n.changeLanguage(lang);
      localStorage.setItem("i18nextLng", lang);
    } else {
      // let json = await response.json();
      setOpen(true);
      seterror(true);
      seterrorMessage(["Unable to change language.."] /* json.error */);
    }
  };

  return (
    <React.Fragment>
      <Notification
      id="notification"
        open={open} // must be a "state" to show notification message [true or false]
        setOpen={setOpen} // this function changes the state "open" value.
        error={error} // if error message put [true] else for success put [false]
        errorMessage={errorMessage} // the recived error message (array of string) from server.
      />
      <Button
        aria-controls="language-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="contained"
        color="primary"
        startIcon={<TranslateIcon />}
      >
        {langMap[lang]}
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={(event) => setLanguage(event, "en")}>
          English
        </MenuItem>
        <MenuItem onClick={(event) => setLanguage(event, "ar")}>
          العربية
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
