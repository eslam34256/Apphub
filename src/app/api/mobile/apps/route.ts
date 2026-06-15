import { NextRequest, NextResponse } from "next/server";
import { apps } from "@/data/apps";
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const country = searchParams.get("country");
  const query = searchParams.get("q");
  const limit = Number(searchParams.get("limit") ?? "20");
  let result = [...apps];
  if (category) result = result.filter(a => a.category === category);
  if (country) result = result.filter(a => a.countries.includes(country as any));
  if (query) { const q = query.toLowerCase(); result = result.filter(a => a.name.toLowerCase().includes(q) || a.shortDescription.toLowerCase().includes(q) || a.tags.join(" ").toLowerCase().includes(q)); }
  return NextResponse.json({ success:true, total:result.length, data:result.slice(0,limit) });
}
