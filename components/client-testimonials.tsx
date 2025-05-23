import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getDictionary } from '@/lib/dictionary';

interface ClientTestimonialsProps {
  lang: string;
}

const ClientTestimonials = async ({ lang }: ClientTestimonialsProps) => {
  const dictionary = await getDictionary(lang);

  const testimonials = dictionary.clientTestimonials?.testimonials || [
    {
      name: 'Sarah Johnson',
      role: 'Honey Enthusiast',
      quote:
        'The quality of their honey is exceptional. You can really taste the difference compared to store-bought varieties.',
    },
    {
      name: 'Michael Chen',
      role: 'Home Chef',
      quote:
        'I use their honey in all my recipes. The natural sweetness and purity make every dish special.',
    },
    {
      name: 'Emma Davis',
      role: 'Wellness Coach',
      quote:
        'Not only is the honey delicious, but their service is outstanding. Always fresh and delivered with care.',
    },
  ];

  return (
    <div className='relative w-full'>
      <section className='relative pt-16'>
        <div className='max-w-[1440px] mx-auto'>
          <div className='max-w-3xl mx-auto px-4'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl font-serif text-[#1D1D1F] mb-2'>
                {dictionary.clientTestimonials?.title || 'What Our Clients Say'}
              </h2>
              <div className='w-20 h-1 bg-[#FF7A3D] mx-auto rounded-full'></div>
            </div>
            <div className='relative px-2 pb-16'>
              <Carousel
                opts={{
                  align: 'center',
                  loop: true,
                }}
                className='w-full'
              >
                <CarouselContent className='px-2 py-4'>
                  {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index}>
                      <div className='bg-[#FFFBF8] rounded-2xl p-10 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 mx-auto max-w-2xl border border-[#FFE4D2]'>
                        <div className='flex justify-center mb-8'>
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className='text-[#FF7A3D] text-2xl'>
                              ★
                            </span>
                          ))}
                        </div>
                        <blockquote className='relative'>
                          <span className='absolute -top-4 -left-2 text-6xl text-[#FF7A3D]/10'>
                            &ldquo;
                          </span>
                          <p className='text-gray-700 text-xl leading-relaxed text-center mb-8 relative z-10'>
                            {testimonial.quote}
                          </p>
                          <span className='absolute -bottom-8 -right-2 text-6xl text-[#FF7A3D]/10'>
                            &rdquo;
                          </span>
                        </blockquote>
                        <div className='text-center mt-12'>
                          <div className='w-12 h-12 bg-gradient-to-br from-[#FF7A3D] to-[#FF9A6A] rounded-full flex items-center justify-center text-white text-xl font-semibold mb-3 mx-auto'>
                            {testimonial.name.charAt(0)}
                          </div>
                          <h3 className='font-medium text-[#1D1D1F] text-lg'>
                            {testimonial.name}
                          </h3>
                          <p className='text-gray-500 text-sm mt-1'>
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className='bg-white -left-4 md:-left-12 shadow-lg hover:bg-white hover:text-[#FF7A3D] transition-colors'>
                  <ChevronLeft className='h-5 w-5' />
                </CarouselPrevious>
                <CarouselNext className='bg-white -right-4 md:-right-12 shadow-lg hover:bg-white hover:text-[#FF7A3D] transition-colors'>
                  <ChevronRight className='h-5 w-5' />
                </CarouselNext>
              </Carousel>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClientTestimonials;
