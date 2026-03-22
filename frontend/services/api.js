export async function fetchPortfolio(address) {
  const res = await fetch(`/api/portfolio?address=${address}`);
  return res.json();
}