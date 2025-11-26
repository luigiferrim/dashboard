"use client";
import { useEffect } from "react";

export default function RemoveV0Badge() {
  useEffect(() => {
    const removeBadge = () => {
      const badge = document.querySelector('[id^="v0-built-with-button"]');
      if (badge) badge.remove();
    };

    removeBadge();
    const observer = new MutationObserver(removeBadge);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
