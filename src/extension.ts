import * as vscode from 'vscode';

import { EXTENSION_NAME } from './constants';
import { generateCode, refactorCode, registerOpenAIApiKey, unregisterOpenAIApiKey } from './commands';

export function activate(context: vscode.ExtensionContext) {
  const secrets: vscode.SecretStorage = context.secrets;

  /** OpenAIのAPIキーをSecretStorageに格納するコマンド */
  const registerOpenAIApiKeyDisposable = vscode.commands.registerCommand(`${EXTENSION_NAME}.registerOpenAIApiKey`, () =>
    registerOpenAIApiKey(secrets)
  );

  /** SecretStorageに格納したOpenAIのAPIキーを削除するコマンド */
  const unregisterOpenAIApiKeyDisposable = vscode.commands.registerCommand(`${EXTENSION_NAME}.unregisterOpenAIApiKey`, () =>
    unregisterOpenAIApiKey(secrets)
  );

  /** 当該行に記載の内容でソースコードを生成するコマンド */
  const generateCodeDisposable = vscode.commands.registerCommand(`${EXTENSION_NAME}.generateCode`, () => generateCode(secrets));

  /** 当該行に記載のソースコードをリファクタリングするコマンド */
  const refactorCodeDisposable = vscode.commands.registerCommand(`${EXTENSION_NAME}.refactorCode`, () => refactorCode(secrets));

  context.subscriptions.push(
    registerOpenAIApiKeyDisposable,
    unregisterOpenAIApiKeyDisposable,
    generateCodeDisposable,
    refactorCodeDisposable
  );
}

export function deactivate() {}
