import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/spinner";
import ProfileItem from "../profiles/ProfileItem";
import { getProfiles } from "../../redux/profile/profile.action";

const Profiles = ({
  getProfiles,
  clearProfiles,
  profile: { profiles, isFetching },
}) => {
  useEffect(() => {
    getProfiles();
    return () => {
      clearProfiles();
    };
  }, [getProfiles]);
  return (
    <Fragment>
      {isFetching ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop"></i> Browse and connect with
            developers
          </p>
          <div className="profiles">
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profile found</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});
export default connect(mapStateToProps, {
  getProfiles,
  clearProfiles: () => ({
    type: "CLEAR_PROFILES",
  }),
})(Profiles);
