import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Update to accept imageUrl
export const sendNotification = async (
  userId: number, 
  message: string, 
  link?: string, 
  imageUrl?: string
) => {
  try {
    await prisma.notification.create({
      data: { 
        userId, 
        message, 
        link,
        imageUrl, // Save the image URL
        type: "INFO" 
      },
    });
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
};

// Update to accept imageUrl
export const broadcastNotification = async (
  message: string, 
  link: string, 
  imageUrl?: string
) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true }
    });

    if (users.length === 0) return;

    const notifications = users.map(user => ({
      userId: user.id,
      message,
      link,
      imageUrl, // Save the image URL
      type: "ALERT",
      isRead: false
    }));

    await prisma.notification.createMany({
      data: notifications
    });

    console.log(`Broadcast sent to ${users.length} users: ${message}`);
  } catch (error) {
    console.error("Failed to broadcast notification:", error);
  }
};