import React from "react";
import ReactDom from "react-dom";
import BoolValue from "../../components/User/BoolValue";
import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
afterEach(cleanup);
test("BoolValue matches snapshot", () => {
  const component = renderer.create(<BoolValue />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

describe("BoolValue", () => {
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(<BoolValue></BoolValue>, div);
  });

  it("BoolValue Functionality ", () => {
    let labelMock = "Text Value";
    let handleValueChangeMock = jest.fn();
    let attributeNameMock = "attrib1";
    let wrapper = mount(
      <BoolValue
        label={labelMock}
        handleValueChange={handleValueChangeMock}
        attributeName={attributeNameMock}
      />
    );
    act(() => {
      let checkbox = wrapper.find(FormControlLabel);
      checkbox
        .prop("control")
        .props.onChange({ target: { checked: true }, labelMock });
    });

    wrapper.update();
    expect(handleValueChangeMock).toHaveBeenCalledTimes(1);
    expect(handleValueChangeMock.mock.calls[0][1]).toStrictEqual(labelMock);
  });
});
