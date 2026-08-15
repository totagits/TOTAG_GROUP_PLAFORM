export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/images/totag-logo.png" 
                alt="TOTAG Group Logo" 
                className="h-20 w-auto"
              />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-totag-green">TOTAG</span> <span className="text-totag-blue">Group</span> <span className="text-white">of Companies Ltd</span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A diversified business group committed to delivering excellence across multiple industries 
              with integrity, innovation, and unwavering dedication to our clients' success.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <button 
              onClick={() => handleNavClick("#cargo")} 
              className="text-gray-400 hover:text-totag-green transition-colors duration-200"
            >
              Cargo
            </button>
            <button 
              onClick={() => handleNavClick("#farm")} 
              className="text-gray-400 hover:text-totag-blue transition-colors duration-200"
            >
              Agriculture
            </button>
            <button 
              onClick={() => handleNavClick("#petroleum")} 
              className="text-gray-400 hover:text-totag-orange transition-colors duration-200"
            >
              Petroleum
            </button>
            <button 
              onClick={() => handleNavClick("#construction")} 
              className="text-gray-400 hover:text-totag-blue transition-colors duration-200"
            >
              Construction
            </button>
            <button 
              onClick={() => handleNavClick("#it")} 
              className="text-gray-400 hover:text-totag-green transition-colors duration-200"
            >
              IT Services
            </button>
          </div>
          
          <div className="border-t border-gray-800 pt-8 space-y-2">
            <p className="text-gray-400">
              &copy; {currentYear} TOTAG Group of Companies Ltd. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Designed & Developed by <span className="text-totag-blue font-semibold">TOTAG IT Services</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
