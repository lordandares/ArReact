import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  ViroARScene,
  ViroAmbientLight,
  // ViroDirectionalLight,
  // ViroARPlane,
  ViroFlexView,
  ViroConstants,
} from 'react-viro';

class ArGeopoints extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      north: {},
      tracking: 1,
    };
  }

  static propTypes = {
    // location: PropTypes.any.isRequired,
    // heading: PropTypes.any.isRequired,
    // camera: PropTypes.any.isRequired,
    // saveHeadingAR: PropTypes.func.isRequired,
    saveCameraAR: PropTypes.func.isRequired,
    heading: PropTypes.any.isRequired,
    location: PropTypes.any.isRequired,
  };

  handleCameraUpdate = camera => {
    this.props.saveCameraAR(camera);
  };

  trackingUpdateHandler = tracking => {
    this.setState({ tracking });
    if (tracking === ViroConstants.TRACKING_NORMAL) {
      this.updatePoints();
    }
  };

  latLongToMerc = (latDeg, longDeg) => {
    const longRad = (longDeg / 180.0) * Math.PI;
    const latRad = (latDeg / 180.0) * Math.PI;
    const smA = 6378137.0;
    const xmeters = smA * longRad;
    const ymeters = smA * Math.log((Math.sin(latRad) + 1) / Math.cos(latRad));

    return { x: xmeters, y: ymeters };
  };

  updatePoints = () => {
    const { location } = this.props;
    const north = this.createARObjectlocation(location.latitude + 0.002, location.longitude);
    this.setState({ north });
  };

  createARObjectlocation = (lat, long) => {
    const objPoint = this.latLongToMerc(lat, long);
    const mobilePoint = this.latLongToMerc(
      this.props.location.latitude,
      this.props.location.longitude
    );

    const objDeltaY = objPoint.y - mobilePoint.y;
    const objDeltaX = objPoint.x - mobilePoint.x;

    const degree = this.props.heading.trueHeading;
    const angleRadian = (degree * Math.PI) / 180;

    const newObjX = objDeltaX * Math.cos(angleRadian) - objDeltaY * Math.sin(angleRadian);
    const newObjY = objDeltaX * Math.sin(angleRadian) + objDeltaY * Math.cos(angleRadian);

    return { x: newObjX, y: 0, z: -newObjY };
  };

  render() {
    const { north, tracking } = this.state;
    return (
      <ViroARScene
        dragType="FixedToWorld"
        onPinch={this.onPinch}
        onTrackingUpdated={this.trackingUpdateHandler}
        // onCameraTransformUpdate={this.handleCameraUpdate}
      >
        <ViroAmbientLight color="#ffffff" />

        {tracking === ViroConstants.TRACKING_NORMAL && (
          <>
            <ViroFlexView
              backgroundColor="red"
              scale={[1, 1, 1]}
              transformBehaviors="billboard"
              height={20}
              width={20}
              position={[north.x, north.y, north.z]}
            />
          </>
        )}
      </ViroARScene>
    );
  }
}
export default ArGeopoints;
