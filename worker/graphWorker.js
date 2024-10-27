import { forceLink, forceSimulation, forceManyBody, forceCenter } from 'd3-force';

self.onmessage = (event) => {
    const { nodes, edges, width, height } = event.data;

    const simulation = forceSimulation(nodes)
        .force("link", forceLink(edges).id(d => d.id).distance(50))
        .force("charge", forceManyBody().strength(-100))
        .force("center", forceCenter(width / 2, height / 2))

    simulation.on("tick", () => {
        // 將計算結果傳回繪圖函數或直接進行 OffscreenCanvas 繪製
        for (const node of nodes) {
            node.x = node.x || 0;
            node.y = node.y || 0;
        }

        for (const edge of edges) {
            edge.source = {
                x: nodes.find(n => n.id === edge.source).x,
                y: nodes.find(n => n.id === edge.source).y,
            }
            edge.target = {
                x: nodes.find(n => n.id === edge.target).x,
                y: nodes.find(n => n.id === edge.target).y,
            }
        }
    });

    for (let i = 0; i < 100; i++) {
        simulation.tick();
    }

    simulation.stop();

    const offscreenCanvas = event.data.canvas;
    const ctx = offscreenCanvas.getContext('2d');

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // 畫邊 (edges)
        ctx.strokeStyle = '#aaa';
        for (const edge of edges) {
            ctx.beginPath();
            ctx.moveTo(edge.source.x, edge.source.y);
            ctx.lineTo(edge.target.x, edge.target.y);
            ctx.stroke();
        };

        // 畫節點 (nodes)
        ctx.fillStyle = '#3498db';
        for (const node of nodes) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    draw();
};