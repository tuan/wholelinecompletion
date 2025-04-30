// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { showSuggestions } from "./suggest";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const openDocs = new Set<vscode.Uri>();
  const currentActiveEditor = vscode.window.activeTextEditor?.document.uri;
  if (currentActiveEditor != null) {
    openDocs.add(currentActiveEditor);
  }

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor && !openDocs.has(editor.document.uri)) {
      openDocs.add(editor.document.uri);
    }
  });

  vscode.workspace.onDidCloseTextDocument((doc) => {
    if (openDocs.has(doc.uri)) {
      openDocs.delete(doc.uri);
    }
  });

  const disposable = vscode.commands.registerCommand(
    "wholelinecompletion.triggerSuggest",
    async () => {
      const textEditor = vscode.window.activeTextEditor;
      if (textEditor == null) {
        return;
      }

      console.log(openDocs);
      await showSuggestions(openDocs, textEditor);
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
