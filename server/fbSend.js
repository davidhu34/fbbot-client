const opencc = require('opencc')
const occ = new opencc('s2twp.json')
const type_zh_tw = require('./place_type')

const chzw = str => occ.convertSync(str)

module.exports = (botly) => (payload) => { // source: douban movies v2 api
    const type = payload.type
    const prev = payload.prev
    const data = payload.data
    const elements = []
    switch (type) {
        case 'travel':
            data.places.map( p => {
                const placeType = p.types
                    .filter( t => t !== 'point_of_interest' )
                    .map(t => type_zh_tw[t]).join('/')
                console.log(placeType)
                elements.push({
                    image_url: p.photoUrl,
                    title: chzw(p.name),
                    subtitle: p.rating+" | "+placeType+" | "+chzw(p.address),
                    item_url: "https://www.google.com.tw/search?q="+(p.name),
                    buttons: [{
                        type: 'web_url',
                        title: 'map',
                        url: 'http://maps.google.com.tw/maps?z=12&t=m&q=loc:'+p.location.lat+'+'+p.location.lng
                    }]
                })
            })
            botly.sendGeneric({
                id: prev.sender,
                elements: elements,
            }, (err, data) => {console.log("send travel cb:", err, data)} )
            break
        case 'movie':
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
            }, (err, data) => {console.log("send movies cb:", err, data)} )
            break
        case 'restaurant':
            data.restaurants.map( r => {
                const open = (r.opening_hours !== undefined)? (
                    (r.opening_hours.open_now)? ' | 營業中': ' | 今日已結束營業'
                ) : ''
                if(elements.length < 4)
                    elements.push({
                        title: r.name,
                        //"image_url": "",
                        subtitle: r.formatted_address+open,
                        buttons: [
                            {
                                title: r.rating+" / 5.0",
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
                    elements: elements,
                    buttons: [{
                        title: 'View More',
                        type: 'postback',
                        payload: 'payload'
                    }]
                }
            }, (err, data) => {console.log("send restaurants cb:", err, data)} )
            break
        case 'review':
            console.log('to send reviews')
            const open = (data.open !== undefined)? (
                data.open? ' | 營業中': ' | 今日已結束營業'
            ) : ''
            const top = {
                title: data.name,
                subtitle: '地址: '+data.address+' | 電話: '+data.phone+' | 網址: '+data.website,
                default_action: {
                    type: 'web_url',
                    url: data.website,
                },
                buttons: [{
                    type: 'web_url',
                    title: data.rating+open+" | open map",
                    url: data.google
                }]
            }
            elements.push(top)
            data.reviews.map( rv => {
                if(elements.length < 4)
                    elements.push({
                        title: rv.rating+" / 5.0",
                        //"image_url": "",
                        subtitle: rv.text,
                    })
            })
            botly.send({
                id: prev.sender,
                message: {
                    text: '供您參考最高評價選項'
                }
            }, () => {
                botly.sendAttachment({
                    id: prev.sender,
                    type: 'template',
                    payload: {
                        template_type: 'list',
                        top_element_style: 'compact',
                        elements: elements,
                        buttons: [{
                            title: 'View More',
                            type: 'postback',
                            payload: 'payload'
                        }]
                    }
                }, (err, data) => {console.log("send recviews cb:", err, data)} )
            })
        default:
    }
}
