import * as vscode from 'vscode';

import { EXTENSION_DISPLAY_NAME } from '../constants';

// TODO: サービスに逃がす。

const STORAGE_KEY_FOR_OPEN_AI_API_KEY = 'openAIApiKey';

/** SecretStorageのAPIキーを取り出す */
export const getApiKey = async (secrets: vscode.SecretStorage): Promise<string> => {
  const apiKey = await secrets.get(STORAGE_KEY_FOR_OPEN_AI_API_KEY);
  if (!apiKey) {
    vscode.window.showErrorMessage(
      `Your OpenAI api key has not been registered.\nPlease run command "${EXTENSION_DISPLAY_NAME}: Register OpenAI API Key" and register your key.`
    );
    throw new Error();
  }
  return apiKey;
};

/** OpenAIのAPIキーをSecretStorageに格納するコマンド */
export const registerOpenAIApiKey = async (secrets: vscode.SecretStorage) => {
  const apiKey = await vscode.window.showInputBox({
    title: 'Enter your OpenAI api key',
    placeHolder: '********',
    password: true,
    ignoreFocusOut: true,
  });

  if (!apiKey) {
    vscode.window.showWarningMessage('Empty value.');
    return;
  }

  secrets.store(STORAGE_KEY_FOR_OPEN_AI_API_KEY, apiKey);
  vscode.window.showInformationMessage('API Key saved.');
};

/** SecretStorageに格納したOpenAIのAPIキーを削除するコマンド */
export const unregisterOpenAIApiKey = async (secrets: vscode.SecretStorage) => {
  secrets.delete(STORAGE_KEY_FOR_OPEN_AI_API_KEY);
  vscode.window.showInformationMessage('API Key removed.');
};
