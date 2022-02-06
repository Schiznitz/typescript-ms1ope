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

const Enum = {
  KeyCode: {
    Up: { Value: 1 },
    Down: { Value: 2 },
    Left: { Value: 3 },
    Right: { Value: 4 },
  },
};

console.log('--------------------------------');

// Rojo
export enum KeyInputState {
  KeyDown,
  KeyUp,
}
type BeatKeyCodeType =
  | typeof Enum.KeyCode.Up.Value
  | typeof Enum.KeyCode.Down.Value
  | typeof Enum.KeyCode.Left.Value
  | typeof Enum.KeyCode.Right.Value;
export interface BeatData {
  code: BeatKeyCodeType;
  time: number;
  release_time?: number;
}
export interface SongData {
  name: string;
  beats: Array<BeatData>;
}
export interface PlayerInput {
  time: number;
  code: number;
  state: KeyInputState;
}
export function calc_score(beats: Array<BeatData>, inputs: Array<PlayerInput>) {
  const intervals = beats.map((beat, i) => {
    return {
      min: beat.time - 100,
      max: beat.time + 100,
      index: i,
    };
  });
  const map_beat_inputs = new Map<number, Array<number>>();
  intervals.forEach((interval) => {
    inputs.forEach((input, i_input) => {
      if (input.time >= interval.min && input.time <= interval.max) {
        if (!map_beat_inputs.has(interval.index))
          map_beat_inputs.set(interval.index, []);
        console.log('>', interval.index, i_input);
        map_beat_inputs.get(interval.index)?.push(i_input);
      }
    });
  });
  map_beat_inputs.forEach((i_inputs, i_beat) => {
    const beat = beats[i_beat];
    const _inputs = i_inputs.map((i) => inputs[i]);
  });
}
calc_score(
  [
    {
      code: Enum.KeyCode.Up.Value,
      time: 100,
    },
    {
      code: Enum.KeyCode.Down.Value,
      time: 100,
    },
    {
      code: Enum.KeyCode.Left.Value,
      time: 100,
    },
    {
      code: Enum.KeyCode.Right.Value,
      time: 100,
    },
  ],
  [
    {
      code: Enum.KeyCode.Left.Value,
      time: 100,
      state: KeyInputState.KeyDown,
    },
  ]
);
