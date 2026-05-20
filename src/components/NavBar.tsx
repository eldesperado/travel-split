export function NavBar() {
  return (
    <div className="nav-bar">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-forest rounded-[6px] flex items-center justify-center flex-shrink-0">
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 12l9-9 9 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 21V9h6v12" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="font-display text-[17px] font-bold text-ink-primary tracking-tight">Travel Split</span>
      </div>

    </div>
  );
}
