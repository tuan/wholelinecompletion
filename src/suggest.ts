import * as vscode from "vscode";
import { getCurrentLine, getCurrentLineRange } from "./utils";

export async function showSuggestions(
  openDocs: Set<vscode.Uri>,
  textEditor: vscode.TextEditor
): Promise<string | undefined> {
  const currentLine = getCurrentLine(textEditor);
  const trimmedLine = currentLine.trim();

  const currentLineRange = getCurrentLineRange(textEditor);
  if (trimmedLine.length < 3) {
    return undefined;
  }

  const result = new Set<vscode.QuickPickItem>();
  const regex = new RegExp(`${trimmedLine}`, "i");
  const lines = new Set<string>();
  for (const docUri of openDocs) {
    const content = await vscode.workspace.openTextDocument(docUri);
    content
      .getText()
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && line.match(regex) !== null)
      .forEach((line) => {
        lines.add(line);
      });
  }

  lines.forEach((line) => {
    result.add({ label: line });
  });

  if (result.size === 0) {
    return undefined;
  }

  const picked = await vscode.window.showQuickPick([...result], {
    matchOnDescription: true,
  });
  if (picked == null) {
    return;
  }

  const trimmedStart = currentLine.indexOf(trimmedLine);
  const replacementStart = currentLineRange.start.translate(0, trimmedStart);
  const replacementEnd = replacementStart.translate(0, trimmedLine.length);
  const replacementRange = new vscode.Range(replacementStart, replacementEnd);
  textEditor.edit((builder) => builder.replace(replacementRange, picked.label));

  // Move cursor to end of replaced line
  const newPosition = replacementStart.translate(0, picked.label.length);
  textEditor.selection = new vscode.Selection(newPosition, newPosition);
}
