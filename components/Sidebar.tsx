"use client";

import Link from "next/link";
import Image from "next/image";
import { navItems } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  fullName: string;
  avatar: string;
  email: string;
}

const Sidebar = ({ fullName, avatar, email }: Props) => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <Link href="/" className="block">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="Shad Logo Full"
          width={160}
          height={50}
          className="hidden h-auto lg:block"
          priority
        />

        <Image
          src="/assets/icons/logo-brand.svg"
          alt="Shad Logo"
          width={52}
          height={52}
          className="lg:hidden"
          priority
        />
      </Link>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }) => {
            const isActive = pathname === url;

            return (
              <li key={name} className="lg:w-full">
                <Link
                  href={url}
                  className={cn("sidebar-nav-item", isActive && "shad-active")}
                >
                  <Image
                    src={icon}
                    alt={`${name} icon`}
                    width={24}
                    height={24}
                    className={cn("nav-icon", isActive && "nav-icon-active")}
                  />
                  <p className="hidden lg:block">{name}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Illustration */}
      <Image
        src="/assets/images/files-2.png"
        alt="Sidebar illustration"
        width={506}
        height={418}
        className="w-full"
        sizes="(max-width: 768px) 100vw, 400px"
      />

      {/* User Info */}
      <div className="sidebar-user-info">
        <Image
          src={avatar}
          alt={`${fullName} avatar`}
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />
        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
