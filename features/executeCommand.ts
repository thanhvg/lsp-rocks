import {
  ClientCapabilities,
  ExecuteCommandParams,
  ExecuteCommandRegistrationOptions,
  ExecuteCommandRequest,
  RegistrationType,
} from "vscode-languageserver-protocol";
import { LanguageClient } from "../client";
import { RunnableDynamicFeature, ensure } from "./features";

export class ExecuteCommand extends RunnableDynamicFeature<
  ExecuteCommandParams,
  ExecuteCommandParams,
  Promise<any>,
  ExecuteCommandRegistrationOptions
> {
  constructor(private client: LanguageClient) {
    super();
  }

  public fillClientCapabilities(capabilities: ClientCapabilities): void {
    const codeActionSupport = ensure(
      ensure(capabilities, "workspace")!,
      "executeCommand",
    )!;
    codeActionSupport.dynamicRegistration = true;
  }

  public async runWith(params: ExecuteCommandParams): Promise<any> {
    return await this.client.sendRequest(ExecuteCommandRequest.type, params);
  }

  public get registrationType(): RegistrationType<ExecuteCommandRegistrationOptions> {
    return ExecuteCommandRequest.type;
  }
}
