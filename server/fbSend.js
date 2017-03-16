const opencc = require('opencc')
const occ = new opencc('s2twp.json')

const chzw = str => occ.convertSync(str)

module.exports = (botly) => (payload) => { // source: douban movies v2 api
    const type = payload.type
    const prev = payload.prev
    const data = payload.data
    const elements = []
    switch (type) {
        case 'movie':
            console.log(data.movies[0])
            data.movies.map( m => {
                const genre = chzw(m.genres.join('/'))
                const cast = chzw(m.casts.map( m => m.name ).join())
                const name = chzw(m.original_title)
                if (!name.match(/[\u3400-\u9FBF]/) && elements.length < 8)
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
            }, (err, data) => {console.log("send generic cb:", err, data)} )
            break;
        case 'restaurant':
            data.restaurants.map( r => {
                console.log(Object.keys(r))
                const open = (r.opening_hours)? (
                    (r.opening_hours.open_now)? '營業中': '今日已結束營業'
                ) : ''
                if(elements.length < 4)
                    elements.push({
                        title: r.name,
                        //"image_url": "",
                        subtitle: r.formatted_address+' | '+open,
                        buttons: [
                            {
                                title: r.rating,
                                type: 'postback',
                                payload: 'fsdg'
                            }
                        ]
                    })
            })
            botly.sendAttachment({
                id: prev.sender,
                type: 'template',
                payload: {
                    template_type: 'list',
                    top_element_style: 'compact',
                    elements: elements
                },
                buttons: [{
                    title: 'View More',
                    type: 'postback',
                    payload: 'payload'
                }]
            }, (err, data) => {console.log("send generic cb:", err, data)} )

        default:
    }
}
