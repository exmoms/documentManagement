import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import { default as Check } from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import { default as Edit, default as EditIcon } from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import UpdateIcon from "@material-ui/icons/Update";
import MaterialTable from "material-table";
import React, { Component, forwardRef } from "react";
import { withTranslation } from "react-i18next";
import { fetchData } from "../../../api/FetchData";
import TableBodyRow from "../../Shared/materialTableRow";
import TableBodyToolbar from "../../Shared/materialTableToolbar";
import EditProfilePopup from "./EditProfilePopup";
import EditRolePopup from "./EditRolePopup";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

class UsersTable extends Component {
  getAllLessUsersURL = "/api/user/lessRoleUsers";
  initUser = {
    userId: 0,
    userName: "",
  };

  constructor(props) {
    super(props);
    this.state = {
      option: 1,
      data: [],
      user: this.initUser,
      show: false,
      showChangeRolePopup: false,
    };
  }

  componentDidMount() {
    fetchData(this.getAllLessUsersURL).then(
      (data) => {
        this.setState({
          data: data,
        });
      },
      (error) => console.log(error)
    );
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.userTableNeedUpdate &&
      this.props.userTableNeedUpdate !== prevProps.userTableNeedUpdate
    ) {
      fetchData(this.getAllLessUsersURL).then(
        (data) => {
          this.setState({
            data: data,
          });
        },
        (error) => console.log(error)
      );
    }
  }

  // translation object
  t = this.props["t"];

  editUserProfile = {
    icon: EditIcon,
    tooltip: this.t("edit_user_profile"),
    position: "row",
    onClick: (event, rowData) => {
      this.setState({ user: rowData, show: true });
    },
  };

  changeRole = {
    icon: UpdateIcon,
    tooltip: this.t("edit_user_role"),
    position: "row",
    onClick: (event, rowData) => {
      this.setState({ user: rowData, showChangeRolePopup: true });
    },
  };

  composeTableColumns = () => {
    let columns = [];

    columns = [
      {
        title: this.t("userid"),
        field: "userId",
      },
      { title: this.t("username"), field: "userName" },
      {
        title: this.t("role_label"),
        field: "role",
        hidden: true,
      },
    ];
    return columns;
  };

  composeTableActions = () => {
    let actions = [];
    let userRole = localStorage.getItem("userRole");
    if (userRole !== null && userRole !== undefined) {
      actions =
        userRole === "SuperAdmin"
          ? [this.editUserProfile, this.changeRole]
          : [this.editUserProfile];
    } else {
      actions = [this.editUserProfile];
    }

    return actions;
  };

  showPopup = (show) => {
    this.setState({ show: show });
  };

  showChangeRolePopup = (show, flag) => {
    if (flag) {
      fetchData(this.getAllLessUsersURL).then(
        (data) => {
          this.setState({
            data: data,
            showChangeRolePopup: show,
          });
        },
        (error) => console.log(error)
      );
    } else {
      this.setState({ showChangeRolePopup: show });
    }
  };

  render() {
    const { user, show, showChangeRolePopup } = this.state;
    return (
      <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          title={this.t("browse_users")}
          icons={tableIcons}
          columns={this.composeTableColumns()}
          components={{
            Row: TableBodyRow,
            Toolbar: TableBodyToolbar,
          }}
          data={this.state.data}
          actions={this.composeTableActions()}
          options={{
            actionsColumnIndex: -1,
            exportButton: false,
          }}
          localization={{
            pagination: {
              labelRowsSelect: this.t("rows"),
              firstAriaLabel: this.t("first_page"),
              firstTooltip: this.t("first_page"),
              previousAriaLabel: this.t("previous_page"),
              previousTooltip: this.t("previous_page"),
              nextAriaLabel: this.t("next_page"),
              nextTooltip: this.t("next_page"),
              lastAriaLabel: this.t("last_page"),
              lastTooltip: this.t("last_page"),
            },
            toolbar: {
              nRowsSelected: "{0}" + this.t("selected_row"),
              searchTooltip: this.t("search"),
              searchPlaceholder: this.t("search"),
              exportTitle: this.t("export_as_csv"),
            },
            header: {
              actions: this.t("actions"),
            },
            body: {
              emptyDataSourceMessage: this.t("no_records"),
            },
          }}
        />
        <EditProfilePopup show={show} action={this.showPopup} user={user} />
        <EditRolePopup
          show={showChangeRolePopup}
          action={this.showChangeRolePopup}
          user={user}
        />
      </div>
    );
  }
}

export default withTranslation()(UsersTable);
