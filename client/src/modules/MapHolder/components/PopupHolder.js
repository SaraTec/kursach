import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Popup } from 'react-mapbox-gl';
import Media from 'react-media';
import DefContent from './PopupContent/DefibrillatorPopupContent';
import { popupOffsets } from '../consts';

const PopupHolder = ({ popupData }) => {
  return (
    <>
      {popupData && (
        <Media query="(min-width: 599px)">
          {matches =>
            matches ? (
              <Popup
                coordinates={popupData.coordinates}
                offset={popupOffsets}
              >
                <DefContent height="270px" id={popupData.data.id} />
              </Popup>
            ) : (
              <DefContent height="370px" id={popupData.data.id} />
            )
          }
        </Media>
      )}
    </>
  );
};

PopupHolder.defaultProps = {
  popupData: null
};

PopupHolder.propTypes = {
  popupData: PropTypes.shape({
    data: PropTypes.shape({
      id: PropTypes.string
    }),
    coordinates: PropTypes.arrayOf(PropTypes.number)
  })
};

export default connect(state => ({
  popupData: state.popupData
}))(PopupHolder);
