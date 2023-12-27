import React from "react";
import ReactDom from "react-dom";
import DateValue from "../../components/User/DateValue";
import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
afterEach(cleanup);
test("DateValue matches snapshot", () => {
  const component = renderer.create(<DateValue />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

describe("DateValue", () => {
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(<DateValue></DateValue>, div);
  });

  it("DateValue Functionality ", () => {
    let labelMock = "Text Value";
    let handleValueChangeMock = jest.fn();
    let attributeNameMock = "attrib1";
    let wrapper = mount(
      <DateValue
        label={labelMock}
        handleValueChange={handleValueChangeMock}
        attributeName={attributeNameMock}
      />
    );
    act(() => {
      wrapper.find(KeyboardDatePicker).at(0).props().onChange("03/03/2020");
    });

    wrapper.update();

    expect(handleValueChangeMock).toHaveBeenCalledTimes(1);
    expect(handleValueChangeMock.mock.calls[0][0]).toStrictEqual("03/03/2020");
    expect(handleValueChangeMock.mock.calls[0][1]).toStrictEqual(labelMock);
  });
});
