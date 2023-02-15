import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './styles/App.css';
import Map from './routes/Map';
import Home from './routes/Home';
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/map/:country">
          <Map />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>

  );
}

export default App;
