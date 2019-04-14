import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import * as userActions from '../redux/actions/application/user';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as currentPosition from 'framework-ui/src/utils/currentPosition';
import Map, { MapyCzProvider, MarkerLayer, Marker } from 'react-mapycz/src';
import { MouseControl, KeyboardControl, ZoomControl, CompassControl, SyncControl } from 'react-mapycz/src/controls';
import Loader from './Loader';

const LABELS = {
     // 2:  'World',
     // 5:  'States',
     8: 'Stát',
     11: 'Města',
     14: 'Vesnice',
     17: 'Ulice',
     20: 'Budovy'
};

const styles = theme => ({
     errorColor: {
          color: theme.errorColor
     },
     loaderDiv: {
          position: 'relative',
          left: '50%',
          top: '20%'
     },
     root: {
          height: '100%'
     },
     mapPlaceholder: {
          height: '50vh'
     },
     errorGeoPermission: {
          backgroundColor: 'rgb(254,243,216)',
          fontSize: 20
     }
});

class SMapOwn extends Component {
     state = {
          userPosition: {
               loaded: false,
               error: false
          }
     };
     componentDidMount() {
          const { enableSendingCurrPosition, disableSendingCurrPosition, sendCurrentPosition, enableGeoLocation } = this.props;

          if (enableGeoLocation) {
               console.log('getting position');
               const success = () => {
                    if (sendCurrentPosition) enableSendingCurrPosition();
                    currentPosition.get(this.setPosition, this.handlePositionError);
                    this.positionWatchID = currentPosition.watching(this.setPosition);
               };
               const error = () => {
                    console.log('error');
                    disableSendingCurrPosition();
                    this.handlePositionError();
               };
               currentPosition.init(success, error);
          } else {
               this.setState({ userPosition: { loaded: true } });
          }
     }
     setPosition = position => {
          const { latitude, longitude } = position.coords;
          console.log('setPosition');
          this.setState({
               userPosition: {
                    timestamp: position.timestamp,
                    coords: [latitude, longitude],
                    loaded: true
               }
          });
     };
     handlePositionError = error => {
          if (error === 'cannotFindPosition') {
               this.setState({
                    userPosition: {
                         loaded: false,
                         error: true,
                         errorText: 'Nelze najít vaši polohu'
                    }
               });
          } else {
               this.setState({
                    userPosition: {
                         loaded: false,
                         error: true
                    }
               });
          }
     };
     componentWillUnmount() {
          if (this.props.enableGeoLocation && this.props.sendCurrentPosition) {
               clearInterval(this.positionInterval);
               this.props.disableSendingCurrPosition();
               currentPosition.clearWatch(this.positionWatchID);
          }
     }
     render() {
          const { classes, showUserPosition } = this.props;
          const { userPosition } = this.state;
          const posLoaded = userPosition.loaded;
          const posError = userPosition.error;
          return posLoaded ? (
               <Map height="50vh" centerCoords={userPosition.coords}>
                    <SyncControl />
                    <MouseControl zoom={false} />
                    <KeyboardControl />
                    <ZoomControl title={['Přiblížit', 'Oddálit']} labels={LABELS} />
                    <CompassControl title="Pohyb" />
                    <MarkerLayer>
                         {showUserPosition && (
                              <Marker title="Moje pozice" coords={userPosition.coords} imageUrl="my_location.svg" width={30} />
                         )}
                         {this.props.markers.map((marker, idx) => (
                              <Marker
                                   title={marker.title}
                                   key={`marker-${idx}`}
                                   coords={marker.coords}
                                   imageUrl="marker.svg"
                                   width={35}
                              />
                         ))}
                    </MarkerLayer>
               </Map>
          ) : !posError ? (
               <div className={classes.loaderDiv + ' ' + classes.mapPlaceholder}>
                    <Loader open={true} />
               </div>
          ) : (
               <div className={classes.mapPlaceholder + ' ' + classes.errorGeoPermission}>
                    <span>
                         {userPosition.errorText
                              ? userPosition.errorText
                              : 'Pro správnou funkčnost mapy je potřeba povolit přístup k poloze.'}
                    </span>
               </div>
          );
     }
}

SMapOwn.defaultProps = {
     sendCurrentPosition: false,
     enableGeoLocation: true,
     showUserPosition: true,
     markers: []
};

const _mapDispatchToProps = dispatch =>
     bindActionCreators(
          {
               enableSendingCurrPosition: userActions.enableSendingCurrPosition,
               disableSendingCurrPosition: userActions.disableSendingCurrPosition
          },
          dispatch
     );

export default withStyles(styles)(
     connect(
          null,
          _mapDispatchToProps
     )(MapyCzProvider(SMapOwn))
);
