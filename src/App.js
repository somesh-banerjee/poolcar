import './App.css';
import RegisterDriverButton from './components/RegisterDriver'
import DriverDashboard from './components/DriverDashboard'
import CustomerDashboard from './components/CustomerDashboard'

function App() {
  return (
    <div className="App">
      <RegisterDriverButton />
      <h2>Driver</h2>
      <DriverDashboard />
      <h2>Customer</h2>
      <CustomerDashboard />
    </div>
  );
}

export default App;
