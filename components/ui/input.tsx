import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = React.useState(false);
    const [isKeyboardActive, setIsKeyboardActive] = React.useState(false);

    // Handle touch events to maintain focus
    const handleTouchStart = (e: React.TouchEvent) => {
      // Prevent default to avoid blur issues on touch devices
      e.preventDefault();
      if (inputRef.current) {
        inputRef.current.focus();
        setIsFocused(true);
      }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      // Ensure focus is maintained after touch
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          setIsFocused(true);
        }
      }, 10);
    };

    // Enhanced focus handling for touch devices
    const handleFocus = (e: React.FocusEvent) => {
      setIsFocused(true);
      setIsKeyboardActive(false);
      // Add a class to indicate active state
      e.target.classList.add('touch-active');
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent) => {
      // Check if the blur is caused by clicking on keyboard
      const target = e.relatedTarget as HTMLElement;
      const isKeyboardButton = target?.closest('.on-screen-keyboard') || 
                              target?.classList.contains('keyboard-button');
      
      if (isKeyboardButton) {
        // Don't remove focus state, just mark keyboard as active
        setIsKeyboardActive(true);
        // Immediately refocus the input
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            setIsFocused(true);
          }
        }, 5);
      } else {
        // Only remove focus if clicking outside keyboard
        setIsFocused(false);
        setIsKeyboardActive(false);
        // Remove active class but delay to allow for touch events
        setTimeout(() => {
          e.target.classList.remove('touch-active');
        }, 100);
      }
      props.onBlur?.(e);
    };

    // Listen for clicks on keyboard buttons to maintain focus
    React.useEffect(() => {
      const handleKeyboardClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isKeyboardButton = target?.closest('.on-screen-keyboard') || 
                                target?.classList.contains('keyboard-button');
        
        if (isKeyboardButton && inputRef.current) {
          // Mark keyboard as active and maintain focus
          setIsKeyboardActive(true);
          setIsFocused(true);
          
          // Ensure input stays focused
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
              setIsFocused(true);
            }
          }, 10);
        }
      };

      const handleDocumentClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isKeyboardButton = target?.closest('.on-screen-keyboard') || 
                                target?.classList.contains('keyboard-button');
        
        // If clicking outside keyboard and input, remove focus
        if (!isKeyboardButton && inputRef.current && !inputRef.current.contains(target)) {
          setIsFocused(false);
          setIsKeyboardActive(false);
        }
      };

      document.addEventListener('click', handleKeyboardClick);
      document.addEventListener('click', handleDocumentClick);
      
      return () => {
        document.removeEventListener('click', handleKeyboardClick);
        document.removeEventListener('click', handleDocumentClick);
      };
    }, []);

    // Determine if we should show the focus ring
    const shouldShowFocusRing = isFocused || isKeyboardActive;

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm touch-active:ring-2 touch-active:ring-ring touch-active:ring-offset-2",
          shouldShowFocusRing && "ring-2 ring-ring ring-offset-2",
          className
        )}
        ref={(node) => {
          // Handle both refs
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          inputRef.current = node;
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
