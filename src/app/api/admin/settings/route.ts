import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { 
  getPublishedSettings, 
  getDraftSettings, 
  saveDraftSettings, 
  publishSettings, 
  getSettingsVersions, 
  restoreSettingsVersion 
} from '@/lib/store-db';

export async function GET(req: NextRequest) {
  const auth = verifyAdminRequest(req);
  if (!auth.isAuthorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const published = getPublishedSettings();
  const draft = getDraftSettings();
  const versions = getSettingsVersions();

  return NextResponse.json({
    published,
    draft,
    versions,
  });
}

export async function POST(req: NextRequest) {
  const auth = verifyAdminRequest(req);
  if (!auth.isAuthorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, settings, note, versionId } = body;

    if (action === 'save_draft') {
      if (!settings) {
        return NextResponse.json({ error: 'Settings object is required.' }, { status: 400 });
      }
      saveDraftSettings(settings, auth.adminEmail);
      return NextResponse.json({ success: true, message: 'Draft saved successfully.' });
    }

    if (action === 'publish') {
      const res = publishSettings(auth.adminEmail, note || 'Published from admin control center');
      return NextResponse.json({ success: true, version: res.version, message: 'Published to live site.' });
    }

    if (action === 'restore') {
      if (!versionId) {
        return NextResponse.json({ error: 'versionId is required.' }, { status: 400 });
      }
      const res = restoreSettingsVersion(versionId, auth.adminEmail);
      if (!res.success) {
        return NextResponse.json({ error: 'Version not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Settings restored and published successfully.' });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
