'use client';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className='space-y-4'>
      <Card className="overflow-hidden rounded-xl">
        <div className="relative aspect-square">
          <Image
            src={images[current]}
            alt='product image'
            fill
            priority={true}
            className='object-cover object-center transition-all duration-300'
          />
        </div>
      </Card>
      <div className='grid grid-cols-4 gap-4'>
        {images.map((image, index) => (
          <Card
            key={image}
            onClick={() => setCurrent(index)}
            className={cn(
              'cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:ring-2 hover:ring-[#FF7A3D]',
              current === index && 'ring-2 ring-[#FF7A3D]'
            )}
          >
            <div className="relative aspect-square">
              <Image 
                src={image} 
                alt='thumbnail' 
                fill
                className='object-cover object-center'
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
