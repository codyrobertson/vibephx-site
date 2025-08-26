export async function GET() {
  return new Response('API is working!', {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}