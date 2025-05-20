'use client';

import { useEffect } from 'react';
import { Review } from '@/types';
import Link from 'next/link';
import { useState } from 'react';
import ReviewForm from './review-form';
import { getReviews } from '@/lib/actions/review.actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar, Star, User } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import Rating from '@/components/shared/product/rating';

const ReviewList = ({
  userId,
  productId,
  productSlug,
  productRating,
  numReviews,
}: {
  userId: string;
  productId: string;
  productSlug: string;
  productRating: number;
  numReviews: number;
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      const res = await getReviews({ productId });
      setReviews(res.data);
    };

    loadReviews();
  }, [productId]);

  // Reload reviews after created or updated
  const reload = async () => {
    const res = await getReviews({ productId });
    setReviews([...res.data]);
  };

  return (
    <div className='space-y-6'>
      <div className="flex items-start gap-6">
        <Card className="flex-1 border-[#FF7A3D]/10">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-xl text-[#1D1D1F]">Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-[#FF7A3D] text-[#FF7A3D]" />
                <span className="text-2xl font-medium text-[#1D1D1F]">
                  {(typeof productRating === 'number' ? productRating : 0).toFixed(1)}
                </span>
              </div>
              <div className="text-sm text-[#1D1D1F]/70">
                Based on {numReviews || 0} {(numReviews || 0) === 1 ? 'review' : 'reviews'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 border-[#FF7A3D]/10">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-xl text-[#1D1D1F]">Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            {userId ? (
              <div className="space-y-3">
                <p className="text-sm text-[#1D1D1F]/70">
                  Share your thoughts about this product with other customers
                </p>
                <ReviewForm
                  userId={userId}
                  productId={productId}
                  onReviewSubmitted={reload}
                />
              </div>
            ) : (
              <div className="text-sm text-[#1D1D1F]/70">
                Please
                <Link
                  className='text-[#FF7A3D] hover:text-[#FF7A3D]/80 px-1.5'
                  href={`/sign-in?callbackUrl=/product/${productSlug}`}
                >
                  sign in
                </Link>
                to write a review
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className='flex flex-col gap-3'>
        {reviews.length === 0 && (
          <div className="text-center py-8 text-[#1D1D1F]/70">
            No reviews yet. Be the first to review this product!
          </div>
        )}
        {reviews.map((review) => (
          <Card key={review.id} className="border-[#FF7A3D]/10 hover:border-[#FF7A3D]/20 transition-colors duration-300">
            <CardHeader className="pb-3">
              <div className='flex items-start justify-between'>
                <div className='space-y-1.5'>
                  <CardTitle className="font-serif text-[#1D1D1F]">{review.title}</CardTitle>
                  <div className='flex items-center space-x-4'>
                    <Rating value={review.rating} />
                    <div className='flex items-center text-sm text-[#1D1D1F]/70'>
                      <User className='mr-1.5 h-3.5 w-3.5' />
                      {review.user ? review.user.name : 'User'}
                    </div>
                    <div className='flex items-center text-sm text-[#1D1D1F]/70'>
                      <Calendar className='mr-1.5 h-3.5 w-3.5' />
                      {formatDateTime(review.createdAt).dateTime}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-[#1D1D1F]/80 leading-relaxed">
                {review.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
