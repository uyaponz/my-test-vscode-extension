import * as vscode from 'vscode';

import { EXTENSION_DISPLAY_NAME } from '../constants';
import { generateRefactoredCode, getEditorLanguageName, getSelectedText, getSuggestedCode, insertToNextLine } from '../misc';
import { getApiKey } from './api-key';

/** 当該行に記載の内容でソースコードを生成するコマンド */
export const generateCode = async (secrets: vscode.SecretStorage) => {
  let apiKey: string;
  try {
    apiKey = await getApiKey(secrets);
  } catch {
    return;
  }

  const editor = vscode.window.activeTextEditor;
  if (editor) {
    // 選択範囲のテキストを取得する。
    const selectedText = getSelectedText(editor);
    console.debug('selectedText:', selectedText);
    if (!selectedText) {
      vscode.window.showWarningMessage('Empty line.');
      return;
    }

    // ソースコードを生成し、キャレット位置の次の行に転記する。
    vscode.window.withProgress(
      { title: EXTENSION_DISPLAY_NAME, location: vscode.ProgressLocation.Notification, cancellable: true },
      async (progress, token) => {
        progress.report({ message: 'Processing (generating)...' });

        // ソースコードを生成する。
        const result = await getSuggestedCode(apiKey, selectedText, getEditorLanguageName(editor));
        console.debug('result:', result);
        if (!result) {
          vscode.window.showWarningMessage('Empty result.');
          return;
        }

        // キャンセルされていたら処理終了。
        if (token.isCancellationRequested) {
          return;
        }

        // キャレット位置の次の行に埋め込む。
        insertToNextLine(result, editor);
      }
    );
  } else {
    vscode.window.showErrorMessage('Unknown error (no editor instance).');
    return;
  }
};

/** 当該行に記載のソースコードをリファクタリングするコマンド */
export const refactorCode = async (secrets: vscode.SecretStorage) => {
  let apiKey: string;
  try {
    apiKey = await getApiKey(secrets);
  } catch {
    return;
  }

  const editor = vscode.window.activeTextEditor;
  if (editor) {
    // 選択範囲のテキストを取得する。
    const selectedText = getSelectedText(editor);
    console.debug('selectedText:', selectedText);
    if (!selectedText) {
      vscode.window.showWarningMessage('Empty line.');
      return;
    }

    // ソースコードを生成し、キャレット位置の次の行に転記する。
    vscode.window.withProgress(
      { title: EXTENSION_DISPLAY_NAME, location: vscode.ProgressLocation.Notification, cancellable: true },
      async (progress, token) => {
        progress.report({ message: 'Processing (refactoring)...' });

        // ソースコードを生成する。
        const result = await generateRefactoredCode(apiKey, selectedText, getEditorLanguageName(editor));
        console.debug('result:', result);
        if (!result) {
          vscode.window.showWarningMessage('Empty result.');
          return;
        }

        // キャンセルされていたら処理終了。
        if (token.isCancellationRequested) {
          return;
        }

        // キャレット位置の次の行に埋め込む。
        insertToNextLine(result, editor);
      }
    );
  } else {
    vscode.window.showErrorMessage('Unknown error (no editor instance).');
    return;
  }
};
