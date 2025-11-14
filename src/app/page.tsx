/**
 * 게시글 목록 페이지
 * 
 * Published가 체크된 모든 게시글을 최신순으로 표시합니다.
 * 검색, 카테고리 필터링, 페이지네이션 기능을 지원합니다.
 */

import {
  getBlogPosts,
  searchBlogPosts,
  getAllCategories,
} from "@/lib/notion";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";

interface HomeProps {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}

const POSTS_PER_PAGE = 6;

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const searchQuery = params.q || "";
  const selectedCategory = params.category || null;
  const currentPage = parseInt(params.page || "1", 10);

  // 모든 게시글 가져오기
  let posts = await getBlogPosts();

  // 검색 필터링
  if (searchQuery) {
    posts = await searchBlogPosts(searchQuery);
  }

  // 카테고리 필터링
  if (selectedCategory) {
    posts = posts.filter((post) => post.category === selectedCategory);
  }

  // 페이지네이션
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  // 모든 카테고리 가져오기
  const allCategories = await getAllCategories();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">블로그</h1>

      {/* 검색 바 */}
      <div className="mb-6">
        <SearchBar />
      </div>

      {/* 카테고리 필터 */}
      <CategoryFilter categories={allCategories} />

      {/* 검색 결과 표시 */}
      {searchQuery && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          &quot;{searchQuery}&quot; 검색 결과: {totalPosts}개
        </p>
      )}

      {/* 게시글 목록 */}
      {paginatedPosts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          {searchQuery || selectedCategory
            ? "검색 결과가 없습니다."
            : "아직 게시된 글이 없습니다."}
        </p>
      ) : (
        <>
          <div className="grid gap-8 md:grid-cols-2">
            {paginatedPosts.map((post) => (
              <article
                key={post.id}
                className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={`/blog/${post.slug}`}>
                  {post.thumbnail && (
                    <div className="relative w-full h-48">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {post.category && (
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-2">
                        {post.category}
                      </span>
                    )}
                    <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {post.title}
                    </h2>
                    {post.summary && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {post.summary}
                      </p>
                    )}
                    {post.publishedDate && (
                      <time
                        dateTime={post.publishedDate}
                        className="text-sm text-gray-500 dark:text-gray-500"
                      >
                        {new Date(post.publishedDate).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* 페이지네이션 */}
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
