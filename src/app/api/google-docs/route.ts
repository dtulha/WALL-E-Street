import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SCOPES = ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive.file'];

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/api/auth/callback/google'  // Updated port to 3000
);

export async function POST(req: Request) {
  try {
    const { query, responses } = await req.json();
    const cookieStore = cookies();
    
    const accessToken = cookieStore.get('google_access_token')?.value;
    const refreshToken = cookieStore.get('google_refresh_token')?.value;

    // If no tokens, redirect to auth
    if (!accessToken) {
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'  // Force consent screen to get refresh token
      });

      return NextResponse.json({ 
        needsAuth: true,
        authUrl 
      });
    }

    // Set credentials from cookies
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const docs = google.docs({ version: 'v1', auth: oauth2Client });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Create a new document
    const createResponse = await docs.documents.create({
      requestBody: {
        title: `Research Results - ${new Date().toLocaleDateString()}`,
      },
    });

    const documentId = createResponse.data.documentId;

    if (!documentId) {
      throw new Error('Failed to create document');
    }

    // Prepare the content
    const requests = [];
    let currentIndex = 1;

    // Add title and metadata
    requests.push({
      insertText: {
        location: { index: currentIndex },
        text: `Research Query: ${query}\n\nGenerated on: ${new Date().toLocaleString()}\n\n`,
      },
    });
    currentIndex += query.length + new Date().toLocaleString().length + 30;

    // Add each analyst's response
    responses.forEach((response: any) => {
      const analystName = `\n${response.analyst?.name}\n`;
      requests.push(
        {
          insertText: {
            location: { index: currentIndex },
            text: analystName,
          },
        },
        {
          updateParagraphStyle: {
            range: {
              startIndex: currentIndex,
              endIndex: currentIndex + analystName.length,
            },
            paragraphStyle: {
              namedStyleType: 'HEADING_2',
            },
            fields: 'namedStyleType',
          },
        }
      );
      currentIndex += analystName.length;

      const content = `${response.content}\n\n`;
      requests.push({
        insertText: {
          location: { index: currentIndex },
          text: content,
        },
      });
      currentIndex += content.length;

      if (response.chainOfThought) {
        const keyPoints = 'Key Points:\n' + response.chainOfThought.map((point: string) => `• ${point}\n`).join('') + '\n';
        requests.push({
          insertText: {
            location: { index: currentIndex },
            text: keyPoints,
          },
        });
        currentIndex += keyPoints.length;
      }
    });

    // Update the document content
    await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests,
      },
    });

    return NextResponse.json({
      success: true,
      documentId,
      url: `https://docs.google.com/document/d/${documentId}/edit`,
    });
  } catch (error: any) {
    console.error('Error creating Google Doc:', error);
    
    // If token is invalid, redirect to auth
    if (error.message?.includes('invalid_grant') || error.message?.includes('No access')) {
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
      });
      
      return NextResponse.json({ 
        needsAuth: true,
        authUrl 
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to create Google Doc' },
      { status: 500 }
    );
  }
} 