export interface IEmailProvider {
  sendRaw(options: sendRawConfiguration): Promise<string>;
  send(options: sendConfiguration): Promise<string>;
}

export type sendConfiguration = {
  returnPath: string;
  destination: {
    to: Array<string>;
    bcc?: Array<string>;
    cc?: Array<string>;
  };
  message: {
    body: {
      html?: string;
      text?: string;
    };
    subject: string;
    from: string;
  };
};

export type sendRawConfiguration = {
  fromArn: string;
  destination: Array<string>;
  rawMessage: string;
};
