'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import ScrollProgress from './ScrollProgress';

export default function SiteChrome() {
    const pathname = usePathname();

    if (pathname.startsWith('/admin') || pathname === '/login') {
        return null;
    }

    return (
        <>
            <ScrollProgress />
            <Navbar />
        </>
    );
}
