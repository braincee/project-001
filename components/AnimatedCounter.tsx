import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

function usePrevious(value: any) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value //assign the value of ref to the argument
  }, [value]) //this code will run when the value of 'value' changes
  return ref.current //in the end, return the current ref value.
}

const AnimatedCounter = ({
  counter,
  emoji,
}: {
  counter: number
  emoji: any
}) => {
  const prevValue = usePrevious(counter)

  const MotionBox = motion('div')

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
  }
  return (
    <div className='flex flex-wrap'>
      {counter > 0 &&
        new Array(prevValue)
          .fill(0)
          .map((number, index) => <p key={index}>{emoji}</p>)}
      <AnimatePresence initial={false}>
        <MotionBox
          key={'animated-counter'}
          variants={variants}
          initial='from'
          animate='to'
        >
          {prevValue && counter > prevValue && <p>{emoji}</p>}
        </MotionBox>
      </AnimatePresence>
    </div>
  )
}

export default AnimatedCounter
