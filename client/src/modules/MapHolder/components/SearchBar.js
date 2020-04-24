/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import mapPin from '../../../icons/target.svg';

const useStyles = makeStyles(() => ({
  pin: {
    width: 70,
    height: 60
  }
}));

const SearchBar = ({ style }) => {
  const classes = useStyles();
  return (
    <div className={style}>
      <IconButton
        color="secondary"
        aria-label="add an alarm"
      >
        <div>
          <img
            alt="User pin"
            src={mapPin}
            className={classes.pin}
          />
        </div>
      </IconButton>
    </div>
  );
};

export default SearchBar;
