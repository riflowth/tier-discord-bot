import { YouTubeVideo } from 'play-dl';
import * as PlayDL from 'play-dl';

export type TrackInfo = {
  url: string,
  title: string,
  thumbnail: string,
  duration: number,
  duration_locale: string,
  author: string,
  author_avatar: string,
  author_url: string,
};

export type Playlist = {
  title: string,
  creator_name: string,
  creator_url: string,
  creator_avatar: string,
  url: string,
  videoUrls: string[],
  duration: number,
  duration_locale: string,
};
export default class TrackUtil {

  public static getInfo(track: any): TrackInfo {
    const info = {
      url: null,
      title: null,
      thumbnail: null,
      duration: null,
      duration_locale: null,
      author: null,
      author_avatar: null,
      author_url: null,
    };

    if (track instanceof YouTubeVideo) {
      info.url = track.url;
      info.title = track.title;
      info.thumbnail = track.thumbnails.at(-1).url;
      info.duration = track.durationInSec;
      info.author = track.channel.name;
      info.author_avatar = track.channel.icons[0].url;
      info.author_url = track.channel.url;
    }

    console.log(track);

    info.duration_locale = (track.live) ? '🔴 Live' : this.getLocaleDuration(info.duration);

    return info;
  }

  public static getLocaleDuration(duration: number): string {
    let timeString = new Date(duration * 1000).toISOString();

    timeString = (duration < 3600) ? timeString.substring(14, 19) : timeString.substring(11, 19);

    return timeString.startsWith('0') ? timeString.substring(1) : timeString;
  }

  public static async getPlaylist(keyword: string): Promise<Playlist> {
    try {
      if (!keyword.startsWith('https') || PlayDL.yt_validate(keyword) !== 'playlist') {
        throw new Error('This keyword is not a youtube playlist');
      }

      const playlistURL = new URL(keyword);

      // TODO: playlist / mix issue
      // if (playlistURL.pathname === '/watch') playlistURL.pathname = '/playlist';

      const playlist = await PlayDL.playlist_info(playlistURL.toString(), { incomplete: true });
      const videos = await playlist.all_videos();

      const totalDuration = videos
        .map((video) => video.durationInSec)
        .reduce((total, sec) => total + sec, 0);

      const playlistInfo: Playlist = {
        title: playlist.title,
        creator_name: playlist.channel.name ?? '-',
        creator_url: playlist.channel.url,
        creator_avatar: playlist.channel.icons[0].url,
        url: playlist.url,
        duration: totalDuration,
        duration_locale: this.getLocaleDuration(totalDuration),
        videoUrls: videos.map((video) => video.url),
      };

      return playlistInfo;
    } catch (error: Error | any) {
      return null;
    }
  }

}
