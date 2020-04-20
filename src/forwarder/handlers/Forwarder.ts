import { IEnvironmentProvider } from "../../../lib/providers/EnvironmentProvider";
import { IEmailProvider } from "../../../lib/providers/EmailProvider";
import {
  SNSEventHandler,
  SESNotificationMessage,
} from "../../../lib/handlers/SNSEventHandler";
import { map } from "../../../map";
export class Forwarder extends SNSEventHandler {
  async handle(): Promise<object> {
    console.log(map);

    const queue = this.event.Records.map((record) => {
      console.log(record);

      const message: SESNotificationMessage = JSON.parse(record.Sns.Message);

      const toEmail = this.getToEmails(message.mail.destination[0]);
      const fromEmail = this.getToEmails("*");

      return this.emailProvider.send({
        returnPath: fromEmail[0],
        destination: {
          to: toEmail,
        },
        message: {
          body: {
            html: message.content,
          },
          subject: message.mail.commonHeaders.subject,
          from: fromEmail[0],
        },
      });
    });

    console.log("result", await Promise.all(queue));

    return {
      message: "ok",
    };
  }

  getToEmails(fromEmail: string): Array<string> {
    if (map[fromEmail]) {
      return map[fromEmail];
    } else {
      return map["*"];
    }
  }

  constructor(
    private environment: IEnvironmentProvider,
    private emailProvider: IEmailProvider
  ) {
    super(environment);
  }
}
