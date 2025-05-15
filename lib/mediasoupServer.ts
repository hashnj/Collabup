// // lib/mediasoupServer.ts
// import * as mediasoup from 'mediasoup';
// import { getOrCreateRoom } from './roomManager';

// let worker: mediasoup.types.Worker;
// let router: mediasoup.types.Router;

// const mediaCodecs: mediasoup.types.RtpCodecCapability[] = [
//   {
//     kind: 'audio',
//     mimeType: 'audio/opus',
//     clockRate: 48000,
//     channels: 2,
//   },
//   {
//     kind: 'video',
//     mimeType: 'video/VP8',
//     clockRate: 90000,
//     parameters: {},
//   },
// ];

// export const initMediasoup = async () => {
//   if (!worker) {
//     worker = await mediasoup.createWorker();
//     router = await worker.createRouter({ mediaCodecs });
//     // console.log('Mediasoup worker + router initialized.');
//   }
// };

// export const getRouter = async () => {
//   if (!router) await initMediasoup();
//   return router;
// };
