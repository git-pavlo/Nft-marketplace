import { useEffect, useState } from "react";
import TokenCard from "../components/TokenCard";
import { getContracts } from "../hooks/useWeb3";

export default function MyToken() {
  const [tokens, setTokens] = useState([]);

  async function load() {
    const { nft, market, account } = await getContracts();
    const owned = [];

    for (let id = 0; id < 50; id++) {
      try {
        if ((await nft.ownerOf(id)) === account) {
          owned.push({
            id,
            name: `MyToken #${id}`,
            rank: id % 10,
            price: "—",
            image: `/tokens/${id}.png`,
          });
        }
      } catch {}
    }
    setTokens(owned);
  }

  async function mint() {
    const { nft } = await getContracts();
    await (await nft.mint()).wait();
    load();
  }

  return (
    <>
      <button onClick={mint}>Mint</button>

      <div className="grid">
        {tokens.map((t) => (
          <TokenCard
            key={t.id}
            {...t}
            actions={[
              { label: "Sell", onClick: () => alert("sell") },
              { label: "Send", onClick: () => alert("send") },
            ]}
          />
        ))}
      </div>
    </>
  );
}
  