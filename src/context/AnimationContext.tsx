"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ShoppingCart } from "lucide-react";

interface AnimationState {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface AnimationContextType {
  triggerAnimation: (buttonElement: HTMLElement) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined
);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [animation, setAnimation] = useState<AnimationState | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationIdRef = useRef(0);

  const triggerAnimation = useCallback((buttonElement: HTMLElement) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Cancel previous animation
    setAnimation(null);

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      // Get button position
      const buttonRect = buttonElement.getBoundingClientRect();
      const startX = buttonRect.left + buttonRect.width / 2;
      const startY = buttonRect.top + buttonRect.height / 2;

      // Get cart icon position in header
      const cartButton = document.querySelector(
        'header button[data-cart-button="true"]'
      ) as HTMLElement;

      if (!cartButton) return;

      const cartRect = cartButton.getBoundingClientRect();
      const endX = cartRect.left + cartRect.width / 2;
      const endY = cartRect.top + cartRect.height / 2;

      // Increment animation ID
      animationIdRef.current += 1;
      const currentAnimationId = animationIdRef.current;

      // Force reflow
      void buttonElement.offsetHeight;

      // Set animation immediately
      requestAnimationFrame(() => {
        // Only set if this is still the latest animation
        if (currentAnimationId === animationIdRef.current) {
          setAnimation({
            startX,
            startY,
            endX,
            endY,
          });

          // Clear animation after it completes
          timeoutRef.current = setTimeout(() => {
            if (currentAnimationId === animationIdRef.current) {
              setAnimation(null);
            }
            timeoutRef.current = null;
          }, 1300);
        }
      });
    });
  }, []);

  const FlyingCartIcon = () => {
    if (!animation || typeof window === "undefined") return null;

    const deltaX = animation.endX - animation.startX;
    const deltaY = animation.endY - animation.startY;

    return createPortal(
      <div
        className="fixed pointer-events-none z-[9999]"
        style={
          {
            left: `${animation.startX}px`,
            top: `${animation.startY}px`,
            transform: "translate(-50%, -50%)",
            animation: `flyToCart 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
            willChange: "transform, opacity",
            "--delta-x": `${deltaX}px`,
            "--delta-y": `${deltaY}px`,
          } as React.CSSProperties & {
            "--delta-x": string;
            "--delta-y": string;
          }
        }
      >
        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
          <ShoppingCart className="w-4 h-4 text-white" />
        </div>
      </div>,
      document.body
    );
  };

  return (
    <AnimationContext.Provider value={{ triggerAnimation }}>
      {children}
      <FlyingCartIcon />
    </AnimationContext.Provider>
  );
}

export function useAddToCartAnimation() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error(
      "useAddToCartAnimation must be used within AnimationProvider"
    );
  }
  return context;
}
