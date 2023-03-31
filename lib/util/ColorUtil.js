import { rgbaToAHex, hexToRgba } from 'hex-and-rgba/esm';


import {
  LAYER_APPLICATION, LAYER_BUSINESS, LAYER_MOTIVATION, 
  LAYER_STRATEGY, LAYER_IMP_MIG, 
  LAYER_PHYSICAL, LAYER_TECHNOLOGY
} from '../metamodel/Concept';

export const COLOR_LAYER_STRATEGY = '#F5DEAA', // 'rgba(245, 222, 170, 1)'
  COLOR_LAYER_BUSINESS = '#FFFFB5', // 'rgba(255, 255, 181, 1)' 
  COLOR_LAYER_APPLICATION = '#B5FFFF', // 'rgba(181, 255, 255, 1)' 
  COLOR_LAYER_TECHNOLOGY = '#C9E7B7', // 'rgba(201, 231, 183, 1)' 
  COLOR_LAYER_PHYSICAL = '#C9E7B7', // 'rgba(201, 231, 183, 1)' 
  COLOR_LAYER_IMP_MIG = '#FFE0E0', // 'rgba(255, 224, 224,1)' 
  COLOR_LAYER_MOTIVATION = '#CCCCFF'; // 'rgba(204, 204, 255, 1)' 

export const COLOR_LAYER_MAP = new Map([
  [LAYER_STRATEGY, COLOR_LAYER_STRATEGY],
  [LAYER_BUSINESS, COLOR_LAYER_BUSINESS],
  [LAYER_APPLICATION, COLOR_LAYER_APPLICATION],
  [LAYER_TECHNOLOGY, COLOR_LAYER_TECHNOLOGY],
  [LAYER_PHYSICAL, COLOR_LAYER_PHYSICAL],
  [LAYER_IMP_MIG, COLOR_LAYER_IMP_MIG],
  [LAYER_MOTIVATION, COLOR_LAYER_MOTIVATION]
])

export const BLACK_SHADOW = '#00000066', // 'rgba(0, 0, 0, 0.40)'
  DEFAULT_NOTE_COLOR = '#FFFFFF';

export function toHex(rgbaColor) {
  return rgbaToAHex(rgbaColor.r, rgbaColor.g, rgbaColor.b, rgbaColor.a/100 );
}

export function toRgba(hexColor) {
  var color = hexToRgba(hexColor);
  if (color) {
    return {r: color[0], g: color[1], b: color[2], a: color[3]*100};
  } else {
    return false
  }
}