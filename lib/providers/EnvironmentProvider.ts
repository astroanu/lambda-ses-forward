export interface IEnvironmentProvider {
  getValue(key: string): string;
  getEnvObject(): object;
}

export class EnvironmentProvider implements IEnvironmentProvider {
  env: object;

  getEnvObject(): any {
    return this.env;
  }

  getValue(key: string): string {
    if (this.getEnvObject()[key]) {
      return this.getEnvObject()[key];
    }

    console.log(`tried to retrieve variable ${key} from env, but failed`);

    return null;
  }

  constructor() {
    this.env = process.env;
  }
}
