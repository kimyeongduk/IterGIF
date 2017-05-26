importScripts('GIFEncoder.js', 'TypedNeuQuant.js', 'LZWEncoder.js');

function encodeFrame(frame) {
	var frame_index, frame_length, width, height, quality, delay, imageData, last;
	
	frame_index  = frame.data["frame_index"];
	frame_length = frame.data["frame_length"];
	width        = frame.data["width"];
	height       = frame.data["height"];
	imageData    = frame.data["imageData"];
	quality      = frame.data["quality"];
	delay        = frame.data["delay"];
	last         = frame.data["last"];
	
	var encoder = new GIFEncoder(width, height);
	
	if(frame_index == 0) encoder.writeHeader();
	else encoder.firstFrame = false
	
	encoder.setRepeat(0);
	encoder.setQuality(quality);
	encoder.setDelay(delay);
	encoder.addFrame(new Uint8Array(imageData));
	if(last) encoder.finish();
	
	self.postMessage({"frame_index": frame_index, "frame_length": frame_length, "data": encoder.stream().getData(), "last": last});
}

self.onmessage = encodeFrame;