import * as PlayDL from 'play-dl';

export default class YoutubeResolver {

  public static async resolveByUrl(url: string) {
    if (!url.startsWith('https')) return null;

    if (PlayDL.yt_validate(url) === 'video') {
      const infoData = await PlayDL.video_basic_info(url);
      const song = infoData.video_details;
      return song;
    }

    // TODO: yt playlist

    return null;
  }

  public static async resolveByTitle(title: string) {
    if (PlayDL.yt_validate(title) === 'search') {
      const result = await PlayDL.search(title, {
        source: { youtube: 'video' },
        limit: 1,
      });
      return result[0];
    }

    return null;
  }

}
