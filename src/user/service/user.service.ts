import {
  getUserInfo,
  getUserRepos
} from '../../gateways/github/service/github.service';
import { upsertLanguages } from '../../language/repository/language.repository';
import { upsertUser, findUsers } from '../repository/user.repository';

export const addUser = async (username: string) => {
  try {
    const languages = new Set<string>();

    const [gitHubUserInfo, gitHubUserRepos] = await Promise.all([
      getUserInfo(username),
      getUserRepos(username)
    ]);

    const userId = await upsertUser({
      username: username,
      name: gitHubUserInfo.name,
      location: gitHubUserInfo.location,
      followers: gitHubUserInfo.followers,
      following: gitHubUserInfo.following,
      created_at: gitHubUserInfo.created_at
    });

    gitHubUserRepos
      .filter((item) => item.language)
      .forEach((item) => languages.add(item.language));

    await upsertLanguages(userId, [...languages]);

    console.log(`addUser has been executed successfully!`);
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
      console.log('Nothing to show...');
    }
  } catch (error: any) {
    console.error(error.message);
  }
};
