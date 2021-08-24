import S3 from "aws-sdk/clients/s3"
import csvParser from "csv-parser"
import { S3Folder } from "@enums/S3Folder"

class S3Service {
  constructor() {
    this.storage = new S3({
      region: process.env.AWS_REGION,
      signatureVersion: "v4",
    })
  }

  getPutSignedUrl = (fileName) => {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${S3Folder.UPLOADED}/${fileName}`,
    }

    return this.storage.getSignedUrlPromise("putObject", params)
  }

  // JUST LOGGER FOR EACH PRODUCT FOR NOW
  createProducts = (records) => {
    const promises = records.map((record) => {
      const params = {
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key,
      }

      const readStream = this.storage.getObject(params).createReadStream()

      const allRowsData = []
      return new Promise((resolve, reject) => {
        readStream
          .pipe(csvParser())
          .on("data", (row) => {
            console.log("row", row)
            allRowsData.push(row)
          })
          .on("end", () => {
            resolve(allRowsData)
          })
          .on("error", (error) => {
            reject(error)
          })
      })
    })

    return Promise.all(promises)
  }

  #deleteFromUploaded = async (record) => {
    const paramsToDelete = {
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key,
    }

    await this.storage.deleteObject(paramsToDelete).promise()
  }

  #copyToParsed = async (record) => {
    const params = {
      Bucket: record.s3.bucket.name,
      CopySource: encodeURI(`${record.s3.bucket.name}/${record.s3.object.key}`),
      Key: record.s3.object.key.replace(S3Folder.UPLOADED, S3Folder.PARSED),
    }

    await this.storage.copyObject(params).promise()
  }

  moveToParsedFolder = async (records) => {
    for await (const record of records) {
      await this.#copyToParsed(record)
      await this.#deleteFromUploaded(record)
    }
  }
}

const s3 = new S3Service()

export { s3 }
