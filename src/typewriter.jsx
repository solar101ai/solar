import { useEffect, useState } from "react";

export default function Typewriter({ text, speed = 16 }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayed("");

    const interval = setInterval(() => {
      if (i >= text.length) {
        clearInterval(interval);
        return;
      }

      const ch = text.charAt(i); // 永远不会是 undefined
      setDisplayed((prev) => prev + ch);
      i++;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  const paragraphs = displayed.split("\n\n");

  return (
    <div>
      {paragraphs.map((p, idx) => (
        <p
          key={idx}
          style={{
            marginBottom: "16px",
            whiteSpace: "pre-wrap",
            lineHeight: "1.7",
          }}
        >
          {p}
        </p>
      ))}
    </div>
  );
}
