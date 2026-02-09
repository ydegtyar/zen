import { ReactNode } from 'react';
import { XStack, YStack } from 'tamagui';

interface Props {
    startSlot?: ReactNode;
    middleSlot?: ReactNode;
    endSlot?: ReactNode;
}

export function Header({ startSlot, middleSlot, endSlot }: Props) {
    return (
        <XStack
            alignItems="center"
            justifyContent="space-between" 
            paddingHorizontal="$1"
            backgroundColor="$background"
            gap="$2"
            paddingBottom="$2"
        >
            <YStack minWidth={56} alignItems="flex-start">{startSlot}</YStack>
            <YStack flex={1} alignItems="center">{middleSlot}</YStack>
            <YStack minWidth={56} alignItems="flex-end">{endSlot}</YStack>
        </XStack>
    );
} 