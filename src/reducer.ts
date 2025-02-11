import { Loop, liftState, loop } from 'redux-loop';
import { compose } from 'redux';
import { Actions } from './types/actions.type';
import * as O from 'fp-ts/lib/Option';
import { Picture } from './types/picture.type';
import fakeDatas from './fake-datas.json';
import { cmdFetch } from './commands';
import { loading, success, failure } from './api';
import { PictureStatus } from './types/api.type';

export type State = {
  counter: number;
  pictures: PictureStatus;
  pictureSelected: O.Option<Picture>;
};

export const defaultState: State = {
  counter: 3,
  pictures: success(fakeDatas.slice(0, 3)),
  pictureSelected: O.none,
};

export const reducer = (state: State | undefined, action: Actions): State | Loop<State> => {
  if (!state) return defaultState; // mandatory by redux
  switch (action.type) {
    case 'INCREMENT':
      return loop(
        { ...state, counter: state.counter + 1 },
        cmdFetch({
          type: 'FETCH_CATS_REQUEST',
          method: 'GET',
          path: `https://pixabay.com/api/?key=48779537-e111644ccf849acd51bfe04f2&per_page=${state.counter + 1}&q=cat`
        })
      );
    case 'DECREMENT':
      return state.counter > 3 
        ? loop(
            { ...state, counter: state.counter - 1 },
            cmdFetch({
              type: 'FETCH_CATS_REQUEST',
              method: 'GET',
              path: `https://pixabay.com/api/?key=48779537-e111644ccf849acd51bfe04f2&per_page=${state.counter - 1}&q=cat`
            })
          )
        : state;
    case 'SELECT_PICTURE':
      return {
        ...state,
        pictureSelected: O.some(action.picture)
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        pictureSelected: O.none
      };
    case 'FETCH_CATS_REQUEST':
      return loop(
        { ...state, pictures: loading() },
        cmdFetch({
          type: 'FETCH_CATS_REQUEST',
          method: 'GET',
          path: `https://pixabay.com/api/?key=48779537-e111644ccf849acd51bfe04f2&per_page=${state.counter}&q=cat`
        })
      );
    case 'FETCH_CATS_COMMIT':
      return {
        ...state,
        pictures: success(action.payload as Picture[])
      };
    case 'FETCH_CATS_ROLLBACK':
      return {
        ...state,
        pictures: failure(action.error.message)
      };
  }
};

export const counterSelector = (state: State) => state.counter;

export const picturesSelector = (state: State): Picture[] => {
  switch (state.pictures.kind) {
    case 'SUCCESS':
      return state.pictures.pictures;
    case 'LOADING':
    case 'FAILURE':
      return [];
  }
};
export const getSelectedPicture = (state: State): O.Option<Picture> => state.pictureSelected;

export default compose(liftState, reducer);
