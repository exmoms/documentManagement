import React from "react";
import ReactDom from "react-dom";
import ConfirmUpdateDialog from "../../components/User/ConfirmUpdateDialog";
import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";

afterEach(cleanup);
describe("ConfirmUpdateDialog", () => {
  test("ConfirmUpdateDialog renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(<ConfirmUpdateDialog />, div);
  });

  test("ConfirmUpdateDialog matches snapshot", () => {
    const component = renderer.create(<ConfirmUpdateDialog />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ConfirmUpdateDialog Functionality ", () => {
    let open = true;
    let handleIgnoreUpdateMock = jest.fn();
    let handleCloseMock = jest.fn();
    let handleConfirmUpdateMock = jest.fn();
    let wrapper = mount(
      <ConfirmUpdateDialog
        open={open}
        handleIgnoreUpdate={handleIgnoreUpdateMock}
        handleClose={handleCloseMock}
      />
    );
    act(() => {
      wrapper.find("#Back").at(0).props().onClick();
    });
    act(() => {
      wrapper.find("#Ignore").at(0).props().onClick();
    });
    expect(handleIgnoreUpdateMock).toHaveBeenCalledTimes(1);
  });
});
