import { TextTransformPipe } from 'src/app/core/pipes/text-transform.pipe';

describe('TextTransoformPipe', () => {
  it('create an instance', () => {
    const pipe = new TextTransformPipe();
    expect(pipe).toBeTruthy();
  });
});
