import { Injectable } from '@angular/core';
import { RgbColor } from '../components/dynamic/color/RgbColor';
import { HsvColor } from '../components/dynamic/color/HsvColor';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor() { }

  /**
     *
     * @param colorCode
     *
     * @return true if the given string is a correct hex color format
     */
    isValidHexCode(colorCode: string): boolean {
      const hexColorFormatRegex = /^#[0-9A-Fa-f]{6}$/gi;
      return !!colorCode.match(hexColorFormatRegex);
  }

  parseRgbString(rgbText: string): RgbColor {
      const rgbColorFormatRegex = /^rgb\((\d+),(\d+),(\d+)\)$/gi;
      const inValidRange = value => (value >= 0 && value < 256);

      const match = rgbColorFormatRegex.exec(rgbText);
      if (!match || match.length !== 4) {
          return null;
      }
      const red = parseInt(match[1]);
      const green = parseInt(match[2]);
      const blue = parseInt(match[3]);
      if (!inValidRange(red) || !inValidRange(green) || !inValidRange(blue)) {
          return null;
      }
      return {red, green, blue};
  }

  /**
   * Transforms from HSV color representation to RGB
   * @see https://en.wikipedia.org/wiki/HSL_and_HSV#HSV_to_RGB
   *
   * @param hsv
   *
   * @return RGB values in range [0,255]
   */
  hsv2rgb({hue, saturation, value}: HsvColor): RgbColor {

      const chroma = value * saturation;
      const hue1 = this.rad2deg(hue) / 60;
      const x = chroma * (1 - Math.abs((hue1 % 2) - 1));
      let r1;
      let g1;
      let b1;
      if (hue1 >= 0 && hue1 <= 1) {
          ([r1, g1, b1] = [chroma, x, 0]);
      } else if (hue1 >= 1 && hue1 <= 2) {
          ([r1, g1, b1] = [x, chroma, 0]);
      } else if (hue1 >= 2 && hue1 <= 3) {
          ([r1, g1, b1] = [0, chroma, x]);
      } else if (hue1 >= 3 && hue1 <= 4) {
          ([r1, g1, b1] = [0, x, chroma]);
      } else if (hue1 >= 4 && hue1 <= 5) {
          ([r1, g1, b1] = [x, 0, chroma]);
      } else if (hue1 >= 5 && hue1 <= 6) {
          ([r1, g1, b1] = [chroma, 0, x]);
      }

      const m = value - chroma;
      const [r, g, b] = [r1 + m, g1 + m, b1 + m];

      // scale up to [0, 255]
      return {
          red: Math.round(255 * r),
          green: Math.round(255 * g),
          blue: Math.round(255 * b)
      };
  }

  /**
   *
   * @param rgb
   *
   * @return [hue, saturation, value]
   */
  rgb2hsv({red, green, blue}: RgbColor): HsvColor {
      red /= 255;
      green /= 255;
      blue /= 255;

      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);

      const value = max;
      const d = max - min;
      const saturation = max === 0 ? 0 : d / max;

      let hue;
      if (max === min) {
          hue = 0; // achromatic
      } else {
          switch (max) {
              case red:
                  hue = (green - blue) / d + (green < blue ? 6 : 0);
                  break;
              case green:
                  hue = (blue - red) / d + 2;
                  break;
              case blue:
                  hue = (red - green) / d + 4;
                  break;
          }

          hue /= 6;
      }
      // scale to [-π,π]
      hue = 2 * Math.PI * hue - Math.PI;
      return {hue, saturation, value};
  }

  /**
   *  Converts radian to degrees
   *
   * @param rad radian in range [-π, π]
   *
   * @return degree in [0, 360]
   */
  private rad2deg(rad: number): number {
      return ((rad + Math.PI) / (2 * Math.PI)) * 360;
  }

  /**
   *
   * @param rgb
   *
   * @return hex string
   */
  rgb2hex({red, green, blue}: RgbColor): string {
      const r = this.decimal2hex(red);
      const g = this.decimal2hex(green);
      const b = this.decimal2hex(blue);
      return '#' + r + g + b;
  }

  /**
   *
   * @param hex string with leading '#'
   *
   * @return array with r,g,b values
   */
  hex2rgb(hex: string): RgbColor {
      const [red, green, blue] = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
          , (m, r, g, b) => '#' + r + r + g + g + b + b)
          .substring(1).match(/.{2}/g)
          .map(x => parseInt(x, 16));
      return {red, green, blue};
  }

  /**
   * Converts a decimal number to a hex string
   * @param decimal
   *
   */
  private decimal2hex(decimal: number): string {
      let hex = Number(decimal).toString(16);
      if (hex.length < 2) {
          hex = '0' + hex;
      }
      return hex;
  }
}
