export async function GET() {
  try {
    // Replace with real logic later
    const tvl = 123456; 

    return Response.json({ tvl });
  } catch (err) {
    return Response.json({ error: "Failed to fetch TVL" }, { status: 500 });
  }
}