const { exec } = require('child-process')
const iconv = require('iconv')

module.exports = bot => textInput => {
    const buf = iconv.encode(textInput, 'UTF8')
    const child = exec(
        'java -Dfile.encoding=UTF-8 -jar c:/iflytek/iflytek.jar \"'+textInput+'\"',{encoding: 'utf8'});
    child.stdout.on('data', function(data) {
        //var iflydata = JSON.parse(data);
        console.log('RC code==>'+data.toString());
                if(data.toString().indexOf("ifly")>-1){
                     var iflydata = data.split("#");
                 if(iflydata[1]=='weather'){
                     var weatherData = JSON.parse(iflydata[2]);

                     /*botly.send({id: sender, message: {
                         text: `${users[sender].first_name},:`+opencc.convertSync(weatherData.city+":"+weatherData.weather+weatherData.tempRange).replace(/ /g,'')
                    }}, function (err, data) {
                        console.log("regular send cb:", err, data);
                    });*/
                    createWAV(opencc.convertSync(weatherData.city+":"+weatherData.weather+weatherData.tempRange).replace(/ /g,''));
                     //event.reply(opencc.convertSync(weatherData.weather+weatherData.tempRange).replace(/ /g,''));
                 } else if(iflydata[1]=='cookbook'){
                     var cookbook = JSON.parse(iflydata[2]);
                     var cookinfo = cookbook.ingredient +" : "+ cookbook.accessory;
                     /* botly.send({id: sender, message: {
                         text: `${users[sender].first_name},:`+opencc.convertSync(cookinfo.toString()).replace(/ /g,'')
                    }}, function (err, data) {
                        console.log("regular send cb:", err, data);
                    });*/
                    createWAV(opencc.convertSync(cookinfo.toString()).replace(/ /g,''));
                    // event.reply(opencc.convertSync(cookinfo.toString()).replace(/ /g,''));

                 }
                 else {

                     if(data.split("#")[2].indexOf('schedule')>-1){
                         //var scheduleData = JSON.parse(iflydata[2]);
                         var iflyObj = JSON.parse(data.split("#")[2]);

                            var mydate = moment(iflyObj.semantic.slots.datetime.date+" "+iflyObj.semantic.slots.datetime.time);
                            var endtime = moment(mydate).add(2, 'hours');
                            console.log(mydate.toISOString());
                            var payload ={
                                starttime:mydate.toISOString(),
                                endtime:endtime.toISOString(),
                                title:iflyObj.semantic.slots.content
                            }
                            if(iflyObj.semantic.slots.name=='reminder'){
                            //iot_client.publish('iot-2/evt/schedule/fmt/json', JSON.stringify(payload));
                            console.log('Create Calendar entry at Google Calendar');
                            }
                            else {

                            //var date =new Date(2016, 11, 20, 23, 34, 0);

                            var j = schedule.scheduleJob(mydate.toDate(), function(){
                              console.log('Time is UP.');
                             // bot.push(event.source.userId.toString(), '時間到了！'+iflyObj.semantic.slots.content);
                                /*botly.send({id: sender, message: {
                                text: `${users[sender].first_name},:`+'時間到了！'+opencc.convertSync(iflyObj.semantic.slots.content).replace(/ /g,'')
                                }}, function (err, data) {
                                    console.log("regular send cb:", err, data);
                                });*/
                                createWAV('時間到了！'+opencc.convertSync(iflyObj.semantic.slots.content).replace(/ /g,''));
                            });
                            console.log('Create scheduler on'+mydate.toDate());
                            }
                                /*botly.send({id: sender, message: {
                                text: `${users[sender].first_name},:`+'為你安排 :'+iflyObj.semantic.slots.datetime.date+":"+iflyObj.semantic.slots.datetime.time+":"+iflyObj.semantic.slots.name+":"+opencc.convertSync(iflyObj.semantic.slots.content).replace(/ /g,'')
                                }}, function (err, data) {
                                    console.log("regular send cb:", err, data);
                                });*/
                                createWAV('為你安排 :'+iflyObj.semantic.slots.datetime.date+":"+iflyObj.semantic.slots.datetime.time+":"+iflyObj.semantic.slots.name+":"+opencc.convertSync(iflyObj.semantic.slots.content).replace(/ /g,''));
                    //	 event.reply("為你安排 "+iflyObj.semantic.slots.datetime.date+":"+iflyObj.semantic.slots.datetime.time+":"+iflyObj.semantic.slots.name+":"+opencc.convertSync(iflyObj.semantic.slots.content).replace(/ /g,''));
                            } else if(data.split("#")[2].indexOf('websearch')>-1){
                              console.log('Web Search =============== :');
                             //var scheduleData = JSON.parse(iflydata[2]);
                             var iflyObj = JSON.parse(data.split("#")[2]);
                             var searchKey = 'IBM';
                             if(iflyObj.semantic.slots.keywords)
                                 searchKey = iflyObj.semantic.slots.keywords;
                             else
                                 searchKey = iflyObj.text;

                                console.log('SearchKey :'+searchKey);
                                var payload ={
                                    query:opencc.convertSync(searchKey).replace(/ /g,''),
                                    "mid": mid,
                                    "eventId": '',
                                    "eventUser": ''
                                }
                                iot_client.publish('iot-2/evt/websearch/fmt/json', JSON.stringify(payload));

                             //event.reply("我幫你找找，請稍等 : "+opencc.convertSync(searchKey).replace(/ /g,''));
                            // bot.push(event.source.userId.toString(), "我幫你找找，請稍等 : "+opencc.convertSync(searchKey).replace(/ /g,''));
                            /* botly.send({id: sender, message: {
                                text: `${users[sender].first_name},:`+'我幫你找找，請稍等... : \n'+opencc.convertSync(searchKey).replace(/ /g,'')
                                }}, function (err, data) {
                                    console.log("regular send cb:", err, data);
                                });*/createWAV('我幫你找找，請稍等... : \n'+opencc.convertSync(searchKey).replace(/ /g,''));

                            } else if(data.split("#")[2].indexOf('restaurant')>-1){
                             console.log('restaurantSearchK=============== :');
                             //var scheduleData = JSON.parse(iflydata[2]);
                             var iflyObj = JSON.parse(data.split("#")[2]);
                             var searchKey = '台北美食';
                             if(iflyObj.semantic.slots.keywords)
                                 searchKey = iflyObj.semantic.slots.keywords;
                             else if(iflyObj.semantic.slots.name)
                                 searchKey = ((iflyObj.semantic.slots.location.poi=='CURRENT_POI')?'台北':(iflyObj.semantic.slots.location.poi))+' '+iflyObj.semantic.slots.name;
                             else if(iflyObj.semantic.slots.category)
                                 searchKey = ((iflyObj.semantic.slots.location.poi=='CURRENT_POI')?'台北':(iflyObj.semantic.slots.location.poi))+' '+iflyObj.semantic.slots.category;
                             else if(iflyObj.semantic.slots.special)
                                 searchKey = ((iflyObj.semantic.slots.location.poi=='CURRENT_POI')?'台北':(iflyObj.semantic.slots.location.poi))+' '+iflyObj.semantic.slots.special;
                             else
                                 searchKey = iflyObj.text;

                                console.log('SearchKey :'+searchKey);
                                var payload ={
                                    query:searchKey,
                                    "eventId": '',
                                    "eventUser": ''
                                }
                                iot_client.publish('iot-2/evt/restaurant/fmt/json', JSON.stringify(payload));
                                /*botly.send({id: sender, message: {
                                text: `${users[sender].first_name},:`+'為你找尋............... : \n'+opencc.convertSync(searchKey).replace(/ /g,'')
                                }}, function (err, data) {
                                    console.log("regular send cb:", err, data);
                                });*/createWAV('為你找尋............... : \n'+opencc.convertSync(searchKey).replace(/ /g,''));

                             //event.reply("為你找尋 : "+opencc.convertSync(searchKey).replace(/ /g,''));
                         } else if(data.split("#")[2].indexOf('train')>-1){
                         console.log('THSRC 時刻表 Search=============== :');
                         //var scheduleData = JSON.parse(iflydata[2]);
                        var iflyObj = JSON.parse(data.split("#")[2]);
                        var now=moment();
                        //預設值
                        var StartStation ='台北';  //起站
                        var EndStation ='左營';  	//終站
                        var SearchDate =now.format("YYYY/MM/DD");		//出發日期
                        var SearchTime =now.format("HH:mm"); 			//出發時間
                        var traindate;// =moment("2017-01-14 09:00:00", "YYYY-MM-DD hh:mm:ss");

                         if(iflyObj.semantic.slots.startLoc){
                             if(iflyObj.semantic.slots.startLoc.areaAddr)
                                  StartStation=iflyObj.semantic.slots.startLoc.areaAddr;
                             if(iflyObj.semantic.slots.startLoc.cityAddr)
                                  StartStation=iflyObj.semantic.slots.startLoc.cityAddr;
                         }
                          if(iflyObj.semantic.slots.endLoc){
                               if(iflyObj.semantic.slots.endLoc.areaAddr)
                                  EndStation = iflyObj.semantic.slots.endLoc.areaAddr;
                              if(iflyObj.semantic.slots.endLoc.cityAddr)
                                  EndStation = iflyObj.semantic.slots.endLoc.cityAddr;
                          }

                           if(iflyObj.semantic.slots.startDate){
                               if(iflyObj.semantic.slots.startDate.date){
                                   traindate =moment(iflyObj.semantic.slots.startDate.date+' 09:00:00', "YYYY-MM-DD HH:mm:ss");
                                   SearchDate =traindate.format("YYYY/MM/DD");
                                  // SearchTime =traindate.format("hh:mm");
                               }
                               if(iflyObj.semantic.slots.startDate.time){
                                   traindate =moment(SearchDate+' '+iflyObj.semantic.slots.startDate.time, "YYYY-MM-DD HH:mm:ss");
                                   SearchTime =traindate.format("HH:mm");
                               }
                           }




                            console.log('SearchKey :'+StartStation+' to '+EndStation +'date:'+SearchDate+'time:'+SearchTime);
                            var payload ={
                                StartStation:opencc.convertSync(StartStation).replace(/ /g,''),
                                EndStation :opencc.convertSync(EndStation).replace(/ /g,''),
                                SearchDate:SearchDate,
                                SearchTime:SearchTime,
                                "eventId": '',
                                "eventUser": ''
                            }
                            iot_client.publish('iot-2/evt/train/fmt/json', JSON.stringify(payload));

                         //botly.send("查詢中...................... : \n"+opencc.convertSync('行程 :'+StartStation+'站 到 '+EndStation +'站\n日期:'+SearchDate+' 時間:'+SearchTime));

                         /*botly.send({id: sender, message: {
                                text: `${users[sender].first_name},:`+'查詢中...................... : \n'+opencc.convertSync('行程 :'+StartStation+'站 到 '+EndStation +'站\n日期:'+SearchDate+' 時間:'+SearchTime)
                                }}, function (err, data) {
                                    console.log("regular send cb:", err, data);
                                });*/
                            createWAV('查詢中...................... : \n'+opencc.convertSync('行程 :'+StartStation+'站 到 '+EndStation +'站\n日期:'+SearchDate+' 時間:'+SearchTime));
                     }
                     else if(data.split("#")[2].indexOf('music')>-1){
                         console.log('restaurantSearchK=============== :');
                         //var scheduleData = JSON.parse(iflydata[2]);
                         var iflyObj = JSON.parse(data.split("#")[2]);
                         var downloadURL = '';
                         var searchKey ='';
                         if(iflyObj.semantic.slots && iflyObj.semantic.slots.artist)
                             searchKey = iflyObj.semantic.slots.artist;
                         if(iflyObj.semantic.slots && iflyObj.semantic.slots.song)
                             searchKey = searchKey+" : "+iflyObj.semantic.slots.song;//((iflyObj.semantic.slots.location.poi=='CURRENT_POI')?'台北':(iflyObj.semantic.slots.location.poi))+' '+iflyObj.semantic.slots.name;
                         else
                             searchKey = iflyObj.text;

                            console.log('SearchKey :'+searchKey);
                            /* var payload ={
                                query:searchKey,
                                "eventId": event.source.userId.toString(),
                                "eventUser": ''
                            }
                            iot_client.publish('iot-2/evt/restaurant/fmt/json', JSON.stringify(payload)); */

                            if(iflyObj.data.result && iflyObj.data.result.length >0 ){
                            console.log('Music Download URL :'+iflyObj.data.result[0].downloadUrl)
                                //var songName = iflyObj.data.result[0].downloadUrl.split("/").pop();
                                    /*botly.send({id: sender, message: {
                                        text: `${users[sender].first_name},:`+'正在為你準備 :'+opencc.convertSync(searchKey).replace(/ /g,'')
                                        }}, function (err, data) {
                                            console.log("regular send cb:", err, data);
                                        });*/
                                        createWAV('正在為你準備 :'+opencc.convertSync(searchKey).replace(/ /g,''));
                                    setTimeout(function(){
                                        console.log('Wait for Search.....');
                                        /*botly.sendAttachment({
                                            id: sender,
                                            type: Botly.CONST.ATTACHMENT_TYPE.AUDIO,
                                            payload: {url: iflyObj.data.result[0].downloadUrl.replace(/ /g,'')}
                                        }, function (err, data) {
                                            console.log('ERR:'+err);
                                            console.log('Data'+JSON.stringify(data));
                                            if(data.error){
                                                botly.send({id: sender, message: {
                                                text: `${users[sender].first_name},:`+'Facebook系統忙碌，請多試幾次哦！'
                                                }}, function (err, data) {
                                                    console.log("regular send cb:", err, data);
                                                });
                                            }*/
                                            createWAV('');
                                                //log it
                                        //});
                                    },2000);


                            }

                     }
                     else {
                        /*botly.send({id: sender, message: {
                            text: `${users[sender].first_name},:`+opencc.convertSync(data.split("#")[2]).replace(/ /g,'')
                        }}, function (err, data) {
                            console.log("regular send cb:", err, data);
                        });*/createWAV(opencc.convertSync(data.split("#")[2]).replace(/ /g,''));
                     }
                 }
                }


                if(data.toString().indexOf('"rc":4')>-1){
                    msgs[mid].rc= false;
                    console.log('en input string==>'+buf.toString());

                    /* var payload = {
                           d:{
                                "mid": message.message.mid,
                               "text": "查查"+buf.toString() || {},
                               "eventId": sender,
                               "eventUser": users[sender].first_name
                             }
                       };
                    iot_client.publish('iot-2/evt/text/fmt/json', JSON.stringify(payload)); */

                    //Get Watson English Conversation Workspace
                    var payload = {
                        workspace_id: workspace,
                        input: {text:buf.toString()} || {}
                    };

                      // Send the input to the conversation service
                      conversation.message(payload, function(err, data) {
                        if (err) {
                          //return res.status(err.code || 500).json(err);
                          console.log('Conversation Error:'+err);
                        } else {
                        //return res.json(updateMessage(payload, data));
                         if(data.output.text[0]){
                            console.log(data.output.text[0]);
                            /*botly.send({id: sender, message: {
                            text: `${users[sender].first_name},:`+(data.output.text[0] || '')
                            }}, function (err, data) {
                                console.log("regular send cb:", err, data);
                            });*/
                            createWAV(data.output.text[0] || '');
                         }
                        }
                      });
                    //Publish FB message to Node-Red IOT/Conversation


                        /*
                        botly.send({id: sender, message: {
                        text: `${users[sender].first_name},:`+'筆記中....'+buf.toString()+',下次學起來！'
                    }}, function (err, data) {
                        console.log("regular send cb:", err, data);
                    }); */
                }
        console.log('data: ', typeof data, data);

    });
}
