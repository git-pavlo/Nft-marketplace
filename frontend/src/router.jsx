import { Routes, Route, Navigate } from "react-router-dom";
import MyToken from "./pages/MyToken";
import Marketplace from "./pages/Marketplace";

export default function Router() {
  return (
    <div className="main-content">
      <Routes>
        <Route path="/" element={<Navigate to="/marketplace" />} />
        <Route path="/mytoken" element={<MyToken />} />
        <Route path="/marketplace" element={<Marketplace />} />
      </Routes>
    </div>
  );
}
