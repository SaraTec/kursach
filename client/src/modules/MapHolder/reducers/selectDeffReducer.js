import { SELECT_DEFF } from '../consts';

const initialState = {};

export default (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case SELECT_DEFF: {
      if (
        payload &&
        state.lng === payload.lng &&
        state.lat === payload.lat
      ) {
        return state;
      }
      return { ...payload };
    }
    default:
      return state;
  }
};
