"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Home,
  User,
  Menu,
  X,
  LogIn,
  UserPlus,
  Sparkles,
} from "lucide-react";

import { useState, useEffect } from "react";
import { usePathname, useParams } from "next/navigation";
import { useResumeState } from "@/lib/hooks";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useTranslation } from "@/components/i18n/i18n-provider";

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
      <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
    </div>
    <span className="text-white font-semibold text-base sm:text-lg hidden xs:block">
      Resume
    </span>
  </div>
);

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const { currentResume } = useResumeState();
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navItems = [
    {
      href: `/${locale}`,
      label: t("nav.home"),
      icon: <Home className="h-4 w-4" />,
    },
    {
      href: `/${locale}/templates`,
      label: t("nav.templates"),
      icon: <FileText className="h-4 w-4" />,
    },
    {
      href: `/${locale}/editor`,
      label: t("nav.editor"),
      icon: <FileText className="h-4 w-4" />,
    },
    {
      href: `/${locale}/user`,
      label: t("nav.account"),
      icon: <User className="h-4 w-4" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`)
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    const normalized = (str: string) => str.replace(/\/$/, "");
    return pathname.startsWith(normalized(href));
  };

  return (
    <>
      {/* Navbar Container */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-4 inset-x-0 z-50 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl mx-auto shadow-2xl w-full max-w-screen-xl px-4 sm:px-6 py-2 sm:py-3"
      >
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <Link href={`/${locale}`} className="shrink-0">
            <Logo />
          </Link>

          {/* Middle: Desktop Navigation */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            <div className="flex gap-1 lg:gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs lg:text-sm flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    isActive(item.href)
                      ? "text-blue-400 bg-blue-500/10"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  {item.icon}
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Buttons */}
          <div className="flex items-center gap-2">
            {currentResume?.personalInfo?.fullName && (
              <Badge
                variant="outline"
                className="hidden lg:flex items-center gap-1 text-xs bg-blue-500/20 border-blue-500/30 text-blue-300 max-w-32 truncate"
              >
                <FileText className="h-3 w-3" />
                <span className="truncate">
                  {currentResume.personalInfo.fullName}
                </span>
              </Badge>
            )}

            <div className="hidden xl:block">
              <LanguageSwitcher />
            </div>

            <div className="hidden xl:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                <LogIn className="h-4 w-4 mr-1" />
                登录
              </Button>
              <Button
                size="sm"
                className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                注册
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden text-slate-300 hover:text-white hover:bg-slate-700/50 p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed top-20 translate-x-1/2 w-[92%] max-w-sm bg-slate-900/95 border border-slate-700/50 rounded-2xl p-4 z-50 md:hidden shadow-2xl"
            >
              <div className="space-y-3">
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-xl text-sm transition-colors ${
                        isActive(item.href)
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                ))}

                <div className="pt-3 border-t border-slate-700/50 space-y-3">
                  <LanguageSwitcher />

                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50 h-12"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4 mr-3" />
                    登录
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 h-12"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserPlus className="h-4 w-4 mr-3" />
                    注册
                  </Button>

                  {currentResume?.personalInfo?.fullName && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-2 text-xs justify-center bg-blue-500/20 border-blue-500/30 text-blue-300 p-3"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="truncate">
                        {currentResume.personalInfo.fullName}
                      </span>
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
