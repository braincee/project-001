import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  },[value]); //this code will run when the value of 'value' changes
  return ref.current; //in the end, return the current ref value.
}

const AnimatedCounter = ({ counter, emoji }) => {
  const prevValue = usePrevious(counter);

  const MotionBox = motion("div");

  const variants = {
    from: () => ({
      x: `800%`,
    }),
    to: () => ({
      x: '0%',
      transition: {
        type: 'spring',
        mass: 1,
        damping: 15,
        stiffness: 100,
        restDelta: 0.001,
      },
    }),
  };
  console.log(prevValue, counter);
  return (
    <div className="flex flex-wrap">
      { counter > 0 &&
        new Array(prevValue).fill(0).map((number, index) => (        
          <p key={index}>{emoji}</p>
        ))
      }
      <AnimatePresence initial={false}>
        <MotionBox
          id={'animated-counter'}
          key={'animated-counter'}
          top={0}
          left={0}
          right={0}
          variants={variants}
          initial='from'
          animate='to'
        >
          { counter > prevValue && (
            <p>{emoji}</p>
          )}
        </MotionBox>
      </AnimatePresence>
    </div>
  )
}

export default AnimatedCounter;
