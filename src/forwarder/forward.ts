import { Forwarder } from "./handlers/Forwarder";
import { EnvironmentProvider } from "../../lib/providers/EnvironmentProvider";
import { SESServiceProvider } from "../../lib/providers/infrastructure/SESServiceProvider";

const handler = new Forwarder(
  new EnvironmentProvider(),
  new SESServiceProvider()
).getHandler();

export default handler;
