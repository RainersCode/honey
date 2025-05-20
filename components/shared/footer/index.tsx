import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

const Footer = () => {
  return (
    <footer className="bg-[#FFFBF8] border-t border-[#1D1D1F]/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-[#1D1D1F]">{APP_NAME}</h3>
            <p className="text-gray-600 text-sm">
              Bringing nature's sweetness directly from our farm to your table.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-medium text-[#1D1D1F]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#FF7A3D] text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-600 hover:text-[#FF7A3D] text-sm transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[#FF7A3D] text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-medium text-[#1D1D1F]">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>123 Honey Farm Road</li>
              <li>Bee Valley, BV 12345</li>
              <li>Tel: (555) 123-4567</li>
              <li>Email: info@honeyfarm.com</li>
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h3 className="font-medium text-[#1D1D1F]">Hours</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Monday - Friday: 9am - 6pm</li>
              <li>Saturday: 9am - 4pm</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#1D1D1F]/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-[#FF7A3D] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-[#FF7A3D] transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 