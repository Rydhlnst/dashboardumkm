import { NextResponse } from "next/server";
import { getUMKMProducts } from "@/db/queries";

export async function GET() {
  const products = await getUMKMProducts();
  return NextResponse.json(products);
}
