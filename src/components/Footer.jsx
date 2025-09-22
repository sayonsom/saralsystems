import { Layers } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="max-w-md md:max-w-none md:flex md:items-start md:justify-between md:gap-6">
            <div className="max-w-md">
              <a href="/" className="flex items-center gap-2 text-gray-900 font-bold text-xl">
                <img src="/logo.png" alt="GridSpeed logo" className="h-6 w-6 object-contain" />
                <span>GridSpeed</span>
              </a>
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>GSTIN: 29ABECS1100R1Z4</p>
                <p>CIN: U74999WB2020PTC238608</p>
                <p>
                  Bhaskar ID:{" "}
                  <a
                    href="https://www.startupindia.gov.in/bhaskar/profile?bhaskarid=OI-0925-9284HL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-600 underline decoration-dotted"
                  >
                    OI-0925-9284HL
                  </a>
                </p>
                <p>In business since 2020</p>
              </div>
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <a href="mailto:hello@gridspeed.app" className="hover:text-orange-600">hello@gridspeed.app</a>
                <div>
                  <a href="https://wa.me/91987" target="_blank" rel="noopener noreferrer" className="hover:text-orange-600">WhatsApp: +91 98765 43210</a>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:flex-shrink-0 md:self-start">
              <a
                href="https://www.startupindia.gov.in/bhaskar/profile?bhaskarid=OI-0925-9284HL"
                target="_blank"
                rel="noopener noreferrer"
                title="View Startup India Bhaskar Profile"
              >
                <img src="/startup-india.webp" alt="Startup India" className="h-8 w-auto object-contain" />
              </a>
            </div>
          </div>

          <div className="md:text-right">
            <nav className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3 md:grid-cols-1">
              <a href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors">Contact</a>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-orange-600 transition-colors">GitHub</a>
              <a href="/blog" className="text-gray-700 hover:text-orange-600 transition-colors">Blog</a>
              <a href="#services" className="text-gray-700 hover:text-orange-600 transition-colors">Services</a>
              <a href="/terms" className="text-gray-700 hover:text-orange-600 transition-colors">Terms &amp; Conditions</a>
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} GridSpeed, Inc. | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

