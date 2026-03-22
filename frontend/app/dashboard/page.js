"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState(null);
  const [tvl, setTvl] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/portfolio")
      .then(res => res.json())
      .then(data => setPortfolio(data));

    fetch("http://localhost:5000/api/tvl")
      .then(res => res.json())
      .then(data => setTvl(data.tvl));
  }, []);

  if (!portfolio) return <div className="text-white">Loading...</div>;

  return (
    <div className="bg-black min-h-screen p-6 text-white">
      <h1 className="text-2xl mb-6 font-bold">DeFi Dashboard</h1>

      <StatsCards total={portfolio.totalValue} tvl={tvl} />

      <div className="mt-6">
        <MainChart />
      </div>

      <Transactions />
    </div>
  );
}

/* ========================= */
function StatsCards({ total, tvl }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card title="Total Balance" value={`$${total}`} />
      <Card title="TVL" value={`$${tvl}`} />
      <Card title="APY" value="12.5%" />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-gray-900 p-4 rounded-2xl">
      <p className="text-gray-400">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}

/* ========================= */
function MainChart() {
  const data = [
    { time: "Mon", price: 100 },
    { time: "Tue", price: 120 },
    { time: "Wed", price: 90 },
    { time: "Thu", price: 140 },
    { time: "Fri", price: 180 },
  ];

  return (
    <div className="bg-gray-900 p-4 rounded-2xl">
      <h2 className="mb-4">Portfolio Value</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#4ade80" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ========================= */
function Transactions() {
  return (
    <div className="bg-gray-900 p-4 rounded-2xl mt-6">
      <h2 className="mb-3">Recent Activity</h2>

      <table className="w-full text-gray-300">
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Swap</td>
            <td>$200</td>
            <td className="text-green-400">Success</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}