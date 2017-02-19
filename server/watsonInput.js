const { iot_client } = require('./watson')

module.exports = bot => {
    iot_client.on("message", function(topic,payload_origin){
    	const noAnswer = payload_origin.indexOf('noanswer') === 0
    	// assuming otherwise always arrives later than helper
    	const payload_with_mid = payload_origin.toString().substr( noAnswer? 9:0 )
    	const midIdx = payload_with_mid.indexOf('#')
    	const mid = payload_with_mid.substr(0, midIdx)
    	const payload = payload_with_mid.substr(midIdx+1)

    	console.log('payload origin:'+payload_origin);
    	console.log('received topic:'+topic+', payload:'+payload);
    	var payloadary = payload.toString().split('#');
    	console.log(payloadary.length);

        const emit = (text) => bot.emit(mid, !noAnswer, text)

    	if(payloadary.length==5)	{
    		console.log('response tag==>'+payloadary[4]);
    		var movielist = payloadary[2].toString().split('\n');
    		var moviecolumn={};
    		var moviearray=[];
    		for(var i=0;i<movielist.length-1;i++){
    			var movie=movielist[i].split(',');
    			//console.log(i);
    			moviecolumn={
    				image_url: movie[0],
    				title: opencc.convertSync(movie[1]),
    				subtitle: opencc.convertSync(movie[2].replace(/ /g,'')),
    				item_url:  movie[3]
    			};
    			moviearray.push(moviecolumn);

    		}
    		/*botly.sendGeneric({id: payloadary[0], elements:moviearray.slice(0,8)}, function (err, data) {
            console.log("send generic cb:", err, data);
    		});

    		botly.send({id: payloadary[0], message: {
    					text: '參考看看嘍！'
    				}}, function (err, data) {
    					console.log("regular send cb:", err, data);});*/
            emit('');

    	} else if(payloadary[2] && payloadary[2] !='undefined'){
    	//console.log('Send to Users:'+users[payloadary[0]])
    	/*botly.send({id: payloadary[0], message: {
    							text: `${users[payloadary[0]].first_name},:`+opencc.convertSync(payloadary[2])
    						}}, function (err, data) {
    							console.log("regular send cb:", err, data);
    						});*/
            emit(opencc.convertSync(payloadary[2]));
    	} else if(topic.toString()=='iot-2/cmd/traintable/fmt/json'){
    		console.log('THSRC search Reuren result :'+payload);
    		var trainpayload = JSON.parse(payload.toString());
    		console.log('Map Object==>'+trainpayload.summary);
    		//bot.push(trainpayload.eventId, trainpayload.summary);
    		/*botly.send({id: trainpayload.eventId, message: {
    							text: trainpayload.summary
    						}}, function (err, data) {
    							console.log("regular send cb:", err, data);
    						});*/
                emit(trainpayload.summary);
    		setTimeout(function () {
    		//bot.push(trainpayload.eventId, '祝您旅途愉快！');
    		/*botly.send({id: trainpayload.eventId, message: {
    							text: `${users[trainpayload.eventId].first_name},:`+' 祝您旅途愉快！'
    						}}, function (err, data) {
    							console.log("regular send cb:", err, data);
    						});*/
                emit('祝您旅途愉快！');
    		}, 500)

    	} else if(topic.toString()=='iot-2/cmd/foodreturn/fmt/json'){
    		console.log('Food Reuren result :'+payload);
    		var foodpayload = JSON.parse(payload.toString());
    		console.log('foodpayload Object==>'+foodpayload);

    		/*botly.send({id: foodpayload.eventId, message: {
    							text: foodpayload.address+' : '+foodpayload.description
    						}}, function (err, data) {
    							console.log("regular send cb:", err, data);
    						});*/
                emit(foodpayload.address+' : '+foodpayload.description);
    		setTimeout(function () {
    		//bot.push(trainpayload.eventId, '祝您旅途愉快！');
    		/*botly.send({id: foodpayload.eventId, message: {
    							text: `${users[foodpayload.eventId].first_name},:`+' 希望你會喜歡！好吃再回來跟我說哦~~！'
    						}}, function (err, data) {
    							console.log("regular send cb:", err, data);
    						});*/
                emit('希望你會喜歡！好吃再回來跟我說哦~~！');
    		}, 500)
    		/* bot.push(foodpayload.eventId, {
    			type: 'location',
    			title: foodpayload.description.substring(0,90), //max 100 chars
    			address: foodpayload.address.substring(0,90),	//max 100 chars
    			latitude: foodpayload.lat,
    			longitude: foodpayload.lon
    		});
    		setTimeout(function () {
    		bot.push(foodpayload.eventId, '希望你會喜歡！好吃再回來跟我說哦~~');
    		}, 500) */
    	}
    }
    })
}
