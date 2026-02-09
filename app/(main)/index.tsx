import { ContinueReading } from '@/components/ContinueReading';
import { EmptyFavorites } from '@/components/EmptyFavorites';
import { Header } from '@/components/Header';
import { ReadingProgressIndicator } from '@/components/ReadingProgressIndicator';
import { StoryListItem } from '@/components/StoryListItem';
import { FavoriteIcon } from '@/components/ui/FavoriteIcon';
import { useFavorites } from '@/data/favorites';
import { Story } from '@/data/fetch-stories';
import { i18n } from '@/data/i18n';
import { useLastReadStory } from '@/data/last-read';
import { useStories } from '@/data/queries/stories';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Search } from '@tamagui/lucide-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Button, H4, Input, Spinner, useTheme, XStack, YStack } from 'tamagui';

export default function MainScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [search, setSearch] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const { data: favorites = [] } = useFavorites();
  const {color} = useTheme()
  
  useEffect(() => {
    setShowFavorites(params.favorites === 'true');
  }, [params.favorites]);

  const { data = [], isLoading } = useStories({
    select: stories => showFavorites ? stories.filter(s => favorites.includes(s.index)) : stories
  });
  const { data: lastReadStory } = useLastReadStory();

  const index = useMemo(() => new Fuse<Story>(data, {
    keys: ['title', 'text'],
    threshold: 0.55
  }), [data]);

  const stories = search.trim() ? index.search(search).map(result => result.item) : data;

  const handleFavoritePress = useCallback(() => {
    if (showFavorites) {
      router.setParams({ favorites: undefined });
    } else {
      setSearch('');
      router.setParams({ favorites: 'true' });
    }
  }, [showFavorites, router]);

  return (
    <YStack backgroundColor="$background" flex={1}>
      <Header
        startSlot={
          <Button
            size="$3"
            chromeless
            onPress={() => router.push('/settings')}
            aria-label="Settings"
          >
            <Ionicons name="settings-outline" size={24} color={color.val} />
          </Button>
        }
        middleSlot={
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: '/stories/[id]',
                params: { id: Math.floor(Math.random() * data.length) || 1 }
              });
            }}
          >
            <H4>{i18n.t('app.title')}</H4>
          </TouchableOpacity>
        }
        endSlot={
          <Button
            size="$3"
            chromeless
            onPress={handleFavoritePress}
            aria-label="Favorites"
          >
            <FavoriteIcon filled={showFavorites} />
          </Button>
        }
      />

      {!showFavorites && (
        <XStack alignItems="center" margin="$2" backgroundColor="$background" borderRadius={8} paddingHorizontal="$2" >
          <Search size={20} color="$color" />
          <Input
            flex={1}
            placeholder={i18n.t('app.searchStories')}
            value={search}
            onChangeText={setSearch}
            // backgroundColor="$background"
            borderWidth={0}
            // color="$color"
            // placeholderTextColor="$color"
          />
        </XStack>
      )}

      <Collapsible collapsed={!lastReadStory || !!search.trim() || showFavorites} >
        <XStack marginHorizontal="$2" marginVertical="$1" flex={1} >
          {lastReadStory && !search.trim() && !showFavorites && <ContinueReading story={lastReadStory} />}
        </XStack>
      </Collapsible>
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
            keyExtractor={(item, index) => `${item.index}-${index}`}
            renderItem={({ item }) => <StoryListItem story={item} />}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            estimatedItemSize={62}
          />
        )}
      </YStack>
      {!showFavorites && <ReadingProgressIndicator />}
    </YStack>
  );
}
