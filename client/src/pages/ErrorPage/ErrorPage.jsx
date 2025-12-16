import { Link } from 'react-router-dom';
import errorImg from '../../assets/404.gif';

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-gray-200 text-center px-4">
      {/* Error Image */}
      <img 
        src={errorImg} 
        alt="404 Not Found" 
        className="w-72 max-w-full mb-6 drop-shadow-lg"
      />

      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Oops! Page Not Found
      </h2>

      {/* Subtitle */}
      <p className="text-gray-500 mb-6 max-w-md">
        The page you are looking for doesn’t exist or has been moved.
      </p>

      {/* Button */}
      <Link 
        to="/" 
        className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default ErrorPage;
