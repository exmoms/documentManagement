
import React from "react";
import ReactDom from "react-dom";
import Profile  from "../../components/Admin/Profile";
import EditPassword  from "../../components/Admin/EditPassword";
import LanguageMenu  from "../../components/Admin/LanguageMenu";
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
import { useCookies } from "react-cookie";
import i18n from "i18next";
afterEach(cleanup);
describe("Profile", () => {
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
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(<Profile />,div
    );
  });
//TBD
  // test("matches snapshot", () => {
  //   let authenticated = true;
  //   let setAuthenticated = jest.fn()
  //   let value ={authenticated,setAuthenticated};
  //   jest.spyOn(ContextAuth, "useAuth").mockImplementation(()=>value);
  //   const wrapper = shallow(<Profile />
  //   );
  //   expect(toJSON(wrapper)).toMatchSnapshot();
  // });

  test("initialization", () => {
    let  wrapper = mount(<Profile />);
    expect(wrapper.find(EditPassword).length).toBe(1);
    expect(wrapper.find(LanguageMenu).length).toBe(1);

  });
});