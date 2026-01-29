import { useSocketStore } from "../lib/socket";

export function ChatHeader({ participant, chatId }) {
  const { onlineUsers, typingUsers } = useSocketStore();
  const isOnline = onlineUsers.has(participant?._id);
  // const isTyping = !!typingUsers.get(chatId);
  const typingUserId = typingUsers.get(chatId);
  const isTyping = typingUserId && typingUserId === participant?._id;

  return (
    <div className="h-16 px-6 border-b border-base-300 flex items-center gap-4 bg-base-200/80">
      <div className="relative">
        <img src={participant?.avatar} className="w-10 h-10 rounded-full bg-base-300/40" alt="" />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-base-200" />
        )}
      </div>
      <div>
        <h2 className="font-semibold">{participant?.name}</h2>
        <p className="text-xs text-base-content/70">
          {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
}
