import * as vscode from "vscode";
import { getCurrentWord, getCurrentWordRange } from "./utils";

export async function showSuggestions(
  openDocs: Set<vscode.Uri>,
  textEditor: vscode.TextEditor
): Promise<string | undefined> {
  const currentWord = getCurrentWord(textEditor);

  const currentWordRange = getCurrentWordRange(textEditor);
  if (currentWordRange == null || currentWord.length < 3) {
    return undefined;
  }

  const result = new Set<vscode.QuickPickItem>();
  const regex = new RegExp(`${currentWord}`, "i");
  const lines = new Set<string>();
  for (const docUri of openDocs) {
    const content = await vscode.workspace.openTextDocument(docUri);
    content
      .getText()
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && line.match(regex) != null)
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

  textEditor.edit((builder) =>
    builder.replace(currentWordRange!, picked.label)
  );

  // Move cursor to end of replaced word
  const newPosition = currentWordRange!.start.translate(0, picked.label.length);
  textEditor.selection = new vscode.Selection(newPosition, newPosition);
}
