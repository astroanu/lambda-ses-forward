import {
  IEmailProvider,
  sendConfiguration,
  sendRawConfiguration,
} from "../EmailProvider";
import { SES } from "aws-sdk";

export class SESServiceProvider implements IEmailProvider {
  private ses: SES;

  async sendRaw(options: sendRawConfiguration) {
    const config: SES.Types.SendRawEmailRequest = {
      FromArn: options.fromArn,
      Destinations: options.destination,
      RawMessage: {
        Data: Buffer.from(options.rawMessage),
      },
    };

    console.log("config", config);

    return this.ses
      .sendRawEmail(config)
      .promise()
      .then(
        (data) => {
          return data;
        },
        (err) => {
          return err;
        }
      );
  }

  async send(options: sendConfiguration): Promise<string> {
    const config: SES.Types.SendEmailRequest = {
      ReturnPath: options.returnPath,
      Destination: {
        BccAddresses: options.destination.bcc ? options.destination.bcc : [],
        CcAddresses: options.destination.cc ? options.destination.cc : [],
        ToAddresses: options.destination.to ? options.destination.to : [],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: options.message.body.html,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: options.message.subject,
        },
      },
      Source: options.message.from,
    };

    console.log("config", config);

    return this.ses
      .sendEmail(config)
      .promise()
      .then(
        (data) => {
          return data;
        },
        (err) => {
          return err;
        }
      );
  }

  constructor() {
    this.ses = new SES({
      region: "us-east-1",
    });
  }
}
