import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import useContract from "./hooks/useContract";
import Mint from "./pages/Mint";

function App() {
  const [account, setAccount] = useState(null);
  const { contract } = useContract(account);

  return (
    <div>
      <ConnectWallet setAccount={setAccount} />
      {account && <p>Connected: {account}</p>}
      {contract && <Mint contract={contract} />}
    </div>
  );
}

export default App;
