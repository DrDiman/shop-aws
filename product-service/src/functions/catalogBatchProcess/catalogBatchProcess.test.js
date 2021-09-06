import { v4 as uuidv4 } from "uuid"
import { catalogBatchProcess } from "./catalogBatchProcess"
import { successResponse, errorResponse } from "@libs/apiGateway"
import { Product } from "@models/Product"
import { pgProducts } from "@services/pgProducts"
import { notifier } from "@services/notifier"

const mockProduct1 = new Product({
  id: uuidv4(),
  title: "iphone 8",
  description: "iPone 8",
  count: 42,
  price: 200,
})

const mockProduct2 = new Product({
  id: uuidv4(),
  title: "nokia",
  description: "Nokia eee",
  count: 42,
  price: 11,
})

const mockProductList = [mockProduct1, mockProduct2]
const mockMessageAttributes = [{ blah: 1 }]

jest.mock("@services/pgProducts", () => ({
  pgProducts: {
    insertAll: jest.fn(() => Promise.resolve(mockProductList)),
  },
}))

jest.mock("@services/notifier", () => ({
  notifier: {
    getMessageAttributes: jest.fn(() => mockMessageAttributes),
    publish: jest.fn(() => Promise.resolve()),
  },
}))

jest.mock("@libs/middleware", () => ({
  middyfy: jest.fn((fn) => fn),
}))

jest.mock("@libs/apiGateway", () => ({
  successResponse: jest.fn((obj) => obj),
  errorResponse: jest.fn((err) => err),
}))

describe("catalogBatchProcess", () => {
  const mockEvent = {
    Records: [
      { body: JSON.stringify(mockProduct1) },
      { body: JSON.stringify(mockProduct2) },
    ],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should call pgProducts.insertAll once with correct argument", async () => {
    const products = await catalogBatchProcess(mockEvent)
    expect(pgProducts.insertAll).nthCalledWith(
      1,
      mockEvent.Records.map((r) => JSON.parse(r.body))
    )
  })

  it("should call notifier.getMessageAttributes once with correct argument", async () => {
    const products = await catalogBatchProcess(mockEvent)
    const message = mockProductList.map((p) => JSON.stringify(p)).join("\n")
    expect(notifier.getMessageAttributes).nthCalledWith(1, message)
  })

  it("should call notifier.publish once with correct argument", async () => {
    const products = await catalogBatchProcess(mockEvent)
    const message = mockProductList.map((p) => JSON.stringify(p)).join("\n")
    expect(notifier.publish).nthCalledWith(1, message, mockMessageAttributes)
  })

  it("should call successResponse once with correct value in case of existing product", async () => {
    await catalogBatchProcess(mockEvent)
    expect(successResponse).nthCalledWith(1, mockProductList)
  })

  it("should call errorResponse once with correct value in case of error of inserting  ist of products", async () => {
    const mockError = new Error("Something went wrong")
    pgProducts.insertAll.mockImplementationOnce(() => Promise.reject(mockError))
    await catalogBatchProcess(mockEvent)
    expect(errorResponse).nthCalledWith(1)
  })

  it("should call errorResponse once with correct value in case of error of publishing message", async () => {
    const mockError = new Error("Something went wrong")
    notifier.publish.mockImplementationOnce(() => Promise.reject(mockError))
    await catalogBatchProcess(mockEvent)
    expect(errorResponse).nthCalledWith(1)
  })
})
