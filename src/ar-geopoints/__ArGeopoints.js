import React, { PureComponent } from 'react';
// import { View } from 'react-native';
import * as Location from 'expo-location';
import {
  ViroARScene,
  ViroAmbientLight,
  // ViroDirectionalLight,
  // ViroARPlane,
  ViroFlexView,
} from 'react-viro';

import { hasLocationPermission } from '../../utils/locationUtils';

// import { main } from "./style";

/**
 * Description
 * @author ?
 * @class ArGeopoints
 */
class ArGeopoints extends PureComponent {
  /**
   * Definition of the prop types
   */
  static propTypes = {};

  /**
   * Default Props
   */
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      // text: "Initializing AR...",
      northPointX: 0,
      northPointZ: 0,
      southPointX: 0,
      southPointZ: 0,
      eastPointX: 0,
      eastPointZ: 0,
      westPointX: 0,
      westPointZ: 0,
      frontX: 0,
      frontZ: 0,
      heading: null,
    };
  }

  handleHeaderRes = heading => {
    this.setState({ heading });
  };

  handleLocationRes = ({ coords }) => {
    this.setState({ location: coords });
  };

  componentDidMount = () => {
    hasLocationPermission().then(res => {
      if (res) {
        Promise.all([
          Location.getHeadingAsync(),
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
          }),
        ]).then(values => {
          this.handleHeaderRes(values[0]);
          this.handleLocationRes(values[1]);
        });
      }
    });
  };

  onInitialized = () => {
    const CHANGE = 0.002;

    const frontPoint = this.createNotRotatedARObjectPosition(
      this.state.location.latitude + CHANGE,
      this.state.location.longitude
    );
    const northPoint = this.createARObjectPosition(
      this.state.location.latitude + CHANGE,
      this.state.location.longitude
    );
    const southPoint = this.createARObjectPosition(
      this.state.location.latitude - CHANGE,
      this.state.location.longitude
    );
    const eastPoint = this.createARObjectPosition(
      this.state.location.latitude,
      this.state.location.longitude + CHANGE
    );
    const westPoint = this.createARObjectPosition(
      this.state.location.latitude,
      this.state.location.longitude - CHANGE
    );

    // const northPoint = this.createARObjectPosition(-34.587074, -58.432412);
    // const frontPoint = this.createNotRotatedARObjectPosition(
    //   -34.587074,
    //   -58.432412
    // );
    // const southPoint = this.createARObjectPosition(-34.585696, -58.430303);
    // var westPoint = this.createARObjectPosition(47.618539, -122.338644);
    // var southPoint = this.createARObjectPosition(47.61821, -122.338455);
    // console.log('obj north final x:' + northPoint.x + 'final z:' + northPoint.z);
    // console.log('obj south final x:' + southPoint.x + 'final z:' + southPoint.z);
    // console.log('obj east point x' + eastPoint.x + 'final z' + eastPoint.z);
    // console.log('obj west point x' + westPoint.x + 'final z' + westPoint.z);
    this.setState({
      northPointX: northPoint.x,
      northPointZ: northPoint.z,
      southPointX: southPoint.x,
      southPointZ: southPoint.z,
      frontX: frontPoint.x,
      frontZ: frontPoint.z,
      eastPointX: eastPoint.x,
      eastPointZ: eastPoint.z,
      westPointX: westPoint.x,
      westPointZ: westPoint.z,
      text: 'AR Init called.',
    });
  };

  // -34.5863523,-58.4313721 MOBILE
  // -34.586511, -58.431556
  //

  createNotRotatedARObjectPosition = (lat, long) => {
    const objPoint = this.latLongToMerc(lat, long);
    const mobilePoint = this.latLongToMerc(
      this.state.location.latitude,
      this.state.location.longitude
    );

    const objDeltaY = objPoint.y - mobilePoint.y;
    const objDeltaX = objPoint.x - mobilePoint.x;

    const degree = 0;
    const angleRadian = (degree * Math.PI) / 180;

    const newObjX = objDeltaX * Math.cos(angleRadian) - objDeltaY * Math.sin(angleRadian);
    const newObjY = objDeltaX * Math.sin(angleRadian) + objDeltaY * Math.cos(angleRadian);

    return { x: newObjX, y: 0, z: -newObjY };
  };

  createARObjectPosition = (lat, long) => {
    console.log(lat, long); // eslint-disable-line no-console
    const objPoint = this.latLongToMerc(lat, long);
    const mobilePoint = this.latLongToMerc(
      this.state.location.latitude,
      this.state.location.longitude
    );

    const objDeltaY = objPoint.y - mobilePoint.y;
    const objDeltaX = objPoint.x - mobilePoint.x;

    const degree = this.state.heading.trueHeading; // for now i'm using a constant compass value (90 degree clockwise from north)
    console.warn(this.state.heading.trueHeading); // eslint-disable-line no-console
    const angleRadian = (degree * Math.PI) / 180; // degree to radian

    const newObjX = objDeltaX * Math.cos(angleRadian) - objDeltaY * Math.sin(angleRadian);
    const newObjY = objDeltaX * Math.sin(angleRadian) + objDeltaY * Math.cos(angleRadian);

    return { x: newObjX, y: 0, z: -newObjY }; // y is in my case always 0 (center of the screen).
    // for some reason this AR point is not valid? It jumps to different positions in AR space everytime i restart the AR app.
  };

  latLongToMerc = (latDeg, longDeg) => {
    const longRad = (longDeg / 180.0) * Math.PI;
    const latRad = (latDeg / 180.0) * Math.PI;
    const smA = 6378137.0;
    const xmeters = smA * longRad;
    const ymeters = smA * Math.log((Math.sin(latRad) + 1) / Math.cos(latRad));

    return { x: xmeters, y: ymeters };
  };

  cameraUpdate = e => console.log('cameraUpdate:', e); // eslint-disable-line no-console

  render() {
    const { heading } = this.state;
    console.log(this.state); // eslint-disable-line no-console
    return (
      heading && (
        <ViroARScene
          dragType="FixedToWorld"
          onPinch={this.onPinch}
          onTrackingInitialized={this.onInitialized}
          // onCameraTransformUpdate={e => console.log(e)}
        >
          <ViroAmbientLight color="#ffffff" />

          <ViroFlexView
            backgroundColor="red"
            scale={[1, 1, 1]}
            transformBehaviors="billboard"
            height={20}
            width={20}
            position={[this.state.southPointX, 0, this.state.southPointZ]}
          />
          <ViroFlexView
            backgroundColor="blue"
            scale={[1, 1, 1]}
            transformBehaviors="billboard"
            height={20}
            width={20}
            position={[this.state.northPointX, 0, this.state.northPointZ]}
          />
          <ViroFlexView
            backgroundColor="green"
            scale={[1, 1, 1]}
            transformBehaviors="billboard"
            height={20}
            width={20}
            position={[this.state.eastPointX, 0, this.state.eastPointZ]}
          />
          <ViroFlexView
            backgroundColor="black"
            scale={[1, 1, 1]}
            transformBehaviors="billboard"
            height={20}
            width={20}
            position={[this.state.westPointX, 0, this.state.westPointZ]}
          />
          <ViroFlexView
            backgroundColor="white"
            scale={[2, 2, 2]}
            transformBehaviors="billboard"
            height={20}
            width={20}
            position={[this.state.frontX, 0, this.state.frontZ]}
          />
        </ViroARScene>
      )
    );
  }
}

export default ArGeopoints;
