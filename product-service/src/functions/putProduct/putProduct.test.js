import { v4 as uuidv4 } from "uuid"
import { ValidationError } from "yup"
import { putProduct } from "./putProduct"
import { successResponse, errorResponse } from "@libs/apiGateway"
import { Product } from "@models/Product"
import { pgProducts } from "@services/pgProducts"
import { StatusCode } from "@enums/StatusCode"

const mockProduct1 = new Product({
  id: uuidv4(),
  title: "iphone 8",
  description: "iPone 8",
  count: 42,
  price: 200,
})

const mockProduct2 = new Product({
  id: uuidv4(),
  title: "iphone 10",
  description: "iPone 10",
  count: 42,
  price: 200,
})

const mockProductWithoutId = new Product({
  title: "iphone 10",
  description: "iPone 10",
  count: 42,
  price: 200,
})

const mockError = new Error("mock error")

jest.mock("@services/pgProducts", () => ({
  pgProducts: {
    updateById: jest.fn((product, id) => Promise.resolve(mockProduct1)),
    put: jest.fn((product) => Promise.resolve(mockProduct2)),
  },
}))

jest.mock("@libs/middleware", () => ({
  middyfy: jest.fn((fn) => fn),
}))

jest.mock("@libs/apiGateway", () => ({
  successResponse: jest.fn((obj) => obj),
  errorResponse: jest.fn((err) => err),
}))

Product.schema.validate = jest.fn((product) => Promise.resolve(product))

describe("putProduct", () => {
  const mockEvent = {
    body: mockProduct1,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should call Product.schema.validate once with correct argument", async () => {
    const product = await putProduct(mockEvent)
    expect(Product.schema.validate).nthCalledWith(1, mockEvent.body)
  })

  it("should call pgProducts.updateById once with correct arguments", async () => {
    const product = await putProduct(mockEvent)
    expect(pgProducts.updateById).nthCalledWith(
      1,
      mockEvent.body,
      mockEvent.body.id
    )
  })

  it("should call successResponse once with correct value", async () => {
    const product = await putProduct(mockEvent)
    expect(successResponse).nthCalledWith(1, mockEvent.body)
  })

  it("should call pgProducts.put once with correct arguments", async () => {
    const mockEvent = {
      body: mockProductWithoutId,
    }
    const product = await putProduct(mockEvent)
    expect(pgProducts.put).nthCalledWith(1, mockEvent.body)
  })

  it("should call successResponse once with correct value", async () => {
    const mockEvent = {
      body: mockProductWithoutId,
    }
    const product = await putProduct(mockEvent)
    expect(successResponse).nthCalledWith(1, mockProduct2)
  })

  it("should call errorResponse once with correct value in case of error of getting list of products", async () => {
    Product.schema.validate.mockImplementationOnce(() =>
      Promise.reject(new ValidationError("schema validation Error"))
    )
    await putProduct(mockEvent)
    expect(errorResponse).nthCalledWith(1, StatusCode.BAD_REQUEST)
  })

  it("should call errorResponse once with correct value in case of error of getting list of products", async () => {
    pgProducts.updateById.mockImplementationOnce(() =>
      Promise.reject(mockError)
    )

    await putProduct(mockEvent)
    expect(errorResponse).nthCalledWith(1)
  })
})
