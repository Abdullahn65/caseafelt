"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/collections", label: "All Collections" },
  { href: "/products", label: "All Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/support", label: "Support" },
];

/**
 * MobileMenu — slide-in overlay for small screens.
 * Includes a toggle button (hamburger icon) and the nav panel.
 */
export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on route change or Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex md:hidden items-center justify-center h-11 w-11 rounded-md hover:bg-bg-tertiary transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-5 w-5 text-fg-primary" />
        ) : (
          <Menu className="h-5 w-5 text-fg-primary" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-bg-primary shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between p-4 border-b border-border-default">
          <span className="text-lg font-semibold tracking-tight">
            CaseaFelt
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-bg-tertiary transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-fg-primary" />
          </button>
        </div>

        <nav className="p-4 space-y-1" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-md text-base font-medium text-fg-secondary hover:text-fg-primary hover:bg-bg-secondary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
