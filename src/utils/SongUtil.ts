import { Video } from 'play-dl/dist/YouTube/classes/Video';

export type SongInfo = {
  title: string,
  thumbnail: string,
  duration: number,
  duration_locale: string,
  author: string,
  author_avatar: string,
  url: string,
};

export default class SongUtil {

  public static getInfo(song: any): SongInfo {
    const info = {
      title: null,
      thumbnail: null,
      duration: null,
      duration_locale: null,
      author: null,
      author_avatar: null,
      url: null,
    };

    if (song instanceof Video) {
      info.title = song.title;
      info.thumbnail = song.thumbnail.url;
      info.duration = song.durationInSec;
      info.author = song.channel.name;
      info.author_avatar = song.channel.icon.url;
      info.url = song.channel.url;
    }

    info.duration_locale = this.getDuationLocale(info.duration);

    return info;
  }

  public static getDuationLocale(duration: number) {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    return `${minutes}:${seconds} min`;
  }

}
