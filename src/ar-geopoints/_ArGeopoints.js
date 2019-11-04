import React, { PureComponent } from 'react';
// import { View } from 'react-native';
import {
  ViroARScene,
  ViroAmbientLight,
  // ViroDirectionalLight,
  // ViroARPlane,
  ViroBox,
  ViroText,
} from 'react-viro';

import { main } from './style';

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
      text: 'Initializing AR...',
      northPointX: 0,
      northPointZ: 0,
      eastPointX: 0,
      eastPointZ: 0,
    };
  }

  onInitialized = () => {
    const northPoint = this.createARObjectPosition(-34.586511, -58.431556);
    const eastPoint = this.createARObjectPosition(-34.585716, -58.430746);
    // var westPoint = this.createARObjectPosition(47.618539, -122.338644);
    // var southPoint = this.createARObjectPosition(47.61821, -122.338455);
    // console.log('obj north final x:' + northPoint.x + 'final z:' + northPoint.z);
    // console.log('obj south final x:' + southPoint.x + 'final z:' + southPoint.z);
    // console.log('obj east point x' + eastPoint.x + 'final z' + eastPoint.z);
    // console.log('obj west point x' + westPoint.x + 'final z' + westPoint.z);
    this.setState({
      northPointX: northPoint.x,
      northPointZ: northPoint.z,
      // southPointX: southPoint.x,
      // southPointZ: southPoint.z,
      eastPointX: eastPoint.x,
      eastPointZ: eastPoint.z,
      // westPointX: westPoint.x,
      // westPointZ: westPoint.z,
      text: 'AR Init called.',
    });
  };

  // -34.5863523,-58.4313721 MOBILE
  // -34.586511, -58.431556
  //

  createARObjectPosition = (lat, long) => {
    const objPoint = this.latLongToMerc(lat, long);
    const mobilePoint = this.latLongToMerc('-34.5863523', '-58.4313721');

    const objDeltaY = objPoint.y - mobilePoint.y;
    const objDeltaX = objPoint.x - mobilePoint.x;

    const degree = 90; // for now i'm using a constant compass value (90 degree clockwise from north)
    const angleRadian = (degree * Math.PI) / 180; // degree to radian

    const newObjX = objDeltaX * Math.cos(angleRadian) - objDeltaY * Math.sin(angleRadian);
    const newObjY = objDeltaX * Math.sin(angleRadian) + objDeltaY * Math.cos(angleRadian);

    return { x: newObjX, y: 0, z: newObjY }; // y is in my case always 0 (center of the screen).
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

  render() {
    return (
      <ViroARScene
        dragType="FixedToWorld"
        onPinch={this.onPinch}
        onTrackingInitialized={this.onInitialized}
      >
        <ViroAmbientLight color="#ffffff" />

        <ViroText
          text={this.state.text}
          scale={[0.2, 2, 0.2]}
          position={[0, -2, -5]}
          style={main.helloWorldTextStyle}
        />
        <ViroText
          text="North Text"
          scale={[3, 3, 3]}
          transformBehaviors={['billboard']}
          position={[this.state.northPointX, 0, this.state.northPointZ]}
          style={main.helloWorldTextStyle}
        />

        <ViroText
          text="East Text"
          scale={[3, 3, 3]}
          transformBehaviors={['billboard']}
          position={[this.state.eastPointX, 0, this.state.eastPointZ]}
          style={main.helloWorldTextStyle}
        />

        <ViroBox scale={[3, 3, 3]} position={[this.state.eastPointX, 0, this.state.eastPointZ]} />
      </ViroARScene>
    );
  }
}

export default ArGeopoints;
