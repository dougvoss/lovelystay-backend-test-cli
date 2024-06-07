import { config } from "dotenv";
import axios, { AxiosError, HttpStatusCode } from "axios";

config();

const BASE_URL = process.env.GITHUB_API_URL;

export const getUserInfo = async (
  username: string
): Promise<IGitHubUserInfo> => {
  try {
    console.log(BASE_URL);
    const response = await axios
      .get(`${BASE_URL}/users/${username}`)
      .then((resp) => resp.data);

    const result: IGitHubUserInfo = {
      name: response.name,
      location: response.location,
      followers: response.followers,
      following: response.following,
      createdAt: response.created_at,
    };

    return result;
  } catch (error: any) {
    let errorMessage = `Error on try to get github user info. Cause: ${error.message}`;

    if (
      error instanceof AxiosError &&
      error.response?.status === HttpStatusCode.NotFound
    ) {
      errorMessage = `Username '${username}' not found on github`;
    }

    throw new Error(errorMessage);
  }
};

export const getUserRepos = async (
  username: string
): Promise<IGitHubUserRepos[]> => {
  try {
    const response: any[] = await axios
      .get(`${BASE_URL}/users/${username}/repos`)
      .then((resp) => resp.data);

    return response.map((item) => {
      const reposItem: IGitHubUserRepos = {
        name: item.name,
        description: item.description,
        language: item.language,
        private: item.private,
        forks: item.forks,
        openIssues: item.open_issues,
      };
      return reposItem;
    });
  } catch (error: any) {
    throw new Error(
      `Erro on try to get github user repos. Cause: ${error.message}`
    );
  }
};
