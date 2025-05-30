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
import { Locale } from '@/config/i18n.config';
import { getDictionary } from '@/lib/dictionary';

interface ReviewListProps {
  userId: string;
  productId: string;
  productSlug: string;
  productRating: number;
  numReviews: number;
  lang: Locale;
}

const ReviewList = ({
  userId,
  productId,
  productSlug,
  productRating,
  numReviews,
  lang,
}: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);

      const res = await getReviews({ productId });
      setReviews(res.data);
    };

    loadData();
  }, [productId, lang]);

  // Reload reviews after created or updated
  const reload = async () => {
    const res = await getReviews({ productId });
    setReviews([...res.data]);
  };

  if (!dict) return null;

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='flex flex-col sm:flex-row items-start gap-4 sm:gap-6'>
        <Card className='w-full flex-1 border-[#FF7A3D]/10'>
          <CardHeader className='pb-2 sm:pb-3'>
            <CardTitle className='font-serif text-lg sm:text-xl text-[#1D1D1F]'>
              {dict.reviews.customerReviews}
            </CardTitle>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='flex items-center gap-3 sm:gap-4'>
              <div className='flex items-center gap-2'>
                <Star className='h-4 w-4 sm:h-5 sm:w-5 fill-[#FF7A3D] text-[#FF7A3D]' />
                <span className='text-xl sm:text-2xl font-medium text-[#1D1D1F]'>
                  {(typeof productRating === 'number'
                    ? productRating
                    : 0
                  ).toFixed(1)}
                </span>
              </div>
              <div className='text-xs sm:text-sm text-[#1D1D1F]/70'>
                {dict.reviews.basedOn} {numReviews || 0}{' '}
                {(numReviews || 0) === 1
                  ? dict.reviews.review
                  : dict.reviews.reviews}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='w-full flex-1 border-[#FF7A3D]/10'>
          <CardHeader className='pb-2 sm:pb-3'>
            <CardTitle className='font-serif text-lg sm:text-xl text-[#1D1D1F]'>
              {dict.reviews.writeReview}
            </CardTitle>
          </CardHeader>
          <CardContent className='pt-0'>
            {userId ? (
              <div className='space-y-2 sm:space-y-3'>
                <p className='text-xs sm:text-sm text-[#1D1D1F]/70'>
                  {dict.reviews.shareThoughts}
                </p>
                <ReviewForm
                  userId={userId}
                  productId={productId}
                  onReviewSubmitted={reload}
                  lang={lang}
                />
              </div>
            ) : (
              <div className='text-xs sm:text-sm text-[#1D1D1F]/70'>
                {dict.reviews.pleaseSignIn.before}
                <Link
                  className='text-[#FF7A3D] hover:text-[#FF7A3D]/80 px-1.5'
                  href={`/${lang}/sign-in?callbackUrl=/${lang}/product/${productSlug}`}
                >
                  {dict.reviews.pleaseSignIn.link}
                </Link>
                {dict.reviews.pleaseSignIn.after}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className='flex flex-col gap-2 sm:gap-3'>
        {reviews.length === 0 && (
          <div className='text-center py-6 sm:py-8 text-[#1D1D1F]/70 text-sm sm:text-base'>
            {dict.reviews.noReviews}
          </div>
        )}
        {reviews.map((review) => (
          <Card
            key={review.id}
            className='border-[#FF7A3D]/10 hover:border-[#FF7A3D]/20 transition-colors duration-300'
          >
            <CardHeader className='pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6'>
              <div className='flex items-start justify-between'>
                <div className='space-y-1 sm:space-y-1.5 flex-1'>
                  <CardTitle className='font-serif text-[#1D1D1F] text-base sm:text-lg leading-tight'>
                    {review.title}
                  </CardTitle>
                  <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
                    <Rating value={review.rating} />
                    <div className='flex flex-col xs:flex-row gap-1 xs:gap-3 text-xs sm:text-sm text-[#1D1D1F]/70'>
                      <div className='flex items-center'>
                        <User className='mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5' />
                        {review.user ? review.user.name : dict.reviews.user}
                      </div>
                      <div className='flex items-center'>
                        <Calendar className='mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5' />
                        {formatDateTime(review.createdAt).dateTime}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className='pt-0 px-3 sm:px-6 pb-3 sm:pb-6'>
              <CardDescription className='text-[#1D1D1F]/80 leading-relaxed text-sm sm:text-base'>
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
