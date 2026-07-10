import { SOCIAL } from "@/lib/links";

// Instagram + Messenger links with inline icons. Used in the footer and
// on the Join page. External links open in a new tab.
export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-5 ${className}`}>
      <a
        href={SOCIAL.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 hover:text-paper transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
        Instagram
      </a>
      <a
        href={SOCIAL.messenger}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 hover:text-paper transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.99-.88c.17-.07.35-.09.53-.04.91.25 1.88.39 2.89.39 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm6.02 7.46l-2.93 4.65c-.47.74-1.47.93-2.18.41l-2.33-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.93-4.65c.47-.74 1.47-.93 2.18-.41l2.33 1.75c.21.16.5.16.72 0l3.15-2.4c.42-.32.98.18.7.63z" />
        </svg>
        Messenger
      </a>
    </div>
  );
}
