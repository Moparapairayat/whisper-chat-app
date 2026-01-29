import { Message } from "@/types";
import { View, Text } from "react-native";

function MessageBubble({ message, isFromMe }: { message: Message; isFromMe: boolean }) {
  return (
    <View className={`flex-row ${isFromMe ? "justify-end" : "justify-start"}`}>
      <View
        className={`max-w-[80%] px-3 py-2 rounded-2xl ${
          isFromMe
            ? "bg-primary rounded-br-sm"
            : "bg-surface-card rounded-bl-sm border border-surface-light"
        }`}
      >
        <Text className={`text-sm ${isFromMe ? "text-surface-dark" : "text-foreground"}`}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}

export default MessageBubble;
