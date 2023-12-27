import React from "react";
import ReactDom from "react-dom";
import NumberValue from "../../components/User/NumberValue";
import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import TextField from "@material-ui/core/TextField";
afterEach(cleanup);
test("NumberValue matches snapshot", () => {
  const component = renderer.create(<NumberValue />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

describe("NumberValue", () => {
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(<NumberValue></NumberValue>, div);
  });

  it("NumberValue Functionality ", () => {
    let labelMock = "Text Value";
    let handleValueChangeMock = jest.fn();
    let attributeNameMock = "attrib1";
    let wrapper = mount(
      <NumberValue
        label={labelMock}
        handleValueChange={handleValueChangeMock}
        attributeName={attributeNameMock}
      />
    );
    act(() => {
      wrapper
        .find(TextField)
        .at(0)
        .props()
        .onChange({ target: { value: 5 } });
    });

    wrapper.update();

    expect(handleValueChangeMock).toHaveBeenCalledTimes(1);
    expect(handleValueChangeMock.mock.calls[0][0]).toStrictEqual(5);
    expect(handleValueChangeMock.mock.calls[0][1]).toStrictEqual(labelMock);
  });
});
