import React, { useRef, useEffect } from 'react';
import './HorizontalBar.css';

const HorizontalBar = () => {
 const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const bubbles = [];
    let mouse = { x: 0, y: 0 };
    let animationFrameId;

    // Bubble class to manage individual bubble properties and behavior
    class Bubble {
      constructor() {
        this.element = document.createElement('div');
        this.element.className = 'bubble';
        this.size = Math.random() * 10 + 5; // Size between 5 and 15px
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random vibrant color
        this.element.style.backgroundColor = this.color;
        this.position = {
          x: Math.random() * (window.innerWidth - this.size),
          y: Math.random() * (window.innerHeight - this.size),
        };
        this.velocity = {
          x: (Math.random() - 0.5) * 2, // Velocity between -1 and 1
          y: (Math.random() - 0.5) * 2,
        };
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
        container.appendChild(this.element);
      }

      update() {
        // Move bubble and bounce off edges
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.position.x <= 0 || this.position.x >= window.innerWidth - this.size) {
          this.velocity.x *= -1;
        }
        if (this.position.y <= 0 || this.position.y >= window.innerHeight - this.size) {
          this.velocity.y *= -1;
        }
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
      }

      nudge(mouseX, mouseY) {
        // Nudge bubble away if mouse is within 50px
        const dx = this.position.x - mouseX;
        const dy = this.position.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 50) {
          this.velocity.x += (dx / distance) * 2;
          this.velocity.y += (dy / distance) * 2;
        }
      }
    }

    // Create 50 bubbles
    for (let i = 0; i < 50; i++) {
      bubbles.push(new Bubble());
    }

    // Animation loop
    function animate() {
      bubbles.forEach(bubble => {
        bubble.nudge(mouse.x, mouse.y);
        bubble.update();
      });
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    // Track mouse movement
    function handleMouseMove(event) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    }
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <div className="bubble-container" ref={containerRef}></div>;
};


export default HorizontalBar;