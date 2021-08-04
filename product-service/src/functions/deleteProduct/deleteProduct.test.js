import { v4 as uuidv4 } from "uuid"
import { deleteProduct } from "./deleteProduct"
import { successResponse, errorResponse } from "@libs/apiGateway"
import { Product } from "@models/Product"
import { pgProducts } from "@services/pgProducts"

const mockProduct = new Product({
  id: uuidv4(),
  title: "iphone 8",
  description: "iPone 8",
  count: 42,
  price: 200,
})

jest.mock("@services/pgProducts", () => ({
  pgProducts: {
    deleteById: jest.fn(() => Promise.resolve(mockProduct)),
  },
}))

jest.mock("@libs/middleware", () => ({
  middyfy: jest.fn((fn) => fn),
}))

jest.mock("@libs/apiGateway", () => ({
  successResponse: jest.fn((obj) => obj),
  errorResponse: jest.fn((err) => err),
}))

describe("deleteProduct", () => {
  const mockEvent = {
    pathParameters: {
      id: mockProduct.id,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should call pgProducts.deleteById once with correct argument", async () => {
    const product = await deleteProduct(mockEvent)
    expect(pgProducts.deleteById).nthCalledWith(1, mockEvent.pathParameters.id)
  })

  it("should call successResponse once with correct value in case of existing product", async () => {
    await deleteProduct(mockEvent)
    expect(successResponse).nthCalledWith(1, mockProduct)
  })

  it("should call errorResponse once with correct value in case of error of getting list of products", async () => {
    const mockError = new Error("Something went wrong")
    pgProducts.deleteById.mockImplementationOnce(() =>
      Promise.reject(mockError)
    )
    await deleteProduct(mockEvent)
    expect(errorResponse).nthCalledWith(1)
  })
})
