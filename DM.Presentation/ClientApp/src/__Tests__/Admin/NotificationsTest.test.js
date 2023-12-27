
import React from "react";
import ReactDom from "react-dom";
import { Notification } from "../../components/Admin/Notifications";
import { cleanup } from "@testing-library/react";
import { shallow , mount} from "enzyme";
import toJSON from "enzyme-to-json";
import { Alert } from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { act } from "react-dom/test-utils";
afterEach(cleanup);
describe("Notifications", () => {
   afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    const div = document.createElement("div");
    let open=true;
    let error=true;
    const setOpen = jest.fn();
    let errorMessage=["error 1" , "error 2"];
    ReactDom.render(<Notification open={open} error={error} setOpen={setOpen} errorMessage={errorMessage} />,div
    );
  });

  test("matches snapshot", () => {
    let open=true;
    let error=true;
    const setOpen = jest.fn();
    let errorMessage=["error 1" , "error 2"];
    const wrapper = shallow(
        <Notification open={open} error={error} setOpen={setOpen} errorMessage={errorMessage}/>
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
   
  test("intializationNotifications", () => {
    let open=true;
    let error=true;
    const setOpen = jest.fn();
    let errorMessage=["error 1" , "error 2"];
    let  wrapper = mount(<Notification open={open} error={error} setOpen={setOpen} errorMessage={errorMessage}/>);
    expect(wrapper.find(Alert).at(0).props().severity).toBe("error");  
    errorMessage.map((item, index) => (
        expect(wrapper.find("#errorMessageItem"+index).text()).toBe(errorMessage[index])
      ));
});
 
test("intializationNotifications when error is false and setOpen is called", () => {
    let open=true;
    let error=false;
    const setOpen = jest.fn();
    let errorMessage=["error 1" , "error 2"];
    let  wrapper = mount(<Notification open={open} error={error} setOpen={setOpen} errorMessage={errorMessage}/>);
    act(() => {
        wrapper
          .find(IconButton)
          .at(0)
          .props()
          .onClick();
      });
      wrapper.update();
    expect(wrapper.find(Alert).at(0).props().severity).toBe("success");  
    errorMessage.map((item, index) => (
        expect(wrapper.find("#errorMessageItem"+index).length).toBe(0)
      ));
      expect(setOpen).toHaveBeenCalledTimes(1);
      expect(wrapper.find(Typography).text()).toBe("successful_msg")
});

test("intializationNotifications when open is false", () => {
    let open=false;
    let error=false;
    const setOpen = jest.fn();
    let errorMessage=["error 1" , "error 2"];
    let  wrapper = mount(<Notification open={open} error={error} setOpen={setOpen} errorMessage={errorMessage}/>);
    expect(wrapper.find(Alert).length).toBe(0);  
});
});