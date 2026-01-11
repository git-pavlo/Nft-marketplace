import { useEffect, useState } from "react";
import TokenCard from "../components/TokenCard";
import { getContracts } from "../hooks/useWeb3";

export default function Marketplace() {
  const [items, setItems] = useState([]);

  async function load() {
    const { market } = await getContracts();
    const listed = [];

    for (let id = 0; id < 50; id++) {
      try {
        const l = await market.getListing(
          import.meta.env.VITE_NFT_ADDRESS,
          id
        );
        if (l.price > 0n) {
          listed.push({
            id,
            name: `Token #${id}`,
            rank: id % 10,
            price: Number(l.price) / 1e18,
            image: `/tokens/${id}.png`,
          });
        }
      } catch {}
    }
    setItems(listed);
  }

  async function buy(id, price) {
    const { market } = await getContracts();
    await market.buyItem(
      import.meta.env.VITE_NFT_ADDRESS,
      id,
      { value: BigInt(price * 1e18) }
    );
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="grid">
      {items.map((t) => (
        <TokenCard
          key={t.id}
          {...t}
          actions={[
            { label: "Buy", onClick: () => buy(t.id, t.price) },
          ]}
        />
      ))}
    </div>
  );
}
