import _repositoryHelper from '../../helpers/repository.helper';
import { ILanguage } from '../interface/ILanguage';

export const upsertLanguage = async (language: ILanguage): Promise<string> => {
  try {
    const result = await _repositoryHelper.upsertOne<ILanguage>({
      table: 'language',
      data: language,
      conflictFields: ['language', 'user_id'],
      returningFields: ['id']
    });

    return result.id;
  } catch (error: any) {
    throw new Error(`Error on try to upsert language. Cause: ${error.message}`);
  }
};

export const upsertLanguages = async (userId: number, languages: string[]) => {
  const promises: any[] = [];

  languages.forEach((language) => {
    promises.push(
      upsertLanguage({
        language,
        user_id: userId
      })
    );
  });

  const ids = await Promise.all(promises);

  return ids;
};
