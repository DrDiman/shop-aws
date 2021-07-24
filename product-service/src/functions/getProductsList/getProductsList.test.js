import { getProductsList } from "./getProductsList"
import { successResponse, errorResponse } from "@libs/apiGateway"
import { Product } from "@models/Product"
import { pgProducts } from "@services/pgProducts"

const mockProduct = new Product({
  id: "1",
  title: "iphone 8",
  description: "iPone 8",
  count: 42,
  price: 200,
})

const mockList = [mockProduct]

const mockError = new Error("mock error")

jest.mock("@services/pgProducts", () => ({
  pgProducts: {
    getAll: jest.fn(() => Promise.resolve(mockList)),
  },
}))


jest.mock("@libs/middleware", () => ({
  middyfy: jest.fn((fn) => fn),
}))

jest.mock("@libs/apiGateway", () => ({
  successResponse: jest.fn((obj) => obj),
  errorResponse: jest.fn((err) => err),
}))

describe("getProductsList", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should call successResponse once with correct value", async () => {
    await getProductsList()
    expect(successResponse).nthCalledWith(1, mockList)
  })

  it("should call errorResponse once with correct value in case of error of getting list of products", async () => {
    const mockError = new Error("Something went wrong")
    pgProducts.getAll.mockImplementationOnce(() => Promise.reject(mockError))
    await getProductsList()
    expect(errorResponse).nthCalledWith(1)
  })
})
