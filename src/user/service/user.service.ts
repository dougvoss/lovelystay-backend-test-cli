import {
  getUserInfo,
  getUserRepos,
} from "../../gateways/github/service/github.service";
import { createLanguages } from "../../language/repository/language.repository";
import { createUser, findUsers } from "../repository/user.repository";

export const addUser = async (username: string) => {
  try {
    const languages = new Set<string>();

    const gitHubUserInfo = await getUserInfo(username);
    const userId = await createUser({
      name: gitHubUserInfo.name,
      location: gitHubUserInfo.location,
      followers: gitHubUserInfo.followers,
      following: gitHubUserInfo.following,
      createdAt: gitHubUserInfo.createdAt,
    });

    const gitHubUserLanguages = await getUserRepos(username);
    gitHubUserLanguages
      .filter((item) => item.language)
      .forEach((item) => languages.add(item.language));

    await createLanguages(userId, [...languages]);

    console.log(`User ${username} added successfully!`);
  } catch (error: any) {
    console.error(error.message);
  }
};

export const listUsers = async (filter?: string) => {
  try {
    const users = await findUsers(filter);

    if (users.length) {
      console.table(users);
    } else {
      console.log("Nothing to show...");
    }
  } catch (error: any) {
    console.error(error.message);
  }
};
