/**
 * 소셜 공유 버튼 컴포넌트
 * 
 * 게시글을 다양한 소셜 미디어 플랫폼에 공유할 수 있는 버튼들을 제공합니다.
 */

"use client";

interface SocialShareProps {
  title: string;
  url: string;
  summary?: string;
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    kakao: `https://story.kakao.com/share?url=${encodedUrl}`,
  };

  const handleShare = async (platform: keyof typeof shareLinks) => {
    if (platform === "kakao") {
      // 카카오톡 공유는 별도 처리 필요
      window.open(shareLinks[platform], "_blank", "width=600,height=400");
    } else {
      window.open(shareLinks[platform], "_blank", "noopener,noreferrer");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("링크가 클립보드에 복사되었습니다!");
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-sm text-gray-600 dark:text-gray-400">공유하기:</span>
      <button
        onClick={() => handleShare("twitter")}
        className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        aria-label="트위터에 공유"
        title="트위터에 공유"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
        </svg>
      </button>
      <button
        onClick={() => handleShare("facebook")}
        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        aria-label="페이스북에 공유"
        title="페이스북에 공유"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </button>
      <button
        onClick={() => handleShare("linkedin")}
        className="p-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white transition-colors"
        aria-label="링크드인에 공유"
        title="링크드인에 공유"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </button>
      <button
        onClick={copyToClipboard}
        className="p-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white transition-colors"
        aria-label="링크 복사"
        title="링크 복사"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  );
}

