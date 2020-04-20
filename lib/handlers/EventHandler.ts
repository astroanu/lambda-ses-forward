import { APIGatewayProxyResult } from "aws-lambda";
import { IEnvironmentProvider } from "../providers/EnvironmentProvider";

export interface IEventResult {
  result(): APIGatewayProxyResult;
}

export class EventResult implements IEventResult {
  result(): APIGatewayProxyResult {
    return {
      statusCode: this.statusCode,
      headers: this.headers,
      multiValueHeaders: {},
      body: this.isBase64Encoded
        ? this.body.toString()
        : JSON.stringify(this.body),
      isBase64Encoded: this.isBase64Encoded,
    };
  }

  constructor(
    public body: object | string,
    public statusCode = 200,
    public headers: { [key: string]: boolean | number | string } = {},
    public isBase64Encoded: boolean = false
  ) {}
}

export interface IEventHandler {
  handle(): Promise<IEventResult>;
}

export abstract class EventHandler {
  constructor(public environmentProvider: IEnvironmentProvider) {}
}
