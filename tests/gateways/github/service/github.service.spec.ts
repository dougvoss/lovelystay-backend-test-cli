import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  getUserInfo,
  getUserRepos
} from '../../../../src/gateways/github/service/github.service';
import { HttpStatusCode } from 'axios';

const mock = new MockAdapter(axios);

describe('GitHub Service Tests', () => {
  afterEach(() => {
    mock.reset();
  });

  describe('Test of getUserInfo method', () => {
    it('Should return user info for a valid username', async () => {
      const username = 'validUser';
      const mockResponse = {
        name: 'John Doe',
        location: 'Earth',
        followers: 100,
        following: 50,
        created_at: '2020-01-01T00:00:00Z'
      };

      mock
        .onGet(`${process.env.GITHUB_API_URL}/users/${username}`)
        .reply(200, mockResponse);

      const result = await getUserInfo(username);

      expect(result).toEqual({
        name: 'John Doe',
        location: 'Earth',
        followers: 100,
        following: 50,
        created_at: '2020-01-01T00:00:00Z'
      });
    });

    it('Should throw an error if the username is not found', async () => {
      const username = 'nonexistentUser';

      mock
        .onGet(`${process.env.GITHUB_API_URL}/users/${username}`)
        .reply(HttpStatusCode.NotFound);

      await expect(getUserInfo(username)).rejects.toThrow(
        `Username '${username}' not found on github`
      );
    });
  });

  describe('Test of getUserRepos method', () => {
    it('Should return user repositories for a valid username', async () => {
      const username = 'validUser';
      const mockResponse = [
        {
          name: 'repo1',
          description: 'First repo',
          language: 'JavaScript',
          private: false,
          forks: 10,
          open_issues: 1
        },
        {
          name: 'repo2',
          description: 'Second repo',
          language: 'TypeScript',
          private: false,
          forks: 5,
          open_issues: 0
        }
      ];

      mock
        .onGet(`${process.env.GITHUB_API_URL}/users/${username}/repos`)
        .reply(200, mockResponse);

      const result = await getUserRepos(username);

      expect(result).toEqual([
        {
          name: 'repo1',
          description: 'First repo',
          language: 'JavaScript',
          private: false,
          forks: 10,
          openIssues: 1
        },
        {
          name: 'repo2',
          description: 'Second repo',
          language: 'TypeScript',
          private: false,
          forks: 5,
          openIssues: 0
        }
      ]);
    });

    // eslint-disable-next-line max-len
    it('should throw an error if there is a problem fetching the repositories', async () => {
      const username = 'validUser';

      mock
        .onGet(`${process.env.GITHUB_API_URL}/users/${username}/repos`)
        .networkError();

      await expect(getUserRepos(username)).rejects.toThrow(
        'Erro on try to get github user repos. Cause: Network Error'
      );
    });
  });
});
