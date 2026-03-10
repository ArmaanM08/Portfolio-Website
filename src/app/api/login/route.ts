import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // Use a simple hardcoded password for MVP
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'armaan123';

        if (password === ADMIN_PASSWORD) {
            const response = NextResponse.json({ success: true });

            // Set an HttpOnly cookie to simulate simple session auth
            response.cookies.set('admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 // 1 day
            });

            return response;
        }

        return NextResponse.json(
            { success: false, message: 'Invalid password' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Bad request' },
            { status: 400 }
        );
    }
}
