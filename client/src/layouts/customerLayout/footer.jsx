import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#603F26] text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* About Us Section */}
        <div>
          <h4 className="text-xl font-semibold mb-4">About Us</h4>
          <ul>
            <li><a href="/about" className="hover:text-yellow-400">Company Info</a></li>
            <li><a href="/careers" className="hover:text-yellow-400">Careers</a></li>
            <li><a href="/contact" className="hover:text-yellow-400">Contact Us</a></li>
          </ul>
        </div>

        {/* Customer Service Section */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Customer Service</h4>
          <ul>
            <li><a href="/help" className="hover:text-yellow-400">Help Center</a></li>
            <li><a href="/shipping" className="hover:text-yellow-400">Shipping & Returns</a></li>
            <li><a href="/faq" className="hover:text-yellow-400">FAQs</a></li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul>
            <li><a href="/terms" className="hover:text-yellow-400">Terms & Conditions</a></li>
            <li><a href="/privacy" className="hover:text-yellow-400">Privacy Policy</a></li>
            <li><a href="/track-order" className="hover:text-yellow-400">Track Order</a></li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
          <ul className="flex flex-col">
            <li><a href="https://facebook.com" className="hover:text-yellow-400" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://twitter.com" className="hover:text-yellow-400" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://instagram.com" className="hover:text-yellow-400" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://linkedin.com" className="hover:text-yellow-400" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white mt-12 pt-6 text-center">
        <p>&copy; 2024 Diverse Den. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
