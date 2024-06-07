import db from '../../../src/db';
import { createLanguage, createLanguages } from '../../../src/language/repository/language.repository';

jest.mock('../../../src/db', () => ({
  one: jest.fn(),
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

      (db.one as jest.Mock).mockResolvedValue({ id: mockId });

      const result = await createLanguage(userId, language);

      expect(result).toBe(mockId);
      expect(db.one).toHaveBeenCalledWith(
        'INSERT INTO languages (user_id, language) VALUES ($1, $2) RETURNING id',
        [userId, language]
      );
    });

    it('Should throw an error if the insert fails', async () => {
      const userId = 1;
      const language = 'JavaScript';
      const errorMessage = 'Insert failed';

      (db.one as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(createLanguage(userId, language)).rejects.toThrow(
        `Error on try to insert language data. Cause: ${errorMessage}`
      );
    });
  });

  describe('Test of createLanguages method', () => {
    it('Should insert multiple languages and return their ids', async () => {
      const userId = 1;
      const languages = ['JavaScript', 'TypeScript'];
      const mockIds = ['123', '456'];

      (db.one as jest.Mock)
        .mockResolvedValueOnce({ id: mockIds[0] })
        .mockResolvedValueOnce({ id: mockIds[1] });

      const result = await createLanguages(userId, languages);

      expect(result).toEqual(mockIds);
      expect(db.one).toHaveBeenCalledTimes(languages.length);
      languages.forEach((language, index) => {
        expect(db.one).toHaveBeenCalledWith(
          'INSERT INTO languages (user_id, language) VALUES ($1, $2) RETURNING id',
          [userId, language]
        );
      });
    });

    it('Should throw an error if one of the inserts fails', async () => {
      const userId = 1;
      const languages = ['JavaScript', 'TypeScript'];
      const errorMessage = 'Insert failed';

      (db.one as jest.Mock)
        .mockResolvedValueOnce({ id: '123' })
        .mockRejectedValueOnce(new Error(errorMessage));

      await expect(createLanguages(userId, languages)).rejects.toThrow(
        `Error on try to insert language data. Cause: ${errorMessage}`
      );
    });
  });
});
