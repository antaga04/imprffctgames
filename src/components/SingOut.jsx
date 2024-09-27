import { PowerIcon } from '../icons';
import PropTypes from 'prop-types';

const SingOut = ({ handleLogout }) => {
  return (
    <div onClick={handleLogout} className="w-full contents">
      <button className="flex h-[48px] w-fit grow items-center justify-center gap-2 rounded-md bg-red-500 p-3 text-sm font-medium hover:bg-red-600 md:flex-none md:justify-start md:p-2 md:px-3">
        <PowerIcon className="w-6" />
        <div className="hidden md:block">Singout</div>
      </button>
    </div>
  );
};

export default SingOut;

SingOut.propTypes = {
  handleLogout: PropTypes.func,
};
