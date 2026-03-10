import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

const dataFilePath = path.join(process.cwd(), 'src/data/portfolio.json');

export async function GET() {
    try {
        const fileContents = fs.readFileSync(dataFilePath, 'utf8');
        const data = JSON.parse(fileContents);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    // Simple check for our fake session cookie
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session || session.value !== 'authenticated') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const newData = await request.json();
        fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2), 'utf8');
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
