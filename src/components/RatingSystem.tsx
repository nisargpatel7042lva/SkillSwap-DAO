
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useAccount } from "wagmi";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RatingSystemProps {
  bookingId: number;
  skillTitle: string;
  onRatingSubmitted: () => void;
}

export const RatingSystem = ({ bookingId, skillTitle, onRatingSubmitted }: RatingSystemProps) => {
  const { address } = useAccount();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitRating = async () => {
    if (!address || rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("address", address)
        .single();

      if (!user) {
        toast.error("User not found");
        return;
      }

      const { error } = await supabase
        .from("ratings")
        .insert({
          service_id: bookingId,
          rater_id: user.id,
          rating,
          comment: comment.trim() || null
        });

      if (error) {
        toast.error("Failed to submit rating");
        return;
      }

      toast.success("Rating submitted successfully!");
      onRatingSubmitted();
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error("An error occurred while submitting the rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-lg">Rate this Service</CardTitle>
        <p className="text-sm text-gray-600">{skillTitle}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating *</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {rating} star{rating !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Comment (optional)</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this service..."
              rows={3}
              className="border-2 border-dashed border-gray-300"
            />
          </div>

          <Button 
            onClick={handleSubmitRating}
            disabled={isSubmitting || rating === 0}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
