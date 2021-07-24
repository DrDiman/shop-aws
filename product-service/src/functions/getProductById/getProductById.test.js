import { getProductById } from "./getProductById"
import { successResponse, errorResponse } from "@libs/apiGateway"
import { getMockProductList } from "@functions/getMockProductList.js"

const mockList = [
  { id: "1", name: "iphone 8" },
  { id: "2", name: "iphone 12" },
]

jest.mock("@functions/getMockProductList.js", () => ({
  getMockProductList: jest.fn(() => Promise.resolve(mockList)),
}))

jest.mock("@libs/middleware", () => ({
  middyfy: jest.fn((fn) => fn),
}))

jest.mock("@libs/apiGateway", () => ({
  successResponse: jest.fn((obj) => obj),
}))

describe("getProductById", () => {
  const [firstProduct] = mockList
  const mockEvent = {
    pathParameters: {
      id: firstProduct.id,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return correct product", async () => {
    const product = await getProductById(mockEvent)
    expect(product).toEqual(firstProduct)
  })

  it("should call formatJSONResponse once with correct value in case of existing product", async () => {
    await getProductById(mockEvent)
    expect(successResponse).nthCalledWith(1, firstProduct, 200)
  })

  it("should call formatJSONResponse once with correct value in case of not existed product", async () => {
    const mockEvent = {
      pathParameters: {
        id: "blah",
      },
    }
    await getProductById(mockEvent)
    expect(formatJSONResponse).nthCalledWith(1, null, 404)
  })

  it("should call formatJSONResponse once with correct value in case of error of getting list of products", async () => {
    const mockError = new Error("Something went wrong")
    getMockProductList.mockImplementationOnce(() => Promise.reject(mockError))
    await getProductById(mockEvent)
    expect(formatJSONResponse).nthCalledWith(1, null, 500)
  })
})
