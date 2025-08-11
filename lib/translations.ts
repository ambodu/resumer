import { type Locale } from "./i18n";

// 翻译消息类型
type Messages = {
  [key: string]: string | Messages;
};

// 加载翻译消息
const loadMessages = async (locale: Locale): Promise<Messages> => {
  try {
    const messages = await import(`@/messages/${locale}.json`);
    return messages.default;
  } catch (error) {
    console.warn(`Failed to load messages for locale: ${locale}`);
    // 回退到中文
    const fallbackMessages = await import("@/messages/zh.json");
    return fallbackMessages.default;
  }
};

// 获取嵌套对象的值
const getNestedValue = (obj: Messages, path: string): string => {
  const keys = path.split(".");
  let current: any = obj;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      return path; // 如果找不到翻译，返回原始路径
    }
  }

  return typeof current === "string" ? current : path;
};

// 翻译函数
export const getTranslation = async (
  locale: Locale,
  key: string
): Promise<string> => {
  const messages = await loadMessages(locale);
  return getNestedValue(messages, key);
};

// 批量翻译函数
export const getTranslations = async (
  locale: Locale,
  keys: string[]
): Promise<Record<string, string>> => {
  const messages = await loadMessages(locale);
  const result: Record<string, string> = {};

  for (const key of keys) {
    result[key] = getNestedValue(messages, key);
  }

  return result;
};

// 客户端翻译 Hook（简化版）
export const useTranslations = (locale: string) => {
  const t = (key: string): string => {
    // 这里可以实现客户端缓存的翻译逻辑
    // 目前返回 key 作为占位符
    return key;
  };

  return { t };
};

// 服务端翻译函数
export const createTranslator = (messages: Messages) => {
  return (key: string): string => {
    return getNestedValue(messages, key);
  };
};
