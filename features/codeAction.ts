import { ClientCapabilities, CodeAction, CodeActionParams, CodeActionRegistrationOptions, CodeActionRequest, Command, RegistrationType } from "vscode-languageserver-protocol";
import { LanguageClient } from "../client";
import { RunnableDynamicFeature, ensure } from "./features";

export class CodeActionFeature extends RunnableDynamicFeature<CodeActionParams, CodeActionParams, Promise<(Command | CodeAction)[] | null>, CodeActionRegistrationOptions> {

  constructor(private client: LanguageClient) {
    super();
  }

  public fillClientCapabilities(capabilities: ClientCapabilities): void {
    const codeActionSupport = (ensure(ensure(capabilities, 'textDocument')!, 'codeAction')!);
    codeActionSupport.dynamicRegistration = true;
  }

  public async runWith(params: CodeActionParams): Promise<(Command | CodeAction)[] | null> {
    return await this.client.sendRequest(CodeActionRequest.type, params);
  }

  public get registrationType(): RegistrationType<CodeActionRegistrationOptions> {
    return CodeActionRequest.type;
  }

}
