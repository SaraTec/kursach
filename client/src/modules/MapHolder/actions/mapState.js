import {
  ADD_NEW_POINT,
  SET_MAP_CENTER,
  SET_MAP_ZOOM,
  SELECT_DEFF
} from '../consts';

export const setMapCenter = mapState => {
  return {
    type: SET_MAP_CENTER,
    payload: mapState
  };
};

export const setMapZoom = zoom => {
  return {
    type: SET_MAP_ZOOM,
    payload: zoom
  };
};

export const addNewPoint = newPoint => {
  return {
    type: ADD_NEW_POINT,
    payload: newPoint
  };
};

export const selectDeff = deff => {
  return {
    type: SELECT_DEFF,
    payload: deff
  };
};
