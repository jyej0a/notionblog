/**
 * Notion API 연동 및 데이터 가공 로직
 * 
 * 이 파일은 Notion 데이터베이스와 통신하여
 * 블로그 게시글 데이터를 가져오고 처리하는 역할을 합니다.
 */

import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Notion을 Markdown으로 변환하는 인스턴스
const n2m = new NotionToMarkdown({ notionClient: notion });

/**
 * 게시글의 타입 정의
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  publishedDate: string | null;
  summary: string | null;
  category: string | null;
  thumbnail: string | null;
}

/**
 * Notion 데이터베이스에서 모든 게시글을 가져옵니다.
 * Published가 체크된 게시글만 반환합니다.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Published Date",
          direction: "descending",
        },
      ],
    });

    const posts: BlogPost[] = response.results.map((page) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const properties = (page as any).properties;

      // Files 속성에서 썸네일 이미지 URL 추출
      let thumbnail: string | null = null;
      if (properties.Files?.files && properties.Files.files.length > 0) {
        const file = properties.Files.files[0];
        thumbnail = file.type === "external" ? file.external.url : file.file.url;
      }

      return {
        id: page.id,
        title: properties.Name?.title?.[0]?.plain_text || "",
        slug: properties.Slug?.rich_text?.[0]?.plain_text || "",
        published: properties.Published?.checkbox || false,
        publishedDate: properties["Published Date"]?.date?.start || null,
        summary: properties.Summary?.rich_text?.[0]?.plain_text || null,
        category: properties.Category?.select?.name || null,
        thumbnail,
      };
    });

    return posts;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

/**
 * Slug를 기반으로 특정 게시글을 가져옵니다.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        and: [
          {
            property: "Slug",
            rich_text: {
              equals: slug,
            },
          },
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const page = response.results[0] as any;
    const properties = page.properties;

    // Files 속성에서 썸네일 이미지 URL 추출
    let thumbnail: string | null = null;
    if (properties.Files?.files && properties.Files.files.length > 0) {
      const file = properties.Files.files[0];
      thumbnail = file.type === "external" ? file.external.url : file.file.url;
    }

    return {
      id: page.id,
      title: properties.Name?.title?.[0]?.plain_text || "",
      slug: properties.Slug?.rich_text?.[0]?.plain_text || "",
      published: properties.Published?.checkbox || false,
      publishedDate: properties["Published Date"]?.date?.start || null,
      summary: properties.Summary?.rich_text?.[0]?.plain_text || null,
      category: properties.Category?.select?.name || null,
      thumbnail,
    };
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    return null;
  }
}

/**
 * Notion 페이지의 콘텐츠를 Markdown으로 변환합니다.
 */
export async function getPostContent(pageId: string): Promise<string> {
  try {
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdBlocks);
    return mdString.parent || "";
  } catch (error) {
    console.error("Error converting page to markdown:", error);
    return "";
  }
}

/**
 * 모든 게시글의 Slug 목록을 가져옵니다.
 * (sitemap.xml 생성에 사용)
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getBlogPosts();
  return posts.map((post) => post.slug);
}

/**
 * 카테고리별로 게시글을 필터링합니다.
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts.filter((post) => post.category === category);
}

/**
 * 검색어로 게시글을 필터링합니다.
 */
export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  if (!query) return posts;
  
  const lowerQuery = query.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.summary?.toLowerCase().includes(lowerQuery) ||
      post.category?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * 모든 카테고리 목록을 가져옵니다.
 */
export async function getAllCategories(): Promise<string[]> {
  const posts = await getBlogPosts();
  const categories = posts
    .map((post) => post.category)
    .filter((category): category is string => category !== null);
  return Array.from(new Set(categories)).sort();
}

/**
 * 특정 게시글과 관련된 게시글을 추천합니다.
 * 같은 카테고리이거나 제목/요약이 유사한 게시글을 반환합니다.
 */
export async function getRelatedPosts(
  currentPostSlug: string,
  limit: number = 3
): Promise<BlogPost[]> {
  const currentPost = await getBlogPostBySlug(currentPostSlug);
  if (!currentPost) return [];

  const allPosts = await getBlogPosts();
  const otherPosts = allPosts.filter((post) => post.slug !== currentPostSlug);

  // 같은 카테고리 우선
  const sameCategoryPosts = otherPosts.filter(
    (post) => post.category === currentPost.category && post.category !== null
  );

  // 나머지는 최신순
  const remainingPosts = otherPosts.filter(
    (post) => !sameCategoryPosts.includes(post)
  );

  return [...sameCategoryPosts, ...remainingPosts].slice(0, limit);
}

