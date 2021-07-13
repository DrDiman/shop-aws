import { getProductsList } from "./getProductsList"
import { formatJSONResponse } from "@libs/apiGateway"
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
  formatJSONResponse: jest.fn((obj) => obj),
}))

describe("getProductsList", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return correct products list", async () => {
    const productList = await getProductsList()
    expect(productList).toEqual(mockList)
  })

  it("should call formatJSONResponse once with correct value", async () => {
    await getProductsList()
    expect(formatJSONResponse).nthCalledWith(1, mockList, 200)
  })

  it("should call formatJSONResponse once with correct value in case of error of getting list of products", async () => {
    const mockError = new Error("Something went wrong")
    getMockProductList.mockImplementationOnce(() => Promise.reject(mockError))
    await getProductsList()
    expect(formatJSONResponse).nthCalledWith(1, null, 500)
  })
})
