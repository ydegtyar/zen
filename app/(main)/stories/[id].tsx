import { Header } from '@/components/Header';
import { BottomNavLink } from '@/components/ui/BottomNavLink';
import { FavoriteIcon } from '@/components/ui/FavoriteIcon';
import { getAppButtonStyle, useAppButtonPalette } from '@/components/ui/buttonStyles';
import { addFavorite, removeFavorite, useIsFavorite } from '@/data/favorites';
import { useLastReadStore } from '@/data/last-read';
import { useStoriesByIndex, useStory } from '@/data/queries/stories';
import { addReadIndex } from '@/data/reading-progress';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Image } from 'expo-image';
import { Link, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { InteractionManager, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, ScrollView, useWindowDimensions, View } from 'react-native';
import { Button, H6, Spinner, Text, XStack, YStack } from 'tamagui';
import { lightHaptic } from '@/utils/haptics';
import { useAppObserve } from '@/utils/observe';

const CONTINUE_READING_SET_DELAY_MS = 500;
const PLACEHOLDER_IMAGE = require('@/assets/images/placeholder.png');

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
  const buttonPalette = useAppButtonPalette();
  const { markInteractive } = useAppObserve();
  const { id } = useLocalSearchParams();
  const requestedStoryIndex = Number(Array.isArray(id) ? id[0] : id);
  const trackableStoryIndex = Number.isFinite(requestedStoryIndex) && requestedStoryIndex > 0
    ? requestedStoryIndex
    : undefined;
  const { data: story, isLoading } = useStory(requestedStoryIndex, {
    enabled: !!trackableStoryIndex,
  });
  const storyIndex = story?.index ?? trackableStoryIndex;
  const setLastRead = useLastReadStore(state => state.setLastRead);
  const clearLastRead = useLastReadStore(state => state.clearLastRead);
  const navSectionHeightRef = useRef(0);
  const contentHeightRef = useRef(0);
  const viewportHeightRef = useRef(0);
  const scrollYRef = useRef(0);
  const completedStoryIndexRef = useRef<number | null>(null);
  const { width: screenWidth } = useWindowDimensions();
  const imageSource = (story && 'image' in story && story.image) ? story.image : PLACEHOLDER_IMAGE;
  const { data: storiesByIndex } = useStoriesByIndex();
  const isFavorite = useIsFavorite(story?.index);
  const prevStory = story ? storiesByIndex?.get(story.index - 1) : undefined;
  const nextStory = story ? storiesByIndex?.get(story.index + 1) : undefined;
  const paragraphs = useMemo(
    () => story?.text.split('\n').map(paragraph => paragraph.trim()).filter(Boolean) ?? [],
    [story?.text]
  );

  const completeStory = useCallback(() => {
    if (!storyIndex || completedStoryIndexRef.current === storyIndex) {
      return;
    }

    completedStoryIndexRef.current = storyIndex;
    clearLastRead(storyIndex);
    void addReadIndex(storyIndex);
  }, [clearLastRead, storyIndex]);

  const checkCompletionTrigger = useCallback(() => {
    const navSectionHeight = navSectionHeightRef.current;
    const contentHeight = contentHeightRef.current;
    const viewportHeight = viewportHeightRef.current;

    if (navSectionHeight <= 0 || contentHeight <= 0 || viewportHeight <= 0) {
      return;
    }

    const navSectionTopY = Math.max(0, contentHeight - navSectionHeight);
    if (scrollYRef.current + viewportHeight >= navSectionTopY) {
      completeStory();
    }
  }, [completeStory]);

  useEffect(() => {
    if (storyIndex) {
      navSectionHeightRef.current = 0;
      contentHeightRef.current = 0;
      viewportHeightRef.current = 0;
      scrollYRef.current = 0;
      completedStoryIndexRef.current = null;
    }
  }, [storyIndex]);

  useFocusEffect(
    useCallback(() => {
      if (!storyIndex) {
        return;
      }

      let timeout: ReturnType<typeof setTimeout> | undefined;
      const task = InteractionManager.runAfterInteractions(() => {
        timeout = setTimeout(() => {
          if (completedStoryIndexRef.current !== storyIndex) {
            setLastRead(storyIndex);
          }
        }, CONTINUE_READING_SET_DELAY_MS);
      });

      return () => {
        task.cancel();
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }, [setLastRead, storyIndex])
  );

  useEffect(() => {
    if (!isLoading && story) {
      markInteractive({ params: { storyId: story.index } });
    }
  }, [isLoading, markInteractive, story]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollYRef.current = event.nativeEvent.contentOffset.y;
    viewportHeightRef.current = event.nativeEvent.layoutMeasurement.height;
    contentHeightRef.current = event.nativeEvent.contentSize.height;
    checkCompletionTrigger();
  }, [checkCompletionTrigger]);

  const handleNavSectionLayout = useCallback((event: LayoutChangeEvent) => {
    navSectionHeightRef.current = event.nativeEvent.layout.height;
    checkCompletionTrigger();
  }, [checkCompletionTrigger]);

  if (isLoading) {
    return (
      <YStack flex={1} backgroundColor="$background" alignItems="center" justifyContent="center">
        <Spinner size="large" color="$color" />
      </YStack>
    );
  }

  if (!story) {
    return <Link href="/(main)" replace />;
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <Header
        startSlot={
          <Link href={{ pathname: '/' }} asChild>
            <Button
              size="$3"
              circular
              borderWidth={1}
              {...getAppButtonStyle(buttonPalette)}
              onPressIn={() => {
                void lightHaptic();
              }}
              aria-label="Back"
            >
              <Ionicons name="arrow-back" size={20} color={buttonPalette.foreground} />
            </Button>
          </Link>
        }
        middleSlot={
          <H6 textAlign="center">{story.title}</H6>
        }
        endSlot={
          <Button
            size="$3"
            circular
            borderWidth={1}
            {...getAppButtonStyle(buttonPalette, isFavorite)}
            onPressIn={() => {
              void lightHaptic();
            }}
            onPress={() => isFavorite ? removeFavorite(story.index) : addFavorite(story.index)}
            aria-label="Favorite"
          >
            <FavoriteIcon
              filled={isFavorite}
              size={20}
              color={isFavorite ? buttonPalette.icon : buttonPalette.foreground}
            />
          </Button>
        }
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        onLayout={(event) => {
          viewportHeightRef.current = event.nativeEvent.layout.height;
          checkCompletionTrigger();
        }}
        onContentSizeChange={(_width, height) => {
          contentHeightRef.current = height;
          checkCompletionTrigger();
        }}
        onScroll={handleScroll}
        scrollEventThrottle={64}
      >
        <Image
          source={imageSource}
          style={{ width: screenWidth, height: screenWidth }}
          contentFit="cover"
          placeholder={PLACEHOLDER_IMAGE}
          transition={120}
        />
        <YStack padding="$4" gap="$4" flex={1}>
          <View style={{ flex: 1, gap: 4 }}>
            {paragraphs.map((paragraph, idx) => (
              <StoryParagraph key={idx}>{paragraph}</StoryParagraph>
            ))}
          </View>
          <YStack marginTop="$4" onLayout={handleNavSectionLayout}>
            <XStack justifyContent="space-between" alignItems="stretch" paddingHorizontal="$0" gap="$2">
              {prevStory ? (
                <BottomNavLink
                  direction="prev"
                  title={prevStory.title}
                  href={{ pathname: '/stories/[id]', params: { id: String(prevStory.index) } }}
                  replace
                />
              ) : (
                <View style={{ flex: 1, minHeight: 68 }} />
              )}
              {nextStory ? (
                <BottomNavLink
                  direction="next"
                  title={nextStory.title}
                  href={{ pathname: '/stories/[id]', params: { id: String(nextStory.index) } }}
                  replace
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
