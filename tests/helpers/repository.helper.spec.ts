import db from '../../src/db';
import repositoryHelper from '../../src/helpers/repository.helper';

// Mock the db.one method
jest.mock('../../src/db', () => ({
  one: jest.fn()
}));

describe('Repository helper tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upsertOne', () => {
    it('should perform an upsert operation and return the result', async () => {
      const table = 'test_table';
      const data = { id: 1, name: 'Test Name' };
      const conflictFields = ['id'];
      const returningFields = ['id', 'name'];
      const mockResult = { id: 1, name: 'Test Name' };

      (db.one as jest.Mock).mockResolvedValue(mockResult);

      const result = await repositoryHelper.upsertOne({
        table,
        data,
        conflictFields,
        returningFields
      });

      expect(db.one).toHaveBeenCalledWith(expect.any(String), data);
      expect(result).toEqual(mockResult);
    });

    // eslint-disable-next-line max-len
    it('should perform an upsert operation without conflict fields and return the result', async () => {
      const table = 'test_table';
      const data = { id: 1, name: 'Test Name' };
      const mockResult = { id: 1, name: 'Test Name' };

      (db.one as jest.Mock).mockResolvedValue(mockResult);

      const result = await repositoryHelper.upsertOne({
        table,
        data
      });

      expect(db.one).toHaveBeenCalledWith(expect.any(String), data);
      expect(result).toEqual(mockResult);
    });

    // eslint-disable-next-line max-len
    it('should perform an upsert operation without returning fields and return the result', async () => {
      const table = 'test_table';
      const data = { id: 1, name: 'Test Name' };
      const conflictFields = ['id'];
      const returningFields: string[] = [];
      const mockResult = { id: 1, name: 'Test Name' };

      (db.one as jest.Mock).mockResolvedValue(mockResult);

      const result = await repositoryHelper.upsertOne({
        table,
        data,
        conflictFields,
        returningFields
      });

      expect(db.one).toHaveBeenCalledWith(expect.any(String), data);
      expect(result).toEqual(mockResult);
    });

    it('should throw an error if the upsert operation fails', async () => {
      const table = 'test_table';
      const data = { id: 1, name: 'Test Name' };
      const conflictFields = ['id'];
      const returningFields = ['id', 'name'];
      const errorMessage = 'Insert failed';

      (db.one as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(
        repositoryHelper.upsertOne({
          table,
          data,
          conflictFields,
          returningFields
        })
      ).rejects.toThrow(`Error on try to insert data. Cause: ${errorMessage}`);
    });
  });
});
