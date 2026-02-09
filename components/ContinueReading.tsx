import { Story } from '@/data/fetch-stories';
import { i18n } from '@/data/i18n';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { TouchableHighlight } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

interface Props {
  story: Story;
}

export function ContinueReading({ story }: Props) {
  return (
    <Link
      href={{ pathname: '/stories/[id]', params: { id: String(story.index) } }}
      asChild
    >
      <TouchableHighlight
        underlayColor="#d1fae5"
        style={{ borderRadius: 16, marginVertical: 8, width: '100%', backgroundColor: '#fff' }}
      >
        <XStack paddingHorizontal="$3" paddingVertical="$2" alignItems="flex-start" gap="$3" >
          <YStack flex={1}>
            <Text fontSize="$3" color="$gray9" marginBottom={2}>{i18n.t('app.continueReading')}</Text>
            <Text fontWeight="bold" fontSize="$4" marginTop={'$1'} numberOfLines={2}>{story.title}</Text>
            <Text fontSize="$3" color="$color" numberOfLines={2} marginTop={2}>{story.text}</Text>
          </YStack>
          <Image
            source={story.image || require('@/assets/images/placeholder.png')}
            style={{ width: 96, height: 96, borderRadius: 16 }}
            contentFit="cover"
          />
        </XStack>
      </TouchableHighlight>
    </Link>
  );
}
