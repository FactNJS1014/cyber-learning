import { NextRequest, NextResponse } from 'next/server';
import { getCertificateByNo } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ certificateNo: string }> }
) {
  try {
    const { certificateNo } = await params;

    if (!certificateNo) {
      return NextResponse.json({ error: 'Certificate number is required' }, { status: 400 });
    }

    const cert = await getCertificateByNo(certificateNo.trim());
    if (!cert) {
      return NextResponse.json(
        {
          valid: false,
          error: 'CERTIFICATE_NOT_FOUND',
          message: 'The requested Certificate Number could not be found in the registry.',
        },
        { status: 404 }
      );
    }

    // Public verification details without disclosing sensitive personal data
    return NextResponse.json({
      valid: true,
      certificateNo: cert.certificateNo,
      studentName: cert.userName || cert.user?.name || 'Verified Graduate',
      programName: cert.programName,
      level: cert.level,
      issuedDate: cert.issuedAt,
      verificationCode: cert.verificationCode,
      status: 'VERIFIED_AND_AUTHENTIC',
    });
  } catch (err: any) {
    console.error('Certificate verification error:', err);
    return NextResponse.json({ error: 'Verification service error' }, { status: 500 });
  }
}
