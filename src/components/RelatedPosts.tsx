/**
 * 관련 게시글 추천 컴포넌트
 * 
 * 현재 게시글과 관련된 다른 게시글들을 표시합니다.
 */

import { getRelatedPosts } from "@/lib/notion";
import Link from "next/link";
import Image from "next/image";

interface RelatedPostsProps {
  currentSlug: string;
}

export default async function RelatedPosts({ currentSlug }: RelatedPostsProps) {
  const relatedPosts = await getRelatedPosts(currentSlug, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-6">관련 게시글</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {post.thumbnail && (
              <div className="relative w-full h-32">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              {post.category && (
                <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-2">
                  {post.category}
                </span>
              )}
              <h3 className="font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {post.title}
              </h3>
              {post.publishedDate && (
                <time
                  dateTime={post.publishedDate}
                  className="text-xs text-gray-500 dark:text-gray-500"
                >
                  {new Date(post.publishedDate).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

