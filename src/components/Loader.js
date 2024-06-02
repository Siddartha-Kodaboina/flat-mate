import React from 'react';

const Loader = () => {
    const reactBaseUrl = process.env.REACT_APP_NODE_ENV === 'development'
        ? process.env.REACT_APP_LOCAL_REACT_BASE_URL
        : process.env.REACT_APP_PRODUCTION_REACT_BASE_URL;

    return (
        <div className="flex justify-center items-center h-screen">
            <video
                className="w-full h-auto max-w-2xl md:max-w-lg lg:max-w-md"
                autoPlay
                loop
                muted
            >
                <source src={`${reactBaseUrl}/images/rocket-loading.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default Loader;
