import { PrismaClient } from '@prisma/client';
import twilio from 'twilio';

const prisma = new PrismaClient();

// Twilio Configuration
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'

// Helper to send WhatsApp
export const sendWhatsappMessage = async (to: string, body: string, mediaUrl?: string) => {
  try {
    await client.messages.create({
      body,
      from: WHATSAPP_FROM,
      to: `whatsapp:${to}`,
      mediaUrl: mediaUrl ? [mediaUrl] : undefined
    });
    console.log(`WhatsApp sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send WhatsApp to ${to}:`, error);
  }
};

export const sendNotification = async (
  userId: number, 
  message: string, 
  link?: string, 
  imageUrl?: string
) => {
  try {
    // Save to DB
    const notification = await prisma.notification.create({
      data: { userId, message, link, imageUrl, type: "INFO" },
    });

    // Send WhatsApp if user has phone number
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.phoneNumber) {
      const whatsappBody = `${message}\n${link ? `Link: ${link}` : ''}`;
      await sendWhatsappMessage(user.phoneNumber, whatsappBody, imageUrl);
    }

  } catch (error) {
    console.error("Failed to send notification:", error);
  }
};

export const broadcastNotification = async (
  message: string, 
  link: string, 
  imageUrl?: string
) => {
  try {
    // Fetch users with IDs and Phone Numbers
    const users = await prisma.user.findMany({
      select: { id: true, phoneNumber: true }
    });

    if (users.length === 0) return;

    // 1. Create DB Notifications
    const notifications = users.map(user => ({
      userId: user.id,
      message,
      link,
      imageUrl,
      type: "ALERT",
      isRead: false
    }));

    await prisma.notification.createMany({
      data: notifications
    });

    // 2. Send WhatsApp Broadcast
    const whatsappBody = `📢 New Update: ${message}\nWatch here: ${link}`;
    
    // Process in parallel (batches recommended for production)
    users.forEach(user => {
      if (user.phoneNumber) {
        sendWhatsappMessage(user.phoneNumber, whatsappBody, imageUrl);
      }
    });

    console.log(`Broadcast sent to ${users.length} users.`);
  } catch (error) {
    console.error("Failed to broadcast notification:", error);
  }
};