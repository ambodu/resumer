"use client";

import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useI18n } from './i18n-provider';
import { Locale } from '@/lib/i18n';

// 语言选项
const languages = [
  {
    code: 'zh' as const,
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳'
  },
  {
    code: 'en' as const,
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  }
];

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
}

export function LanguageSwitcher({ variant = 'default', className = '' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];
  
  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };
  
  // 图标模式
  if (variant === 'icon-only') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          title="切换语言 / Switch Language"
        >
          <Globe className="h-5 w-5" />
        </button>
        
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 ${
                    locale === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <div>
                    <div className="font-medium">{language.nativeName}</div>
                    <div className="text-sm text-gray-500">{language.name}</div>
                  </div>
                  {locale === language.code && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
  
  // 紧凑模式
  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <span className="text-base">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-sm ${
                    locale === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span>{language.flag}</span>
                  <span>{language.nativeName}</span>
                  {locale === language.code && (
                    <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
  
  // 默认模式
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Globe className="h-5 w-5" />
        <div className="text-left">
          <div className="font-medium text-sm">{currentLanguage.nativeName}</div>
          <div className="text-xs text-gray-500">{currentLanguage.name}</div>
        </div>
        <ChevronDown className="h-4 w-4" />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">
                选择语言 / Select Language
              </div>
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full px-3 py-3 text-left hover:bg-gray-50 rounded-md flex items-center space-x-3 transition-colors ${
                    locale === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span className="text-xl">{language.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{language.nativeName}</div>
                    <div className="text-sm text-gray-500">{language.name}</div>
                  </div>
                  {locale === language.code && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// 简单的选择器组件（用于设置页面等）
export function SimpleLanguageSelector({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  
  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className={`px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    >
      {languages.map((language) => (
        <option key={language.code} value={language.code}>
          {language.flag} {language.nativeName}
        </option>
      ))}
    </select>
  );
}

// 内联语言切换器（用于移动端菜单等）
export function InlineLanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => setLocale(language.code)}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            locale === language.code
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <span className="mr-1">{language.flag}</span>
          {language.nativeName}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;