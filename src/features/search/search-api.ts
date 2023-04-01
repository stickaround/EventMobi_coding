import { Octokit } from 'octokit';
import type { Gist } from './search-reducer';

const octokit = new Octokit();

export interface SearchGistsParams {
  username: string;
  page: number;
  perPage: number;
}

export interface FetchGistsCountParams {
  username: string;
}

export interface ForkResponse {
  owner: {
    avatar_url: string;
  };
  url: string;
}

export async function searchGists({
  username,
  page,
  perPage,
}: SearchGistsParams): Promise<Gist[]> {
  const result: Gist[] = [];
  const gists = await octokit.request('GET /users/{username}/gists', {
    username,
    page,
    per_page: perPage,
  });

  for (const gist of gists.data) {
    const forks = await octokit.request(gist.forks_url, {
      per_page: 3,
      page: 1,
    });

    result.push({
      id: gist.id,
      description: gist.description,
      tags: Object.entries(gist.files)
        .map(([name, file]) =>
          file.language ?? file.filename?.split('.')[-1] ?? name),
      link: gist.url ?? '',
      forks: forks.data.map((fork: ForkResponse) => ({
        avatar: fork.owner.avatar_url,
        link: fork.url
      }))
    })
  };

  return result;
}

export async function fetchGistsCount({ username }: FetchGistsCountParams): Promise<number> {
  let pageCount = 1;
  let gists = await octokit.request('GET /users/{username}/gists', {
    username,
    per_page: 100,
    page: pageCount,
  });

  while (gists.data.length === 100) {
    pageCount++;
    gists = await octokit.request('GET /users/{username}/gists', {
      username,
      per_page: 100,
      page: pageCount,
    });
  }

  return pageCount && (pageCount - 1) * 100 + gists.data.length;
}
