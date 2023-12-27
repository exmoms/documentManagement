import React from "react";
import ReactDom from "react-dom";
import { FOLDER, FILE } from "../../../../components/User/DocumentSet/utils/constants";
import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import { createMount } from '@material-ui/core/test-utils';
afterEach(cleanup);

describe("constants", () => {
    test("renders without crashing", () => {
        expect(FOLDER).toBe(1);
        expect(FILE).toBe(0);
      });

    });