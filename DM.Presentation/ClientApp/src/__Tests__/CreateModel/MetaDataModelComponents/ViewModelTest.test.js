import React from "react";
import ReactDom from "react-dom";
import ViewModel from "../../../components/CreateModel/MetaDataModelComponent/ViewModel.js";
import { cleanup } from "@testing-library/react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import { act } from "react-dom/test-utils";
import * as FetchDataMock from "../../../api/FetchData";
import ReviewModel from "../../../components/CreateModel/MetaDataModelComponent/ReviewModel";
import { getModelById } from "../../../api/FetchData";
afterEach(cleanup);
describe("ViewModel", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders without crashing", () => {
    let object = {
      metaDataModelId: 3,
      metaDataModelName: "Model A",
      documentClassId: 4,
      documentClassName: "Class A",
      metaDataAttributes: [
        {
          metaDataAttributeId: 1,
          metaDataAttributeName: "A bool",
          isRequired: true,
          dataTypeID: 1,
          dataTypeName: "bool",
        },
        {
          metaDataAttributeId: 2,
          metaDataAttributeName: "A int",
          isRequired: true,
          dataTypeID: 5,
          dataTypeName: "int",
        },
        {
          metaDataAttributeId: 3,
          metaDataAttributeName: "A decimal",
          isRequired: false,
          dataTypeID: 3,
          dataTypeName: "decimal",
        },
      ],
        aggregateMetaDataModelsParts: [{  metaDataModelName: "" }],
      compoundModels: [
        {
          compoundModelsId: 1,
          metadataModelId: 3,
          isRequired: true,
          caption: "attach name 1",
        },
        {
          compoundModelsId: 2,
          metadataModelId: 3,
          isRequired: false,
          caption: "attach name 2",
        },
      ],
      addedDate: "2020-02-25T15:55:42.34",
    };
    const mockSuccessResponse = object;
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const FetchMock = jest
      .spyOn(FetchDataMock, "fetchData")
      .mockImplementation(() => mockJsonPromise);
    const div = document.createElement("div");
    let idMock = 0;
    const handleCloseMock = jest.fn();
    let open = true;
    ReactDom.render(
      <ViewModel id={idMock} handleClose={handleCloseMock} open={open} />,
      div
    );
  });

  test("matches snapshot", () => {
    let object = {
      metaDataModelId: 3,
      metaDataModelName: "Model A",
      documentClassId: 4,
      documentClassName: "Class A",
      metaDataAttributes: [
        {
          metaDataAttributeId: 1,
          metaDataAttributeName: "A bool",
          isRequired: true,
          dataTypeID: 1,
          dataTypeName: "bool",
        },
        {
          metaDataAttributeId: 2,
          metaDataAttributeName: "A int",
          isRequired: true,
          dataTypeID: 5,
          dataTypeName: "int",
        },
        {
          metaDataAttributeId: 3,
          metaDataAttributeName: "A decimal",
          isRequired: false,
          dataTypeID: 3,
          dataTypeName: "decimal",
        },
      ],
        aggregateMetaDataModelsParts: [{ aggregateName: "agregated" }],
      compoundModels: [
        {
          compoundModelsId: 1,
          metadataModelId: 3,
          isRequired: true,
          caption: "attach name 1",
        },
        {
          compoundModelsId: 2,
          metadataModelId: 3,
          isRequired: false,
          caption: "attach name 2",
        },
      ],
      addedDate: "2020-02-25T15:55:42.34",
    };
    const mockSuccessResponse = object;
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const FetchMock = jest
      .spyOn(FetchDataMock, "fetchData")
      .mockImplementation(() => mockJsonPromise);
    const div = document.createElement("div");
    let idMock = 0;
    const handleCloseMock = jest.fn();
    let open = true;
    const wrapper = shallow(
      <ViewModel id={idMock} handleClose={handleCloseMock} open={open} />
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

    test("first render of ReviewModel", () => {
    let object = {
      metaDataModelId: 1,
      metaDataModelName: "Model A",
      documentClassId: 4,
      documentClassName: "Class A",
      metaDataAttributes: [
        {
              dataTypeID: 3,
              id: 3098,
              isRequired: true,
              metaDataAttributeName: "fdes",
        },
        {
            dataTypeID: 6,
            id: 3099,
            isRequired: true,
            metaDataAttributeName: "sdaa",
        }
      ],
        aggregateMetaDataModelsParts: [{
            aggregateName: "errrrr",
            childMetaDataModelId: 2024,
            childMetaDataModelName: "dsds",
            id: 3053,
            parentMetaDataModelId: 4076,
        }],
      compoundModels: [
        {
            caption: "wewq",
            id: 3055,
            isRequired: true,
            metadataModelId: 4076,
        },
        {
            caption: "dasdas",
            id: 3056,
            isRequired: false,
            metadataModelId: 4076,
        }
      ],
      addedDate: "2020-02-25T15:55:42.34",
    };
    const mockSuccessResponse = object;
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const fetchMock = jest
      .spyOn(FetchDataMock, "fetchData") 
      .mockImplementation(() => mockJsonPromise);
      let idMock = -1;
    const handleCloseMock = jest.fn();
    let wrapper;
    return mockJsonPromise.then(() => {
       wrapper = mount(
        <ViewModel id={idMock} handleClose={handleCloseMock} open={open} />
      );
    }).then(() => {
      wrapper.render();
      wrapper.update(); 
      expect(wrapper.find(ReviewModel).props().value.metaDataModelName).toBe(
      ""
    );
    expect(wrapper.find(ReviewModel).props().value.documentClassSelected).toStrictEqual(
      {"documentClassName": ""}
        ); 
        expect(wrapper.find(ReviewModel).props().value.isCompound).toBeFalsy();
    expect(wrapper.find(ReviewModel).props().value.isAggregated).toBeFalsy();
    expect(
      wrapper.find(ReviewModel).props().value.aggregateMetaDataModelsParts
    ).toStrictEqual([{ "aggregateName": ""  }]);
    expect(wrapper.find(ReviewModel).props().value.compoundModels).toStrictEqual([
        {
            isRequired: false,
            caption: ""
        }
    ]);
    expect(wrapper.find(ReviewModel).props().value.metaDataAttribute).toStrictEqual([
      {
        isRequired: false,
        dataTypeID: "",
        metaDataAttributeName: "",
      },
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(0);
    });
    
    
  });

    test("Get Model by id", () => {
        let object = {
            id: 4076,
            metaDataModelName: "rytr",
            documentClassId: 1002,
            documentClassName: "Doc_class_3",
            addedDate: "0001-01-01T00:00:00",
            userId: 1,
            metaDataAttributes: [
                {
                    id: 3098,
                    metaDataAttributeName: "fdes",
                    isRequired: true,
                    dataTypeID: 3
                },
                {
                    id: 3099,
                    metaDataAttributeName: "sdaa",
                    isRequired: true,
                    dataTypeID: 6
                },
                {
                    id: 3100,
                    metaDataAttributeName: "cvxxx",
                    isRequired: false,
                    dataTypeID: 6
                }
            ],
            childMetaDataModels: [
                {
                    id: 3053,
                    childMetaDataModelId: 2024,
                    parentMetaDataModelId: 4076,
                    aggregateName: "errrrr",
                    childMetaDataModelName: "dsds"
                },
                {
                    id: 3054,
                    childMetaDataModelId: 2026,
                    parentMetaDataModelId: 4076,
                    aggregateName: "rreeee",
                    childMetaDataModelName: "Model 21"
                },
                {
                    id: 3055,
                    childMetaDataModelId: 3035,
                    parentMetaDataModelId: 4076,
                    aggregateName: "wwweee",
                    childMetaDataModelName: "sdsds"
                }
            ],
            compoundModels: [
                {
                    id: 3055,
                    metadataModelId: 4076,
                    isRequired: true,
                    caption: "wewq"
                },
                {
                    id: 3056,
                    metadataModelId: 4076,
                    isRequired: false,
                    caption: "dasdas"
                },
                {
                    id: 3057,
                    metadataModelId: 4076,
                    isRequired: false,
                    caption: "cvxdd"
                }
            ]
        };
        const mockSuccessResponse = object;
        const mockJsonPromise = Promise.resolve(mockSuccessResponse);
        const FetchMock = jest
            .spyOn(FetchDataMock, "fetchData")
            .mockImplementation(() => mockJsonPromise);
        let idMock = 4075;
        const handleCloseMock = jest.fn();
        let wrapper;
        return mockJsonPromise.then(() => {
            wrapper = mount(
                <ViewModel id={idMock} handleClose={handleCloseMock} open={open} />
            );
        }).then(() => {
            wrapper.render();
            wrapper.update();
            //expect the side effects  
            expect(FetchMock).toHaveBeenCalledTimes(1);
            expect(FetchMock.mock.calls[0][0]).toBe('/api/MetaDataModel/'+idMock);
            expect(wrapper.find(ReviewModel).props().value.metaDataModelName).toBe(
                "rytr"
            );
            expect(wrapper.find(ReviewModel).props().value.documentClassSelected).toStrictEqual(
                { "documentClassName": "Doc_class_3" }
            );
            expect(wrapper.find(ReviewModel).props().value.isCompound).toBeTruthy();
            expect(wrapper.find(ReviewModel).props().value.isAggregated).toBeTruthy();
            expect(
                wrapper.find(ReviewModel).props().value.aggregateMetaDataModelsParts
            ).toStrictEqual([
                { 
                aggregateName: "errrrr",
                childMetaDataModelId: 2024,
                childMetaDataModelName: "dsds",
                id: 3053,
                parentMetaDataModelId: 4076,
                },
                {
                    aggregateName: "rreeee",
                    childMetaDataModelId: 2026,
                    childMetaDataModelName: "Model 21",
                    id: 3054,
                    parentMetaDataModelId: 4076,
                },
                {
                    aggregateName: "wwweee",
                    childMetaDataModelId: 3035,
                    childMetaDataModelName: "sdsds",
                    id: 3055,
                    parentMetaDataModelId: 4076,
                }
            ]);
            expect(wrapper.find(ReviewModel).props().value.compoundModels).toStrictEqual([
                {
                    caption: "wewq",
                    id: 3055,
                    isRequired: true,
                    metadataModelId: 4076,
                },
                {
                    caption: "dasdas",
                    id: 3056,
                    isRequired: false,
                    metadataModelId: 4076,
                },
                {
                    caption: "cvxdd",
                    id: 3057,
                    isRequired: false,
                    metadataModelId: 4076,

                }
            ]);
            expect(wrapper.find(ReviewModel).props().value.metaDataAttribute).toStrictEqual([
                {
                    id: 3098,
                    metaDataAttributeName: "fdes",
                    isRequired: true,
                    dataTypeID: 3
                },
                {
                    id: 3099,
                    metaDataAttributeName: "sdaa",
                    isRequired: true,
                    dataTypeID: 6
                },
                {
                    id: 3100,
                    metaDataAttributeName: "cvxxx",
                    isRequired: false,
                    dataTypeID: 6
                }
            ]);
        });


    });
});

