import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/spinner";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import ProfileGithub from "./ProfileGithub";
import { getProfileById } from "../../redux/profile/profile.action";
import { Link } from "react-router-dom";

const Profile = ({
  getProfileById,
  profile: { profileById, loading },
  auth,
  match,
  clearProfileById,
}) => {
  useEffect(() => {
    getProfileById(match.params.id);

    return () => {
      clearProfileById();
    };
  }, [getProfileById, match.params.id]);
  // profile === null ||
  return (
    <Fragment>
      {profileById === null || loading === true ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/profiles" className="btn btn-light">
            Back To Profile
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profileById.user._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                Edit Profile
              </Link>
            )}
          <div className="profile-grid my-1">
            <ProfileTop profile={profileById} />
            <ProfileAbout profile={profileById} />
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
              {profileById.experience.length > 0 ? (
                <Fragment>
                  {profileById.experience.map((exp) => (
                    <ProfileExperience key={exp._id} experience={exp} />
                  ))}
                </Fragment>
              ) : (
                <h4>No experience credentials</h4>
              )}
            </div>
            <div className="profile-edp bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {profileById.education.length > 0 ? (
                <Fragment>
                  {profileById.education.map((edu) => (
                    <ProfileEducation key={edu._id} education={edu} />
                  ))}
                </Fragment>
              ) : (
                <h4>No education credentials</h4>
              )}
            </div>
            {profileById.githubusername && (
              <ProfileGithub username={profileById.githubusername} />
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getProfileById,
  clearProfileById: () => ({
    type: "CLEAR_PROFILE_BY_ID",
  }),
})(Profile);
