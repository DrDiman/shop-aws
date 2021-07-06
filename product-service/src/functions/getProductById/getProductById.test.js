import { getProductById } from "./getProductById"
import { mockProductList } from "@functions/mockProductList.js"
import { formatJSONResponse } from "@libs/apiGateway"
import { middyfy } from "@libs/middleware"

jest.mock("@libs/middleware", () => ({
  middyfy: jest.fn((fn) => fn),
}))

jest.mock("@libs/apiGateway", () => ({
  formatJSONResponse: jest.fn((obj) => obj),
}))

describe("getProductById", () => {
  const [ firstProduct ] = mockProductList
  const mockEvent = {
    pathParameters: {
      id: firstProduct.id
    }
  }

  it("should return correct product", async () => {
    const product = await getProductById(mockEvent)
    expect(product).toEqual(firstProduct)
  })

  it("should call formatJSONResponse once with correct value", async () => {
    await getProductById(mockEvent)
    expect(formatJSONResponse).nthCalledWith(1, firstProduct)
  })
})
