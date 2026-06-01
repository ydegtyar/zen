'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/app', label: 'Preview' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'TOS' },
  { href: '/support', label: 'Support' },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <div className="nav">
      <Link href="/" className="brand" aria-label="Zen 101 home">
        <span className="brandMark" aria-hidden="true">
          101
        </span>
        <span>Zen</span>
      </Link>
      <div className="navLinks">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              className={`pill menuPill${isActive ? ' menuPillActive' : ''}`}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
