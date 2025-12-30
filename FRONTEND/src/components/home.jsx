import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChartBarIcon, PencilAltIcon, SparklesIcon, MenuIcon, XIcon, LockClosedIcon, QrcodeIcon, TrashIcon, FingerPrintIcon } from '@heroicons/react/outline';
const AdvancedNavbar = ({ darkMode, setDarkMode, menuOpen, setMenuOpen, scrollToSection }) => {
  return (
    <nav className="fixed top-0 z-[100] w-full px-6 py-4 flex items-center justify-between backdrop-blur-sm bg-white/70 dark:bg-gray-950/70 transition-colors duration-700">
      <div className="flex items-center space-x-2">
        <SparklesIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          ShrinkX
        </Link>
      </div>
      <div className="hidden md:flex items-center space-x-6">
        <button
          onClick={() => scrollToSection('features')}
          className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
        >
          Features
        </button>
        <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
          Pricing
        </Link>
        <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
          Contact
        </Link>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-300"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        <Link
          to="/login"
          className="px-6 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:scale-105 transition-all duration-300"
        >
          Sign Up
        </Link>
      </div>
      <div className="md:hidden flex items-center space-x-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-300"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-900 dark:text-white">
          {menuOpen ? <XIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
        </button>
      </div>
    </nav>
  );
};
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }).map((_, i) => {
    const size = Math.random() * 8 + 4; 
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5; 
    const opacity = Math.random() * 0.5 + 0.3; 

    return (
      <div
        key={i}
        className="absolute rounded-full bg-blue-500 dark:bg-purple-500 animate-float"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          top: `${top}%`,
          left: `${left}%`,
          opacity: opacity,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      />
    );
  });
  
  return (
    <>
      <style>
        {`
          @keyframes float {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 0;
            }
            50% {
              transform: translate(100px, -50px) rotate(180deg);
              opacity: 0.8;
            }
            100% {
              transform: translate(0, 0) rotate(360deg);
              opacity: 0;
            }
          }
        `}
      </style>
      <div className="absolute inset-0 z-0 overflow-hidden">
        {particles}
      </div>
    </>
  );
};

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const featuresRef = useRef(null);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    } else if (prefersDark) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const scrollToSection = (sectionId) => {
    let ref;
    switch (sectionId) {
      case 'features':
        ref = featuresRef;
        break;
      default:
        return;
    }

    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false); 
    }
  };

  return (
    <div className="min-h-screen font-sans antialiased relative bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors duration-700 overflow-hidden">

      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none">
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="currentColor"
            fillOpacity="0.1"
            className="text-blue-500 dark:text-blue-900 animate-pulse-slow"
            d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,192C672,192,768,160,864,154.7C960,149,1056,171,1152,181.3C1248,192,1344,192,1392,192L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
          <path
            fill="currentColor"
            fillOpacity="0.1"
            className="text-purple-500 dark:text-purple-900 animate-pulse-slow animation-delay-3000"
            d="M0,224L48,229.3C96,235,192,245,288,245.3C384,245,480,235,576,218.7C672,203,768,187,864,170.7C960,155,1056,139,1152,138.7C1248,139,1344,155,1392,162.7L1440,171L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div className="relative z-10">
        <AdvancedNavbar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          menuOpen={menuOpen} 
          setMenuOpen={setMenuOpen} 
          scrollToSection={scrollToSection}
        />

        {menuOpen && (
          <div className="md:hidden absolute top-16 w-full flex flex-col items-center space-y-4 p-6 bg-white dark:bg-gray-900 shadow-xl transition-all duration-500 animate-slideDown z-40">
            <button
              onClick={() => scrollToSection('features')}
              className="w-full text-center py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Features
            </button>
            <Link
              to="/"
              className="w-full text-center py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              className="w-full text-center py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-2" />
            <Link
              to="/login"
              className="w-full text-center py-3 px-6 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="w-full text-center py-3 px-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:scale-105 transition-all duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        )}
        <section className="flex flex-col items-center justify-center text-center px-6 md:px-16 pt-24 pb-32 min-h-[calc(100vh-80px)] relative overflow-hidden">
          <FloatingParticles />
          <div className="relative z-10">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold mb-6 leading-tight animate-slideInFromTop" style={{ animationDelay: '0.2s' }}>
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Ultimate</span> Link Hub.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-4xl animate-slideInFromBottom" style={{ animationDelay: '0.4s' }}>
              Effortlessly shorten, manage, and track your URLs. Unlock valuable insights with every click.
            </p>
            <div className="relative group animate-scaleIn" style={{ animationDelay: '0.6s' }}>
              <Link
                to="/register"
                className="cta-btn  relative bg-black text-white px-12 py-5 rounded-full text-xl font-semibold shadow-2xl transition-all duration-300"
              >
                Get Started for Free
              </Link>
            </div>
          </div>

        </section>

        <section ref={featuresRef} className="py-24 px-6 md:px-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-700">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-gray-900 dark:text-white">Why Choose ShrinkX?</h2>
          <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            <FeatureCard 
              icon={<PencilAltIcon className="h-16 w-16 text-blue-500 dark:text-blue-400" />}
              title="Custom Short Links"
              description="Personalize your URLs with unique aliases. Create memorable, branded links that build trust and drive engagement."
            />
            <FeatureCard
              icon={<ChartBarIcon className="h-16 w-16 text-purple-500 dark:text-purple-400" />}
              title="Detailed Analytics"
              description="Gain powerful insights into every click. Track location, device type, referrer data, and click trends in real-time."
            />
            <FeatureCard
              icon={<LockClosedIcon className="h-16 w-16 text-green-500 dark:text-green-400" />}
              title="Protected Links"
              description="Secure your content by adding a password to your links. Control who can access your content with a simple click."
            />
            <FeatureCard
              icon={<QrcodeIcon className="h-16 w-16 text-red-500 dark:text-red-400" />}
              title="QR Code Generation"
              description="Instantly generate dynamic QR codes for your short links. Perfect for print materials, events, and easy sharing on any device."
            />
            <FeatureCard
              icon={<TrashIcon className="h-16 w-16 text-yellow-500 dark:text-yellow-400" />}
              title="Link Management"
              description="Effortlessly manage all your links in one place. Edit, organize, and delete links with a user-friendly dashboard."
            />
            <FeatureCard
              icon={<FingerPrintIcon className="h-16 w-16 text-indigo-500 dark:text-indigo-400" />}
              title="Seamless Authentication"
              description="Enjoy a secure and seamless experience. Our robust authentication system ensures your data and links are always safe."
            />
          </div>
        </section>

<section className="py-20 sm:py-24 px-6 md:px-12 bg-white dark:bg-gray-950 transition-colors duration-700 text-center relative overflow-hidden">
  
  <div className="absolute inset-0 z-0 pointer-events-none">
    <div className="w-64 h-64 sm:w-96 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-500 top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2"></div>
    <div className="w-64 h-64 sm:w-96 sm:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2500 bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2"></div>
  </div>

  <div className="relative z-10 flex flex-col items-center">
    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 sm:mb-4 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
      Don't Wait, Elevate.
    </span>
    <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
      Ready to transform your links?
    </h3>
    <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 sm:mb-10 max-w-3xl mx-auto animate-fadeIn" style={{ animationDelay: '0.5s' }}>
      Join thousands of creators, marketers, and businesses who trust **ShrinkX** to simplify, manage, and scale their online presence.
    </p>
    <div className="relative group animate-scaleIn" style={{ animationDelay: '0.7s' }}>
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      <Link
        to="/register"
        className="relative px-8 py-4 sm:px-12 sm:py-6 rounded-full text-lg sm:text-2xl font-bold shadow-2xl transition-all duration-300 
        bg-gray-900 text-white hover:bg-black 
        dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
      >
        Start Shortening Now
      </Link>
    </div>
  </div>
</section>
        
        <footer className="text-center py-8 text-sm bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-800 text-gray-600 dark:text-gray-400 transition-colors duration-700">
          © {new Date().getFullYear()} ShrinkX. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 bg-white dark:bg-gray-950 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 text-center transform hover:-translate-y-3">
    <div className="flex justify-center mb-6">
      {icon}
    </div>
    <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h4>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
  </div>
);

export default HomePage;
