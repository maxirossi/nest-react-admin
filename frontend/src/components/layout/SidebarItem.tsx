import { ReactNode } from 'react';
import { ChevronRight } from 'react-feather';
import { Link } from 'react-router-dom';

interface SidebarItemProps {
  children: ReactNode;
  to: string;
  active?: boolean;
}

export default function SidebarItem({
  children,
  to,
  active = false,
}: SidebarItemProps) {
  return (
    <Link
      to={to}
      className={`sidebar-item no-underline ${active ? 'active' : ''}`}
    >
      <span className="flex gap-5 font-semibold">
        {children} {active ? <ChevronRight /> : null}
      </span>
    </Link>
  );
}
