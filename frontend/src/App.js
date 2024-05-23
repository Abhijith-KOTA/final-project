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

        fetchData();

        const intervalId = setInterval(fetchData, 60000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <AirPollution />
        </>
    );
};

export default App;
