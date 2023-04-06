const fs = require('fs');
const path = require('path');
const v2p = require('video-to-pixels');

var fri = 0;
var div = 16;
const file = 'vids/badapple.mp4'

var frames = {
	"width": 0,
	"height": 0,
	"frames": []
}

const pixels = [
	['⬛', 43],
	['⚫', 44],
	['🖤', 46],
	['🔳', 110],
	['🔲', 113],
	['🤍', 119],
	['⚪', 152],
	['⬜', 180]
];

const getpx = lum => pixels.reduce((prev, curr) => Math.abs(curr[1] - lum) < Math.abs(prev[1] - lum) ? curr : prev)[0];

console.log('converting');

v2p.videoToPixels(file, function (data, w, h) {
	fri += 1;

	var str = ""
	var sdata = v2p.scaleDownByN(div, data, w, h);

	frames.width = w
	frames.height = h

	console.log('frame: ' + fri.toString())
	
	for (let j = 0; j < (h / div); j++) {
		for (let i = 0; i < (w / div); i++) {
			const idx = (i + j * (w / div)) * 4;

			const r = sdata[idx + 0];
			const g = sdata[idx + 1];
			const b = sdata[idx + 2];

			const mean = (r + g + b) / 3;

			str += getpx(mean);
		}

		str += "\n"
	}

	frames.frames.push(str)
}, function(){
    console.log('converted');

	var stream = fs.createWriteStream('json/' + path.parse(path.basename(file)).name + '.json');
	
	stream.write(JSON.stringify(frames));
	stream.end();
})
