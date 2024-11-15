// app/api/submitSurvey/route.ts
import { NextResponse } from 'next/server';
import { handleSurveySubmission } from '@/lib/serverActions';

export async function POST(request: Request) {
  try {
    // Parse JSON body
    const data = await request.json();

    const workspaceId = await handleSurveySubmission(data);

    // Construct the redirect URL based on the workspaceId
    const redirectUrl = `/${workspaceId}/chat`;

    return NextResponse.json({ redirectUrl });
  } catch (error) {
    console.error("Error in POST /api/submitSurvey:", error);
    return NextResponse.error();
  }
}
