export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3"
          y="3"
          width="30"
          height="30"
          rx="8"
          className="fill-indigo-600"
        />

        <circle cx="12" cy="12" r="2" fill="white" />
        <circle cx="24" cy="12" r="2" fill="white" />
        <circle cx="18" cy="22" r="2" fill="white" />

        <path
          d="M12 12L18 22L24 12"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className="font-semibold text-lg tracking-tight">
        EventWorkspace
      </span>
    </div>
  )
}
