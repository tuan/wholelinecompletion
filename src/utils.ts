import * as vscode from "vscode";

export function getCurrentPosition(
  textEditor: vscode.TextEditor
): vscode.Position {
  return textEditor.selection.active;
}

export function getCurrentLine(textEditor: vscode.TextEditor): string {
  const range = getCurrentLineRange(textEditor);
  return textEditor.document.getText(range);
}

export function getCurrentLineRange(
  textEditor: vscode.TextEditor
): vscode.Range {
  const currentPosition = getCurrentPosition(textEditor);
  return textEditor.document.lineAt(currentPosition).range;
}
