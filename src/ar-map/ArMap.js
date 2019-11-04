import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';
import { ViroARSceneNavigator } from 'react-viro';
import { main } from './style';
import ArGeopoints from '../../components/ar-geopoints';
import { hasLocationPermission } from '../../utils/locationUtils';

const VIRO_API_KEY = '66753729-E90A-4DDD-890F-6A885E3AEA89';

/**
 * Description
 * @author ?
 * @class ArMap
 */
export default class ArMap extends PureComponent {
  /**
   * Navigator styles
   */
  static navigatorStyle = {};

  /**
   * Definition of the prop types
   */
  static propTypes = {
    location: PropTypes.any.isRequired,
    heading: PropTypes.any.isRequired,
    camera: PropTypes.any.isRequired,
    saveHeadingAR: PropTypes.func.isRequired,
    saveLocationAR: PropTypes.func.isRequired,
  };

  /**
   * Default Props
   */
  static defaultProps = {};

  /**
   * Name of the page for the tracking
   */
  static displayName = 'ArMap';

  // constructor(props) {
  //   super(props);
  // }

  handleHeaderRes = heading => {
    this.props.saveHeadingAR(heading);
  };

  handleLocationRes = ({ coords }) => {
    this.props.saveLocationAR(coords);
  };

  componentDidMount = () => {
    hasLocationPermission().then(res => {
      if (res) {
        Location.watchHeadingAsync(this.handleHeaderRes);
        Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            // timeInterval: 0,
            // distanceInterval: 0,
          },
          this.handleLocationRes
        );
      }
    });
  };

  render() {
    const { location, heading } = this.props;
    return (
      <View style={main.container}>
        <View>
          <Text>Heading: {heading.trueHeading}</Text>
          <Text>Location: {JSON.stringify(location)}</Text>
        </View>
        {heading.trueHeading && location.latitude && (
          <ViroARSceneNavigator
            style={main.container}
            initialScene={{ scene: ArGeopoints }}
            apiKey={VIRO_API_KEY}
          />
        )}
      </View>
    );
  }
}
