import Header from "./components/Header";
import Footer from "./components/Footer";
import Miner from "./components/Miner";
import "./styles/App.scss"
import 'react-tooltip/dist/react-tooltip.css'
import {observer} from "mobx-react-lite";
import Login from "./Login";
import store from "./store";
import {useEffect} from "react";

function App() {
    useEffect(() => {
        console.log(store.user)
    }, [])

  return store.user ? <div className="App">
      <Header />
      <Miner />
      <Footer />
  </div> : <Login />;
}

export default observer(App);
