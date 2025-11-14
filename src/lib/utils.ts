/**
 * 유틸리티 함수들
 */

/**
 * Markdown 텍스트에서 읽기 시간을 계산합니다.
 * 평균 읽기 속도: 분당 200단어 (한국어 기준 약 400자)
 */
export function calculateReadingTime(content: string): number {
  // 한글, 영문, 숫자 등을 단어로 간주
  const words = content.trim().split(/\s+/).filter((word) => word.length > 0);
  const readingTime = Math.ceil(words.length / 200); // 분당 200단어
  return readingTime < 1 ? 1 : readingTime; // 최소 1분
}

/**
 * 텍스트에서 검색어를 하이라이트합니다.
 */
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-900">$1</mark>');
}

