import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Set headers
    const headers = new Headers({
      'Content-Type': 'image/png',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    });
    const title = searchParams.get('title') || 'CozyConnect';
    const description = searchParams.get('description') || 'Share your stories and connect with others';

    return new Response(
      new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            padding: '2rem',
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 600,
              color: '#000000',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 32,
              color: '#666666',
              textAlign: 'center',
            }}
          >
            {description}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    ), {
      headers
    });
  } catch (e) {
    console.error(e.message);
    return new Response('Failed to generate image', {
      status: 500,
    });
  }
}
