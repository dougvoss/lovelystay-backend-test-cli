import db from "../../../src/db";
import {
  createUser,
  findUsers,
} from "../../../src/user/repository/user.repository";

jest.mock("../../../src/db", () => ({
  one: jest.fn(),
  any: jest.fn(),
}));

describe("User repository tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Test of createUser method", () => {
    it("Should insert a user and return its id", async () => {
      const user = {
        name: "John Doe",
        location: "Earth",
        followers: 100,
        following: 50,
        createdAt: new Date(),
      };
      const mockId = 1;

      (db.one as jest.Mock).mockResolvedValue({ id: mockId });

      const result = await createUser(user);

      expect(result).toBe(mockId);
      expect(db.one).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if the insert fails", async () => {
      const user = {
        name: "John Doe",
        location: "Earth",
        followers: 100,
        following: 50,
        createdAt: new Date(),
      };
      const errorMessage = "Insert failed";

      (db.one as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(createUser(user)).rejects.toThrow(
        `Error on try to insert user data. Cause: ${errorMessage}`
      );
    });
  });

  describe("Test of findUsers method", () => {
    it("Should return users without filter", async () => {
      const mockRows = [
        {
          id: 1,
          name: "John Doe",
          location: "Earth",
          followers: 100,
          following: 50,
          created_at: "2020-01-01T00:00:00Z",
          languages: "JavaScript, TypeScript",
        },
        {
          id: 2,
          name: "Jane Smith",
          location: "Mars",
          followers: 200,
          following: 75,
          created_at: "2021-01-01T00:00:00Z",
          languages: "Python, Ruby",
        },
      ];

      (db.any as jest.Mock).mockResolvedValue(mockRows);

      const result = await findUsers();

      expect(result).toEqual([
        {
          id: 1,
          name: "John Doe",
          location: "Earth",
          followers: 100,
          following: 50,
          createdAt: "2020-01-01T00:00:00Z",
          languages: "JavaScript, TypeScript",
        },
        {
          id: 2,
          name: "Jane Smith",
          location: "Mars",
          followers: 200,
          following: 75,
          createdAt: "2021-01-01T00:00:00Z",
          languages: "Python, Ruby",
        },
      ]);
      expect(db.any).toHaveBeenCalledTimes(1);
    });

    it("Should return users with filter", async () => {
      const filter = "JavaScript";
      const mockRows = [
        {
          id: 1,
          name: "John Doe",
          location: "Earth",
          followers: 100,
          following: 50,
          created_at: "2020-01-01T00:00:00Z",
          languages: "JavaScript, TypeScript",
        },
      ];

      (db.any as jest.Mock).mockResolvedValue(mockRows);

      const result = await findUsers(filter);

      expect(result).toEqual([
        {
          id: 1,
          name: "John Doe",
          location: "Earth",
          followers: 100,
          following: 50,
          createdAt: "2020-01-01T00:00:00Z",
          languages: "JavaScript, TypeScript",
        },
      ]);
      expect(db.any).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if the query fails", async () => {
      const errorMessage = "Query failed";

      (db.any as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(findUsers()).rejects.toThrow(
        `Error on try to list users. Cause: ${errorMessage}`
      );
    });
  });
});
