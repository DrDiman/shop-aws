import S3 from "aws-sdk/clients/s3"
import csvParser from "csv-parser"
import { S3Folder } from "@enums/S3Folder"

console.log(`process.env`, process.env)

const valueMapper = {
  price: (value) => !console.log(`price value`, value) && +value,
  count: (value) => !console.log(`count value`, value) && +value,
}

class s3Service {
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

  parseUploadedCsv = async (records) => {
    const promises = records.map((record) => {
      const params = {
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key,
      }

      const readStream = this.storage.getObject(params).createReadStream()

      const allRowsData = []
      return new Promise((resolve, reject) => {
        readStream
          .pipe(
            csvParser({
              mapHeaders: ({ header }) =>
                !console.log(`header`, header) && header.toLowerCase(),
              mapValues: ({ header, index, value }) =>
                valueMapper[header]?.(value) ?? value,
            })
          )
          .on("data", (row) => {
            console.log("row", row)
            allRowsData.push(row)
          })
          .on("end", () => {
            resolve(allRowsData)
          })
          .on("error", (error) => {
            console.log(`error in readable stream`, error)
            reject(error)
          })
      })
    })
    const data = await Promise.all(promises)

    return data.flat()
  }

  #deleteFromUploaded = async (record) => {
    const paramsToDelete = {
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key,
    }

    await this.storage.deleteObject(paramsToDelete).promise()
  }

  #copyToFolder = async (record, folder) => {
    const params = {
      Bucket: record.s3.bucket.name,
      CopySource: encodeURI(`${record.s3.bucket.name}/${record.s3.object.key}`),
      Key: record.s3.object.key.replace(S3Folder.UPLOADED, folder),
    }

    await this.storage.copyObject(params).promise()
  }

  moveToInvalidFolder = async (records) => {
    for await (const record of records) {
      await this.#copyToFolder(record, S3Folder.INVALID)
      await this.#deleteFromUploaded(record)
    }
  }

  moveToParsedFolder = async (records) => {
    for await (const record of records) {
      await this.#copyToFolder(record, S3Folder.PARSED)
      await this.#deleteFromUploaded(record)
    }
  }
}

const s3 = new s3Service()

export { s3 }
