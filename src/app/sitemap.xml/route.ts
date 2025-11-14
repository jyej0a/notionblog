/**
 * sitemap.xml 동적 생성
 * 
 * 검색 엔진에 사이트 구조를 알려주는 XML 파일을 생성합니다.
 * 모든 게시글의 URL을 포함합니다.
 */

import { NextResponse } from "next/server";
import { getAllPostSlugs } from "@/lib/notion";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const slugs = await getAllPostSlugs();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${slugs
    .map(
      (slug) => `  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

