import _repositoryHelper from '../../../src/helpers/repository.helper';
import {
  upsertLanguage,
  upsertLanguages
} from '../../../src/language/repository/language.repository';

jest.mock('../../../src/helpers/repository.helper', () => ({
  upsertOne: jest.fn()
}));

describe('Language repository tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Test of createLanguage method', () => {
    it('Should insert a language and return its id', async () => {
      const userId = 1;
      const language = 'JavaScript';
      const mockId = '123';

      (_repositoryHelper.upsertOne as jest.Mock).mockResolvedValue({
        id: mockId
      });

      const result = await upsertLanguage({ language, user_id: userId });

      expect(result).toBe(mockId);
      expect(_repositoryHelper.upsertOne).toHaveBeenCalledWith({
        conflictFields: ['language', 'user_id'],
        data: { language: 'JavaScript', user_id: 1 },
        returningFields: ['id'],
        table: 'language'
      });
    });

    it('Should throw an error if the insert fails', async () => {
      const userId = 1;
      const language = 'JavaScript';
      const errorMessage = 'Insert failed';

      (_repositoryHelper.upsertOne as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        upsertLanguage({ language, user_id: userId })
      ).rejects.toThrow(
        `Error on try to upsert language. Cause: ${errorMessage}`
      );
    });
  });

  describe('Test of createLanguages method', () => {
    it('Should insert multiple languages and return their ids', async () => {
      const userId = 1;
      const languages = ['JavaScript', 'TypeScript'];
      const mockIds = ['123', '456'];

      (_repositoryHelper.upsertOne as jest.Mock)
        .mockResolvedValueOnce({ id: mockIds[0] })
        .mockResolvedValueOnce({ id: mockIds[1] });

      const result = await upsertLanguages(userId, languages);

      expect(result).toEqual(mockIds);
      expect(_repositoryHelper.upsertOne).toHaveBeenCalledTimes(
        languages.length
      );
    });

    it('Should throw an error if one of the inserts fails', async () => {
      const userId = 1;
      const languages = ['JavaScript', 'TypeScript'];
      const errorMessage = 'Insert failed';

      (_repositoryHelper.upsertOne as jest.Mock)
        .mockResolvedValueOnce({ id: '123' })
        .mockRejectedValueOnce(new Error(errorMessage));

      await expect(upsertLanguages(userId, languages)).rejects.toThrow(
        `Error on try to upsert language. Cause: ${errorMessage}`
      );
    });
  });
});
