import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import { action } from "@storybook/addon-actions";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Book, /* Compass,*/ HelpCircle, MessageSquare } from "react-feather";
import { Translation } from "react-i18next";
import ReactNotifications from "react-notifications-component";
import { Route, Switch } from "react-router-dom";
import HelpDesk from "../src/js/index.js";
import "../src/scss/faq.scss";
import "../src/scss/help-desk.scss";
import "../src/scss/tutorials.scss";
import { fetchData } from "./api/FetchData.js";
import "./App.css";
import NavBar from "./components/Admin/AppNavBar";
import { Notification } from "./components/Admin/Notifications";
import SideBar from "./components/Admin/AppSideBar";
import Profile from "./components/Admin/Profile";
import Settings from "./components/Admin/Settings/Settings";
import DocumentClass from "./components/CreateModel/DocumentClass";
import CreateDocumentClass from "./components/CreateModel/DocumentClassComponents/CreateDocumentClass";
import ModelFormParent from "./components/CreateModel/MetaDataModelComponent/ModelFormParent";
import Models from "./components/CreateModel/MetaDataModelComponent/Models";
import BrowseDocuments from "./components/User/BrowseDocuments";
import CreateDocument from "./components/User/CreateDocument";
import AddDocumentToSet from "./components/User/DocumentSet/AddDocumentToSet";
import CreateDocumentSet from "./components/User/DocumentSet/CreateDocumentSet";
import Explorer from "./components/User/DocumentSet/Explorer";
import FaqFunction from "./faq";
import "./style.scss";

// Style properities -----------------------------------
const drawerWidth = 260;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    top: 65,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));
//------------------------------------------------------------

// Start function ResponsiveDrawer -----------------------------------------------------------------
function ResponsiveDrawer(props) {
  //const { t } = useTranslation();
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const [user, setuser] = React.useState({ role: "User" });

  const [open, setOpen] = useState(false);
  const [errorMessage, seterrorMessage] = useState([]);
  const [error, seterror] = useState(false);

  useEffect(
    () => {
      fetchData("/api/user/CurrentUserProfile")
        .then(
          (data) => {
            let currentUser = {
              userId: data.userId,
              userName: data.userName,
              role: data.roles[0],
            };
            if (data.roles.includes("SuperAdmin")) {
              currentUser.role = "SuperAdmin";
            } else if (data.roles.includes("Admin")) {
              currentUser.role = "Admin";
            } else {
              currentUser.role = "User";
            }
            localStorage.setItem("userRole", currentUser.role);
            setuser(currentUser);
          },
          (error) => console.log(error)
        )
        .catch((e) => console.log(e));
    },

    [] // to deny infinity loop in useEffect
  );

  const onLogoutError = (errorObject) => {
    setOpen(errorObject.open);
    seterror(errorObject.error);
    seterrorMessage(errorObject.errorMessage);
  };

  const adminRoute = () => {
    if (user) {
      if (user.role === "Admin" || user.role === "SuperAdmin") {
        return (
          <Switch>
            <Route
              exact
              path="/document-class"
              component={DocumentClass}
            ></Route>
            <Route
              exact
              path="/document-class/create-document-classes"
              component={CreateDocumentClass}
            ></Route>
            <Route exact path="/metadata-model" component={Models}></Route>
            <Route
              exact
              path="/metadata-model/create-model"
              component={ModelFormParent}
            ></Route>
            <Route path="/settings" component={Settings} />
          </Switch>
        );
      }
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />

      {/* start NavBar ----------------------*/}
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <NavBar user={user} onError={onLogoutError} />
        </Toolbar>
      </AppBar>
      {/* End NavBar ----------------------*/}

      {/*Start  sideBar ----------------------*/}
      <SideBar onClose={handleDrawerToggle} open={mobileOpen} user={user} />
      {/*End  sideBar ----------------------*/}

      {/*Start  helpDesk ------------------*/}
      <HelpDesk defaultTab="home">
        <HelpDesk.Menu>
          <HelpCircle width="18" height="18" />
        </HelpDesk.Menu>
        <HelpDesk.Content>
          <div name="home">
            <Translation>
              {(t) => <HelpDesk.Header title={t("Help_Center")} />}
            </Translation>
            <Translation>
              {(t) => (
                <HelpDesk.Widgets>
                  <HelpDesk.Widget label={t("FAQ")} tab="home">
                    <Book width="20" height="20" />
                  </HelpDesk.Widget>
                  {/* <HelpDesk.Widget label={t("Tutorials")} tab="tutorials">
                          <Compass width="20" height="20" />
                        </HelpDesk.Widget> */}
                  <HelpDesk.Widget
                    label={t("Contact_Us")}
                    onClick={() =>
                      action("Open the mailing box with their JS API")()
                    }
                    externalAction
                  >
                    <MessageSquare width="20" height="20" />
                  </HelpDesk.Widget>
                </HelpDesk.Widgets>
              )}
            </Translation>
            <FaqFunction onArticleRating={action("Article rated")} />
          </div>
          {/* <div name="tutorials">
                  <HelpDesk.Header title="Tutorials" />
                  <Tutorials walkthroughs={walkthroughs} />
                </div> */}
        </HelpDesk.Content>
      </HelpDesk>
      {/* End helpDesk ----------------------*/}

      {/* Start main content: setup components into Main section -----*/}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className="center">
          {adminRoute()}

          <Notification
            open={open} // must be a "state" to show notification message [true or false]
            setOpen={setOpen} // this function changes the state "open" value.
            error={error} // if error message put [true] else for success put [false]
            errorMessage={errorMessage} // the recived error message (array of string) from server.
          />
          <Switch>
            <Route path="/document-set" component={Explorer}></Route>
            <Route path="/create-document" component={CreateDocument}></Route>
            <Route path="/browse-documents" component={BrowseDocuments}></Route>
            <Route
              path="/create-document-set"
              component={CreateDocumentSet}
            ></Route>
            <Route path="/profile" component={Profile} />

            <Route
              path="/create-document-set"
              component={CreateDocumentSet}
            ></Route>
            <Route
              path="/add-document-to-document-set"
              component={AddDocumentToSet}
            ></Route>
            <Route
              path="/set-browse-documents"
              component={BrowseDocuments}
            ></Route>
            {/* <Route path="/Create Metadata Attributes" component={MetaDataAttribute}></Route> */}
          </Switch>
          <ReactNotifications />
        </div>
      </main>
      {/* End main content ----------------------*/}
    </div>
  );
}
// End function ResponsiveDrawer -----------------------------------------------------------------

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  container: PropTypes.instanceOf(
    typeof Element === "undefined" ? Object : Element
  ),
};

export default ResponsiveDrawer;
