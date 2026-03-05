const BACKEND_URL = process.env.BACKEND_URL || 'https://khobor-ki-backend.onrender.com';

exports.handler = async (event, context) => {
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
        // Get the path (e.g., /api/feed/national)
        const path = event.path.replace('/.netlify/functions/feed', '');

        // Get query parameters
        const queryString = event.rawQuery || '';

        // Build backend URL
        const backendUrl = `${BACKEND_URL}/api/feed${path}${queryString ? '?' + queryString : ''}`;

        console.log('Proxying request to:', backendUrl);

        // Fetch from backend
        const response = await fetch(backendUrl);

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
        console.error('Feed function error:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to fetch data',
                message: error.message
            })
        };
    }
};