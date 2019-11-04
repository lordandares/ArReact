import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ArMap from './ArMap';
import { saveHeadingAR, saveLocationAR } from '../../store/actions/locationARActionCreators';

const mapStateToProps = state => ({
  location: state.locationAR.location,
  heading: state.locationAR.heading,
  camera: state.locationAR.camera,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      saveHeadingAR,
      saveLocationAR,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArMap);
