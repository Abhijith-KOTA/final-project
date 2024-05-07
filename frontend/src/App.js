import React, { useEffect } from 'react';
import './App.css';
import AirPollution from './components/AirPollution';
import backendhandler from './components/UpdateBackend';

const App = () => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                await backendhandler(); // Wait for backend data to be fetched and sent
            } catch (error) {
                console.error('Error fetching backend data:', error);
            }
        };

        // Initial fetch when component mounts
        fetchData();

        // Set up interval to fetch data every 60 seconds
        const intervalId = setInterval(fetchData, 10000); // 60 seconds in milliseconds

        // Cleanup function to clear the interval when the component unmounts or the effect re-runs
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array to run the effect only once when the component mounts

    return (
        <>
            <AirPollution />
            {/* You can render other components or JSX here */}
        </>
    );
};

export default App;
