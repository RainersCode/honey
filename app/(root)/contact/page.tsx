import { Metadata } from 'next';
import ContactForm from './contact-form';
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | Honey Farm',
  description: 'Get in touch with us for any questions about our honey products or services.',
};

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-[#1D1D1F] mb-4">Get in Touch</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Have questions about our honey products or want to learn more about our farm? 
            We'd love to hear from you. Fill out the form below or use our contact information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8 p-6 bg-[#FFF9F5] rounded-2xl border border-[#FFE4D2]">
            <h2 className="text-2xl font-serif text-[#1D1D1F] mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-[#FF7A3D] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-[#1D1D1F]">Address</h3>
                  <p className="text-gray-600">123 Honey Farm Road<br />Sweet Valley, HY 12345</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-[#FF7A3D] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-[#1D1D1F]">Phone</h3>
                  <p className="text-gray-600">(555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-[#FF7A3D] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-[#1D1D1F]">Email</h3>
                  <p className="text-gray-600">info@honeyfarm.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-[#FF7A3D] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-[#1D1D1F]">Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9am - 6pm<br />
                    Saturday: 10am - 4pm<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Requisites */}
            <div className="mt-8 pt-8 border-t border-[#FFE4D2]">
              <h3 className="font-serif text-xl text-[#1D1D1F] mb-4">Before Contacting Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FF7A3D] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">Check our FAQ section for common questions</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FF7A3D] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">Have your order number ready (if applicable)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FF7A3D] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">Include specific product details in your message</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 