export default function RouteMap() {
  return (
    <svg
      viewBox="0 0 400 220"
      className="w-full h-[300px] rounded-lg border border-border bg-[#1a1625]"
    >
      {/* Grid */}
      <defs>
        <pattern
          id="grid"
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.05"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="400" height="220" fill="#1a1625" />
      <rect width="400" height="220" fill="url(#grid)" />

      {/* Offices */}
      {/* BKC HQ */}
      <g transform="translate(200,100)">
        <circle r="12" fill="#8b5cf6" />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fontSize="10"
          fill="#ffffff"
          fontWeight="bold"
        >
          B
        </text>
        <text
          x="0"
          y="26"
          textAnchor="middle"
          fontSize="10"
          fill="#ffffff"
        >
          BKC HQ
        </text>
      </g>

      {/* Powai Tech Park */}
      <g transform="translate(310,50)">
        <circle r="12" fill="#8b5cf6" />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fontSize="10"
          fill="#ffffff"
          fontWeight="bold"
        >
          P
        </text>
        <text
          x="0"
          y="26"
          textAnchor="middle"
          fontSize="10"
          fill="#ffffff"
        >
          Powai Tech Park
        </text>
      </g>

      {/* Lower Parel Hub */}
      <g transform="translate(90,160)">
        <circle r="12" fill="#8b5cf6" />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fontSize="10"
          fill="#ffffff"
          fontWeight="bold"
        >
          L
        </text>
        <text
          x="0"
          y="26"
          textAnchor="middle"
          fontSize="10"
          fill="#ffffff"
        >
          Lower Parel Hub
        </text>
      </g>

      {/* Employee dots */}
      {[
        { x: 40, y: 40 },
        { x: 80, y: 70 },
        { x: 140, y: 50 },
        { x: 260, y: 40 },
        { x: 340, y: 80 },
        { x: 60, y: 130 },
        { x: 180, y: 180 },
        { x: 320, y: 150 },
      ].map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={5}
          fill="#e5e7eb"
          fillOpacity="0.9"
        />
      ))}

      {/* Curved routes from employees to offices */}
      {/* A few sample bezier curves */}
      <path
        d="M 40 40 Q 120 20 200 100"
        stroke="#8b5cf6"
        strokeOpacity="0.4"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M 80 70 Q 150 40 200 100"
        stroke="#8b5cf6"
        strokeOpacity="0.4"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M 140 50 Q 220 20 310 50"
        stroke="#8b5cf6"
        strokeOpacity="0.4"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M 260 40 Q 280 60 310 50"
        stroke="#8b5cf6"
        strokeOpacity="0.4"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M 340 80 Q 260 120 200 100"
        stroke="#8b5cf6"
        strokeOpacity="0.4"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M 60 130 Q 80 140 90 160"
        stroke="#8b5cf6"
        strokeOpacity="0.4"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M 180 180 Q 140 170 90 160"
        stroke="#8b5cf6"
        strokeOpacity="0.4"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M 320 150 Q 260 130 200 100"
        stroke="#8b5cf6"
        strokeOpacity="0.4"
        strokeWidth="2"
        fill="none"
      />

      {/* Legend */}
      <g transform="translate(20,190)">
        <circle cx="0" cy="0" r="6" fill="#8b5cf6" />
        <text x="12" y="3" fontSize="10" fill="#e5e7eb">
          Office
        </text>

        <circle cx="70" cy="0" r="4" fill="#e5e7eb" />
        <text x="82" y="3" fontSize="10" fill="#e5e7eb">
          Employee
        </text>
      </g>
    </svg>
  );
}

