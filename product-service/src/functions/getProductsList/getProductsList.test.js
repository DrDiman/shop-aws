import { getProductsList } from "./getProductsList"
import { mockProductList } from "@functions/mockProductList.js"
import { formatJSONResponse } from "@libs/apiGateway"
import { middyfy } from "@libs/middleware"

jest.mock("@libs/middleware", () => ({
  middyfy: jest.fn((fn) => fn),
}))

jest.mock("@libs/apiGateway", () => ({
  formatJSONResponse: jest.fn((obj) => obj),
}))

describe("getProductsList", () => {
  it("should return correct products list", async () => {
    const productList = await getProductsList()
    expect(productList).toEqual(mockProductList)
  })

  it("should call formatJSONResponse once with correct value", async () => {
    await getProductsList()
    expect(formatJSONResponse).nthCalledWith(1, mockProductList)
  })
})
