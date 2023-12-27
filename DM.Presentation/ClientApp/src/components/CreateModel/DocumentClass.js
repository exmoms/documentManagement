import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import "animate.css";
import React from "react";
import { withTranslation } from "react-i18next";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Link } from "react-router-dom";
import { fetchData } from "../../api/FetchData";
import DisplayTable from "../Dispaly/DisplayTable";

const styles = (theme) => ({
  button: {
    margin: "26px",
    marginLeft: "20px",
    marginRight: "20px",
  },
});

class DocumentClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableTitle: "",
      documentClasses: [],
      columns: [],
      deleteUrl: "",
      loading: true,
      update: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  t = this.props["t"];
  componentDidMount() {
    this.setState({ tableTitle: this.t("browsedocumentclasses") });

    fetchData("/api/DocumentClass/")
      .then((value) => {
        this.setState({ documentClasses: value });
        this.setState({ loading: false });
      })
      .catch((e) => console.log(e));

    var ColumnsArray = [
      { title: this.t("documentclassid"), field: "id" },
      { title: this.t("documentparagraph"), field: "documentClassName" },
      { title: this.t("userid"), field: "userID", hidden: true },
      { title: this.t("addeddate"), field: "addedDate" },
    ];

    this.setState({ columns: ColumnsArray });
    this.setState({
      deleteUrl: "/api/DocumentClass/DeleteDocumentClass?classId=",
    });
  }

  componentDidUpdate(prevprops, prevState) {
    if (this.state.update === true) {
      fetchData("/api/DocumentClass/")
        .then((value) => {
          this.setState({ documentClasses: value });
        })
        .catch((e) => console.log(e));
      this.setState({ update: false });
    }
  }

  handleSubmit(notificationMsg) {
    this.setState({ update: true });

    store.addNotification({
      title: "Success",
      message: notificationMsg,
      type: "success", // 'default', 'success', 'info', 'warning'
      container: "top-left",
      animationIn: ["animated", "fadeIn"], // animate.css classes
      animationOut: ["animated", "fadeOut"], // animate.css classes
      dismiss: {
        duration: 2000,
        showIcon: true,
      },
      showIcon: true,
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <>
        <div className={classes.button}>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} sm={7}> */}
            <Button
              id="CreateNewDocumentClass"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={Link}
              to="/document-class/create-document-classes"
            >
              {this.t("createnewdocumentclass")}{" "}
            </Button>
            {/* </Grid> */}
          </Grid>
        </div>
        <DisplayTable
          id="location-display"
          Data={this.state.documentClasses}
          Columns={this.state.columns}
          TableTitle={this.state.tableTitle}
          DeleteUrl={this.state.deleteUrl}
          loading={this.state.loading}
          onSubmit={this.handleSubmit}
        />
      </>
    );
  }
}

export default withStyles(styles)(withTranslation()(DocumentClass));
