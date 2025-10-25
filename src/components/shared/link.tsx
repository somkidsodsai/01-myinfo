"use client";

import NextLink from "next/link";
import { forwardRef } from "react";

type NextLinkProps = React.ComponentPropsWithoutRef<typeof NextLink>;

interface LinkProps extends Omit<NextLinkProps, "href"> {
  to?: NextLinkProps["href"];
  href?: NextLinkProps["href"];
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, href, ...props },
  ref,
) {
  const resolvedHref = href ?? to;

  return <NextLink ref={ref} href={resolvedHref ?? "#"} {...props} />;
});
