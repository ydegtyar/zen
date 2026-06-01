import { ContinueReading } from '@/components/ContinueReading';
import { EmptyFavorites } from '@/components/EmptyFavorites';
import { Header } from '@/components/Header';
import { ReadingProgressIndicator } from '@/components/ReadingProgressIndicator';
import { StoryListItem } from '@/components/StoryListItem';
import { FavoriteIcon } from '@/components/ui/FavoriteIcon';
import { getAppButtonStyle, useAppButtonPalette } from '@/components/ui/buttonStyles';
import { useFavorites } from '@/data/favorites';
import { i18n } from '@/data/i18n';
import { useLastReadStore } from '@/data/last-read';
import { Language, useLanguage } from '@/data/language';
import { useStories, useStoriesByIndex } from '@/data/queries/stories';
import { useReadingProgress } from '@/data/reading-progress';
import { Story } from "@/data/Story";
import { STORY_KEYWORDS } from '@/data/story-keywords';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { FlashList } from '@shopify/flash-list';
import { Leaf, Search, X } from '@tamagui/lucide-icons-2';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Button, H4, Input, Spinner, XStack, YStack } from 'tamagui';
import { lightHaptic } from '@/utils/haptics';
import { useAppColorScheme } from '@/data/theme';
import { useLocaleHeadingFontFamily } from '@/utils/locale-fonts';
import { useAppObserve } from '@/utils/observe';

const PAGE_HORIZONTAL_PADDING = 16;

const SEARCH_BAR_PALETTE = {
  light: {
    border: ['rgba(168, 176, 162, 0.82)', 'rgba(255, 255, 255, 0.96)', 'rgba(168, 176, 162, 0.36)'] as const,
    surface: 'rgba(255, 255, 255, 0.94)',
    accent: 'rgba(168, 176, 162, 0.14)',
    action: 'rgba(17, 24, 28, 0.06)',
    icon: '#5f6f5b',
    text: '#11181C',
    shadow: '#5f6f5b',
  },
  dark: {
    border: ['rgba(168, 176, 162, 0.44)', 'rgba(255, 255, 255, 0.10)', 'rgba(168, 176, 162, 0.22)'] as const,
    surface: 'rgba(21, 23, 24, 0.94)',
    accent: 'rgba(168, 176, 162, 0.16)',
    action: 'rgba(255, 255, 255, 0.08)',
    icon: '#c6d0bf',
    text: '#ECEDEE',
    shadow: '#000000',
  },
};

export default function MainScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { markInteractive } = useAppObserve();
  const [search, setSearch] = useState('');
  const showFavorites = params.favorites === 'true';
  const { data: favorites = [] } = useFavorites();
  const colorScheme = useAppColorScheme();
  const buttonPalette = useAppButtonPalette();
  const searchBarPalette = SEARCH_BAR_PALETTE[colorScheme];
  const { data: language = Language.En } = useLanguage();
  const headingFontFamily = useLocaleHeadingFontFamily();
  const { data: readIndexes = [] } = useReadingProgress();
  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const readIndexSet = useMemo(() => new Set(readIndexes), [readIndexes]);
  const selectStories = useCallback(
    (stories: Story[]) => showFavorites ? stories.filter(story => favoriteSet.has(story.index)) : stories,
    [favoriteSet, showFavorites]
  );

  const { data = [], isLoading } = useStories({
    select: selectStories
  });
  const { data: storiesByIndex } = useStoriesByIndex();
  const lastReadIndex = useLastReadStore(state => state.lastReadIndex);
  const lastReadStory = lastReadIndex ? storiesByIndex?.get(lastReadIndex) : undefined;
  const searchTerm = search.trim();

  const searchIndex = useMemo(() => new Fuse<Story>(data, {
    keys: ['title', 'text'],
    threshold: 0.55
  }), [data]);

  const stories = useMemo(
    () => searchTerm ? searchIndex.search(searchTerm).map(result => result.item) : data,
    [data, searchIndex, searchTerm]
  );
  const storyKeywords = STORY_KEYWORDS[language] ?? STORY_KEYWORDS[Language.En];

  useEffect(() => {
    if (!isLoading) {
      markInteractive();
    }
  }, [isLoading, markInteractive]);

  const handleFavoritePress = useCallback(() => {
    if (showFavorites) {
      router.setParams({ favorites: undefined });
    } else {
      setSearch('');
      router.setParams({ favorites: 'true' });
    }
  }, [showFavorites, router]);

  const handleKeywordPress = useCallback(() => {
    if (!storyKeywords.length) {
      return;
    }

    const nextKeyword = storyKeywords[Math.floor(Math.random() * storyKeywords.length)];
    setSearch(nextKeyword);
  }, [storyKeywords]);

  const handleRandomStoryPress = useCallback(() => {
    const nextStory = data[Math.floor(Math.random() * data.length)];
    if (!nextStory) {
      return;
    }

    router.push({
      pathname: '/stories/[id]',
      params: { id: nextStory.index }
    });
  }, [data, router]);

  const renderStoryItem = useCallback(
    ({ item }: { item: Story }) => (
      <StoryListItem story={item} isRead={readIndexSet.has(item.index)} />
    ),
    [readIndexSet]
  );

  const keyExtractor = useCallback((item: Story) => String(item.index), []);

  return (
    <YStack backgroundColor="$background" flex={1}>
      <Header
        startSlot={
          <Button
            size="$3"
            circular
            borderWidth={1}
            {...getAppButtonStyle(buttonPalette)}
            onPressIn={() => {
              void lightHaptic();
            }}
            onPress={() => router.push('/settings')}
            aria-label="Settings"
          >
            <Ionicons name="settings-outline" size={20} color={buttonPalette.foreground} />
          </Button>
        }
        middleSlot={
          <TouchableOpacity
            onPressIn={() => {
              void lightHaptic();
            }}
            onPress={handleRandomStoryPress}
          >
            <H4 style={{ fontFamily: headingFontFamily }}>{i18n.t('app.title')}</H4>
          </TouchableOpacity>
        }
        endSlot={
          <Button
            size="$3"
            circular
            borderWidth={1}
            {...getAppButtonStyle(buttonPalette, showFavorites)}
            onPressIn={() => {
              void lightHaptic();
            }}
            onPress={handleFavoritePress}
            aria-label="Favorites"
          >
            <FavoriteIcon
              filled={showFavorites}
              size={20}
              color={showFavorites ? buttonPalette.icon : buttonPalette.foreground}
            />
          </Button>
        }
      />

      {!showFavorites && (
        <LinearGradient
          colors={searchBarPalette.border}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.searchGradient,
            {
              shadowColor: searchBarPalette.shadow,
              shadowOpacity: colorScheme === 'dark' ? 0.34 : 0.13,
            },
          ]}
        >
          <XStack
            alignItems="center"
            backgroundColor={searchBarPalette.surface}
            borderRadius={23}
            minHeight={54}
            paddingHorizontal="$2"
            gap="$2"
            overflow="hidden"
          >
            <YStack
              width={36}
              height={36}
              borderRadius={18}
              alignItems="center"
              justifyContent="center"
              backgroundColor={searchBarPalette.accent}
            >
              <Search size={18} color={searchBarPalette.icon} />
            </YStack>
            <Input
              flex={1}
              height={50}
              paddingHorizontal={0}
              placeholder={i18n.t('app.searchStories')}
              value={search}
              onChangeText={setSearch}
              borderWidth={0}
              color={searchBarPalette.text}
              fontSize="$4"
              fontWeight="500"
              placeholderTextColor="$placeholder"
              backgroundColor="transparent"
              focusStyle={{ borderColor: 'transparent' }}
            />
            {searchTerm ? (
              <Button
                circular
                chromeless
                size="$2.5"
                backgroundColor={searchBarPalette.action}
                aria-label="Clear search"
                onPressIn={() => {
                  void lightHaptic();
                }}
                onPress={() => setSearch('')}
              >
                <X size={16} color={searchBarPalette.icon} />
              </Button>
            ) : (
              <Button
                circular
                chromeless
                size="$2.5"
                backgroundColor={searchBarPalette.action}
                aria-label="Suggest search keyword"
                onPressIn={() => {
                  void lightHaptic();
                }}
                onPress={handleKeywordPress}
              >
                <Leaf size={16} color={searchBarPalette.icon} />
              </Button>
            )}
          </XStack>
        </LinearGradient>
      )}

      {lastReadStory && !searchTerm && !showFavorites ? (
        <XStack marginHorizontal={PAGE_HORIZONTAL_PADDING} marginVertical="$1">
          <ContinueReading story={lastReadStory} />
        </XStack>
      ) : null}
      <YStack flex={1}>
        {isLoading ? (
          <YStack flex={1} alignItems="center" justifyContent="center" paddingHorizontal="$2">
            <Spinner size="large" color="$color" />
          </YStack>
        ) : showFavorites && stories.length === 0 ? (
          <EmptyFavorites />
        ) : (
          <FlashList
            data={stories}
            keyExtractor={keyExtractor}
            renderItem={renderStoryItem}
            contentContainerStyle={styles.storyListContent}
          />
        )}
      </YStack>
      {!showFavorites && <ReadingProgressIndicator />}
    </YStack>
  );
}

const styles = StyleSheet.create({
  searchGradient: {
    marginHorizontal: PAGE_HORIZONTAL_PADDING,
    marginTop: 8,
    marginBottom: 6,
    borderRadius: 24,
    padding: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
  storyListContent: {
    paddingHorizontal: PAGE_HORIZONTAL_PADDING,
  },
});
