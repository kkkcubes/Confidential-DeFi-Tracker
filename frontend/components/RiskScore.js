export default function RiskScore({ portfolio }) {
  const risk =
    portfolio.assets.length > 3 ? "High" : "Low";

  return <div>Risk: {risk}</div>;
}