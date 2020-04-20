import { Context, Callback, SNSEvent } from "aws-lambda";
import { EventResult, EventHandler } from "./EventHandler";
import { IEnvironmentProvider } from "../providers/EnvironmentProvider";

export enum SESNotificationType {
  Received = "Received",
}

export type SESHeader = {
  name: string;
  value: string;
};

export type SESNotificationMessage = {
  notificationType: "Received";
  mail: {
    source: string;
    messageId: string;
    destination: Array<string>;
    headersTruncated: boolean;
    headers: Array<SESHeader>;
    commonHeaders: {
      returnPath: string;
      from: Array<string>;
      to: Array<string>;
      subject: string;
    };
  };
  receipt: object;
  content: string;
};

export type SESNotificationEvent = {
  Records: Array<SNSMessage>;
};

export type SNSMessage = {
  Sns: {
    Type: string;
    Message: string;
  };
};

export interface ISNSEventHandler {
  setEvent(event: SESNotificationEvent): void;
  getHandler(): Function;
  handle(event: SNSEvent): Promise<object>;
}

export abstract class SNSEventHandler extends EventHandler
  implements ISNSEventHandler {
  event: SESNotificationEvent;
  validationSchema: object = {};

  async handle(): Promise<object> {
    return new EventResult(
      {
        message: "empty handler",
      },
      501
    );
  }

  setEvent(event: SESNotificationEvent): void {
    this.event = event;
  }

  getHandler(): Function {
    return async (
      event: SESNotificationEvent,
      context: Context,
      callback: Callback
    ): Promise<object> => {
      this.setEvent(event);

      try {
        const result = await this.handle();

        return result;
      } catch (e) {
        console.trace(e);

        return {
          statusCode: e.statusCode,
          body: JSON.stringify(e),
        };
      }
    };
  }

  constructor(public environmentProvider: IEnvironmentProvider) {
    super(environmentProvider);
  }
}
