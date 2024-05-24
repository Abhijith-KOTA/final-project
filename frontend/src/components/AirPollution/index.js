import {Component} from 'react'
import {ref, onValue} from 'firebase/database'
import {IoLocationSharp} from 'react-icons/io5'
import {FaRegClock} from 'react-icons/fa'
import Firebase from '../Firebase'
import fetchData from '../GetData/fetchDustData'
import DustChart from '../graphs/DustGraph'
import COChart from '../graphs/CoGraph'
import OzoneChart from '../graphs/OzoneGraph'
import Nh3Chart from '../graphs/Nh3Graph'
import fetchStats from '../GetData/fetchStats'
import './index.css'

class AirPollution extends Component {
  state = {
    PM2_5: null,
    CO: null,
    NH3: null,
    O3: null,
    Humidity: null,
    Temperature: null,
    Time: null,
    Data: [],
    DailyStats:{"min_pm2_5": null,},
    selectedGraph: 'dust',
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

    const dustData = await fetchData()
    this.setState({Data: dustData})

    const statsData = await fetchStats()
    if (statsData !==null){
      this.setState({DailyStats: statsData})
    }
  }

  cityRestrict = e => {
    e.target.value = 'Coimbatore'
  }
  roundToTwoDecimals = (num) => {
    return Math.round(num * 100) / 100;
  };

  dustCat =()=>{
    const {PM2_5} = this.state
    if (PM2_5 == null){
      return null
    }
    if (PM2_5 <= 30){
      return "Good"
    }else if (PM2_5<=60){
      return "Satisfactory"
    }else if (PM2_5<=90){
      return "Moderately polluted"
    }else if(PM2_5<=120){
      return "Poor"
    }else if (PM2_5<=250){
      return "Very Poor"
    }else {
      return "Severe"
    }
  }
  
  coCat = ()=>{
    const {CO} = this.state
    if (CO == null){
      return null
    }
    if (CO<=1){
      return "Good"
    }else if (CO<=2){
      return "Satisfactory"
    }else if (CO<=10){
      return "Moderately polluted"
    }else if(CO<=17){
      return "Poor"
    }else if (CO<=34){
      return "Very Poor"
    }else {
      return "Severe"
    }
  }

  NH3Cat = ()=>{
    const {NH3} = this.state
    if (NH3 == null){
      return null
    }
    if (NH3<=200){
      return "Good"
    }else if (NH3<=400){
      return "Satisfactory"
    }else if (NH3<=800){
      return "Moderately polluted"
    }else if(NH3<=1200){
      return "Poor"
    }else if (NH3<=1800){
      return "Very Poor"
    }else {
      return "Severe"
    }
  }

  O3Cat = ()=>{
    const {O3} = this.state
    if (O3 == null){
      return null
    }
    if (O3<=50){
      return "Good"
    }else if (O3<=100){
      return "Satisfactory"
    }else if (O3<=168){
      return "Moderately polluted"
    }else if(O3<=208){
      return "Poor"
    }else if (O3<=748){
      return "Very Poor"
    }else {
      return "Severe"
    }
  }

  handleGraphChange = (e) => {
    this.setState({ selectedGraph: e.target.value });
    e.target.style.backgroundColor = 'blue';
  };

  renderGraph = () => {
    const { selectedGraph, Data } = this.state;

    switch (selectedGraph) {
      case 'dust':
        return <div className="graph-container">
        <div>
        <h1>Dust </h1>
        <DustChart graphdata={Data} />
        </div>
      </div>
      case 'co':
        return <div className="graph-container">
        <div>
        <h1>CO</h1>
        <COChart graphdata={Data} />
        </div>
      </div>
        
      case 'ozone':
        return <div className="graph-container">
        <div>
        <h1>Ozone</h1>
        <OzoneChart graphdata={Data} />
        </div>
      </div>
      
      case 'nh3':
        return <div className="graph-container">
        <div>
        <h1>NH3</h1>
        <Nh3Chart graphdata={Data} />
        </div>
      </div>
        
      default:
        return null;
    }
  };

  predictRedirect = () =>{
      window.open('https://automatic-tribble-7gvwgpvw6gwfxwpw-3002.app.github.dev/', '_blank');
  }

  render() {
    const {PM2_5, CO, NH3, O3, Humidity, Temperature, Time, DailyStats, selectedGraph} = this.state
    return (
      <>
        <div className="bg-container">
          <div className="nav-bar">
            <h1>Air Quality</h1>
            <button className="predictButton" type='button' onClick={this.predictRedirect}>Predict</button>
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
            <span>Updated {Time} hours ago</span>
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
              <th>Category</th>
            </tr>

            <tr>
              <td className="bold-text">Dust</td>
              <td>{this.roundToTwoDecimals(DailyStats.min_pm2_5)}</td>
              <td>{this.roundToTwoDecimals(DailyStats.avg_pm2_5)}</td>
              <td>{this.roundToTwoDecimals(DailyStats.max_pm2_5)}</td>
              <td>{PM2_5}</td>
              <td>(ug/m<sup>3</sup>)</td>
              <td>{this.dustCat()}</td>
            </tr>

            <tr>
              <td className="bold-text">CO</td>
              <td>{this.roundToTwoDecimals(DailyStats.min_CO)}</td>
              <td>{this.roundToTwoDecimals(DailyStats.avg_CO)}</td>
              <td>{this.roundToTwoDecimals(DailyStats.max_CO)}</td>
              <td>{CO}</td>
              <td>(mg/m<sup>3</sup>)</td>
              <td>{this.coCat()}</td>
            </tr>

            <tr>
              <td className="bold-text">NH3</td>
              <td>{this.roundToTwoDecimals(DailyStats.min_NH3)}</td>
              <td>{this.roundToTwoDecimals(DailyStats.avg_NH3)}</td>
              <td>{this.roundToTwoDecimals(DailyStats.max_NH3)}</td>
              <td>{NH3}</td>
              <td>(ug/m<sup>3</sup>)</td>
              <td>{this.NH3Cat()}</td>
            </tr>

            <tr>
              <td className="bold-text">O3</td>
              <td>{this.roundToTwoDecimals(DailyStats.min_Ozone)}</td>
              <td>{this.roundToTwoDecimals(DailyStats.avg_Ozone)}</td>
              <td>{this.roundToTwoDecimals(DailyStats.max_Ozone)}</td>
              <td>{O3}</td>
              <td>(ug/m<sup>3</sup>)</td>
              <td>{this.O3Cat()}</td>
            </tr>

            <tr>
              <td className="bold-text">Humidity</td>
              <td>{this.roundToTwoDecimals(DailyStats.min_humidity)}</td>
              <td>{this.roundToTwoDecimals(DailyStats.avg_humidity)}</td>
              <td>{this.roundToTwoDecimals(DailyStats.max_humidity)}</td>
              <td>{Humidity}</td>
              <td>(RH)</td>
            </tr>

            <tr>
              <td className="bold-text">Temperature</td>
              <td>{this.roundToTwoDecimals(DailyStats.min_Temperature)}</td>
              <td>{this.roundToTwoDecimals(DailyStats.avg_Temperature)}</td>
              <td>{this.roundToTwoDecimals(DailyStats.max_Temperature)}</td>
              <td>{Temperature}</td>
              <td>(°C)</td>
            </tr>
          </table>
          </div>
        </div>
        <h1 className='trends' >Trends</h1>
        <div className="graph-selector">
          <label>
            <input
              type="radio"
              value="dust"
              checked={selectedGraph === 'dust'}
              onChange={this.handleGraphChange}
            />
            <span className={selectedGraph === 'dust' ? 'selected' : ''}>Dust</span>
          </label>
          <label>
            <input
              type="radio"
              value="co"
              checked={selectedGraph === 'co'}
              onChange={this.handleGraphChange}
            />
            <span className={selectedGraph === 'co' ? 'selected' : ''}>CO</span>
          </label>
          <label>
            <input
              type="radio"
              value="ozone"
              checked={selectedGraph === 'ozone'}
              onChange={this.handleGraphChange}
            />
            <span className={selectedGraph === 'ozone' ? 'selected' : ''}>Ozone</span>
          </label>
          <label>
            <input
              type="radio"
              value="nh3"
              checked={selectedGraph === 'nh3'}
              onChange={this.handleGraphChange}
            />
            <span className={selectedGraph === 'nh3' ? 'selected' : ''}>NH3</span>
          </label>
        </div>
        {this.renderGraph()}
      </>
    )
  }
}

export default AirPollution
