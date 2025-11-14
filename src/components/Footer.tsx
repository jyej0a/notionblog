/**
 * 블로그 푸터 컴포넌트
 * 
 * 모든 페이지 하단에 표시되는 푸터입니다.
 */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
          © {currentYear} Notion Blog. Powered by Next.js & Notion.
        </p>
      </div>
    </footer>
  );
}

