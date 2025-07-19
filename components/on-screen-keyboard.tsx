"use client";

import { Button } from "@/components/ui/button";
import { SkipBackIcon as Backspace } from "lucide-react";

interface OnScreenKeyboardProps {
  onKeyPress: (key: string) => void;
}

export function OnScreenKeyboard({ onKeyPress }: OnScreenKeyboardProps) {
  const rows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m", "@", "."],
  ];

  // Enhanced key press handler that maintains focus without preventDefault
  const handleKeyPress = (
    key: string,
    e: React.MouseEvent | React.TouchEvent
  ) => {
    // Stop propagation to prevent focus loss
    e.stopPropagation();

    // Call the original onKeyPress
    onKeyPress(key);

    // Ensure the active input maintains focus
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (activeElement && activeElement.tagName === "INPUT") {
        (activeElement as HTMLInputElement).focus();
      }
    }, 10);
  };

  return (
    <div className="flex flex-col gap-1 on-screen-keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 justify-center">
          {row.map((key) => (
            <Button
              key={key}
              variant="outline"
              className="h-10 w-10 p-0 text-center border-pink-100 touch-manipulation keyboard-button"
              onClick={(e) => handleKeyPress(key, e)}
            >
              {key}
            </Button>
          ))}
        </div>
      ))}
      <div className="flex gap-1 justify-center mt-1">
        <Button
          variant="outline"
          className="h-10 px-3 border-pink-100 touch-manipulation keyboard-button"
          onClick={(e) => handleKeyPress("backspace", e)}
        >
          <Backspace className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-10 flex-1 border-pink-100 touch-manipulation keyboard-button"
          onClick={(e) => handleKeyPress("space", e)}
        >
          Space
        </Button>
        <Button
          variant="outline"
          className="h-10 px-3 border-pink-100 touch-manipulation keyboard-button"
          onClick={(e) => handleKeyPress("clear", e)}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
