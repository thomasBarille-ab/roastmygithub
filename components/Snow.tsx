"use client";

const FLAKES = [
  { left: "5%",  delay: "0s",   duration: "8s"  },
  { left: "15%", delay: "2s",   duration: "12s" },
  { left: "25%", delay: "4s",   duration: "9s"  },
  { left: "35%", delay: "1s",   duration: "11s" },
  { left: "45%", delay: "3s",   duration: "7s"  },
  { left: "55%", delay: "5s",   duration: "13s" },
  { left: "65%", delay: "0.5s", duration: "10s" },
  { left: "75%", delay: "2.5s", duration: "8s"  },
  { left: "85%", delay: "4.5s", duration: "11s" },
  { left: "92%", delay: "1.5s", duration: "9s"  },
];

export function Snow() {
  return (
    <>
      {FLAKES.map((f, i) => (
        <span
          key={i}
          className="snowflake"
          style={{
            left: f.left,
            animationDelay: f.delay,
            animationDuration: f.duration,
            opacity: 0,
          }}
        >
          ❄
        </span>
      ))}
    </>
  );
}
