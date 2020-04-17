import React, { useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Button, Tooltip } from '@material-ui/core';
import PropTypes from 'prop-types';
import ReactMapboxGl, {
  GeoJSONLayer
} from 'react-mapbox-gl';
import PopupHolder from './components/PopupHolder';
import {
  setMapCenter,
  setMapZoom,
  addNewPoint
} from './actions/mapState';
import { hidePopup } from './actions/popupDisplay';
import DefibrillatorPinLayer from './layers/DefibrillatorPinLayer';
import AddedPin from './layers/AddedPin';
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

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1Ijoib3Nrb3ZiYXNpdWsiLCJhIjoiY2s1NWVwcnhhMDhrazNmcGNvZjJ1MnA4OSJ9.56GsGp2cl6zpYh-Ns8ThxA'
});

const MapHolder = ({
  mapState,
  newPoint,
  setMapCenter,
  addNewPoint,
  hidePopup,
  setVisible,
  visible
}) => {
  const classes = useStyles({ visible });
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
    fetch(
      'https://api.mapbox.com/directions/v5/mapbox/driving/24.0315921,49.841952;24.055046172576798,49.83831206813981?access_token=pk.eyJ1Ijoib3Nrb3ZiYXNpdWsiLCJhIjoiY2s1NWVwcnhhMDhrazNmcGNvZjJ1MnA4OSJ9.56GsGp2cl6zpYh-Ns8ThxA&geometries=geojson'
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
      
    return () => {
      document.removeEventListener(
        'click',
        handlePopupClose
      );
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (Object.keys(geoJSON).length !== 0) {
      console.log(geoJSON);
    }
  }, [geoJSON]);

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
    setMapCenter({
      ...event.getCenter(),
      zoom: event.getZoom()
    });
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
      <Button
        className={classes.showIcon}
        color="primary"
        onClick={hideSidebar}
        size="small"
      >
        <Tooltip title={tooltipMessage}>
          <ChevronRightIcon
            className={classes.showMenuIcon}
          />
        </Tooltip>
      </Button>

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
        <PopupHolder />
        <GeoJSONLayer
          data={geoJSON}
          linePaint={linePaint}
        />
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

export default connect(
  state => ({
    defsState: state.defs,
    mapState: state.mapState,
    newPoint: state.newPoint
  }),
  dispatch => ({
    setMapCenter: map => dispatch(setMapCenter(map)),
    setMapZoom: zoom => dispatch(setMapZoom(zoom)),
    addNewPoint: newPoint =>
      dispatch(addNewPoint(newPoint)),
    hidePopup: () => dispatch(hidePopup())
  })
)(MapHolder);
