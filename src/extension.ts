import * as vscode from "vscode";

const COPY_MARKDOWN_COMMAND = "md-copy.copyMarkdown";
const RAW_SOURCE_ELEMENT_ID = "mdp-raw-source";

interface MarkdownItToken {
  content: string;
}

interface MarkdownItState {
  src: string;
  tokens: MarkdownItToken[];
  Token: new (type: string, tag: string, nesting: number) => MarkdownItToken;
}

interface MarkdownIt {
  core: {
    ruler: {
      push(name: string, rule: (state: MarkdownItState) => void): void;
    };
  };
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(COPY_MARKDOWN_COMMAND, async (target) => {
      const doc = await resolveMarkdownDocument(target);
      if (!doc) {
        vscode.window.showWarningMessage("No markdown file found.");
        return;
      }

      await vscode.env.clipboard.writeText(doc.getText());
      vscode.window.showInformationMessage("Markdown copied.");
    })
  );

  return {
    extendMarkdownIt(md: MarkdownIt) {
      md.core.ruler.push("mdp_embed_source", (state) => {
        const encoded = encodeMarkdownSource(state.src);
        const token = new state.Token("html_block", "", 0);
        token.content = `<div id="${RAW_SOURCE_ELEMENT_ID}" data-source="${encoded}" style="display:none"></div>\n`;
        state.tokens.push(token);
      });

      return md;
    },
  };
}

function encodeMarkdownSource(source: string): string {
  return Buffer.from(source, "utf-8").toString("base64");
}

async function resolveMarkdownDocument(
  target: unknown
): Promise<vscode.TextDocument | undefined> {
  const uriDocument = await tryOpenMarkdownDocument(target);
  if (uriDocument) {
    return uriDocument;
  }

  const active = vscode.window.activeTextEditor;
  if (active && active.document.languageId === "markdown") {
    return active.document;
  }

  return (
    vscode.window.visibleTextEditors.find(
      (e) => e.document.languageId === "markdown"
    )?.document ??
    vscode.workspace.textDocuments.find(
      (d) => d.languageId === "markdown"
    )
  );
}

async function tryOpenMarkdownDocument(
  target: unknown
): Promise<vscode.TextDocument | undefined> {
  const uri = extractUri(target);
  if (!uri) {
    return undefined;
  }

  const openDocument = vscode.workspace.textDocuments.find(
    (document) => document.uri.toString() === uri.toString()
  );
  if (openDocument) {
    return openDocument.languageId === "markdown" ? openDocument : undefined;
  }

  const document = await vscode.workspace.openTextDocument(uri);
  return document.languageId === "markdown" ? document : undefined;
}

function extractUri(target: unknown): vscode.Uri | undefined {
  if (target instanceof vscode.Uri) {
    return target;
  }

  if (!target || typeof target !== "object") {
    return undefined;
  }

  const possibleUri = ["resourceUri", "resource", "uri"]
    .map((key) => (target as Record<string, unknown>)[key])
    .find((value): value is vscode.Uri => value instanceof vscode.Uri);

  return possibleUri;
}

export function deactivate() {}
