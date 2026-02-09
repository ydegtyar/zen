import { stories } from "@/assets/stories/en";
import { stories as russianStories } from "@/assets/stories/ru";
import { stories as ukrainianStories } from "@/assets/stories/uk";
import { Story } from "./Story";

export async function fetchStories(language: 'en' | 'uk' | 'ru' = 'en'): Promise<Story[]> {
  if (language === 'uk') {
    return [...ukrainianStories].sort((a, b) => a.index - b.index);
  }
  if (language === 'ru') {
    return [...russianStories].sort((a, b) => a.index - b.index);
  }
  return stories.sort((a, b) => a.index - b.index);
}
