export default function TokenCard({
  image,
  name,
  rank,
  price,
  actions = [],
}) {
  return (
    <div className="token-card">
      <img src={image} alt={name} />

      <div className="token-info">
        <div>{name}</div>
        <div>Rank: {rank}</div>
        <div>{price} ETH</div>
      </div>

      <div className="token-actions">
        {actions.map((a) => (
          <button key={a.label} onClick={a.onClick}>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
