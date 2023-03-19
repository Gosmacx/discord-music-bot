import { Readable } from "stream";
import ytdl from "ytdl-core";
import ytsr from "ytsr";


type result = {
    title: string,
    id: string,
    thumbnail: string,
    url: string
}

type ServiceType = {
    search: (text: string) => Promise<result[]> | null,
    getSong: (url: string) => Promise<result>,
    getStream: (url: string) => Readable
}

const Service: ServiceType = {
    search: async (text) => {
        if (!text) return;
        let result: any = await ytsr(`${text}`, { pages: 0 })
        if (!result || result.length == 0) return;
        const filtredVideos = result.items.filter((item: any) => item.type == 'video')

        return filtredVideos.map((item: any) => {
            return {
                title: item.title,
                id: item.id,
                thumbnail: item.thumbnails[1] ? item.thumbnails[1]?.url : item.thumbnails[0]?.url,
                url: item.url
            }
        })
    },
    getSong: async (url) => {
        const song = await ytdl.getBasicInfo(`${url}`)

        return {
            title: song.videoDetails.title,
            id: song.videoDetails.videoId,
            thumbnail: song.thumbnail_url,
            url: song.videoDetails.video_url
        }
    },
    getStream: (url) => {
        return ytdl(`${url}`, { filter: 'audioonly', quality: 'lowest' })
    }
}

export default Service


