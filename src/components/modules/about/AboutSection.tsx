"use client";
import Head from "next/head";
import Image from "next/image";

export default function AboutSection() {

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image:
        "https://cdn.pixabay.com/photo/2016/09/24/03/20/man-1690965_1280.jpg",
      bio: "With over 15 years of industry experience, Sarah leads our company vision and strategic initiatives.",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Creative Director",
      image:
        "https://cdn.pixabay.com/photo/2016/06/20/04/30/asian-man-1468032_1280.jpg",
      bio: "Michael brings innovative design thinking and creative excellence to all our projects.",
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      role: "Head of Marketing",
      image:
        "https://cdn.pixabay.com/photo/2024/11/10/12/33/businessman-9187765_1280.jpg",
      bio: "Elena's expertise in digital marketing has driven our brand success stories worldwide.",
    },
    {
      id: 4,
      name: "David Kim",
      role: "Lead Developer",
      image:
        "https://cdn.pixabay.com/photo/2020/03/26/09/08/girl-4969690_1280.jpg",
      bio: "David ensures our technical solutions are cutting-edge, reliable, and scalable.",
    },
  ];

  // Popular brands data
  const popularBrands = [
    {
      id: 1,
      name: "EcoStyle",
      category: "Fashion",
      image:
        "https://cdn.pixabay.com/photo/2020/03/26/09/08/girl-4969690_1280.jpg",
      description:
        "Award-winning sustainable fashion brand that revolutionized eco-friendly materials.",
    },
    {
      id: 2,
      name: "TechVision",
      category: "Technology",
      image:
        "https://cdn.pixabay.com/photo/2020/03/26/09/08/girl-4969690_1280.jpg",
      description:
        "Innovative tech company branding that increased market share by 40% in the first year.",
    },
    {
      id: 3,
      name: "OrganicLife",
      category: "Food & Beverage",
      image:
        "https://cdn.pixabay.com/photo/2024/05/29/07/51/ai-generated-8795619_1280.jpg",
      description:
        "Comprehensive rebrand that established OrganicLife as a premium organic food provider.",
    },
    {
      id: 4,
      name: "UrbanSpaces",
      category: "Real Estate",
      image:
        "https://cdn.pixabay.com/photo/2024/05/29/07/51/ai-generated-8795619_1280.jpg",
      description:
        "Modern identity for a leading urban development company focused on sustainable living.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>About Us | Your Company Name</title>
        <meta
          name="description"
          content="Learn about our company, team, vision and our popular brands"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white ">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container mx-auto px-4 py-24 relative z-10 ">
          <div className="text-center ">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About Us</h1>
            <div className="w-16 h-1 bg-yellow-400 mx-auto mb-8"></div>
            <p className="text-xl max-w-3xl mx-auto">
              We are a team of passionate designers, developers, and marketers
              dedicated to crafting exceptional brand experiences.
            </p>
          </div>
        </div>
        {/* <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,106.7C96,117,192,139,288,138.7C384,139,480,117,576,128C672,139,768,181,864,186.7C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div> */}
      </section>

      {/* About Us Description Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="relative">
                {/* Replace with your actual company image */}
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <div className="bg-gray-300 w-full h-96 relative">
                    {/* Uncomment and add your image path */}
                    <Image
                      src="https://www.capterra.com/assets-capterra-bx-landing-pages/_next/image/?url=%2Fassets-capterra-bx-landing-pages%2F_next%2Fstatic%2Fmedia%2F3.11ee089e.png&w=3840&q=75"
                      alt="Our Company"
                      layout="fill"
                      objectFit="cover"
                      priority
                    />
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6  w-32 h-32  z-0">
                  <Image
                    src="https://www.capterra.com/assets-capterra-bx-landing-pages/_next/image/?url=%2Fassets-capterra-bx-landing-pages%2F_next%2Fstatic%2Fmedia%2F2.94f9fbe5.jpeg&w=3840&q=50"
                    alt="Our Company"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-2xl"
                  />
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Who We Are
              </h2>
              <div className="w-20 h-1 bg-blue-600 mb-6"></div>
              <p className="text-gray-600 mb-6 text-lg">
                Founded in 2010, we started with a simple mission: to help
                businesses connect with their audiences through authentic
                storytelling and remarkable design. What began as a small
                creative studio has evolved into a full-service agency with a
                global clientele.
              </p>
              <p className="text-gray-600 mb-10 text-lg">
                Our interdisciplinary team combines expertise in branding,
                design, development, and marketing to deliver holistic solutions
                that drive real business growth. We pride ourselves on building
                lasting partnerships with our clients, understanding their
                unique challenges, and crafting strategies that exceed
                expectations.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <div className="text-blue-600 text-4xl font-bold mb-2">
                    200+
                  </div>
                  <div className="text-gray-500">Projects Completed</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <div className="text-blue-600 text-4xl font-bold mb-2">
                    15+
                  </div>
                  <div className="text-gray-500">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Our Vision
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              We envision a world where every brand can authentically connect
              with its audience through purposeful design and meaningful
              experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Innovation
              </h3>
              <p className="text-gray-600">
                We constantly push boundaries, embracing new technologies and
                approaches to create forward-thinking solutions that help our
                clients stand out.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Excellence
              </h3>
              <p className="text-gray-600">
                We are committed to delivering exceptional quality in everything
                we do, with meticulous attention to detail and a relentless
                pursuit of perfection.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Collaboration
              </h3>
              <p className="text-gray-600">
                We believe that the best results come from true partnership,
                working closely with our clients and fostering a culture of open
                communication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Team</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Meet the talented individuals who make our company extraordinary.
              Our diverse team brings together expertise from various
              backgrounds to deliver outstanding results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative h-80 bg-gray-200">
                  Uncomment and add your team member images
                  <Image
                    src={member.image}
                    alt={member.name}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-0 group-hover:opacity-70 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                    <p className="text-sm">{member.bio}</p>
                    <div className="flex space-x-4 mt-4">
                      <a href="#" className="text-white hover:text-yellow-400">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-yellow-400">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.193-7.715-2.157-10.141-5.126-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21-.005-.418-.015-.628.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-yellow-400">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 mb-0">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Brands Section */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Our Popular Brands
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              We have had the privilege of working with some amazing brands. Here
              are a few success stories that showcase our creative capabilities
              and strategic approach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {popularBrands.map((brand) => (
              <div
                key={brand.id}
                className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="md:w-2/5 bg-gray-200 h-64 md:h-auto relative">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="md:w-3/5 p-6">
                  <div className="text-sm font-medium text-blue-600 mb-1">
                    {brand.category}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {brand.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{brand.description}</p>
                  <a
                    href="#"
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Case Study
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-8 lg:mb-0 text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-4">
                Ready to work with us?
              </h2>
              <p className="text-lg text-blue-100 max-w-xl">
                Let  discuss how we can help your brand reach its full
                potential through strategic design and innovative solutions.
              </p>
            </div>
            <div>
              <a
                href="/contact"
                className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-yellow-400 hover:text-blue-700 transition-colors shadow-lg"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
