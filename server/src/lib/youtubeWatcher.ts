import Parser from 'rss-parser';
import cron from 'node-cron';
import prisma from '../db.js';
import { broadcastNotification } from './notification.js';
import 'dotenv/config'

// Configure parser to fetch media fields
const parser = new Parser({
  customFields: {
    item: [['media:group', 'mediaGroup']],
  },
});

const CHANNEL_ID = process.env.CHANNEL_ID; 

export const startYouTubeWatcher = () => {
  console.log('🎥 YouTube Watcher Service Started...');

  cron.schedule('*/30 * * * *', async () => {
    try {
      const feed = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);
      
      if (!feed.items || feed.items.length === 0) return;

      const latestVideo = feed.items[0];
      const videoLink = latestVideo?.link;
      const videoTitle = latestVideo?.title;

      // Extract thumbnail safely
      // The structure is usually media:group -> media:thumbnail -> [0] -> $ -> url
      // We use the custom field 'mediaGroup' configured above
      const mediaGroup = (latestVideo as any).mediaGroup;
      const thumbnailUrl = mediaGroup?.['media:thumbnail']?.[0]?.['$']?.url;

      if (!videoLink || !videoTitle) return;

      const existingNotification = await prisma.notification.findFirst({
        where: { link: videoLink }
      });

      if (!existingNotification) {
        console.log(`New video detected: ${videoTitle}`);
        
        await broadcastNotification(
          `New Video Uploaded: ${videoTitle}`, 
          videoLink,
          thumbnailUrl // Pass the thumbnail
        );
      } 
    } catch (error) {
      console.error('Error checking YouTube feed:', error);
    }
  });
};