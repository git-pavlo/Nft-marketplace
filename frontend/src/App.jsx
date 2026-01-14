import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyNFTs from './pages/MyNFTs';
import MintNFT from './pages/MintNFT';
import Marketplace from './pages/Marketplace';
import SendNFT from './pages/SendNFT';

function App() {
  const [account, setAccount] = useState(null);

  return (
    <Router>
      <Navbar account={account} setAccount={setAccount} />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home account={account} />} />
          <Route path="/my-nfts" element={<MyNFTs account={account} />} />
          <Route path="/mint" element={<MintNFT account={account} />} />
          <Route path="/marketplace" element={<Marketplace account={account} />} />
          <Route path="/send" element={<SendNFT account={account} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; // ✅ default export
