import { Link } from 'react-router-dom';


const NotFound = () => {

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] text-[#2c3e50] text-center p-8">
            <h1 className="text-[8rem] font-bold text-[#e74c3c] m-0">
                404
            </h1>
            <p className="text-[2rem] mt-4 font-heading">
                Oops! Page not found.
            </p>
            <p className="text-[1.1rem] my-4 mb-8 max-w-[500px] font-paragraph">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="inline-block px-6 py-3 bg-[#3498db] text-white rounded-lg transition-colors duration-300 hover:bg-[#2980b9] font-paragraph"
            >
                ⬅ Go back home
            </Link>
        </div>
    );
};

export default NotFound;

