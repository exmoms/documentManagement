//import 'bootstrap/dist/css/bootstrap.css';
import {
  createMuiTheme,
  jssPreset,
  StylesProvider,
  ThemeProvider,
} from "@material-ui/core/styles";
import { create } from "jss";
import rtl from "jss-rtl";
import React, { Suspense } from "react";
import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "../src/scss/faq.scss";
import "../src/scss/help-desk.scss";
import "../src/scss/tutorials.scss";
import App from "./App";
import ForgetPassword from "./components/Admin/ForgetPassword";
import Login from "./components/Admin/Login";
import NotFoundPage from "./components/Admin/NotFoundPage";
import PrivateRoute from "./components/Admin/PrivateRoute";
import ResetPassword from "./components/Admin/ResetPassword";
import { AuthContext } from "./context/auth";
import "./i18n";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import "./style.scss";
import { postDataToAPI } from "./api/PostData";

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createMuiTheme({
  direction: "rtl",
});

function Direction(props) {
  const { i18n } = useTranslation();
  document.getElementsByTagName("body")[0].setAttribute("dir", i18n.dir());
  if (i18n.dir() === "rtl") {
    return (
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
      </StylesProvider>
    );
  } else {
    return props.children;
  }
}

// ReactDOM.render(
//   <CookiesProvider>
//     <BrowserRouter>
//       <Suspense fallback={null}>
//         <Direction>
//           <App />
//         </Direction>
//       </Suspense>
//     </BrowserRouter>
//   </CookiesProvider>,
//   document.getElementById("root")
// );

class Main extends React.Component {
  constructor(props) {
    super(props);
    // use token cookie if exist.
    this.state = { authenticated: false };
  }

  setAuthenticated = (authenticated) => {
    this.setState({ authenticated: authenticated });
    localStorage.setItem("isAuthenticated", "1");
  };

  componentDidMount() {
    var existingTokens = localStorage.getItem("isAuthenticated");
    if (existingTokens !== null && existingTokens === "1") {
      postDataToAPI("/api/user/CheckToken").then((res) => {
        if (res.status === 200) {
          this.setState({ authenticated: true });
        } else {
          localStorage.removeItem("isAuthenticated");
        }
      });
    }
  }

  render() {
    return (
      <AuthContext.Provider
        value={{
          authenticated: this.state.authenticated,
          setAuthenticated: this.setAuthenticated,
        }}
      >
        <CookiesProvider>
          <BrowserRouter>
            <Suspense fallback={null}>
              <Direction>
                <Switch>
                  <Route path="/login" component={Login}></Route>
                  <Route
                    path="/forget-password"
                    component={ForgetPassword}
                  ></Route>
                  <Route
                    path="/reset-password"
                    component={ResetPassword}
                  ></Route>
                  <PrivateRoute path="/" component={App}></PrivateRoute>
                  <Route path="*" component={NotFoundPage}></Route>
                </Switch>
              </Direction>
            </Suspense>
          </BrowserRouter>
        </CookiesProvider>
      </AuthContext.Provider>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
