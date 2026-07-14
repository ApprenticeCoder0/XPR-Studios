import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "motion/react";

export function AnimatedStat({ text }: { text: string | number }) {
  const [display, setDisplay] = useState(text);
  const controls = useAnimation();

  useEffect(() => {
    setDisplay(text);
    controls.start({
      opacity: [0.5, 1],
      y: [5, 0],
      transition: { duration: 0.5 }
    });
  }, [text, controls]);

  return (
    <motion.span animate={controls} className="inline-block">
      {display}
    </motion.span>
  );
}
