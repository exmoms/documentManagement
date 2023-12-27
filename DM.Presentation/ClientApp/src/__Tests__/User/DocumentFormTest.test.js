import React from "react";
import ReactDom from "react-dom";
import DocumentForm from "../../components/User/DocumentForm";
import { cleanup } from "@testing-library/react";
import { mount } from "enzyme";
import Form from "react-jsonschema-form";
import { shallow } from "enzyme";
import { act } from "react-dom/test-utils";
afterEach(cleanup);
const Testschema = {
  component: "DocumentList",
  children: [
    {
      component: "Document",
      author: "Pete Hunt1",
      children: "Document 1",
    },
    {
      component: "Document",
      author: "Pete Huntf2",
      children: "Document 2",
    },
  ],
};

const TestUiSchema = {
  component: "DocumentList",
  children: [
    {
      component: "Document",
      author: "Pete Hunt1",
      children: "Document 1",
    },
    {
      component: "Document",
      author: "Pete Huntf2",
      children: "Document 2",
    },
  ],
};

const formData = [
  {
    component: "Document",
    author: "Pete Hunt1",
    children: "Document 1",
  },
  {
    component: "Document",
    author: "Pete Huntf2",
    children: "Document 2",
  },
];

describe("DocumentForm", () => {
  test("renders without crashing", () => {
    const div = document.createElement("div");
    const fillFormDataMock = jest.fn();
    ReactDom.render(
      <DocumentForm
        schema={Testschema}
        uiSchema={TestUiSchema}
        formData={formData}
        onSubmit={fillFormDataMock}
        id="fill-metadata-form"
      />,
      div
    );
  });

  it("matches the snapshot", () => {
    const fillFormDataMock = jest.fn();
    const wrapper = mount(
      <DocumentForm
        schema={Testschema}
        uiSchema={TestUiSchema}
        formData={formData}
        onSubmit={fillFormDataMock}
        id="fill-metadata-form"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  test("Form tests of Document Form", () => {
    const fillFormDataMock = jest.fn();
    const consoleMock = jest.fn();
    console.log.bind = consoleMock;
    const wrapper = shallow(
      <DocumentForm
        schema={Testschema}
        uiSchema={TestUiSchema}
        formData={formData}
        onSubmit={fillFormDataMock}
        id="fill-metadata-form"
      />
    );
    //test the props
    expect(wrapper.find(Form).props().schema).toBe(Testschema);
    expect(wrapper.find(Form).props().uiSchema).toBe(TestUiSchema);
    expect(wrapper.find(Form).props().formData).toBe(formData);
    expect(wrapper.find(Form).props().id).toBe("fill-metadata-form");
    //test onSubmit functionality
    act(() => {
      wrapper
        .find(Form)
        .props()
        .onSubmit({ target: { value: "" } });
    });
    wrapper.update();
    expect(fillFormDataMock).toHaveBeenCalledTimes(1);
     //test onError functionality
     act(() => {
      wrapper
        .find(Form)
        .props()
        .onError;
    });
    wrapper.update();
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock.mock.calls[0][0]).toBe(console);
    expect(consoleMock.mock.calls[0][1]).toBe("errors");

  });
});
