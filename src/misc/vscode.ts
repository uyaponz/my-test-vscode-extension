import * as vscode from 'vscode';

export const getSelectedText = (editor: vscode.TextEditor): string => {
  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);
  if (!selectedText) {
    // 未選択の場合は現在行全体を対象とする。
    return editor.document.lineAt(selection.active.line).text;
  }
  return selectedText;
};

export const insertToNextLine = (text: string, editor: vscode.TextEditor) => {
  editor.edit((editBuilder) => {
    const cursorPosition = editor.selection.end;
    editBuilder.insert(
      new vscode.Position(cursorPosition.line, editor.document.lineAt(cursorPosition.line).text.length),
      '\n' + text + '\n'
    );
  });
};

export const getEditorLanguageName = (editor: vscode.TextEditor): string => {
  const langId = editor.document.languageId;
  const langName = langId; // TODO: 表記名を取得したい。
  return langName;
};
