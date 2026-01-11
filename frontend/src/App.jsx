import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import Header from "./components/Header";
import LeftPanel from "./components/LeftPanel";
import "./styles/layout.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <img src="/background.png" className="background" />

        <Header />
        <LeftPanel />
        <Router />
      </div>
    </BrowserRouter>
  );
}
