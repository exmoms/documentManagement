
import React from "react";
import ReactDom from "react-dom";
import PrivateRouter  from "../../components/Admin/PrivateRoute";
import { Notification } from "../../components/Admin/Notifications";
import { cleanup } from "@testing-library/react";
import { shallow , mount} from "enzyme";
import toJSON from "enzyme-to-json";
import { Alert } from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { act } from "react-dom/test-utils";
import { Route, Redirect } from "react-router-dom";
import * as ContextAuth from "../../context/auth";
import { BrowserRouter as Router } from "react-router-dom";
import i18n from "i18next";
afterEach(cleanup);
describe("PrivateRouting 1", () => {

  beforeEach(()=>{
    jest.clearAllMocks();
    i18n
.init({
  react: {
      useSuspense: false
  }
}); 
jest.mock('react-cookie', () => ({
  useCookies: () => ({
    lang: "french"
  })
}));
  jest.mock('react-i18next', () => ({
      useTranslation: () => ({
        i18n: { changeLanguage: jest.fn() }
      })
    }));
});
  afterEach(() => {
   jest.clearAllMocks();
 });
//TBD
//  test("matches snapshot", () => {
//    let authenticated = true;
//    let setAuthenticated = jest.fn()
//    let value ={authenticated,setAuthenticated};
//    let component=Notification;
//    jest.spyOn(ContextAuth, "useAuth").mockImplementation(()=>value);
//    let prop1 =true;
//    const wrapper = shallow(<Router><PrivateRouter prop1={prop1} component={component}/></Router>
//    );
//    expect(toJSON(wrapper)).toMatchSnapshot();
//  });

});
describe("PrivateRouting", () => {
  
   afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    jest.spyOn(ContextAuth, "useAuth").mockImplementation(()=>false);
    let prop1 =true;
    ReactDom.render(<Router><PrivateRouter  prop1={prop1} /></Router>,div
    );
  });

  test("authenticated is false", () => {
    let authenticated = false;
    let setAuthenticated = jest.fn()
    let value ={authenticated,setAuthenticated};
    const useAuth = jest.spyOn(ContextAuth, "useAuth").mockImplementation(()=>value);
    let prop1 =true;
    let  wrapper = mount(<Router><PrivateRouter prop1={prop1} /></Router>);
    expect(useAuth).toHaveBeenCalledTimes(1);
    expect(wrapper.find(Redirect).length).toBe(1);
  });
  test("authenticated is true", () => {
    let authenticated = true;
    let setAuthenticated = jest.fn()
    let value ={authenticated,setAuthenticated};
    const useAuth = jest.spyOn(ContextAuth, "useAuth").mockImplementation(()=>value );
    let prop1 =true;
    let component=Notification;
    let  wrapper = mount(<Router><PrivateRouter prop1={prop1} component={component}/></Router>);
    expect(useAuth).toHaveBeenCalledTimes(1);
    expect(wrapper.find(Redirect).length).toBe(0);
    expect(wrapper.find(component).length).toBe(1);
  });
});