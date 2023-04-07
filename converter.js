const fs = require('fs');
const path = require('path');
const v2p = require('video-to-pixels');

var fri = 0;
var div = 16;
const file = 'vids/diofight/diofight000.mp4'

var frames = {
	"width": 0,
	"height": 0,
	"frames": []
}

const asciis = [
	[' ', '░', '▒', '▓', '█'],
	[`"`, ` `, `.`, `:`, `-`, `=`, `+`, `*`, `#`, `%`, `@`, `"`],
	[' ', '.', ':', '-', 'i', '|', '=', '+', '%', 'O', '#', '@'],
	['⠀','⠄','⠆','⠖','⠶','⡶','⣩','⣪','⣫','⣾','⣿'],
	[
		['⬛', 43],
		['⚫', 44],
		['🖤', 46],
		['🔳', 110],
		['🔲', 113],
		['🤍', 119],
		['⚪', 152],
		['⬜', 180]
	]
];
  
const pixels = asciis[2]; // the 3rd one is the best

const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;
const getpx = lum => pixels.reduce((prev,curr) => Math.abs(curr[1] - lum) < Math.abs(prev[1] - lum) ? curr : prev)[0];

console.log('converting');

v2p.videoToPixels(file, function (data, w, h) {
	fri += 1;

	var str = ""
	var sdata = v2p.scaleDownByN(div, data, w, h);

	if (frames.width == 0) {
		frames.width = w
		console.log('width: ' + w.toString())
	}

	if (frames.height == 0) {
		frames.height = h
		console.log('height: ' + h.toString())
	}
	
	console.log('frame: ' + fri.toString())
	
	for (let j = 0; j < (h / div); j++) {
		for (let i = 0; i < (w / div); i++) {
			const idx = (i + j * (w / div)) * 4;

			const r = sdata[idx + 0];
			const g = sdata[idx + 1];
			const b = sdata[idx + 2];

			const mean = (r + g + b) / 3;
			const ci = Math.floor(map(mean, 0, 255, 0, pixels.length));

			str += pixels[ci];
		}

		str += "\n"
	}

	frames.frames.push(str)
}, function(){
    console.log('converted');

	var stream = fs.createWriteStream('json/diofight/' + path.parse(path.basename(file)).name + '.json');
	
	stream.write(JSON.stringify(frames));
	stream.end();
})
