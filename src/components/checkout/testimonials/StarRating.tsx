
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: "xs" | "sm" | "md";
}

export function StarRating({ rating, size = "sm" }: StarRatingProps) {
  const sizeMap = {
    xs: 8,
    sm: 14,
    md: 18
  };
  
  const starSize = sizeMap[size];

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={starSize}
          className={`${
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-200 fill-gray-200"
          }`}
        />
      ))}
    </div>
  );
}
