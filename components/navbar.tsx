"use client";

import Link from "next/link";
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
import { useAppState } from "@/lib/app-hooks";
import { LanguageSwitcher } from "@/components/language-switcher";
// 临时使用静态文本，后续可以添加翻译功能

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
      <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" />
    </div>
    <span className="text-foreground font-semibold text-base sm:text-lg hidden xs:block">
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
  const { currentResume } = useAppState();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navItems = [
    {
      href: `/${locale}`,
      label: locale === "zh" ? "首页" : "Home",
      icon: <Home className="h-4 w-4" />,
    },
    {
      href: `/${locale}/templates`,
      label: locale === "zh" ? "模板" : "Templates",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      href: `/${locale}/editor`,
      label: locale === "zh" ? "编辑器" : "Editor",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      href: `/${locale}/user`,
      label: locale === "zh" ? "我的" : "Account",
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
      <nav className="fixed top-4 inset-x-0 z-50 bg-background/95 backdrop-blur-sm border border-border rounded-2xl mx-auto shadow-lg w-full max-w-screen-xl px-4 sm:px-6 py-2 sm:py-3">
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
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
                className="hidden lg:flex items-center gap-1 text-xs bg-primary/10 border-primary/30 text-primary max-w-32 truncate"
              >
                <FileText className="h-3 w-3" />
                <span className="truncate">
                  {currentResume.personalInfo.fullName}
                </span>
              </Badge>
            )}

            <div className="hidden xl:block">
              <LanguageSwitcher currentLocale={locale} />
            </div>

            <div className="hidden xl:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <LogIn className="h-4 w-4 mr-1" />
                登录
              </Button>
              <Button size="sm" className="text-xs btn-primary">
                <UserPlus className="h-4 w-4 mr-1" />
                注册
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden text-muted-foreground hover:text-foreground hover:bg-muted p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />
          <div className="fixed top-20 translate-x-1/2 w-[92%] max-w-sm bg-background/95 border border-border rounded-2xl p-4 z-50 md:hidden shadow-lg">
            <div className="space-y-3">
              {navItems.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl text-sm transition-colors ${
                      isActive(item.href)
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </div>
              ))}

              <div className="pt-3 border-t border-border space-y-3">
                <LanguageSwitcher currentLocale={locale} />

                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted h-12"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4 mr-3" />
                  登录
                </Button>
                <Button
                  className="w-full btn-primary h-12"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserPlus className="h-4 w-4 mr-3" />
                  注册
                </Button>

                {currentResume?.personalInfo?.fullName && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-2 text-xs justify-center bg-primary/10 border-primary/30 text-primary p-3"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="truncate">
                      {currentResume.personalInfo.fullName}
                    </span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
