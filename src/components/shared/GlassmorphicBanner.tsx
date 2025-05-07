import React from "react";

const GlassmorphicBanner = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <section className="relative h-96 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700"></div>

      {/* Decorative circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white opacity-10 blur-xl"></div>
      <div className="absolute top-32 -right-24 w-72 h-72 rounded-full bg-white opacity-10 blur-xl"></div>
      <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-indigo-300 opacity-10 blur-xl"></div>

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "20px 20px",
        }}
      ></div>

      {/* Content container with glass effect */}
      <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-10 border border-white/20 shadow-2xl max-w-4xl w-full transform transition-all hover:scale-[1.01] hover:shadow-purple-500/20">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{title}</h1>

            {/* Animated accent line */}
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-pink-400 mx-auto mb-8 relative">
              <div className="absolute top-0 left-0 right-0 h-full bg-white opacity-50 animate-pulse"></div>
            </div>

            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="w-full h-12 md:h-16 lg:h-20 fill-white"
        >
          <path d="M0,0 C240,95 480,95 720,48 C960,0 1200,0 1440,48 L1440,100 L0,100 Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default GlassmorphicBanner;
