const mic = require('mic')
const cp = require('child-process')

const { speech_to_text } = require('./watson')

const micInstance = mic();
// const micInstance = mic({ 'rate': '22100', 'channels': '2', 'debug': false, 'exitOnSilence': 4 });
const micInputStream = micInstance.getAudioStream();
micInstance.start();

micInputStream.on('data', function(data) {
    //console.log("Recieved Input Stream: " + data.length);
});
micInputStream.on('silence', function() {
    console.log("Got SIGNAL silence");
    cp.exec('nircmd.exe mutesysvolume 1 Microphone ');
    iot_client.publish('iot-2/evt/mute_mic/fmt/string', '1');
});

const stt_params = {
    content_type: 'audio/wav',
    //ws: '',
    //model: 'WatsonModel',
    model:'zh-CN_BroadbandModel' ,
    continuous: true,
    inactivity_timeout: -1
};

module.exports = bot => {
	console.log("openCMDS");
	//this.mic;
//	mic = cp.spawn('arecord', [ '--device=plughw:2,0','--format=S16_LE', '--rate=44100', '--channels=1']); //, '--duration=10'
//	mic.stderr.pipe(process.stderr);

	// create the stream
	const recognizeStream = speech_to_text.createRecognizeStream(stt_params);
	micInputStream.pipe(recognizeStream);
	// start the recording
    //mic = cp.spawn('arecord', ['--device=plughw:0,0', '--format=S16_LE', '--rate=44100', '--channels=1']); //, '--duration=10'
    //mic.stderr.pipe(process.stderr);

    //save a local copy of your audio (in addition to streaming it) by uncommenting this
    //mic.stdout.pipe(require('fs').createWriteStream('test.wav'));

    // optionally compress, and then pipe the audio to the STT service

	//new Sound('/home/pi/voice/interlude/pleasesay.wav').play();

    // end the recording


	// listen for 'data' events for just the final text
	// listen for 'results' events to get the raw JSON with interim results, timings, etc.
	//var sayflag = 0
	recognizeStream.setEncoding('utf8'); // to get strings instead of Buffers from `data` events
	// listen for 'data' events for just the final text
	console.log("start record");
	recognizeStream.on('results', function(data){
    	//console.log('xxxxxxxxx state: '+data.state);
    	if(data.results[0] && data.results[0].final && data.results[0].alternatives){

    		ch_r=data.results[0].alternatives[0].transcript;
    		ch_c=data.results[0].alternatives[0].confidence;
    		ch_d=data;
    		//bomb.emit('send');
    	console.log('Results event data: '+data.results[0].alternatives[0].transcript);

/*      const thisCount = count + 1;
        count += 1;
        msgs[thisCount] = {};
        msgs[thisCount].rc = true;
        reply(data.results[0].alternatives[0].transcript,String(thisCount));//iot_client.publish('iot-2/evt/sttword/fmt/json', '{"d":{"sttcht": "'+data.results[0].alternatives[0].transcript+'" }}');
*/
        bot.receive('question', data.results[0].alternatives[0].transcript)
    	//var tts=data.results[0].alternatives[0].transcript;
	    //  new Sound('/home/pi/voice/cmd/Mx.wav').play();
        // exec("python  /home/pi/Adafruit_Python_LED_Backpack/examples/matrix8x8_scroll.py "+tts,openEmotion);
    	// iot_client.publish('iot-2/evt/voicecmd_ch/fmt/json', JSON.stringify(data, null, 2));

    	//iot-2/evt/color/fmt/json
        //  } else {
        //     new Sound('/home/pi/voice/interlude/what.wav').play();
        //}
    });

    recognizeStream.on('error',  function() {
        console.log.bind(console, 'error event: ');
        //var transcription = converter.toBuffer();
        //console.log(transcription);
    });

    recognizeStream.on('connection-close',  function() {
        console.log.bind(console, '==============connection-close event: ===========================');
        //var transcription = converter.toBuffer();
        // console.log(transcription);
    });
}
