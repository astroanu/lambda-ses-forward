import { Forwarder } from "./handlers/Forwarder";
import { EnvironmentProvider } from "../../lib/providers/EnvironmentProvider";

const handler = new Forwarder(new EnvironmentProvider()).getHandler();

export default handler;
