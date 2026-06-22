import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';

const AnimatedCounter = ({ value = 0, suffix = '', decimals = 0, className }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10px' });
  const [display, setDisplay] = useState('0');
  const spring = useSpring(0, { stiffness: 90, damping: 20 });
  const rounded = useTransform(spring, (v) => v.toFixed(decimals));

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, value, spring]);

  useEffect(() => rounded.on('change', (v) => setDisplay(v)), [rounded]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
