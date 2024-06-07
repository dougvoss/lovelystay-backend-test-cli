import { addUser, listUsers } from "../../../src/user/service/user.service";
import {
  getUserInfo,
  getUserRepos,
} from "../../../src/gateways/github/service/github.service";
import { createLanguages } from "../../../src/language/repository/language.repository";
import {
  createUser,
  findUsers,
} from "../../../src/user/repository/user.repository";

jest.mock("../../../src/gateways/github/service/github.service");
jest.mock("../../../src/language/repository/language.repository");
jest.mock("../../../src/user/repository/user.repository");

describe("User service tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Test of addUser method", () => {
    it("Should add a user and their languages successfully", async () => {
      const username = "testuser";
      const mockUserInfo = {
        name: "John Doe",
        location: "Earth",
        followers: 100,
        following: 50,
        createdAt: "2020-01-01T00:00:00Z",
      };
      const mockUserRepos = [
        { language: "JavaScript" },
        { language: "TypeScript" },
        { language: "JavaScript" },
      ];
      const mockUserId = 1;

      (getUserInfo as jest.Mock).mockResolvedValue(mockUserInfo);
      (createUser as jest.Mock).mockResolvedValue(mockUserId);
      (getUserRepos as jest.Mock).mockResolvedValue(mockUserRepos);
      (createLanguages as jest.Mock).mockResolvedValue(undefined);

      await addUser(username);

      expect(getUserInfo).toHaveBeenCalledWith(username);
      expect(createUser).toHaveBeenCalledWith({
        name: "John Doe",
        location: "Earth",
        followers: 100,
        following: 50,
        createdAt: "2020-01-01T00:00:00Z",
      });
      expect(getUserRepos).toHaveBeenCalledWith(username);
      expect(createLanguages).toHaveBeenCalledWith(mockUserId, [
        "JavaScript",
        "TypeScript",
      ]);
    });

    it("Should log an error message if an error occurs", async () => {
      const username = "testuser";
      const errorMessage = "Failed to add user";

      (getUserInfo as jest.Mock).mockRejectedValue(new Error(errorMessage));
      jest.spyOn(console, "error").mockImplementation(() => {});

      await addUser(username);

      expect(console.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe("Test of listUsers method", () => {
    it("Should list users without filter", async () => {
      const mockUsers = [
        {
          id: 1,
          name: "John Doe",
          location: "Earth",
          followers: 100,
          following: 50,
          createdAt: "2020-01-01T00:00:00Z",
          languages: "JavaScript, TypeScript",
        },
      ];

      (findUsers as jest.Mock).mockResolvedValue(mockUsers);
      jest.spyOn(console, "table").mockImplementation(() => {});

      await listUsers();

      expect(findUsers).toHaveBeenCalledWith(undefined);
      expect(console.table).toHaveBeenCalledWith(mockUsers);
    });

    it("Should list users with filter", async () => {
      const filter = "JavaScript";
      const mockUsers = [
        {
          id: 1,
          name: "John Doe",
          location: "Earth",
          followers: 100,
          following: 50,
          createdAt: "2020-01-01T00:00:00Z",
          languages: "JavaScript, TypeScript",
        },
      ];

      (findUsers as jest.Mock).mockResolvedValue(mockUsers);
      jest.spyOn(console, "table").mockImplementation(() => {});

      await listUsers(filter);

      expect(findUsers).toHaveBeenCalledWith(filter);
      expect(console.table).toHaveBeenCalledWith(mockUsers);
    });

    it("Should log a message if no users are found", async () => {
      (findUsers as jest.Mock).mockResolvedValue([]);
      jest.spyOn(console, "log").mockImplementation(() => {});

      await listUsers();

      expect(console.log).toHaveBeenCalledWith("Nothing to show...");
    });

    it("Should log an error message if an error occurs", async () => {
      const errorMessage = "Failed to list users";

      (findUsers as jest.Mock).mockRejectedValue(new Error(errorMessage));
      jest.spyOn(console, "error").mockImplementation(() => {});

      await listUsers();

      expect(console.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});
