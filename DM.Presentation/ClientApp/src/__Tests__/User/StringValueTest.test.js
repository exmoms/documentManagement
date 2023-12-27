import React from "react";
import ReactDom from "react-dom";
import StringValue from "../../components/User/StringValue";
import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import TextField from "@material-ui/core/TextField";
afterEach(cleanup);
test("StringValue matches snapshot", () => {
  const component = renderer.create(<StringValue />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

describe("StringValue", () => {
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDom.render(<StringValue></StringValue>, div);
  });

  it("StringValue Functionality ", () => {
    let labelMock = "Text Value";
    let handleValueChangeMock = jest.fn();
    let attributeNameMock = "attrib1";
    let wrapper = mount(
      <StringValue
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
        .onChange({ target: { value: "test2" } });
    });

    wrapper.update();

    expect(handleValueChangeMock).toHaveBeenCalledTimes(1);
    expect(handleValueChangeMock.mock.calls[0][0]).toStrictEqual("test2");
    expect(handleValueChangeMock.mock.calls[0][1]).toStrictEqual(labelMock);
  });
});
