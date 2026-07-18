import { useEffect, useState } from 'react';

const messages = ['Loading', 'Loading.', 'Loading..', 'Loading...'];

const Loader = () => {
    const [message, setMessage] = useState(messages[0]);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setMessage(messages[i]);
            i = (i + 1) % messages.length;
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef]">

            <div className="w-[60px] h-[60px] border-[6px] border-[#dee2e6] border-t-[#007bff] rounded-full animate-spin mb-5"></div>

            <p className="text-[1.2rem] font-medium text-[#495057] tracking-[0.5px] transition-opacity duration-300 font-paragraph">
                {message}
            </p>
        </div>
    );
};

export default Loader;

