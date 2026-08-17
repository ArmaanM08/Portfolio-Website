import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

const resumePath = path.join(process.cwd(), 'public', 'resume.pdf');
const dataFilePath = path.join(process.cwd(), 'src/data/portfolio.json');

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session || session.value !== 'authenticated') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const form = await request.formData();
        const file = form.get('file');

        if (!(file instanceof File) || file.size === 0) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!file.name.toLowerCase().endsWith('.pdf')) {
            return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(resumePath, buffer);

        const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
        data.resume = { ...(data.resume ?? {}), file: '/resume.pdf' };
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');

        return NextResponse.json({ success: true, file: '/resume.pdf' });
    } catch (error) {
        const err = error as { code?: string };
        if (err.code === 'EROFS' || err.code === 'EPERM' || err.code === 'EACCES') {
            return NextResponse.json({ error: "Read-only filesystem (deployed on Vercel). Upload from your local machine, then commit and push — the resume deploys with the site." }, { status: 500 });
        }
        return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500 });
    }
}