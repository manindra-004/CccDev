import { Config } from '@remotion/cli/config';

// PNG frames keep the BT.709 conversion accurate, so the brand neon matches across players.
Config.setVideoImageFormat('png');
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setColorSpace('bt709');
Config.setAudioCodec('aac');
Config.setOverwriteOutput(true);
