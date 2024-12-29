import { ClientCapabilities, DocumentHighlight, DocumentHighlightParams, DocumentHighlightRegistrationOptions, DocumentHighlightRequest, RegistrationType } from "vscode-languageserver-protocol";
import { LanguageClient } from "../client";
import { RunnableDynamicFeature, ensure } from "./features";

export class DocumentHighLight extends RunnableDynamicFeature<DocumentHighlightParams, DocumentHighlightParams, Promise<DocumentHighlight[] | null>, DocumentHighlightRegistrationOptions> {

  constructor(private client: LanguageClient) {
    super();
  }

  public fillClientCapabilities(capabilities: ClientCapabilities): void {
    const documentHighlightSupport = (ensure(ensure(capabilities, 'textDocument')!, 'documentHighlight')!);
    documentHighlightSupport.dynamicRegistration = true;
  }

  public async runWith(params: DocumentHighlightParams): Promise<DocumentHighlight[] | null> {
    return await this.client.sendRequest(DocumentHighlightRequest.type, params);
  }

  public get registrationType(): RegistrationType<DocumentHighlightRegistrationOptions> {
    return DocumentHighlightRequest.type;
  }

}
