import { SNSEvent, Context, Callback, SNSHandler } from "aws-lambda";
import { IEnvironmentProvider } from "../../../lib/providers/EnvironmentProvider";

export class Forwarder {
  private event: SNSEvent;

  async handle(): Promise<boolean> {
    this.event.Records.forEach((record) => {
      console.log(record.Sns.Message);
    });

    return true;
  }

  getHandler(): Function {
    return async (
      event: SNSEvent,
      context: Context,
      callback: Callback
    ): Promise<boolean> => {
      try {
        this.event = event;

        return await this.handle();
      } catch (e) {
        console.trace(e);
        return false;
      }
    };
  }

  constructor(private environment: IEnvironmentProvider) {}
}
