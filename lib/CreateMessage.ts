import Message from "@/models/MessageSchema";
export async function createMessage(
  senderId: string,
  roomId: string,
  text: string
) {
  try {
    const receiverId = roomId.split("_").find((id) => id !== senderId);
    
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text: text,
    });

    return newMessage;
  } catch (error) {
    console.error("Error handling message creation:", error);
    return null;
  }
}
