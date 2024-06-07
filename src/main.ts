import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { addUser, listUsers } from "./user/service/user.service";

interface Args {
  addUser?: string;
  listUsers?: string;
}

export function parseArgs(): Args {
  const argv = yargs(hideBin(process.argv))
    .option("addUser", {
      type: "string",
      group: "addUser",
      requiresArg: true,
      describe: "Add user on database",
    })
    .option("listUsers", {
      group: "listUsers",
      type: "string",
      describe: "List users from database, if value ",
    })
    .parseSync();

  return argv as Args;
}

export const main = async () => {
  try {
    const args = parseArgs();

    args.hasOwnProperty("addUser");

    if (args.addUser) {
      await addUser(args.addUser);
    } else if (args.hasOwnProperty("listUsers")) {
      await listUsers(args.listUsers);
    } else {
      console.log("Unknown command");
    }
  } catch (error) {
    console.error(error);
  }
};

main();
