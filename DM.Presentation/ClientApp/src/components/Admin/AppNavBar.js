import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
// Importing Material-UI components ---------------------------
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MoreIcon from "@material-ui/icons/MoreVert";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import React from "react";
import { useTranslation } from "react-i18next";
//--------------------------------------------------
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { fetchData } from "../../api/FetchData";
import { postDataToAPI } from "../../api/PostData";

// Add custom style
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

// Main component function
export default function PrimarySearchAppBar(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [user_info, setUser_info] = React.useState({});

  React.useEffect(() => {
    fetchData("/api/user/CurrentUserProfile").then((res) => {
      setUser_info(res);
    });
  }, [user_info.userName]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  /*function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }*/

  const { setAuthenticated } = useAuth();
  const logout = (event) => {
    postDataToAPI("/api/user/Logout").then((res) => {
      if (res.status === 200) {
        setAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
      } else {
        let errorObject = {
          open: true,
          error: true,
          errorMessage: [t("logout_error_msg")],
        };
        props.onError(errorObject);
      }
    });
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
        {t("Profile")}
      </MenuItem>
      {(props.user.role === "Admin" || props.user.role === "SuperAdmin") && (
        <MenuItem onClick={handleMenuClose} component={Link} to="/settings">
          {t("Settings")}
        </MenuItem>
      )}
      <MenuItem onClick={logout} id="menuItem3">
        {t("menu_logout")}
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>{t("menu_profile")}</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow} data-testid="app-nav-bar">
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          ></IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            {t("docmanagmentsys")}
          </Typography>
          <div className={classes.grow} />
          <IconButton
            id="IconButton2"
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => {
              if (document.getElementsByClassName("help-desk__menu") !== null) {
                document.getElementsByClassName("help-desk__menu")[0].click();
              }
            }}
            className={classes.menuButton}
          >
            <HelpOutlineIcon />
          </IconButton>
          {user_info.userName}
          <div className={classes.sectionDesktop}>
            <IconButton
              id="IconButton3"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              id="IconButton4"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
