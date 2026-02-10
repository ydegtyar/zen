import Link from 'next/link';

export function SiteNav() {
  return (
    <div className="nav">
      <Link href="/" className="pill" aria-label="Home">
        Zen 101
      </Link>
      <div className="navLinks">
        <Link className="pill" href="/privacy">
          Privacy
        </Link>
        <Link className="pill" href="/terms">
          TOS
        </Link>
        <Link className="pill" href="/support">
          Support
        </Link>
      </div>
    </div>
  );
}
