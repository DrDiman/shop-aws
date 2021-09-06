import SQS from "aws-sdk/clients/sqs"

class QueueService {
  constructor() {
    this.queue = new SQS()
  }

  sendMessage = async (data) => {
    const sentMessageResult = await this.queue
      .sendMessage({
        QueueUrl: process.env.SQS_ENDPOINT,
        MessageBody: JSON.stringify(data),
      })
      .promise()

    return sentMessageResult
  }
}

const queue = new QueueService()

export { queue }
