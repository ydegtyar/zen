import { Header } from '@/components/Header';
import { BottomNavLink } from '@/components/ui/BottomNavLink';
import { FavoriteIcon } from '@/components/ui/FavoriteIcon';
import { addFavorite, removeFavorite, useIsFavorite } from '@/data/favorites';
import { useLastReadStore } from '@/data/last-read';
import { useStories, useStory } from '@/data/queries/stories';
import { addReadIndex } from '@/data/reading-progress';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { Button, H6, Text, useTheme, XStack, YStack } from 'tamagui';
import { lightHaptic } from '@/utils/haptics';

function StoryParagraph({ children }: { children: React.ReactNode }) {
  return (
    <Text
      whiteSpace="pre-line"
      fontSize={18}
      lineHeight={28}
      letterSpacing={0.2}
      color="$color"
      textAlign="left"
      fontWeight="400"
      userSelect="text"
      marginBottom={12}
    >
      {children}
    </Text>
  );
}

export default function StoryScreen() {
  const { color, background } = useTheme()
  const { id } = useLocalSearchParams();
  const { data: story, isLoading } = useStory(Number(id));
  const setLastRead = useLastReadStore(state => state.setLastRead);
  const screenWidth = Dimensions.get('window').width;
  const imageSource = (story && 'image' in story && story.image) ? story.image : require('@/assets/images/placeholder.png');
  const { data: stories = [] } = useStories();
  const isFavorite = useIsFavorite(story?.index);
  const prevStory = story ? stories.find(s => s.index === story.index - 1) : null;
  const nextStory = story ? stories.find(s => s.index === story.index + 1) : null;

  useEffect(() => {
    if (story?.index) {
      setLastRead(story.index);
      addReadIndex(story.index);
    }
  }, [story, setLastRead]);

  if (!story || isLoading) {
    return <Link href="/(main)" replace />;
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <Header
        startSlot={
          <Link href={{ pathname: '/' }} asChild>
            <Button
              size="$3"
              chromeless
              onPressIn={() => {
                void lightHaptic();
              }}
              aria-label="Back"
            >
              <Ionicons name="arrow-back" size={24}  color={color.val}/>
            </Button>
          </Link>
        }
        middleSlot={
          <H6 textAlign="center">{story.title}</H6>
        }
        endSlot={
          <Button
            size="$3"
            chromeless
            onPressIn={() => {
              void lightHaptic();
            }}
            onPress={() => isFavorite ? removeFavorite(story.index) : addFavorite(story.index)}
            aria-label="Favorite"
          >
            <FavoriteIcon filled={isFavorite} />
          </Button>
        }
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Image
          source={imageSource}
          style={{ width: screenWidth, height: screenWidth }}
          contentFit="cover"
          placeholder={require('@/assets/images/placeholder.png')}
          transition={300}
        />
        <YStack padding="$4" gap="$4" flex={1}>
          <View style={{ flex: 1, gap: 4 }}>
            {story.text.split('\n').map((paragraph, idx) => (
              <StoryParagraph key={idx}>{paragraph.trim()}</StoryParagraph>
            ))}
          </View>
          <YStack marginTop="$4">
            <XStack justifyContent="space-between" alignItems="stretch" paddingHorizontal="$0" gap="$2">
              {prevStory ? (
                <BottomNavLink
                  direction="prev"
                  title={prevStory.title}
                  href={{ pathname: '/stories/[id]', params: { id: String(prevStory.index) } }}
                />
              ) : (
                <View style={{ flex: 1, minHeight: 68 }} />
              )}
              {nextStory ? (
                <BottomNavLink
                  direction="next"
                  title={nextStory.title}
                  href={{ pathname: '/stories/[id]', params: { id: String(nextStory.index) } }}
                />
              ) : (
                <View style={{ flex: 1, minHeight: 68 }} />
              )}
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
} 
