import { main } from "./handler"
import { mockProductList } from "../mockProductList.js"

// const mocked = uuidv4 as jest.Mocked<typeof uuidv4>;

jest.mock("@libs/lambda", () => ({
  middyfy: jest.fn((fn) => fn),
}))

// const mocked = middyfy as jest.Mocked<typeof uuidv4>

describe("getProductsList", () => {
  it("should return correct products list", async () => {
    const event = {}
    const context = {}
    const cb = () => {}
    const productList = await main(event, context, cb)
    expect(productList).toEqual(mockProductList)
  })
})
