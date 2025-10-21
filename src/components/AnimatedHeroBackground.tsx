import { useEffect, useRef } from "react";

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pulsePhase: number;
  pulseSpeed: number;
}

export function AnimatedHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<Orb[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create orbs
    const createOrbs = () => {
      const colors = [
        "rgba(168, 85, 247, 0.15)", // primary purple
        "rgba(192, 132, 252, 0.12)", // light purple
        "rgba(147, 51, 234, 0.18)", // dark purple
        "rgba(216, 180, 254, 0.1)", // very light purple
        "rgba(126, 34, 206, 0.15)", // deep purple
      ];

      const orbs: Orb[] = [];
      const numOrbs = Math.floor(window.innerWidth / 200) + 3;

      for (let i = 0; i < numOrbs; i++) {
        orbs.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 150 + 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.002 + Math.random() * 0.003,
        });
      }

      return orbs;
    };

    orbsRef.current = createOrbs();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw orbs
      orbsRef.current.forEach((orb) => {
        // Update position
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Bounce off edges
        if (orb.x < -orb.radius || orb.x > canvas.width + orb.radius) {
          orb.vx *= -1;
        }
        if (orb.y < -orb.radius || orb.y > canvas.height + orb.radius) {
          orb.vy *= -1;
        }

        // Update pulse
        orb.pulsePhase += orb.pulseSpeed;
        const pulseFactor = Math.sin(orb.pulsePhase) * 0.2 + 0.9;

        // Create gradient
        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius * pulseFactor
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, "rgba(168, 85, 247, 0)");

        // Draw orb
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * pulseFactor, 0, Math.PI * 2);
        ctx.fill();
      });

      // Add blur effect
      ctx.filter = "blur(40px)";
      ctx.globalCompositeOperation = "screen";

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
