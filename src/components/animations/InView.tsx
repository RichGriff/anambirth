'use client'

import clsx from 'clsx'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import React from 'react'

interface InViewProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  distance?: number
  once?: boolean
  amount?: number
}

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  delayChildren?: number
  staggerChildren?: number
  mobileDelayChildren?: number
  mobileStaggerChildren?: number
  once?: boolean
  amount?: number
}

const useIsMobile = (maxWidth = 767) => {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${maxWidth}px)`)

    const update = () => setIsMobile(mediaQuery.matches)
    update()

    mediaQuery.addEventListener('change', update)

    return () => {
      mediaQuery.removeEventListener('change', update)
    }
  }, [maxWidth])

  return isMobile
}

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
  duration?: number
  distance?: number
}

export const InViewFade: React.FC<InViewProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.45,
  distance = 12,
  once = true,
  amount = 0.2,
}) => {
  const reduceMotion = useReducedMotion()

  const variants: Variants = reduceMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0 },
      }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export const StaggerInView: React.FC<StaggerContainerProps> = ({
  children,
  className,
  delayChildren = 0.05,
  staggerChildren = 0.08,
  mobileDelayChildren,
  mobileStaggerChildren,
  once = true,
  amount = 0.2,
}) => {
  const reduceMotion = useReducedMotion()
  const isMobile = useIsMobile()

  const activeDelayChildren = isMobile ? (mobileDelayChildren ?? delayChildren) : delayChildren
  const activeStaggerChildren = isMobile
    ? (mobileStaggerChildren ?? staggerChildren)
    : staggerChildren

  const variants: Variants = {
    hidden: {},
    visible: {
      transition: reduceMotion
        ? { delayChildren: 0, staggerChildren: 0 }
        : { delayChildren: activeDelayChildren, staggerChildren: activeStaggerChildren },
    },
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className,
  duration = 0.4,
  distance = 10,
}) => {
  const reduceMotion = useReducedMotion()

  const variants: Variants = reduceMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0 },
      }

  return (
    <motion.div
      className={clsx(className)}
      variants={variants}
      transition={{ duration, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export const StaggerInViewList: React.FC<StaggerContainerProps> = ({
  children,
  className,
  delayChildren = 0.05,
  staggerChildren = 0.08,
  mobileDelayChildren,
  mobileStaggerChildren,
  once = true,
  amount = 0.2,
}) => {
  const reduceMotion = useReducedMotion()
  const isMobile = useIsMobile()

  const activeDelayChildren = isMobile ? (mobileDelayChildren ?? delayChildren) : delayChildren
  const activeStaggerChildren = isMobile
    ? (mobileStaggerChildren ?? staggerChildren)
    : staggerChildren

  const variants: Variants = {
    hidden: {},
    visible: {
      transition: reduceMotion
        ? { delayChildren: 0, staggerChildren: 0 }
        : { delayChildren: activeDelayChildren, staggerChildren: activeStaggerChildren },
    },
  }

  return (
    <motion.ul
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </motion.ul>
  )
}

export const StaggerListItem: React.FC<StaggerItemProps> = ({
  children,
  className,
  duration = 0.4,
  distance = 10,
}) => {
  const reduceMotion = useReducedMotion()

  const variants: Variants = reduceMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0 },
      }

  return (
    <motion.li
      className={clsx(className)}
      variants={variants}
      transition={{ duration, ease: 'easeOut' }}
    >
      {children}
    </motion.li>
  )
}
