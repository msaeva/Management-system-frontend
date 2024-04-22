import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'transform',
  standalone: true
})
export class TextTransformPipe implements PipeTransform {

  transform(value: string, maxLength: number = 65): string {
    if (value.length <= maxLength) {
      return value;
    }
    const lastSpaceIndex = value.lastIndexOf(' ', maxLength);
    if (lastSpaceIndex !== -1) {
      return value.substring(0, lastSpaceIndex) + '...';
    }
    return value.substring(0, maxLength) + '...';
  }
}
