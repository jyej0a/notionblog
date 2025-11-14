/**
 * 게시글 상세 페이지
 * 
 * Slug를 기반으로 동적 라우팅을 구현합니다.
 * Notion 페이지의 콘텐츠를 Markdown으로 변환하여 렌더링합니다.
 */

import { getBlogPostBySlug, getPostContent, getAllPostSlugs } from "@/lib/notion";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import Image from "next/image";
import type { Metadata } from "next";
import "highlight.js/styles/github-dark.css";
import SocialShare from "@/components/SocialShare";
import RelatedPosts from "@/components/RelatedPosts";
import { calculateReadingTime } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * 동적 메타데이터 생성
 * SEO 최적화를 위해 각 게시글마다 고유한 title과 description을 설정합니다.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "게시글을 찾을 수 없습니다",
    };
  }

  return {
    title: post.title,
    description: post.summary || post.title,
  };
}

/**
 * 정적 경로 생성
 * 빌드 시점에 모든 게시글의 경로를 미리 생성합니다.
 */
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const content = await getPostContent(post.id);
  const readingTime = calculateReadingTime(content);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const postUrl = `${baseUrl}/blog/${post.slug}`;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 썸네일 이미지 */}
      {post.thumbnail && (
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* 게시글 헤더 */}
      <header className="mb-8">
        {post.category && (
          <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
            {post.category}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
        {post.summary && (
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            {post.summary}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          {post.publishedDate && (
            <time dateTime={post.publishedDate}>
              {new Date(post.publishedDate).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          <span>•</span>
          <span>{readingTime}분 읽기</span>
        </div>
      </header>

      {/* 소셜 공유 버튼 */}
      <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
        <SocialShare title={post.title} url={postUrl} summary={post.summary || undefined} />
      </div>

      {/* 게시글 본문 */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            img: (props: any) => {
              const { src, alt } = props;
              if (!src || typeof src !== "string") {
                // eslint-disable-next-line @next/next/no-img-element
                return <img {...props} alt={alt || ""} className="rounded-lg" />;
              }
              return (
                <Image
                  src={src}
                  alt={alt || ""}
                  width={800}
                  height={600}
                  className="rounded-lg"
                />
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* 관련 게시글 */}
      <RelatedPosts currentSlug={post.slug} />
    </article>
  );
}

