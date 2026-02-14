import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/VisionNest.png";

export default function Landing() {
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCTA(true);
    }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.container}>
      {/* Sparkles */}
      <Sparkles />

      {/* Logo with intro animation */}
      <motion.img
        src={logo}
        alt="VisionNest Logo"
        initial={{ scale: 0.85, opacity: 0, y: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: showCTA ? -140 : 0,
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
        style={styles.logo}
      />

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={styles.tagline}
      >
        Pin your progress. Watch it bloom.
      </motion.p>

      {/* Get Started */}
      {showCTA && (
        <motion.a
          href="/login"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={styles.button}
        >
          Get Started
        </motion.a>
      )}
    </div>
  );
}

function Sparkles() {
  return (
    <div style={styles.sparkleLayer}>
      {[...Array(14)].map((_, i) => (
        <span key={i} style={sparkleStyle(i)} />
      ))}
    </div>
  );
}

function sparkleStyle(i) {
  const size = Math.random() * 6 + 4;
  return {
    position: "absolute",
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    width: size,
    height: size,
    background: "rgba(255,255,255,0.9)",
    borderRadius: "50%",
    filter: "blur(1px)",
    animation: `float ${6 + Math.random() * 6}s ease-in-out infinite`,
    opacity: 0.7,
  };
}

const styles = {
  container: {
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #FFE1D6, #E9E3FF)",
    color: "#2B1A4A",
    overflow: "hidden",
    position: "relative",
  },
  logo: {
    width: "280px",                 // BIGGER LOGO
    marginBottom: "20px",
    borderRadius: "16px",           // soften black edges
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)", // soft glow
    zIndex: 2,
    background: "transparent",      // no extra background
  },
  tagline: {
    fontSize: "1.25rem",
    opacity: 0.9,
    marginBottom: "32px",
    textAlign: "center",
    zIndex: 2,
  },
  button: {
    padding: "14px 30px",
    borderRadius: "999px",
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    background: "#2B1A4A",
    color: "#fff",
    zIndex: 2,
  },
  sparkleLayer: {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    zIndex: 1,
    pointerEvents: "none",
  },
};
