import { NavLink } from "react-router-dom";

export default function LeftPanel() {
  return (
    <div className="left-panel">
      <NavLink to="/mytoken">MyToken</NavLink>
      <NavLink to="/marketplace">Marketplace</NavLink>
    </div>
  );
}
