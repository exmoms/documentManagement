import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DescriptionIcon from "@material-ui/icons/Description";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import SearchIcon from "@material-ui/icons/Search";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
// Start: Style properties --------------
const drawerWidth = 260;
const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    // top: 65,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));
//End --------------------------------------

// Start: function SideBar ---------------------------------------------------------------
function SideBar(props) {
  const { t } = useTranslation();
  const { container } = props;
  const classes = useStyles();
  const theme = useTheme();

  // list in sidebar ------------
  // Create Forms
  let createFormlist = [
    {
      path: "document-class",
      title: t("label_documentclass"),
      icon: <AssignmentIcon />,
    },
    {
      path: "metadata-model",
      title: t("createdocument_meatdatmodel"),
      icon: <DescriptionIcon />,
    },
  ];
  // -------------------------------------------

  // list in sidebar ------------
  // Full out forms
  let fullOutFormsList = [
    { path: "create-document", title: t("create_doc"), icon: <NoteAddIcon /> },
    {
      path: "browse-documents",
      title: t("browsedocuments"),
      icon: <SearchIcon />,
    },
    {
      path: "document-set",
      title: t("appsidebar_documentset"),
      icon: <FolderOpenIcon />,
    },
  ];
  // -------------------------------------------

  // Start: show the content of sideBar ---------
  const drawer = (
    <>
      <div>
        <div className={classes.toolbar} />
        {(props.user.role === "Admin" || props.user.role === "SuperAdmin") && (
          <React.Fragment>
            <List>
              {createFormlist.map((text, index) => (
                <ListItem
                  button
                  key={text.title}
                  component={Link}
                  to={"/" + text.path}
                >
                  <ListItemIcon>{text.icon}</ListItemIcon>
                  <ListItemText primary={text.title} />
                </ListItem>
              ))}
            </List>
            <Divider />
          </React.Fragment>
        )}
        <List>
          {fullOutFormsList.map((text, index) => (
            <ListItem
              button
              key={text.title}
              component={Link}
              to={"/" + text.path}
            >
              <ListItemIcon>{text.icon}</ListItemIcon>
              <ListItemText primary={text.title} />
            </ListItem>
          ))}
        </List>
      </div>
    </>
  );
  // End: -----------------------------------------------

  return (
    <nav
      className={classes.drawer}
      aria-label="mailbox folders"
      data-testid="app-side-bar"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp implementation="css">
        <Drawer
          id="drawer1"
          container={container}
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={props.open}
          onClose={props.onClose}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>{" "}
      <Hidden xsDown implementation="css">
        <Drawer
          id="drawer2"
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
}
// End: function SideBar ---------------------------------------------------------------

export default SideBar;
