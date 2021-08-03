import { getProductById } from "./getProductById"
import { successResponse, errorResponse } from "@libs/apiGateway"
import { Product } from "@models/Product"
import { pgProducts } from "@services/pgProducts"
import { StatusCode } from "@enums/StatusCode"

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
    getById: jest.fn((id) =>
      mockList.find((p) => p.id === id)
        ? Promise.resolve(mockProduct)
        : Promise.reject(mockError)
    ),
  },
}))

jest.mock("@libs/middleware", () => ({
  middyfy: jest.fn((fn) => fn),
}))

jest.mock("@libs/apiGateway", () => ({
  successResponse: jest.fn((obj) => obj),
  errorResponse: jest.fn((err) => err),
}))

describe("getProductById", () => {
  const mockEvent = {
    pathParameters: {
      id: mockProduct.id,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should call pgProducts.getById once with correct argument", async () => {
    const product = await getProductById(mockEvent)
    expect(pgProducts.getById).nthCalledWith(1, mockEvent.pathParameters.id)
  })

  it("should call successResponse once with correct value in case of existing product", async () => {
    await getProductById(mockEvent)
    expect(successResponse).nthCalledWith(1, mockProduct)
  })

  it("should call errorResponse once with correct value in case of not existed product", async () => {
    pgProducts.getById.mockImplementationOnce(() => null)
    const mockEvent = {
      pathParameters: {
        id: "blah",
      },
    }
    await getProductById(mockEvent)
    expect(errorResponse).nthCalledWith(1, StatusCode.NOT_FOUND)
  })

  it("should call errorResponse once with correct value in case of error of getting list of products", async () => {
    const mockError = new Error("Something went wrong")
    pgProducts.getById.mockImplementationOnce(() => Promise.reject(mockError))
    await getProductById(mockEvent)
    expect(errorResponse).nthCalledWith(1)
  })
})
