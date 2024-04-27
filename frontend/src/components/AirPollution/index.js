import {Component} from 'react'
import {ref, onValue} from 'firebase/database'
import {IoLocationSharp} from 'react-icons/io5'
import {FaRegClock} from 'react-icons/fa'
import Firebase from '../Firebase'
import fetchDustData from '../GetData/fetchDustData'
import DustChart from '../graphs/DustGraph'
import COChart from '../graphs/CoGraph'
import OzoneChart from '../graphs/OzoneGraph'
import Nh3Chart from '../graphs/Nh3Graph'
import fetchStats from '../GetData/fetchStats'
import './index.css'

class AirPollution extends Component {
  state = {
    PM2_5: 0,
    CO: 0,
    NH3: 0,
    O3: 0,
    Humidity: 0,
    Temperature: 0,
    Time: 0,
    Data: [],
    DailyStats:{},
  }

  async componentDidMount() {
    const CObase = ref(Firebase, 'test/CO(mg_m^3)')
    onValue(CObase, data => {
      const coValue = data.val()
      this.setState({CO: coValue})
    })

    const NH3base = ref(Firebase, 'test/NH3(ug_m^3)')
    onValue(NH3base, data => {
      const Nh3Value = data.val()
      this.setState({NH3: Nh3Value})
    })

    const O3base = ref(Firebase, 'test/O3(ug_m^3)')
    onValue(O3base, data => {
      const O3Value = data.val()
      this.setState({O3: O3Value})
    })

    const PM25base = ref(Firebase, 'test/dust(ug_m^3)')
    onValue(PM25base, data => {
      const Pm25Value = data.val()
      this.setState({PM2_5: Pm25Value})
    })

    const HumidityBase = ref(Firebase, 'test/humidity')
    onValue(HumidityBase, data => {
      const HumidityValue = data.val()
      this.setState({Humidity: HumidityValue})
    })

    const TemperatureBase = ref(Firebase, 'test/temperature')
    onValue(TemperatureBase, data => {
      const TemperatureValue = data.val()
      this.setState({Temperature: TemperatureValue})
    })

    const TimeBase = ref(Firebase, 'test/datetime')
    onValue(TimeBase, data => {
      const TimeValue = data.val()
      this.setState({Time: TimeValue})
    })

    const dustData = await fetchDustData()
    this.setState({Data: dustData})

    const statsData = await fetchStats()
    this.setState({DailyStats: statsData})
  }

  cityRestrict = e => {
    e.target.value = 'Coimbatore'
  }

  render() {
    const {PM2_5, CO, NH3, O3, Humidity, Temperature, Time, Data, DailyStats} = this.state
    console.log(DailyStats)
    return (
      <>
        <div className="bg-container">
          <div className="nav-bar">
            <h1>Air Quality</h1>
          </div>
          <div className="city">
            <label htmlFor="city">
              <IoLocationSharp className="location-icon" />
            </label>
            <select
              name="city"
              id="city"
              className="city-drop"
              onChange={this.cityRestrict}
            >
              <option value="Coimbatore" selected>
                Coimbatore
              </option>
              <option value="City1">City 1</option>
              <option value="City2">City 2</option>
              <option value="City3">City 3</option>
            </select>
          </div>
          <div className="time-container">
            <FaRegClock className="clock-icon" />
            <span>{Time}</span>
          </div>
          <div className="pollutant-container">
          <table className="table">
            <tr>
              <th>Pollutant</th>
              <th>Min</th>
              <th>Average</th>
              <th>Max</th>
              <th>Instantaneous</th>
              <th>Unit</th>
            </tr>

            <tr>
              <td className="bold-text">Dust</td>
              <td>{DailyStats.min_pm2_5}</td>
              <td>{DailyStats.avg_pm2_5}</td>
              <td>{DailyStats.max_pm2_5}</td>
              <td>{PM2_5}</td>
              <td>(ug/m<sup>3</sup>)</td>
            </tr>

            <tr>
              <td className="bold-text">CO</td>
              <td>{DailyStats.min_CO}</td>
              <td>{DailyStats.avg_CO}</td>
              <td>{DailyStats.max_CO}</td>
              <td>{CO}</td>
              <td>(mg/m<sup>3</sup>)</td>
            </tr>

            <tr>
              <td className="bold-text">NH3</td>
              <td>{DailyStats.min_NH3}</td>
              <td>{DailyStats.avg_NH2}</td>
              <td>{DailyStats.max_NH3}</td>
              <td>{NH3}</td>
              <td>(ug/m<sup>3</sup>)</td>
            </tr>

            <tr>
              <td className="bold-text">O3</td>
              <td>{DailyStats.min_Ozone}</td>
              <td>{DailyStats.avg_Ozone}</td>
              <td>{DailyStats.max_Ozone}</td>
              <td>{O3}</td>
              <td>(ug/m<sup>3</sup>)</td>
            </tr>

            <tr>
              <td className="bold-text">Humidity</td>
              <td>{DailyStats.min_humidity}</td>
              <td>{DailyStats.avg_humidity}</td>
              <td>{DailyStats.max_humidity}</td>
              <td>{Humidity}</td>
              <td>(RH)</td>
            </tr>

            <tr>
              <td className="bold-text">Temperature</td>
              <td>{DailyStats.min_Temperature}</td>
              <td>{DailyStats.avg_Temperature}</td>
              <td>{DailyStats.max_Temperature}</td>
              <td>{Temperature}</td>
              <td>(°C)</td>
            </tr>
          </table>
          </div>
        </div>
        {Data.length > 0 && (
            <div className="graph-container">
              <h1>Dust </h1>
              <DustChart graphdata={Data} />
              <h1>CO</h1>
              <COChart graphdata={Data} />
              <h1>Ozone</h1>
              <OzoneChart graphdata={Data} />
              <h1>NH3</h1>
              <Nh3Chart graphdata={Data} />
            </div>
          )}
      </>
    )
  }
}

export default AirPollution
