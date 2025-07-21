"use client";

import { Button } from "@/components/ui/button";

export function OnScreenKeyboard({
  onKeyPress,
}: {
  onKeyPress: (key: string) => void;
}) {
  const rows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m", "@", "."],
  ];
  return (
    <div className="w-full flex flex-col items-center">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center mb-1 gap-1">
          {row.map((key) => (
            <button
              key={key}
              tabIndex={-1}
              className="w-10 h-10 rounded bg-pink-50 text-base font-semibold text-pink-700 shadow-sm active:bg-pink-200 focus:outline-none"
              onClick={() => onKeyPress(key)}
              style={{ touchAction: "manipulation" }}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <div className="flex justify-center gap-1 mt-1 w-full">
        <button
          tabIndex={-1}
          className="w-16 h-10 rounded bg-pink-100 text-base font-semibold text-pink-700"
          onClick={() => onKeyPress("backspace")}
        >
          ⌫
        </button>
        <button
          tabIndex={-1}
          className="flex-1 h-10 rounded bg-pink-100 text-base font-semibold text-pink-700 px-4"
          onClick={() => onKeyPress("space")}
        >
          Space
        </button>
        <button
          tabIndex={-1}
          className="w-16 h-10 rounded bg-pink-100 text-base font-semibold text-pink-700"
          onClick={() => onKeyPress("clear")}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
