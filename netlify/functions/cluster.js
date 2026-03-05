const BACKEND_URL = process.env.BACKEND_URL || 'https://khobor-ki-backend.onrender.com';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

export async function handler(event, context) {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Get query parameters
        const queryString = event.rawQuery || '';

        // Build backend URL
        const backendUrl = `${BACKEND_URL}/api/cluster${queryString ? '?' + queryString : ''}`;

        console.log('Proxying cluster request to:', backendUrl);

        // Fetch from backend
        const response = await fetch(backendUrl, {
            headers: {
                'X-API-Key': INTERNAL_API_KEY  // <-- Add this
            }
        });

        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Cache-Control': 'public, max-age=60' // Cache for 1 minute
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Cluster function error:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to fetch clusters',
                message: error.message
            })
        };
    }
}