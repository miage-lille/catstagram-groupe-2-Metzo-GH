import { Cmd } from 'redux-loop';
import { fetchCatsCommit, fetchCatsRollback } from './actions';
import { FetchCatsRequest } from './types/actions.type';
import { Picture } from './types/picture.type';

interface PixabayResponse {
  hits: Array<{
    previewURL: string;
    webformatURL: string;
    largeImageURL: string;
    user: string;
  }>;
}

const parsePictures = (response: Response): Promise<Picture[]> => 
  response.json()
    .then((data: PixabayResponse) => 
      data.hits.map(hit => ({
        previewFormat: hit.previewURL,
        webFormat: hit.webformatURL,
        largeFormat: hit.largeImageURL,
        author: hit.user
      }))
    );

export const cmdFetch = (action: FetchCatsRequest) =>
  Cmd.run(
    () => {
      return fetch(action.path, {
        method: action.method,
      })
        .then(checkStatus)
        .then(parsePictures);
    },
    {
      successActionCreator: fetchCatsCommit,
      failActionCreator: fetchCatsRollback,
    }
  );

const checkStatus = (response: Response) => {
  if (response.ok) return response;
  throw new Error(response.statusText);
};
