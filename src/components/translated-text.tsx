"use client";

import { useTranslatedText } from "@/hooks/use-translated-text";

type Props = {
  text: string;
  className?: string;
  as?: "p" | "h1" | "h2" | "h3" | "span" | "div";
};

export function TranslatedText({ text, className, as = "span" }: Props) {
  const translated = useTranslatedText(text);
  const Component = as;

  return <Component className={className}>{translated}</Component>;
}