/**
 * 블로그 헤더 컴포넌트
 * 
 * 모든 페이지 상단에 표시되는 헤더입니다.
 * 반응형 디자인을 지원합니다.
 */

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Notion Blog
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Home
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}

