import { parseArgs, main } from "../src/main";
import { addUser, listUsers } from "../src/user/service/user.service";

jest.mock("../src/user/service/user.service");

describe("CLI Tests", () => {
  let addUserMock: jest.Mock;
  let listUsersMock: jest.Mock;

  beforeEach(() => {
    addUserMock = jest.fn();
    listUsersMock = jest.fn();
    (addUser as jest.Mock) = addUserMock;
    (listUsers as jest.Mock) = listUsersMock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Should call addUser when addUser argument is provided", async () => {
    process.argv = ["node", "script", "--addUser", "John Doe"];

    await main();

    expect(addUserMock).toHaveBeenCalledWith("John Doe");
  });

  it("Should call listUsers when listUsers argument is provided", async () => {
    process.argv = ["node", "script", "--listUsers", "users"];

    await main();

    expect(listUsersMock).toHaveBeenCalledWith("users");
  });

  it("Should print 'Unknown command' when no valid arguments are provided", async () => {
    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();
    process.argv = ["node", "script"];

    await main();

    expect(consoleLogMock).toHaveBeenCalledWith("Unknown command");

    consoleLogMock.mockRestore();
  });

  it("Should handle errors thrown during execution", async () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation();
    process.argv = ["node", "script", "--addUser", "John Doe"];
    addUserMock.mockRejectedValue(new Error("Database error"));

    await main();

    expect(consoleErrorMock).toHaveBeenCalled();

    consoleErrorMock.mockRestore();
  });
});
