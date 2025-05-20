import Image from 'next/image';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Honey Enthusiast',
    image: '/images/testimonials/testimonial-1.jpg',
    quote: 'The quality of their honey is exceptional. You can really taste the difference compared to store-bought varieties.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Home Chef',
    image: '/images/testimonials/testimonial-2.jpg',
    quote: 'I use their honey in all my recipes. The natural sweetness and purity make every dish special.',
    rating: 5
  },
  {
    name: 'Emma Davis',
    role: 'Wellness Coach',
    image: '/images/testimonials/testimonial-3.jpg',
    quote: 'Not only is the honey delicious, but their service is outstanding. Always fresh and delivered with care.',
    rating: 5
  }
];

const ClientTestimonials = () => {
  return (
    <section className="my-16 bg-[#FFFBF8] py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-[#1D1D1F] mb-2">What Our Clients Say</h2>
          <div className="w-20 h-1 bg-[#FF7A3D] mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-[#1D1D1F]">{testimonial.name}</h3>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-[#FF7A3D]">★</span>
                ))}
              </div>
              <blockquote className="text-gray-700 italic">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientTestimonials; 