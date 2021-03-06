const QencodeApiClient = require('qencode-api');

const apiKey = "your_api_key_here";
const s3_path = "s3://s3-yourRegion.amazonaws.com/bucketname";
const s3_key = "youS3Key";
const s3_secret = "yourS3secret";
const videoUrl = "https://servername/folder/video.mp4";
const payload = null;

let transcodingParams = {};
transcodingParams.source = videoUrl;

let format = {};

format.destination = {};
format.destination.url = s3_path;
format.destination.key = s3_key;
format.destination.secret = s3_secret;

format.output = "advanced_hls";


let stream = {};
stream.size = "1920x1080";
stream.audio_bitrate = 128;

let vcodec_params = {};
vcodec_params.vprofile = "baseline";
vcodec_params.level = 31;
vcodec_params.coder = 0;
vcodec_params.flags2 = "-bpyramid+fastpskip-dct8x8";
vcodec_params.partitions = "+parti8x8+parti4x4+partp8x8+partb8x8";
vcodec_params.directpred = 2;

stream.video_codec_parameters = vcodec_params;

format.stream = [];
format.stream.push(stream);


transcodingParams.format = [];
transcodingParams.format.push(format);

const qencodeApiClient = new QencodeApiClient(apiKey);
console.log("AccessToken: ", qencodeApiClient.AccessToken);

let task = qencodeApiClient.CreateTask();
console.log("Created new task: ", task.taskToken);

task.StartCustom(transcodingParams, payload);
console.log("Status URL: ", task.statusUrl);


CheckTaskStatus();

async function CheckTaskStatus(){
    while (task.GetStatus().status != "completed") {
        console.log(task.GetStatus().status);
        await sleep(10000);
    }
    console.log(task.GetStatus().status);
}

function sleep(ms){
    return new Promise(resolve=>{
            setTimeout(resolve,ms)
        })
}