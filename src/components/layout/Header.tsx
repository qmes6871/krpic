'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Phone, ArrowRight } from 'lucide-react';
import { categories } from '@/data/categories';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 lg:w-12 lg:h-12">
              <Image
                src="/krpic/images/logo/logo.png"
                alt="재범방지교육통합센터"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="flex flex-col">
              <span className={`text-lg lg:text-xl font-bold transition-colors ${
                isScrolled ? 'text-primary-900' : 'text-white'
              }`}>
                KRPIC
              </span>
              <span className={`hidden sm:block text-xs transition-colors ${
                isScrolled ? 'text-primary-500' : 'text-white/70'
              }`}>
                재범방지교육통합센터
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* 재범방지교육 Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium transition-all ${
                isScrolled
                  ? 'text-primary-700 hover:text-primary-900 hover:bg-primary-50'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}>
                <span>재범방지교육</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-64 bg-white/95 backdrop-blur-xl shadow-xl shadow-black/10 rounded-2xl py-3 mt-2 border border-gray-100"
                  >
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/education/${category.slug}`}
                        className="block px-5 py-3 text-primary-700 font-medium hover:bg-primary-50 hover:text-primary-900 transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/detention-education"
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                isScrolled
                  ? 'text-primary-700 hover:text-primary-900 hover:bg-primary-50'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              구속 수감자 교육
            </Link>
            <Link
              href="/about"
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                isScrolled
                  ? 'text-primary-700 hover:text-primary-900 hover:bg-primary-50'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              통합센터 안내
            </Link>
            <Link
              href="/notice"
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                isScrolled
                  ? 'text-primary-700 hover:text-primary-900 hover:bg-primary-50'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              센터 공지사항
            </Link>
            <Link
              href="/reviews"
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                isScrolled
                  ? 'text-primary-700 hover:text-primary-900 hover:bg-primary-50'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              수강생 후기
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:1544-0000"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                isScrolled
                  ? 'text-primary-600 hover:bg-primary-50'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>1544-0000</span>
            </a>
            <Link
              href="/education"
              className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-500/25 hover:-translate-y-0.5 transition-all"
            >
              <span>수강신청</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              isScrolled
                ? 'text-primary-900 hover:bg-primary-50'
                : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="메뉴 열기"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100"
          >
            <div className="container-custom py-4 space-y-1">
              {/* 재범방지교육 Accordion */}
              <div>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between w-full px-4 py-3 text-primary-900 font-medium rounded-xl hover:bg-primary-50 transition-colors"
                >
                  <span>재범방지교육</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 py-2 space-y-1">
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/education/${category.slug}`}
                            className="block px-4 py-2.5 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/detention-education"
                className="block px-4 py-3 text-primary-900 font-medium rounded-xl hover:bg-primary-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                구속 수감자 교육
              </Link>
              <Link
                href="/about"
                className="block px-4 py-3 text-primary-900 font-medium rounded-xl hover:bg-primary-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                통합센터 안내
              </Link>
              <Link
                href="/notice"
                className="block px-4 py-3 text-primary-900 font-medium rounded-xl hover:bg-primary-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                센터 공지사항
              </Link>
              <Link
                href="/reviews"
                className="block px-4 py-3 text-primary-900 font-medium rounded-xl hover:bg-primary-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                수강생 후기
              </Link>

              <div className="pt-4 space-y-3">
                <a
                  href="tel:1544-0000"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-primary-200 text-primary-700 font-medium rounded-xl hover:bg-primary-50 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>1544-0000</span>
                </a>
                <Link
                  href="/education"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold rounded-xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>수강신청</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
