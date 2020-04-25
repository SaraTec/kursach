/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { geolocated } from 'react-geolocated';
import { makeStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Button, Tooltip } from '@material-ui/core';
import PropTypes from 'prop-types';
import Media from 'react-media';
import ReactMapboxGl, {
  GeoJSONLayer
} from 'react-mapbox-gl';
import PopupHolder from './components/PopupHolder';
import SearchBar from './components/SearchBar';
import {
  setMapCenter,
  setMapZoom,
  addNewPoint,
  selectDeff
} from './actions/mapState';
import { hidePopup } from './actions/popupDisplay';
import DefibrillatorPinLayer from './layers/DefibrillatorPinLayer';
import AddedPin from './layers/AddedPin';
import UserPin from './layers/UserPin';
import { sidebarWidth } from '../Sidebar/styleConstants';

const useStyles = makeStyles(() => ({
  mapContainer: ({ visible }) => ({
    position: 'relative',
    height: '100vh',
    width: visible
      ? `calc(100vw - ${sidebarWidth})`
      : '100vw',
    overflow: 'hidden'
  }),
  map: {
    display: 'flex',
    height: '100%',
    width: '100%'
  },
  showIcon: {
    position: 'fixed',
    height: 64,
    margin: '10px 0 0 10px',
    zIndex: 1,
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    borderRadius: '50%'
  },
  showMenuIcon: ({ visible }) => ({
    height: 35,
    width: 35,
    transform: `${
      visible ? 'rotate(180deg)' : 'rotate(0)'
    }`,
    transition: 'transform 0.2s'
  })
}));

const useSearchBarStyle = makeStyles(() => ({
  desktopStyle: {
    position: 'fixed',
    top: '10px',
    right: '30px',
    width: '150px',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center'
  },
  mobileStyle: {
    position: 'fixed',
    width: '150px',
    zIndex: 1,
    bottom: '10px',
    right: 0,
    left: 0,
    marginRight: 'auto',
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center'
  }
}));

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1Ijoib3Nrb3ZiYXNpdWsiLCJhIjoiY2s1NWVwcnhhMDhrazNmcGNvZjJ1MnA4OSJ9.56GsGp2cl6zpYh-Ns8ThxA'
});

const MapHolder = ({
  mapState,
  newPoint,
  selectedDeff,
  setMapCenter,
  addNewPoint,
  hidePopup,
  setVisible,
  visible,
  coords
}) => {
  const classes = useStyles({ visible });
  const SearchBarStyle = useSearchBarStyle();
  const [map, setLocalMap] = useState(null);
  const [geoJSON, setGeoJSON] = useState({});
  const tooltipMessage = visible
    ? 'Приховати меню'
    : 'Показати меню';
  const handlePopupClose = event => {
    if (event.target.tagName === 'CANVAS') {
      hidePopup();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handlePopupClose);
    return () => {
      document.removeEventListener(
        'click',
        handlePopupClose
      );
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (coords) {
      setMapCenter({
        lng: coords.longitude,
        lat: coords.latitude
      });
    }
  }, [coords]);

  useEffect(() => {
    if (coords && Object.keys(selectedDeff).length !== 0) {
      document.addEventListener('click', handlePopupClose);
      const { longitude, latitude } = coords;
      const { lng, lat } = selectedDeff;
      fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${longitude},${latitude};${lng},${lat}?access_token=pk.eyJ1Ijoib3Nrb3ZiYXNpdWsiLCJhIjoiY2s1NWVwcnhhMDhrazNmcGNvZjJ1MnA4OSJ9.56GsGp2cl6zpYh-Ns8ThxA&geometries=geojson`
      )
        .then(response => {
          return response.json();
        })
        .then(data => {
          setGeoJSON({
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: data.routes[0].geometry
              }
            ]
          });
        });
    }
    return () => {
      document.removeEventListener(
        'click',
        handlePopupClose
      );
    };
  }, [selectedDeff, coords]);

  const loadMap = mapRaw => {
    if (mapRaw) {
      setLocalMap(mapRaw);
    }
  };

  const { lng, lat, zoom } = mapState;

  const changeMapCenterCoords = event => {
    setMapCenter(event.getCenter());
  };

  const onZoomEnded = event => {
    if (
      event
        .getCenter()
        .lng.toString()
        .substring(0, 5) !== '24.03'
    ) {
      setMapCenter({
        ...event.getCenter(),
        zoom: event.getZoom()
      });
    }
  };

  const onZoomStarted = () => {
    hidePopup();
  };

  const hideSidebar = () => {
    if (map) {
      setVisible(prev => !prev);

      setTimeout(() => {
        map.resize();
      }, 100);
    }
  };

  useEffect(() => {
    if (Object.keys(newPoint).length !== 0) {
      const { lng, lat } = newPoint;
      setMapCenter({ lng, lat });
    }
    // eslint-disable-next-line
  }, [newPoint]);

  const onDblClickMap = (_, event) => {
    const currentRoute = window.location.pathname;
    if (
      currentRoute === '/add-form' ||
      currentRoute.includes('/edit-form')
    ) {
      const { lng, lat } = event.lngLat;

      addNewPoint({ lng, lat });
      event.preventDefault();
    }
  };

  const linePaint = {
    'line-color': '#BF93E4',
    'line-width': 5
  };
  return (
    <div className={classes.mapContainer}>
      <Media query="(min-width: 599px)">
        {matches =>
          matches ? (
            <Button
              className={classes.showIcon}
              color="primary"
              onClick={hideSidebar}
              size="small"
            >
              {' '}
              <Tooltip title={tooltipMessage}>
                <ChevronRightIcon
                  className={classes.showMenuIcon}
                />
              </Tooltip>
            </Button>
          ) : (
            <></>
          )
        }
      </Media>
      <Media query="(min-width: 599px)">
        {matches =>
          matches ? (
            <SearchBar
              style={SearchBarStyle.desktopStyle}
            />
          ) : (
            <SearchBar style={SearchBarStyle.mobileStyle} />
          )
        }
      </Media>
      <Map
        // eslint-disable-next-line react/style-prop-object
        style="mapbox://styles/oskovbasiuk/ck5nwya36638v1ilpmwxlfv5g"
        className={classes.map}
        center={[lng, lat]}
        zoom={[zoom]}
        onStyleLoad={loadMap}
        onZoomEnd={onZoomEnded}
        onZoomStart={onZoomStarted}
        onRotateEnd={changeMapCenterCoords}
        onDragEnd={changeMapCenterCoords}
        onDblClick={onDblClickMap}
      >
        {map && <DefibrillatorPinLayer map={map} />}
        {Object.keys(newPoint).length !== 0 && (
          <AddedPin coordinates={newPoint} />
        )}
        {coords && (
          <UserPin
            coordinates={{
              lng: coords.longitude,
              lat: coords.latitude
            }}
          />
        )}
        <PopupHolder />

        {(Object.keys(geoJSON).length !== 0 &&
          Object.keys(selectedDeff).length !== 0) && (
          <GeoJSONLayer
            data={geoJSON}
            linePaint={linePaint}
          />
        )}
      </Map>
    </div>
  );
};

MapHolder.defaultProps = {
  mapState: {},
  setVisible: {},
  visible: null,
  setMapCenter: () => {},
  hidePopup: () => {}
};

MapHolder.propTypes = {
  mapState: PropTypes.shape({
    lng: PropTypes.number,
    lat: PropTypes.number,
    zoom: PropTypes.number
  }),
  newPoint: PropTypes.shape({
    lng: PropTypes.number,
    lat: PropTypes.number
  }).isRequired,
  addNewPoint: PropTypes.func.isRequired,
  setMapCenter: PropTypes.func,
  hidePopup: PropTypes.func,
  setVisible: PropTypes.func,
  visible: PropTypes.bool
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  watchPosition: false,
  userDecisionTimeout: 5000
})(
  connect(
    state => ({
      defsState: state.defs,
      mapState: state.mapState,
      newPoint: state.newPoint,
      selectedDeff: state.selectedDeff
    }),
    dispatch => ({
      setMapCenter: map => dispatch(setMapCenter(map)),
      setMapZoom: zoom => dispatch(setMapZoom(zoom)),
      addNewPoint: newPoint =>
        dispatch(addNewPoint(newPoint)),
      selectDeff: selectedDeff =>
        dispatch(selectDeff(selectedDeff)),
      hidePopup: () => dispatch(hidePopup())
    })
  )(MapHolder)
);
