import { importFileParser } from "./importFileParser"
import { successResponse, errorResponse } from "@libs/apiGateway"
import { s3 } from "@services/s3"
import { StatusCode } from "@enums/StatusCode"
import { Product } from "@models/Product"

const mockError = new Error("Something went wrong")

const mockProduct = new Product({
  id: "1",
  title: "iphone 8",
  description: "iPone 8",
  count: 42,
  price: 200,
})

const mockList = [mockProduct]

jest.mock("@services/s3", () => ({
  s3: {
    createProducts: jest.fn(() => Promise.resolve(mockList)),
    moveToParsedFolder: jest.fn(() => Promise.resolve()),
  },
}))

jest.mock("@libs/middleware", () => ({
  middyfy: jest.fn((fn) => fn),
}))

jest.mock("@libs/apiGateway", () => ({
  successResponse: jest.fn((obj) => obj),
  errorResponse: jest.fn((err) => err),
}))

describe("importFileParser", () => {
  const mockEvent = {
    Records: [{ s3: { key: "test.json" } }],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should call s3.createProducts once with correct argument", async () => {
    const products = await importFileParser(mockEvent)
    expect(s3.createProducts).nthCalledWith(1, mockEvent.Records)
  })

  it("should call s3.moveToParsedFolder once with correct argument", async () => {
    const products = await importFileParser(mockEvent)
    expect(s3.moveToParsedFolder).nthCalledWith(1, mockEvent.Records)
  })

  it("should call successResponse once with correct value in case of creation of the products", async () => {
    const products = await importFileParser(mockEvent)
    expect(successResponse).nthCalledWith(1, mockList, StatusCode.CREATED)
  })

  it("should call errorResponse once with correct value in case of error of creation of the products", async () => {
    s3.createProducts.mockImplementationOnce(() => Promise.reject(mockError))
    await importFileParser(mockEvent)
    expect(errorResponse).nthCalledWith(1)
  })

  it("should call errorResponse once with correct value in case of error of moving of the file to parsed folder", async () => {
    s3.moveToParsedFolder.mockImplementationOnce(() => Promise.reject(mockError))
    await importFileParser(mockEvent)
    expect(errorResponse).nthCalledWith(1)
  })
})
