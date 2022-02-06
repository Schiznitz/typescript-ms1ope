import { Observable, Subject, Subscriber, Unsubscribable } from 'rxjs';
import { EMPTY_SUBSCRIPTION, Subscription } from 'rxjs/internal/Subscription';
import './style.css';

const container = document.getElementById('container') as HTMLDivElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const sz = 20;
const ratio = 9 / 16;
const calcw = (h: number) => h * ratio;

function xx() {
  const cw = container.clientWidth;
  const ch = container.clientHeight;
  const cr = cw / ch;
  const h = ch;
  const w = cr < ratio ? cw : calcw(h);
  const x = (cw - w) / 2;
  canvas.width = w;
  canvas.height = h;
  canvas.style.left = `${x}px`;
  ctx.fillRect(0, 0, sz, sz);
  ctx.fillRect(w - sz, h - sz, sz, sz);
}
xx();
window.onresize = xx;

class AsyncFetchable<T> extends Observable<T> {
  _subscribers = new Array<Subscriber<T> | undefined>();
  _source: () => Promise<T>;
  constructor(source: () => Promise<T>) {
    super((subscriber) => {
      let i = this._subscribers.indexOf(undefined);
      if (i < 0) i = this._subscribers.length;
      this._subscribers[i] = subscriber;
      return () => (this._subscribers[i] = undefined);
    });
    this._source = source;
  }
  async update() {
    const value = await this._source();
    for (const s of this._subscribers) {
      if (!s) continue;
      s.next(value);
    }
  }
}

const s1 = new Observable<number>((s): Unsubscribable => {
  s.next(1);
  const unsubscribe = () => {
    console.log('????');
    Subject;
  };
  return { unsubscribe };
});

// s1.subscribe((x) => console.log('1:', x));
// s1.subscribe((x) => console.log('2:', x));
// s1.subscribe((x) => console.log('3:', x));

import './beat';
