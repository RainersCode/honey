'use client';

import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-144px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="bg-white/90 backdrop-blur-[2px] shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="space-y-6 pb-8 pt-6 border-b border-[#FFE4D2]">
            <Link href="/" className="flex justify-center">
              <Image
                src="/images/logo.svg"
                width={120}
                height={120}
                alt={`${APP_NAME} logo`}
                priority={true}
                className="hover:opacity-90 transition-opacity duration-200"
              />
            </Link>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-serif text-center text-[#1D1D1F]">Page Not Found</CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                We couldn't find the page you're looking for
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-8 pb-8 text-center">
            <div className="space-y-6">
              <p className="text-[#1D1D1F]">
                The page you requested could not be found. Please check the URL and try again.
              </p>
              <Button 
                asChild
                className="bg-[#FF7A3D] hover:bg-[#ff6a24] text-white font-medium text-lg h-12 px-6"
              >
                <Link href="/" className="flex items-center justify-center">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFoundPage;
