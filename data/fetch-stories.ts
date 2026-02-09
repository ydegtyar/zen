import { stories } from "@/assets/stories/en";
import { Story } from "./Story";

export async function fetchStories(language: 'en' | 'uk' | 'ru' = 'en'): Promise<Story[]> {
  if (language === 'uk') {
    return import(`../assets/stories/uk.json`).then(((m) => (m.default || m as Story[]).sort((a, b) => a.index - b.index)));
  }
  if (language === 'ru') {
    return import(`../assets/stories/ru.json`).then(((m) => (m.default || m as Story[]).sort((a, b) => a.index - b.index)));
  }
  return stories.sort((a, b) => a.index - b.index);
}
