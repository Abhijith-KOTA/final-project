import Firebase from '../Firebase'
import {ref, onValue} from 'firebase/database'

let postedData = {};

const sendDataToBackend = async (newData) => {
    try {
        const time = newData.time
        const pm2_5 = newData.pm2_5
        
        const { CO, NH3, Ozone, humidity, Temperature } = newData;
        if (time !==undefined || pm2_5!==undefined){

        // Send data to backend API
        const response = await fetch('https://reimagined-space-bassoon-4xj6xwj64v6c7wpp-3001.app.github.dev/insertdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                time,
                pm2_5,
                CO,
                NH3,
                Ozone,
                humidity,
                Temperature
            })
        });

        if (!response.ok) {
            console.log(`Failed to send data to backend: ${response.statusText}`);
            return
        }

        console.log('Data sent to backend successfully.');
    }
    } catch (error) {
        console.error('Error sending data to backend:', error);
    }
}

const backendhandler = async () => {
    try {
        const PM25base = ref(Firebase, 'test/dust(ug_m^3)');
        const CObase = ref(Firebase, 'test/CO(mg_m^3)');
        const NH3base = ref(Firebase, 'test/NH3(ug_m^3)');
        const O3base = ref(Firebase, 'test/O3(ug_m^3)');
        const HumidityBase = ref(Firebase, 'test/humidity');
        const TemperatureBase = ref(Firebase, 'test/temperature');
        const TimeBase = ref(Firebase, 'test/datetime');

        let newData = {};
        // Fetch data from Firebase
        await Promise.all([
            onValue(PM25base, data => { newData["pm2_5"] = data.val()}),
            onValue(CObase, data => { newData.CO = data.val() }),
            onValue(NH3base, data => { newData.NH3 = data.val() }),
            onValue(O3base, data => { newData.Ozone = data.val() }),
            onValue(HumidityBase, data => { newData.humidity = data.val() }),
            onValue(TemperatureBase, data => { newData.Temperature = data.val() }),
            onValue(TimeBase, data => { newData["time"] = data.val() })
        ]).then(() => {
            if (JSON.stringify(newData) !== JSON.stringify(postedData)) {
                sendDataToBackend(newData);
                postedData = { ...newData };
            }else{
                console.log("Data Not Changed")
            }
        });
        return 
    } catch (error) {
        console.error('Error in backend handler:', error);
        return 
    }
}

export default backendhandler;
