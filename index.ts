import './style.css';

const container = document.getElementById('container') as HTMLDivElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const sz = 20;
const ratio = 9 / 16;
const calcw = (h: number) => h * ratio;

function xx() {
  const h = container.clientHeight;
  const cw = container.clientWidth;
  const w = calcw(h);
  const x = (cw - w) / 2;
  canvas.width = w;
  canvas.height = h;
  canvas.style.left = `${x}px`;
  ctx.fillRect(0, 0, sz, sz);
  ctx.fillRect(w - sz, h - sz, sz, sz);
  console.log(container.clientWidth, container.clientHeight);
}
xx();
window.onresize = xx;
