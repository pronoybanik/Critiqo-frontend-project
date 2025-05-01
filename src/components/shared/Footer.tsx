import Link from 'next/link';
import Image from 'next/image';
import openion2 from '../../assets/logo/opinion16.png'
import google from '../../assets/logo/google.png'
import apple from '../../assets/logo/apple.png'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className=" bg-gray-900 text-gray-300 py-12  mx-auto">
            <div className="container mx-auto ">
                <div className="grid grid-cols-1 md:grid-cols-3 px-10  gap-8 max-w-7xl">
                    <div>
                        {/* Helpful Links */}

                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-white border-b border-gray-800">Helpful Links</h3>
                            <div className='flex flex-col md:flex-row gap-12 '>

                                <ul className="space-y-2">
                                    <li><Link href="/">Home</Link></li>
                                    <li><Link href="/gallery">Gallery</Link></li>
                                    <li><Link href="/smartwatch">Smartwatch</Link></li>
                                    <li><Link href="/terms">Terms & Conditions</Link></li>

                                </ul>
                                <ul>
                                    <li><Link href="/about">About Us</Link></li>
                                    <li><Link href="/blog">Blog</Link></li>
                                    <li><Link href="/contact">Contact Us</Link></li>
                                    <li><Link href="/privacy">Privacy Policy</Link></li>
                                </ul>
                            </div>
                        </div>
                        {/* Download Our App */}
                        <div className='mt-5'>
                            <h3 className="text-xl font-semibold mb-4 text-white border-b border-gray-800">Download Our App</h3>
                            <div className="flex space-x-4 mt-1">
                                <Link href="#">
                                    <Image src={google} alt="Google Play" width={130} height={40} />
                                </Link>
                                <Link className='mt-1' href="#">
                                    <Image src={apple} alt="App Store" width={130} height={50} />
                                </Link>
                            </div>
                        </div>

                    </div>

                    {/* Recent Posts */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-800">Recent posts</h3>
                        <ul className="space-y-4">
                            <li>
                                <div className="flex items-center">
                                    <div className="w-16 h-12 relative mr-4 overflow-hidden rounded">
                                        <Image src="/images/post1.jpg" alt="Recent Post 1" layout="fill" objectFit="cover" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">March 13, 2025</p>
                                        <Link href="/post/1" className="hover:text-white">
                                            A game-changer for frequent flyers and adventurers.
                                        </Link>
                                    </div>
                                </div>
                            </li>
                            {/* ... other recent posts ... */}
                        </ul>
                    </div>

                    {/* Latest Review */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-800 ">Latest Review</h3>
                        <ul className="space-y-4">
                            <li>
                                <div className="flex items-center">
                                    <div className="w-16 h-12 relative mr-4 overflow-hidden rounded">
                                        <Image src="/images/review1.jpg" alt="Review 1" layout="fill" objectFit="cover" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">September 27, 2020</p>
                                        <Link href="/review/1" className="hover:text-white">
                                            Ultimate Guide: 10 Best Cameras for Filmmaking on a Budget
                                        </Link>
                                    </div>
                                </div>
                            </li>
                            {/* ... other latest reviews ... */}
                        </ul>
                    </div>


                </div>

                {/* Bottom Section */}
                <div className="mt-12 bg-gray-900 py-4 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between px-10">
                    <div className="mb-4 md:mb-0">
                        <span className="text-xl font-semibold text-white">
                            <Image src={openion2} alt='footer logo' height={170} width={250} />


                        </span>

                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2 md:hidden">Follow Us</h4>
                        <div className="flex items-center space-x-4">
                            <h4 className="text-sm font-semibold text-gray-400 hidden md:block">Follow Us</h4>
                            <Link href="#" className="hover:text-white">
                                <Facebook className="w-5 h-5 fill-current" />
                            </Link>
                            <Link href="#" className="hover:text-white">
                                <Twitter className="w-5 h-5 fill-current" />
                            </Link>
                            <Link href="#" className="hover:text-white">
                                <Instagram className="w-5 h-5 fill-current" />
                            </Link>
                            <Link href="#" className="hover:text-white">
                                <Linkedin className="w-5 h-5 fill-current" />
                            </Link>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500 hidden md:block">
                        <Link href="/terms" className="mr-4 hover:text-gray-300">Terms & Conditions</Link>
                        <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
                    </div>
                </div>
                <div className='flex justify-center items-center'>
                    <p className="text-sm text-gray-500 mt-1">Copyright ©{new Date().getFullYear()} Team Opinion Oisis </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;