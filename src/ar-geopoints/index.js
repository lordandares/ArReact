import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ArGeopoints from './ArGeopoints';

import { saveCameraAR } from '../../store/actions/locationARActionCreators';

const mapStateToProps = state => ({
  location: state.locationAR.location,
  heading: state.locationAR.heading,
  camera: state.locationAR.camera,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      saveCameraAR,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArGeopoints);
