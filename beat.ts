const Enum = {
  KeyCode: {
    Up: { Value: 1 },
    Down: { Value: 2 },
    Left: { Value: 3 },
    Right: { Value: 4 },
  },
};
// --------------------------------------------
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
export function calc_score(beats: Array<BeatData>) {
  const intervals = beats.map((beat, i) => {
    return {
      min: beat.time - 100,
      max: beat.time + 100,
      index: i,
    };
  });
  const map_beat_inputs = new Map<number, Array<number>>();
  const map_input_beats = new Map<number, Array<number>>();

  const length = beats.length;
  let i_interval = 0;

  function fuck(inputs: Array<PlayerInput>) {
    console.log('---');
    for (let i = i_interval; i < length; i++) {
      map_beat_inputs.set(i, []);
    }
    inputs.forEach((_, i) => {
      map_input_beats.set(i, []);
    });
    const last_input_time = inputs[inputs.length - 1].time;
    // 找出符合节奏区间的输入
    for (let i = i_interval; i < length; i++) {
      const interval = intervals[i];
      if (interval.min > last_input_time || i === length - 1) {
        i_interval = i;
        break;
      }
      const beat = beats[interval.index];
      inputs.forEach((input, i_input) => {
        if (
          input.code === beat.code &&
          input.time >= interval.min &&
          input.time <= interval.max
        ) {
          map_beat_inputs.get(interval.index)?.push(i_input);
          map_input_beats.get(i_input)?.push(interval.index);
        }
      });
    }
    // 找出最接近节拍的输入
    map_beat_inputs.forEach((i_inputs, i_beat) => {
      if (i_inputs.length < 2) return;
      const beat = beats[i_beat];
      i_inputs.sort(
        (a, b) =>
          Math.abs(beat.time - inputs[a].time) -
          Math.abs(beat.time - inputs[b].time)
      );
      const arr_beats = map_input_beats.get(i_inputs[0])!;
      arr_beats[0] = i_beat;
      arr_beats.length = 1;
      for (let i = 1; i < i_inputs.length; i++) {
        map_input_beats.get(i_inputs[i])!.length = 0;
      }
      i_inputs.length = 1;
    });
    map_beat_inputs.forEach((ipts, bt) => {
      console.log('bi', bt, ipts);
    });
    console.log('...');
    map_input_beats.forEach((bts, ipt) => {
      console.log('ib', ipt, bts);
    });
    map_beat_inputs.clear();
    map_input_beats.clear();

    return self;
  }
  const self = { fuck };
  return self;
}
console.log('=======================');
calc_score([
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
])
  .fuck([
    {
      code: Enum.KeyCode.Down.Value,
      time: 101,
      state: KeyInputState.KeyDown,
    },
  ])
  .fuck([
    {
      code: Enum.KeyCode.Down.Value,
      time: 102,
      state: KeyInputState.KeyDown,
    },
  ]);
