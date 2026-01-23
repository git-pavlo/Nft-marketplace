import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletConnect() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const shortAddress = (addr) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
      <div className="flex items-center gap-4">
        {!isConnected ? (
            <ConnectButton />
        ) : (
          <>
            <div className="px-4 py-2 rounded-lg bg-slate-800/50 border border-purple-500/30 text-sm">
              {shortAddress(address)}
            </div>
            <button
              onClick={() => disconnect()}
              className="px-4 py-2 rounded-lg bg-red-600/20 border border-red-500/50 hover:bg-red-600/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Disconnect
            </button>
          </>
        )}
      </div>

  );
}