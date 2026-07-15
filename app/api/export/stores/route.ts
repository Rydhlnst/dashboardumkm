import { NextResponse } from "next/server";
import { getStores } from "@/db/queries";

export async function GET() {
  const stores = await getStores();
  return NextResponse.json(stores);
}
