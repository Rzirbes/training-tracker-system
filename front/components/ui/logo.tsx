"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { PublicImages } from "@/enums";
import { Skeleton } from "./skeleton";

interface Props {
  width?: number;
  height?: number;
  href?: string;
  src?: string;
  alt?: string;
}

export function Logo({
  width = 180,
  height = 64,
  href = "/",
  src = "",
  alt = "Logo",
}: Props) {
  const { systemTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const logo = useMemo(() => {
    if (src) return src;

    const currentTheme = theme === "system" ? systemTheme : theme;
    const isDark = currentTheme === "dark";

    return isDark ? PublicImages.LOGO_WHITE : PublicImages.LOGO_DARK;
  }, [systemTheme, theme, src]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Skeleton
        isLoaded={mounted}
        style={{
          width,
          height,
        }}
      />
    );
  }

  return (
    <Skeleton
      isLoaded={mounted}
      style={{
        width,
        height,
      }}
    >
      <Link href={href}>
        <img
          src={logo}
          alt={alt}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            objectFit: "contain",
            display: "block",
          }}
        />
      </Link>
    </Skeleton>
  );
}
