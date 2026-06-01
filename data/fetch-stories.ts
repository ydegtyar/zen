import { stories } from "@/assets/stories/en";
import { stories as russianStories } from "@/assets/stories/ru";
import { stories as ukrainianStories } from "@/assets/stories/uk";
import { Story } from "./Story";

const storiesByLanguage: Record<'en' | 'uk' | 'ru', Story[]> = {
  en: [...stories].sort((a, b) => a.index - b.index),
  uk: [...ukrainianStories].sort((a, b) => a.index - b.index),
  ru: [...russianStories].sort((a, b) => a.index - b.index),
};

export async function fetchStories(language: 'en' | 'uk' | 'ru' = 'en'): Promise<Story[]> {
  return storiesByLanguage[language] ?? storiesByLanguage.en;
}
