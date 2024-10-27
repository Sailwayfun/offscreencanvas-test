import './style.css';
import GraphWorker from './worker/graphWorker?worker';

document.querySelector('#app').innerHTML = `
  <div>
    <canvas id="canvas" width="1366" height="768"></canvas>
  </div>
`;

document.addEventListener('DOMContentLoaded', () => {
  const worker = new GraphWorker();
  console.log({ worker });

  const DUMMY_NODES = Array.from({ length: 5000 }, (_, i) => ({ id: i + 1 }));
  const DUMMY_EDGES = Array.from({ length: 4999 }, (_, i) => ({ source: i + 1, target: i + 2 }));

  const offscreenCanvas = document.querySelector('#canvas').transferControlToOffscreen();

  worker.postMessage({
    type: 'init',
    nodes: DUMMY_NODES,
    edges: DUMMY_EDGES,
    width: 1366,
    height: 768,
    canvas: offscreenCanvas,
  }, [offscreenCanvas]);
});
