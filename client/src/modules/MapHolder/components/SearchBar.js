/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import mapPin from '../../../icons/target.svg';
import {
  selectDeff,
  setMapCenter,
  setMapZoom,
} from '../actions/mapState';

const useStyles = makeStyles(() => ({
  pin: {
    width: 70,
    height: 60
  }
}));

const SearchBar = ({
  style,
  defibrillators,
  selectDeff,
  setMapCenter,
  setMapZoom
}) => {
  const [defN, ChangeDefN] = useState(0);

  useEffect(() => {
    if (defN) {
      const [lng, lat] = defibrillators[
        defN
      ].location.coordinates;
      selectDeff({ lng, lat });
      setMapCenter({ lng, lat });
      setMapZoom(16);
    }
  }, [defN]);

  const findNearest = () => {
    const [
      lng,
      lat
    ] = defibrillators[0].location.coordinates;
    selectDeff({ lng, lat });
    setMapCenter({ lng, lat });
    ChangeDefN(0);
    setMapZoom(14);
  };

  const clearDirections = () => {
    selectDeff(null);
  };

  const nextNearest = () => {
    if (defN > 8) {
      findNearest();
    } else {
      ChangeDefN(defN + 1);
    }
  };
  const classes = useStyles();
  return (
    <div className={style}>
      <IconButton
        size="small"
        color="secondary"
        aria-label="add an alarm"
        onClick={clearDirections}
      >
        <CloseIcon />
      </IconButton>
      <IconButton
        size="large"
        color="secondary"
        aria-label="add an alarm"
        onClick={findNearest}
      >
        <div>
          <img
            alt="User pin"
            src={mapPin}
            className={classes.pin}
          />
        </div>
      </IconButton>
      <IconButton
        size="small"
        color="secondary"
        aria-label="add an alarm"
        onClick={nextNearest}
      >
        <SkipNextIcon />
      </IconButton>
    </div>
  );
};

export default connect(
  state => ({
    defibrillators: state.defs.listData,
    mapState: state.mapState
  }),
  dispatch => ({
    setMapCenter: map => dispatch(setMapCenter(map)),
    selectDeff: selectedDeff =>
      dispatch(selectDeff(selectedDeff)),
    setMapZoom: zoom => dispatch(setMapZoom(zoom))
  })
)(SearchBar);
