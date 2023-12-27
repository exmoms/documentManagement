import React from "react";
import ReactDom from "react-dom";
import Icon from "../../../../components/User/DocumentSet/Icon/index.js";
import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import { createMount } from '@material-ui/core/test-utils';
import { Container, Logo, Img, Name } from "../../../../components/User/DocumentSet/Icon/styles";
afterEach(cleanup);

describe("styles", () => {
    test("renders without crashing", () => {
        const div = document.createElement("div");
        ReactDom.render(<Container/>, div);
      });
      test("renders without crashing", () => {
        const div = document.createElement("div");
        ReactDom.render(<Logo/>, div);
      });
      test("renders without crashing", () => {
        const div = document.createElement("div");
        ReactDom.render(<Img/>, div);
      });
      test("renders without crashing", () => {
        const div = document.createElement("div");
        ReactDom.render(<Name/>, div);
      });
    test("styles matches snapshot", () => {
    const renderedValue = createMount()(
        <Container/>
      );
      expect(renderedValue.html()).toMatchSnapshot();
    });
    test("styles matches snapshot", () => {
        const renderedValue = createMount()(
            <Logo/>
          );
          expect(renderedValue.html()).toMatchSnapshot();
        });
        test("styles matches snapshot", () => {
            const renderedValue = createMount()(
                <Img/>
              );
              expect(renderedValue.html()).toMatchSnapshot();
            });
            test("styles matches snapshot", () => {
                const renderedValue = createMount()(
                    <Name/>
                  );
                  expect(renderedValue.html()).toMatchSnapshot();
                });
});