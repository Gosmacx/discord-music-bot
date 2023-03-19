import { Spotify, SpotifyList, Youtube } from './RegexList'
import * as Types from './tpyes'

class Utils {
    static typeSelector (text: string) {
        if (text.match(Spotify)) return Types.SPOTIFY      
        if (text.match(SpotifyList)) return Types.SPOTIFY_LIST      
        if (text.match(Youtube)) return Types.YOUTUBE_URL      

        return Types.YOUTUBE
    }
}

export default Utils