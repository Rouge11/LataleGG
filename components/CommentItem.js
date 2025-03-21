import { useState, useEffect, useRef } from "react";

export default function CommentItem({ comment, onDelete, isOwner }) {
  const ref = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const lineHeight = parseFloat(getComputedStyle(ref.current).lineHeight);
      const maxHeight = lineHeight * 4;
      setIsOverflow(ref.current.scrollHeight > maxHeight + 2);
    }
  }, [comment.content]);

  return (
    <div className="border-b pb-2 relative">
      <p className="font-semibold">{comment.nickname}</p>
      <p
        ref={ref}
        className={`whitespace-pre-line text-sm ${expanded ? "" : "line-clamp-4"}`}
      >
        {comment.content}
      </p>

      {isOverflow && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="text-gray-400 hover:text-gray-600 text-sm mt-1 cursor-pointer"
        >
          {expanded ? "닫기" : "... 더보기"}
        </button>
      )}

      <small className="text-gray-500 block mt-1">
        {new Date(comment.createdAt.toDate()).toLocaleString()}
      </small>

      {isOwner && (
        <button
          onClick={() => onDelete(comment.id, comment.userId)}
          className="cursor-pointer absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          삭제
        </button>
      )}
    </div>
  );
}
