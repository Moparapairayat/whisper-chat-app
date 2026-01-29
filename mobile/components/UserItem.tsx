import type { User } from "@/types";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

type UserItemProps = {
  user: User;
  isOnline: boolean;
  onPress: () => void;
};

function UserItem({ user, isOnline, onPress }: UserItemProps) {
  return (
    <Pressable className="flex-row items-center py-2.5 active:opacity-70" onPress={onPress}>
      <View className="relative">
        <Image source={{ uri: user.avatar }} style={{ width: 48, height: 48, borderRadius: 999 }} />
        {isOnline && (
          <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-[2px] border-surface" />
        )}
      </View>

      <View className="flex-1 ml-3 border-b border-surface-light pb-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-foreground font-medium" numberOfLines={1}>
            {user.name}
          </Text>
          {isOnline && <Text className="text-xs text-primary font-medium">Online</Text>}
        </View>
        <Text className="text-xs text-subtle-foreground mt-0.5">{user.email}</Text>
      </View>
    </Pressable>
  );
}

export default UserItem;
