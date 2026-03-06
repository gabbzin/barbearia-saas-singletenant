"use client";

import { StarIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export function InputStars() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: 5 }).map((_, index) => {
        const ratingValue = index + 1;

        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: <Sem problemas>
          <Label key={index}>
            <Input
              name="rating"
              type="radio"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
              className="hidden"
            />
            <StarIcon
              color={ratingValue <= (hover || rating) ? "#facc15" : "#e5e7eb"}
              onMouseEnter={() => setHover(ratingValue)}
              onClick={() => setRating(ratingValue)}
              onMouseLeave={() => setHover(0)}
            />
          </Label>
        );
      })}
    </div>
  );
}
