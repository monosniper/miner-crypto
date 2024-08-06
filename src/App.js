import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/App.scss"
import Stats from "./components/Stats";
import Coins from "./components/Coins";
import Panel from "./components/Panel";

function App() {
  return <div className="App">
      <Header />
      <Coins />
      <Stats />
      <Panel />

      <Footer />
  </div>;
}

export default App;
