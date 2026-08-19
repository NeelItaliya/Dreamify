const baseProps = {
  fill: "none",
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
};

export function BrandMark({ className = "" }) {
  return (
    <svg
      className={className}
      width="38"
      height="38"
      viewBox="0 0 38 38"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="19" cy="19" r="18.5" fill="currentColor" fillOpacity="0.08" />
      <path
        d="M24.7 10.9a10.3 10.3 0 1 0 2.4 16.2 9.1 9.1 0 0 1-2.4-16.2Z"
        fill="currentColor"
      />
      <path
        d="m27.4 10 .45 1.12 1.13.45-1.13.45-.45 1.13-.45-1.13-1.12-.45 1.12-.45.45-1.12Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SettingsIcon({ className = "" }) {
  return (
    <svg className={className} width="18" height="18" {...baseProps} aria-hidden="true">
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 5v4M8 15v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "" }) {
  return (
    <svg className={className} width="18" height="18" {...baseProps} aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = "" }) {
  return (
    <svg className={className} width="18" height="18" {...baseProps} aria-hidden="true">
      <path d="M19 12H5M10 7l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CloseIcon({ className = "" }) {
  return (
    <svg className={className} width="18" height="18" {...baseProps} aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function MoonIcon({ className = "" }) {
  return (
    <svg className={className} width="18" height="18" {...baseProps} aria-hidden="true">
      <path d="M18.6 15.7A7.8 7.8 0 0 1 8.3 5.4a8 8 0 1 0 10.3 10.3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function ShieldIcon({ className = "" }) {
  return (
    <svg className={className} width="18" height="18" {...baseProps} aria-hidden="true">
      <path d="M12 21s7-3.4 7-9.1V5.8L12 3 5 5.8v6.1C5 17.6 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m9.2 12 1.8 1.8 3.9-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SparklesIcon({ className = "" }) {
  return (
    <svg className={className} width="18" height="18" {...baseProps} aria-hidden="true">
      <path d="M12 3c.4 3.3 2.1 5 5.4 5.4C14.1 8.8 12.4 10.5 12 14c-.4-3.5-2.1-5.2-5.4-5.6C9.9 8 11.6 6.3 12 3ZM18.2 14.8c.2 1.7 1.1 2.6 2.8 2.8-1.7.2-2.6 1.1-2.8 2.8-.2-1.7-1.1-2.6-2.8-2.8 1.7-.2 2.6-1.1 2.8-2.8Z" fill="currentColor" />
    </svg>
  );
}

export function VolumeOffIcon({ className = "" }) {
  return (
    <svg className={className} width="20" height="20" {...baseProps} aria-hidden="true">
      <path d="M11 5 7.4 8H4v8h3.4L11 19V5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m15 10 5 5M20 10l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ClockIcon({ className = "" }) {
  return (
    <svg className={className} width="20" height="20" {...baseProps} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrashIcon({ className = "" }) {
  return (
    <svg className={className} width="20" height="20" {...baseProps} aria-hidden="true">
      <path d="M5 7h14M9 7V4.5h6V7M7 7l.8 13h8.4L17 7M10 11v5M14 11v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InfoIcon({ className = "" }) {
  return (
    <svg className={className} width="20" height="20" {...baseProps} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
