import { cva, type VariantProps } from "class-variance-authority";
import {
  motion,
  MotionProps,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import React, { PropsWithChildren, useRef, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string;
  iconSize?: number;
  iconMagnification?: number;
  iconDistance?: number;
  direction?: "top" | "middle" | "bottom";
  children: React.ReactNode;
}

const DEFAULT_SIZE = 60;
const DEFAULT_MAGNIFICATION = 90;
const DEFAULT_DISTANCE = 140;

// Mobile defaults - smaller magnification to prevent overflow
const MOBILE_SIZE = 50;
const MOBILE_MAGNIFICATION = 65;
const MOBILE_DISTANCE = 100;

const dockVariants = cva(
  "supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 mx-auto flex h-[80px] w-max items-center justify-center gap-2 rounded-2xl p-3 backdrop-blur-md"
);

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      iconSize = DEFAULT_SIZE,
      iconMagnification = DEFAULT_MAGNIFICATION,
      iconDistance = DEFAULT_DISTANCE,
      direction = "middle",
      ...props
    },
    ref
  ) => {
    const mouseX = useMotionValue(Infinity);
    const [isMobile, setIsMobile] = useState(false);
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
      // Check if device is mobile
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768);
        setIsTouch('ontouchstart' in window);
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Adjust values for mobile
    const adjustedSize = isMobile ? MOBILE_SIZE : iconSize;
    const adjustedMagnification = isMobile ? MOBILE_MAGNIFICATION : iconMagnification;
    const adjustedDistance = isMobile ? MOBILE_DISTANCE : iconDistance;

    const renderChildren = () => {
      return React.Children.map(children, (child) => {
        if (
          React.isValidElement<DockIconProps>(child) &&
          child.type === DockIcon
        ) {
          return React.cloneElement(child, {
            ...child.props,
            mouseX: mouseX,
            size: adjustedSize,
            magnification: adjustedMagnification,
            distance: adjustedDistance,
            isMobile: isMobile,
            isTouch: isTouch,
          });
        }
        return child;
      });
    };

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
      if (isMobile || isTouch) {
        // Disable magnification on mobile/touch devices
        mouseX.set(Infinity);
      } else if ('pageX' in e) {
        mouseX.set(e.pageX);
      }
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleInteraction}
        onMouseLeave={() => mouseX.set(Infinity)}
        onTouchStart={() => isTouch && mouseX.set(Infinity)}
        {...props}
        className={cn(dockVariants({ className }), {
          "items-start": direction === "top",
          "items-center": direction === "middle",
          "items-end": direction === "bottom",
          // Add overflow hidden on mobile to prevent icons from escaping
          "overflow-hidden": isMobile,
        })}
        style={{
          // Ensure dock stays within viewport on mobile
          maxWidth: isMobile ? 'calc(100vw - 2rem)' : undefined,
        }}
      >
        {renderChildren()}
      </motion.div>
    );
  }
);

Dock.displayName = "Dock";

export interface DockIconProps
  extends Omit<MotionProps & React.HTMLAttributes<HTMLDivElement>, "children"> {
  size?: number;
  magnification?: number;
  distance?: number;
  mouseX?: MotionValue<number>;
  className?: string;
  children?: React.ReactNode;
  props?: PropsWithChildren;
  isMobile?: boolean;
  isTouch?: boolean;
}

const DockIcon = ({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  children,
  isMobile = false,
  isTouch = false,
  ...props
}: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const padding = Math.max(6, size * 0.2);
  const defaultMouseX = useMotionValue(Infinity);

  const distanceCalc = useTransform(mouseX ?? defaultMouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Disable or reduce magnification on mobile/touch
  const sizeTransform = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    isMobile || isTouch ? [size, size, size] : [size, magnification, size]
  );

  const scaleSize = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ 
        width: isMobile || isTouch ? size : scaleSize, 
        height: isMobile || isTouch ? size : scaleSize, 
        padding 
      }}
      className={cn(
        "flex aspect-square cursor-pointer items-center justify-center rounded-full",
        // Add active state for mobile
        "transition-transform active:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

DockIcon.displayName = "DockIcon";

export { Dock, DockIcon, dockVariants };