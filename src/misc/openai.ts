import { Configuration, OpenAIApi } from 'openai';
import { RequiredError } from 'openai/dist/base';

const MODEL = 'gpt-3.5-turbo';
const MAX_TOKENS = 200;

const createOpenAIInstance = (apiKey: string): OpenAIApi => {
  const config = new Configuration({ apiKey });
  return new OpenAIApi(config);
};

const getCodeFromCompletion = (resultMessage: string): string | undefined => {
  const resultArray = resultMessage.split('```');
  if (resultArray.length < 3) {
    return undefined;
  } else {
    const beginIndex = resultMessage.indexOf('\n') + '\n'.length;
    const endIndex = resultMessage.lastIndexOf('\n```');
    return resultMessage.substring(beginIndex, endIndex);
  }
};

/** 使用可能なモデル一覧を取得する */
export const listModels = async (apiKey: string): Promise<string[]> => {
  const openai = createOpenAIInstance(apiKey);

  const models = await openai.listModels();
  return models.data.data.map((d) => d.id);
};

/** ソースコードを作成してもらう */
export const getSuggestedCode = async (apiKey: string, query: string, langName: string): Promise<string | undefined> => {
  const generateContentText = (query: string, langName: string): string => {
    return [
      `次の要件を満たすソースコードを作成してください。言語は${langName}でお願いします。`,
      `- ${query}`,
      '',
      '複雑な処理が含まれる場合、可能であればソースコード内にコメントで補足をお願いします。',
      'なお、回答はソースコードのみでお願いします。以下、回答のフォーマットです。',
      '```${extension}',
      '{code}',
      '```',
      '',
    ].join('\n');
  };

  try {
    const openai = createOpenAIInstance(apiKey);

    const content = generateContentText(query, langName);
    console.debug('content:', content);

    const completion = await openai.createChatCompletion({
      model: MODEL,
      messages: [{ role: 'user', content }],
      max_tokens: MAX_TOKENS,
    });
    console.debug('completion:', JSON.stringify(completion?.data));

    const resultMessage = completion?.data?.choices?.[0]?.message?.content || '';
    return getCodeFromCompletion(resultMessage);
  } catch (error: unknown | RequiredError) {
    console.debug('Error:', JSON.stringify(error));
    return undefined;
  }
};

/** ソースコードをリファクタしてもらう */
export const generateRefactoredCode = async (apiKey: string, code: string, langName: string): Promise<string | undefined> => {
  const generateContentText = (code: string, langName: string): string => {
    return [
      `次のコードをリファクタリングしてください。言語は${langName}です。`,
      '```',
      code,
      '```',
      '',
      'なお、回答はソースコードのみでお願いします。以下、回答のフォーマットです。',
      '```${extension}',
      '{code}',
      '```',
      '',
    ].join('\n');
  };

  try {
    const openai = createOpenAIInstance(apiKey);

    const content = generateContentText(code, langName);
    console.debug('content:', content);

    const completion = await openai.createChatCompletion({
      model: MODEL,
      messages: [{ role: 'user', content }],
      max_tokens: MAX_TOKENS,
    });
    console.debug('completion:', JSON.stringify(completion?.data));

    const resultMessage = completion?.data?.choices?.[0]?.message?.content || '';
    return getCodeFromCompletion(resultMessage);
  } catch (error: unknown | RequiredError) {
    console.debug('Error:', JSON.stringify(error));
    return undefined;
  }
};
