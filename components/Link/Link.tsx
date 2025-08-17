// components/ActiveLink.js
import NextLink from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx"; // optional helper for className merging

interface ActiveLinkProps {
    href: string;
    children: React.ReactNode;
    activeClassName?: string;
    className?: string;
    [key: string]: unknown;
}

export default function Link({ href, children, activeClassName, ...props }: ActiveLinkProps) {
    const { pathname } = useRouter();
    const isActive = pathname === href;

    return (
        <NextLink
            href={href}
            className={clsx(props.className, isActive && activeClassName)}
        >
            {children}
        </NextLink>
    );
}