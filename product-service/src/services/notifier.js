import SNS from "aws-sdk/clients/sns"

const MessageAttribute = {
  IPHONE: "iPhone",
  NOKIA: "nokia",
}

class NotifierService {
  constructor() {
    this.notifier = new SNS()
  }

  getMessageAttributes = (message) => {
    return message.includes(MessageAttribute.IPHONE)
      ? {
          title: {
            DataType: "String",
            StringValue: MessageAttribute.IPHONE,
          },
        }
      : {
          title: {
            DataType: "String",
            StringValue: MessageAttribute.NOKIA,
          },
        }
  }

  publish = async (Message, MessageAttributes) => {
    const publishResponse = await this.notifier
      .publish({
        Message,
        MessageAttributes,
        TopicArn: process.env.SNS_TOPIC_ARN,
      })
      .promise()
    return publishResponse
  }
}

const notifier = new NotifierService()

export { notifier }
