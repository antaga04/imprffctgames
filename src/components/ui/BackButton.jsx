import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '../../icons';
import PropTypes from 'prop-types';

const BackButton = ({ url }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const automaticNavigate = () => {
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  const handleBack = () => {
    url ? navigate(url) : automaticNavigate();
  };

  return (
    <button
      onClick={handleBack}
      className="group absolute top-4 left-4 md:top-10 md:left-10 flex items-center px-4 py-2 rounded-3xl text-[#f2f2f2] bg-[#f2f2f226] hover:bg-[#f2f2f233] border border-[#f2f2f20a] hover:border-[#f2f2f21a] z-10 backdrop-blur-md transition-all duration-400 ease-[cubic-bezier(.165,.84,.44,1)]"
    >
      <span className="inline-block mr-2 transform transition-transform duration-300 ease-[cubic-bezier(.25,.8,.25,1)] group-hover:-translate-x-1 fill-[#f2f2f2]">
        <ArrowLeftIcon />
      </span>
      Back
    </button>
  );
};

export default BackButton;

BackButton.propTypes = {
  url: PropTypes.string,
};
