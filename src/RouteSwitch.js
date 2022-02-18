import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Navbar from "./components/Navbar";

const RouteSwitch = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" />
      </Routes>
    </BrowserRouter>
  );
};
export default RouteSwitch;
