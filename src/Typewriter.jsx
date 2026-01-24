import { useEffect, useRef, useState } from "react";

export default function Typewriter({ text, speed = 16, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const onDoneRef = useRef(onDone);

  // 保持最新的 onDone，但不触发打字重启
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    let i = 0;
    setDisplayed("");

    const interval = setInterval(() => {
      if (i >= text.length) {
        clearInterval(interval);
        if (onDoneRef.current) onDoneRef.current();
        return;
      }

      setDisplayed((prev) => prev + text.charAt(i));
      i++;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]); // 关键：这里绝对不要放 onDone

  const paragraphs = displayed.split("\n\n");

  return (
    <div style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
      {paragraphs.map((p, idx) => (
        <p key={idx} style={{ marginBottom: 16, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
          {p}
        </p>
      ))}
    </div>
  );
}
