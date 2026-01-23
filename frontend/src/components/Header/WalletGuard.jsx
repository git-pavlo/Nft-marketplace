import { useAccount, useDisconnect } from "wagmi";
import { useEffect, useRef } from "react";

export default function WalletGuard() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const prevAddressRef = useRef(null);

  useEffect(() => {
    // On first load, store current address
    if (isConnected && !prevAddressRef.current) {
      prevAddressRef.current = address;
      return;
    }

    // If wallet/account changes, auto-disconnect
    if (isConnected && prevAddressRef.current && address !== prevAddressRef.current) {
      disconnect();
      prevAddressRef.current = null;
    }

    // If disconnected manually or page reloads
    if (!isConnected) {
      prevAddressRef.current = null;
    }
  }, [address, isConnected, disconnect]);

  return null; // no UI
}
