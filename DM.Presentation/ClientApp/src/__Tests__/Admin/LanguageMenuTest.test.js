
import React from "react";
import ReactDom from "react-dom";
import LanguageMenu from "../../components/Admin/LanguageMenu";
import { cleanup } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { shallow , mount} from "enzyme";
import toJSON from "enzyme-to-json";
import { MemoryRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { Link } from "react-router-dom";
import { Suspense } from "react";
import * as FetchMock from "../../api/FetchData";
import * as PostDataMock from "../../api/PostData";
import { useCookies } from "react-cookie";
import MenuItem from "@material-ui/core/MenuItem";
import { act } from "react-dom/test-utils";
import List from "@material-ui/core/List";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {Redirect } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import i18n from "i18next";
afterEach(cleanup);
describe("LanguageMenu", () => {
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
    })
    afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(<LanguageMenu/>
        ,div
    );
  });

  test("matches snapshot", () => {
    const wrapper = shallow(<LanguageMenu/>);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  
  test("intialization LanguageMenu", () => {
      const setItemMock = jest.spyOn(window.localStorage.__proto__, 'setItem');
      const wrapper = mount(<LanguageMenu/>);
      expect(setItemMock).toHaveBeenCalled();
      expect(setItemMock.mock.calls[0][0]).toBe("i18nextLng");
      expect(setItemMock.mock.calls[0][1]).toBe("en");
      expect(wrapper.find(LanguageMenu).find(Button).text()).toBe("English");
    expect(wrapper.find(LanguageMenu).find("#language-menu").at(0).props().anchorEl).toBe(null);
    expect(wrapper.find(LanguageMenu).find("#language-menu").at(0).props().open).toBeFalsy();
    setItemMock.mockClear();
  });

  test("handleClick ,handleClose ", () => {
    const wrapper = mount(<LanguageMenu/>);
    act(() => {
        wrapper
          .find(Button)
          .at(0)
          .props()
          .onClick({ currentTarget: { } });
      });
      wrapper.update();
      wrapper.render();
    expect(wrapper.find(LanguageMenu).find(Button).text()).toBe("English");
  expect(wrapper.find(LanguageMenu).find("#language-menu").at(0).props().anchorEl).toStrictEqual({});
  expect(wrapper.find(LanguageMenu).find("#language-menu").at(0).props().open).toBeTruthy();

  act(() => {
    wrapper
      .find("#language-menu")
      .at(0)
      .props()
      .onClose({ currentTarget: { } });
  });
  wrapper.update();
  wrapper.render();
  expect(wrapper.find(LanguageMenu).find("#language-menu").at(0).props().anchorEl).toBe(null);
  expect(wrapper.find(LanguageMenu).find("#language-menu").at(0).props().open).toBeFalsy();
});

test("setLanguage when res is 200", () => {
    const wrapper = mount(<LanguageMenu/>);
    const setItemMock2 = jest.spyOn(window.localStorage.__proto__, 'setItem');
const mockSuccessResponsePost ={ok :true};
const mockJsonPromisePost = Promise.resolve(mockSuccessResponsePost);
const PostMock = jest.spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromisePost);
act(() => {
    wrapper
      .find(Button)
      .at(0)
      .props()
      .onClick({ currentTarget: { } });
  });
  wrapper.render();
  wrapper.update();
  expect(wrapper.find(LanguageMenu).find("#language-menu").at(0).props().anchorEl).toStrictEqual({});
  expect(wrapper.find(LanguageMenu).find("#language-menu").at(0).props().open).toBeTruthy();
return mockJsonPromisePost.then(() => {
    act(() => {
        wrapper
          .find(MenuItem)
          .at(1)
          .props()
          .onClick({ target: {value:"" } });
      });
}).then(() => {
    wrapper.update();
    wrapper.render();
    expect(PostMock).toHaveBeenCalledTimes(1);
  expect(PostMock.mock.calls[0][0]).toBe("/api/User/ChangeLanguage?lang=ar");
  expect(wrapper.find(LanguageMenu).find(Button).text()).toBe("English");
  expect(setItemMock2).toHaveBeenCalled();
  expect(wrapper.find(LanguageMenu).find("#language-menu").at(0).props().anchorEl).toBe(null);
  expect(wrapper.find(LanguageMenu).find("#language-menu").at(0).props().open).toBeFalsy();
  setItemMock2.mockClear();
});

});

test("setLanguage when res is not 200", () => {
    const wrapper = mount(<LanguageMenu/>);
    const alertMock = jest.spyOn(window, 'alert');
const mockSuccessResponsePost ={ok :false};
const mockJsonPromisePost = Promise.resolve(mockSuccessResponsePost);
const PostMock = jest.spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromisePost);
return mockJsonPromisePost.then(() => {
    act(() => {
        wrapper
          .find(MenuItem)
          .at(1)
          .props()
          .onClick({ target: {value:"" } });
      });
}).then(() => {
    wrapper.update();
    wrapper.render();
    expect(PostMock).toHaveBeenCalledTimes(1);
  expect(PostMock.mock.calls[0][0]).toBe("/api/User/ChangeLanguage?lang=ar");
  expect(wrapper.find(LanguageMenu).find(Button).text()).toBe("English");
  expect(wrapper.find(LanguageMenu).find("#language-menu").at(0).props().anchorEl).toBe(null);
  expect(wrapper.find(LanguageMenu).find("#language-menu").at(0).props().open).toBeFalsy();
        expect(wrapper.find("#notification").props().open).toBeTruthy(); 
      expect(wrapper.find("#notification").props().error).toBeTruthy(); 
      expect(wrapper.find("#notification").props().errorMessage).toStrictEqual(["Unable to change language.."]); 
});

});
});