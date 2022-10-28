import { Dimensions } from 'react-native';

const device = Dimensions.get('window');
let scaleR;

if (device.width <= 414) {
	// Android smartphones
	scaleR = device.width / 414;
} else {
	// Android tablets
	scaleR = 1;
}


export const scale = scaleR;
export const size = function size(pixel) {
	return Math.ceil(pixel * scale);
}
