import React from 'react';

/**
 * Footer component for the application
 * Contains developer information for the take-home exercise
 * @returns {JSX.Element} Footer with developer information
 */
export default function Footer() {
  return (
    <footer className="bg-emerald-800 py-12 text-white">
      <div className="container mx-auto px-6">
        
        {/* Take-home exercise information */}
        <div className="mt-8 border-t border-emerald-700 pt-6 pb-2">
          <div className="bg-emerald-700 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-2 text-white">Take-Home Exercise</h3>
            <p className="text-sm text-emerald-100">
              This project was developed by <strong>Daniel Avila</strong> as a take-home exercise for the Senior Software Engineer position at Solace.
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 mb-4">
            <div className="bg-emerald-700 rounded-lg p-4">
              <h4 className="font-medium mb-2">Contact Information</h4>
              <ul className="space-y-1 text-sm text-emerald-100">
                <li>
                  <span className="font-medium">Email:</span>{" "}
                  <a href="mailto:daniel.avila@rottay.com" className="hover:text-white underline">daniel.avila@rottay.com</a>
                </li>
                <li>
                  <span className="font-medium">Phone:</span>{" "}
                  <a href="tel:+13054900555" className="hover:text-white">305-490-0555</a>
                </li>
                <li>
                  <span className="font-medium">Location:</span>{" "}
                  <span>Miami, Florida</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-emerald-700 rounded-lg p-4">
              <h4 className="font-medium mb-2">Professional Profile</h4>
              <p className="text-sm text-emerald-100 mb-2">
                Senior Software Engineer with 15 years of experience.
              </p>
              <a 
                href="https://www.linkedin.com/in/avila-daniel/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-white hover:text-emerald-200"
              >
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                </svg>
                LinkedIn Profile
              </a>
            </div>
          </div>
        </div>
        
        <div className="text-center text-sm text-emerald-100">
          &copy; {new Date().getFullYear()} Solace Health. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
