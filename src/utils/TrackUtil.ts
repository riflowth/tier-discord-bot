import { YouTubeVideo } from 'play-dl';

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
      info.thumbnail = track.thumbnails[0].url;
      info.duration = track.durationInSec;
      info.author = track.channel.name;
      info.author_avatar = track.channel.iconURL;
      info.author_url = track.channel.url;
    }

    info.duration_locale = this.getLocaleDuration(info.duration);

    return info;
  }

  public static getLocaleDuration(duration: number): string {
    let timeString = new Date(duration * 1000).toISOString();

    timeString = (duration < 3600) ? timeString.substring(14, 19) : timeString.substring(11, 19);

    return timeString.startsWith('0') ? timeString.substring(1) : timeString;
  }

}
