
import React from "react";
import ReactDom from "react-dom";
import PrimarySearchAppBar from "../../components/Admin/AppNavBar";
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
import * as ContextAuth from "../../context/auth";
import MenuItem from "@material-ui/core/MenuItem";
import { act } from "react-dom/test-utils";
afterEach(cleanup);
describe("PrimarySearchAppBar", () => {
   afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    const useAuth = jest.fn();
    jest.spyOn(ContextAuth, "useAuth").mockImplementation(()=>useAuth);
    let user={role:"Admin"}
    ReactDom.render(
        <Router>
          <PrimarySearchAppBar user={user}/>
        </Router>,
      div
    );
  });

  test("matches snapshot", () => {
    let user={role:"Admin"}
    const useAuth = jest.fn();
    jest.spyOn(ContextAuth, "useAuth").mockImplementation(()=>useAuth);
    const wrapper = shallow(
      <Router>
        <PrimarySearchAppBar user={user}/>
      </Router>
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  
  test("componentDidMount", () => {
      let user={role:"Admin"};
      let userNotAdmin={role:"user"}
      const useAuth = jest.fn();
     jest.spyOn(ContextAuth, "useAuth").mockImplementation(()=>useAuth);
    const mockSuccessResponse = {id:1 , userName:"Name A"};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const fetchMock =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise);
    let wrapper;
    return mockJsonPromise.then(() => {
      wrapper = mount(<Router>
        <PrimarySearchAppBar user={user}/>
      </Router>) ;
    }).then(() => {
        wrapper.render();
        wrapper.update();
        expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe("/api/user/CurrentUserProfile");
      expect(wrapper.text()).toBe("docmanagmentsysName A");
      expect(wrapper.find("#primary-search-account-menu-mobile").at(0).props().anchorEl).toBe(null);
      expect(wrapper.find("#primary-search-account-menu-mobile").at(0).props().open).toBeFalsy();

      expect(wrapper.find("#primary-search-account-menu").at(0).props().anchorEl).toBe(null);
      expect(wrapper.find("#primary-search-account-menu").at(0).props().open).toBeFalsy();
      expect(wrapper.find("#primary-search-account-menu").find(MenuItem).length).toBe(3);
    });
});
//TBD
//NEED INTIGRATION TEST
// test("onClick of IconButton2", () => {
//   let user={role:"Admin"};
//   const clickMock = jest.fn();
//   const useAuth = jest.fn();
// jest.spyOn(ContextAuth, "useAuth").mockImplementation(()=>useAuth);
// let wrapper = mount(<Router>
//   <PrimarySearchAppBar user={user}/>
// </Router> , {attachTo:document.body}) ;
//   const clickInputSpy = jest.spyOn(HTMLButtonElement.prototype, 'click');
// act(() => {
//   wrapper
//     .find("#IconButton2")
//     .at(0)
//     .props()
//     .onClick();
// });
// wrapper.render();
//   wrapper.update();
//   expect(clickInputSpy).toHaveBeenCalledTimes(1);
// });

test("handleProfileMenuOpen and handleMenuClose", () => {
  let user={role:"user"};
  const useAuth = jest.fn();
jest.spyOn(ContextAuth, "useAuth").mockImplementation(()=>useAuth);
let wrapper = mount(<Router>
  <PrimarySearchAppBar user={user}/>
</Router>) ;
act(() => {
  wrapper
    .find("#IconButton3")
    .at(0)
    .props()
    .onClick({ currentTarget: { } });
});
      wrapper.render();
      wrapper.update();
      expect(wrapper.find("#primary-search-account-menu-mobile").at(0).props().anchorEl).toBe(null);
      expect(wrapper.find("#primary-search-account-menu-mobile").at(0).props().open).toBeFalsy();

      expect(wrapper.find("#primary-search-account-menu").at(0).props().anchorEl).toStrictEqual({});
      expect(wrapper.find("#primary-search-account-menu").at(0).props().open).toBeTruthy();
      expect(wrapper.find("#primary-search-account-menu").find(MenuItem).length).toBe(2);

      act(() => {
        wrapper
          .find("#primary-search-account-menu")
          .at(0)
          .props()
          .onClose();
      });
            wrapper.render();
            wrapper.update();
      expect(wrapper.find("#primary-search-account-menu-mobile").at(0).props().anchorEl).toBe(null);
      expect(wrapper.find("#primary-search-account-menu-mobile").at(0).props().open).toBeFalsy();

      expect(wrapper.find("#primary-search-account-menu").at(0).props().anchorEl).toBe(null);
      expect(wrapper.find("#primary-search-account-menu").at(0).props().open).toBeFalsy();
});

test("handleMobileMenuOpen and handleMobileMenuClose", () => {
  let user={role:"user"};
  const useAuth = jest.fn();
jest.spyOn(ContextAuth, "useAuth").mockImplementation(()=>useAuth);
let wrapper = mount(<Router>
  <PrimarySearchAppBar user={user}/>
</Router>) ;
act(() => {
  wrapper
    .find("#IconButton4")
    .at(0)
    .props()
    .onClick({ currentTarget: { } });
});
      wrapper.render();
      wrapper.update();
      expect(wrapper.find("#primary-search-account-menu-mobile").at(0).props().anchorEl).toStrictEqual({});
      expect(wrapper.find("#primary-search-account-menu-mobile").at(0).props().open).toBeTruthy();

      expect(wrapper.find("#primary-search-account-menu").at(0).props().anchorEl).toBe(null);
      expect(wrapper.find("#primary-search-account-menu").at(0).props().open).toBeFalsy();
      expect(wrapper.find("#primary-search-account-menu").find(MenuItem).length).toBe(2);
      act(() => {
        wrapper
          .find("#primary-search-account-menu-mobile")
          .at(0)
          .props()
          .onClose();
      });
            wrapper.render();
            wrapper.update();
      expect(wrapper.find("#primary-search-account-menu-mobile").at(0).props().anchorEl).toBe(null);
      expect(wrapper.find("#primary-search-account-menu-mobile").at(0).props().open).toBeFalsy();

      expect(wrapper.find("#primary-search-account-menu").at(0).props().anchorEl).toBe(null);
      expect(wrapper.find("#primary-search-account-menu").at(0).props().open).toBeFalsy();
});

test("logout functionality when res is 200", () => {
  let user={role:"Admin"};
const mockSuccessResponse = {id:1 , userName:"Name A"};
const mockJsonPromise = Promise.resolve(mockSuccessResponse);
const fetchMock2 =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise);
const mockSuccessResponsePost ={status :200};
const mockJsonPromisePost = Promise.resolve(mockSuccessResponsePost);
const PostMock = jest.spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromisePost);
const setAuthenticated = jest.fn();
let authenticated= true
let value = {setAuthenticated ,authenticated}
jest.spyOn(ContextAuth, "useAuth").mockImplementation(()=>value);
const removeItemMock =  jest.spyOn(localStorage.__proto__, "removeItem");
let wrapper;
return mockJsonPromise.then(() => {
  wrapper = mount(<Router>
    <PrimarySearchAppBar user={user}/>
  </Router>) ;
}).then(() => {
    wrapper.render();
    wrapper.update();
    expect(fetchMock2).toHaveBeenCalledTimes(2);
  expect(fetchMock2.mock.calls[0][0]).toBe("/api/user/CurrentUserProfile");
  expect(wrapper.text()).toBe("docmanagmentsysName A");
  expect(wrapper.find("#primary-search-account-menu-mobile").at(0).props().anchorEl).toBe(null);
  expect(wrapper.find("#primary-search-account-menu-mobile").at(0).props().open).toBeFalsy();
  expect(wrapper.find("#primary-search-account-menu").at(0).props().anchorEl).toBe(null);
  expect(wrapper.find("#primary-search-account-menu").at(0).props().open).toBeFalsy();
  expect(wrapper.find("#primary-search-account-menu").find(MenuItem).length).toBe(3);
  return mockJsonPromisePost.then(() => {
    act(() => {
      wrapper
        .find("#menuItem3")
        .at(0)
        .props()
        .onClick({ target: { value: "" } });
    });
  }).then(() => {
    wrapper.render();
    wrapper.update();
    expect(PostMock).toHaveBeenCalledTimes(1);
  expect(PostMock.mock.calls[0][0]).toBe("/api/user/Logout");

  expect(setAuthenticated).toHaveBeenCalledTimes(1);
  expect(setAuthenticated.mock.calls[0][0]).toBeFalsy();

  expect(removeItemMock).toHaveBeenCalledTimes(1);
  expect(removeItemMock.mock.calls[0][0]).toBe("isAuthenticated");
  });

});

});

test("logout functionality when res isn't 200", () => {
  let user={role:"Admin"};
const mockSuccessResponse = {id:1 , userName:"Name A"};
const mockJsonPromise = Promise.resolve(mockSuccessResponse);
const fetchMock2 =  jest.spyOn(FetchMock, "fetchData").mockImplementation(() => mockJsonPromise);
const mockSuccessResponsePost ={status :300};
const mockJsonPromisePost = Promise.resolve(mockSuccessResponsePost);
const PostMock = jest.spyOn(PostDataMock, "postDataToAPI").mockImplementation(() => mockJsonPromisePost);
const useAuth = jest.fn();
const onError = jest.fn();
jest.spyOn(ContextAuth, "useAuth").mockImplementation(()=>useAuth);
const removeItemMock =  jest.spyOn(localStorage.__proto__, "removeItem");
const alertMock =  jest.spyOn(window, "alert");
let wrapper;
return mockJsonPromise.then(() => {
  wrapper = mount(<Router>
    <PrimarySearchAppBar user={user} onError={onError}/>
  </Router>) ;
}).then(() => {
    wrapper.render();
    wrapper.update();
    expect(fetchMock2).toHaveBeenCalledTimes(1);
  expect(fetchMock2.mock.calls[0][0]).toBe("/api/user/CurrentUserProfile");
  expect(wrapper.text()).toBe("docmanagmentsysName A");
  expect(wrapper.find("#primary-search-account-menu-mobile").at(0).props().anchorEl).toBe(null);
  expect(wrapper.find("#primary-search-account-menu-mobile").at(0).props().open).toBeFalsy();
  expect(wrapper.find("#primary-search-account-menu").at(0).props().anchorEl).toBe(null);
  expect(wrapper.find("#primary-search-account-menu").at(0).props().open).toBeFalsy();
  expect(wrapper.find("#primary-search-account-menu").find(MenuItem).length).toBe(3);
  return mockJsonPromisePost.then(() => {
    act(() => {
      wrapper
        .find("#menuItem3")
        .at(0)
        .props()
        .onClick({ target: { value: "" } });
    });
  }).then(() => {
    wrapper.render();
    wrapper.update();
  expect(PostMock).toHaveBeenCalledTimes(1);
  expect(PostMock.mock.calls[0][0]).toBe("/api/user/Logout");

  expect(useAuth).toHaveBeenCalledTimes(0);
  expect(removeItemMock).toHaveBeenCalledTimes(0);

  expect(onError).toHaveBeenCalledTimes(1);
  expect(onError.mock.calls[0][0]).toStrictEqual({"error": true, "errorMessage": ["logout_error_msg"], "open": true});
  });

});

});
});
