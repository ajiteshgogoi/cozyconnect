import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'CozyConnect';
    const description = searchParams.get('description') || 'Share your stories and connect with others';

    return new ImageResponse(
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
              background: 'linear-gradient(to right, #f97316, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem',
              textAlign: 'center',
              lineHeight: '1.2',
              filter: 'drop-shadow(0 2px 4px rgba(255,192,203,0.3))'
            }}
          >
            <span style={{ marginRight: '12px' }}>❤️</span>
            {title}
          </div>
          <div
            style={{
              fontSize: 32,
              color: '#fff',
              textAlign: 'center',
              backgroundColor: 'rgba(124, 45, 18, 0.9)',
              borderRadius: '8px',
              padding: '8px 32px',
              marginTop: '8px'
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
    );
  } catch (e: any) {
    console.error(e.message);
    return new Response('Failed to generate image', {
      status: 500,
    });
  }
}
