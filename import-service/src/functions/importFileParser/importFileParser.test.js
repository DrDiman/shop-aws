import { v4 as uuidv4 } from "uuid"
import { importFileParser } from "./importFileParser"
import { successResponse, errorResponse } from "@libs/apiGateway"
import { s3 } from "@services/s3"
import { StatusCode } from "@enums/StatusCode"
import { Product } from "@models/Product"
import { queue } from "@services/queue"

const mockError = new Error("Something went wrong")

const mockProduct = new Product({
  id: uuidv4(),
  title: "iphone 8",
  description: "iPone 8",
  count: 42,
  price: 200,
})

const mockList = [mockProduct]

jest.mock("@services/s3", () => ({
  s3: {
    parseUploadedCsv: jest.fn(() => Promise.resolve(mockList)),
    moveToParsedFolder: jest.fn(() => Promise.resolve()),
    moveToInvalidFolder: jest.fn(() => Promise.resolve()),
  },
}))

jest.mock("@services/queue", () => ({
  queue: {
    sendMessage: jest.fn(() => Promise.resolve()),
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

  it("should call s3.parseUploadedCsv once with correct argument", async () => {
    const products = await importFileParser(mockEvent)
    expect(s3.parseUploadedCsv).nthCalledWith(1, mockEvent.Records)
  })

  it("should call queue.sendMessage with correct arguments", async () => {
    const products = await importFileParser(mockEvent)
    expect(queue.sendMessage).nthCalledWith(1, mockProduct)
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
    s3.parseUploadedCsv.mockImplementationOnce(() => Promise.reject(mockError))
    await importFileParser(mockEvent)
    expect(errorResponse).nthCalledWith(1)
  })

  it("should call errorResponse once with correct value in case of error of moving of the file to parsed folder", async () => {
    s3.moveToParsedFolder.mockImplementationOnce(() =>
      Promise.reject(mockError)
    )
    await importFileParser(mockEvent)
    expect(errorResponse).nthCalledWith(1)
  })

  it("should call queue.sendMessage in case of invalid parsed products", async () => {
    s3.parseUploadedCsv.mockImplementationOnce(() =>
      Promise.resolve([{ title: "blah" }])
    )
    await importFileParser(mockEvent)
    expect(queue.sendMessage).not.toHaveBeenCalled()
  })

  it("should call errorResponse once with correct value and s3.moveToInvalidFolder in case of invalid parsed products", async () => {
    s3.parseUploadedCsv.mockImplementationOnce(() =>
      Promise.resolve([{ title: "blah" }])
    )
    await importFileParser(mockEvent)
    expect(s3.moveToInvalidFolder).nthCalledWith(1, mockEvent.Records)
    expect(errorResponse).nthCalledWith(1, StatusCode.BAD_REQUEST)
  })
})
