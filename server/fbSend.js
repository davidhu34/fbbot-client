const opencc = require('opencc')
const occ = new opencc('s2twp.json')

const chzw = str => occ.convertSync(str)

module.exports = (botly) => ({
    movie: (payload) => { // source: douban movies v2 api
        const prev = payload.prev
        const data = payload.data
        const elements = []
        console.log(data.movies[0])
        data.movies.slice(0,7).map( m => {
            const genre = chzw(m.genres.join('/'))
            const cast = chzw(m.casts.map( m => m.name ).join())
            const name = chzw(m.original_title)
            if (!name.match(/[\u3400-\u9FBF]/) || elements.length < 8)
                elements.push({
                    image_url: m.images.large,
                    title: name+' ('+m.year+')',//chzw(m.title) + '('+m.year+')',
                    subtitle: "類別: "+genre+" | 主演: "+cast+" | 評價: "+m.rating.average,
                    item_url: "https://www.google.com.tw/search?q="+(m.original_title+'+'+m.year).replace(" ",'+')//m.alt
                })
        })
        botly.sendGeneric({
            id: prev.sender,
            elements: elements
        }, (err, data) => {
            console.log("send generic cb:", err, data);
        })
    }
}
)
