'use client';

import React, { useEffect, useRef } from 'react';

export function NetworkVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Nodes definition
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      isPrimary?: boolean;
      accentColor?: string;
      label?: string;
    }

    const nodeCount = Math.min(26, Math.floor(width / 32));
    const nodes: Node[] = [];

    // Central primary network nodes (SaaS Infrastructure hubs)
    nodes.push({ 
      x: width * 0.5, 
      y: height * 0.42, 
      vx: 0.08, 
      vy: -0.08, 
      radius: 6, 
      isPrimary: true, 
      accentColor: '#00E5FF', 
      label: 'NEXORA-ISB-EDGE' 
    });
    nodes.push({ 
      x: width * 0.28, 
      y: height * 0.36, 
      vx: -0.1, 
      vy: 0.08, 
      radius: 5, 
      isPrimary: true, 
      accentColor: '#8B5CF6', 
      label: 'DXB-CORE-01' 
    });
    nodes.push({ 
      x: width * 0.72, 
      y: height * 0.52, 
      vx: 0.1, 
      vy: 0.12, 
      radius: 5, 
      isPrimary: true, 
      accentColor: '#00E5FF', 
      label: 'SIN-ANYCAST-02' 
    });

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1.5,
        accentColor: Math.random() > 0.4 ? '#00E5FF' : '#8B5CF6',
      });
    }

    // Packet animation
    interface Packet {
      fromIndex: number;
      toIndex: number;
      progress: number;
      speed: number;
      color: string;
    }

    const packets: Packet[] = [];
    for (let i = 0; i < 7; i++) {
      packets.push({
        fromIndex: Math.floor(Math.random() * nodes.length),
        toIndex: Math.floor(Math.random() * 3),
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.007,
        color: i % 2 === 0 ? '#00E5FF' : '#8B5CF6',
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw thin technical grid
      ctx.strokeStyle = 'rgba(36, 50, 74, 0.25)';
      ctx.lineWidth = 1;
      const gridSize = 48;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update node positions
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 20 || node.x > width - 20) node.vx *= -1;
        if (node.y < 20 || node.y > height - 20) node.vy *= -1;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.3;
            const isPrimaryConn = nodes[i].isPrimary || nodes[j].isPrimary;

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            
            if (isPrimaryConn) {
              ctx.strokeStyle = `rgba(0, 229, 255, ${alpha * 1.6})`;
              ctx.lineWidth = 1.2;
            } else {
              ctx.strokeStyle = `rgba(139, 92, 246, ${alpha * 0.8})`;
              ctx.lineWidth = 0.8;
            }
            ctx.stroke();
          }
        }
      }

      // Draw moving data streams (packets)
      packets.forEach((p) => {
        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          p.fromIndex = Math.floor(Math.random() * nodes.length);
          p.toIndex = Math.floor(Math.random() * 3);
        }

        const from = nodes[p.fromIndex];
        const to = nodes[p.toIndex];
        if (from && to) {
          const px = from.x + (to.x - from.x) * p.progress;
          const py = from.y + (to.y - from.y) * p.progress;

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw nodes
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        if (node.isPrimary) {
          ctx.fillStyle = node.accentColor || '#00E5FF';
          ctx.shadowColor = node.accentColor || '#00E5FF';
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Pulse orbital ring
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = node.accentColor === '#8B5CF6' 
            ? 'rgba(139, 92, 246, 0.4)' 
            : 'rgba(0, 229, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();

          if (node.label && width > 600) {
            ctx.font = '9px monospace';
            ctx.fillStyle = '#F1F5F9';
            ctx.fillText(node.label, node.x + 10, node.y + 3);
          }
        } else {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
