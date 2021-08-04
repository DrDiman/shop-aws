import { importProductsFile } from "./importProductsFile"
import { successResponse, errorResponse } from "@libs/apiGateway"
import { s3 } from "@services/s3"

const mockSignedUrl = "mockSignedUrl"

const mockFileName = "mockFileName"

const mockError = new Error("Something went wrong")

jest.mock("@services/s3", () => ({
  s3: {
    getPutSignedUrl: jest.fn((id) => Promise.resolve(mockSignedUrl)),
  },
}))

jest.mock("@libs/middleware", () => ({
  middyfy: jest.fn((fn) => fn),
}))

jest.mock("@libs/apiGateway", () => ({
  successResponse: jest.fn((obj) => obj),
  errorResponse: jest.fn((err) => err),
}))

describe("importProductsFile", () => {
  const mockEvent = {
    queryStringParameters: {
      name: mockFileName,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should call s3.getPutSignedUrl once with correct argument", async () => {
    const url = await importProductsFile(mockEvent)
    expect(s3.getPutSignedUrl).nthCalledWith(1, mockFileName)
  })

  it("should call successResponse once with correct value in case of existing product", async () => {
    const url = await importProductsFile(mockEvent)
    expect(successResponse).nthCalledWith(1, mockSignedUrl)
  })

  it("should call errorResponse once with correct value in case of error of getting url", async () => {
    s3.getPutSignedUrl.mockImplementationOnce(() => Promise.reject(mockError))
    await importProductsFile(mockEvent)
    expect(errorResponse).nthCalledWith(1)
  })
})
