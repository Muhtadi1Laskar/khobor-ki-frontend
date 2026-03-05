const BACKEND_URL = process.env.BACKEND_URL || 'https://khobor-ki-backend.onrender.com';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

export async function handler(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Extract category from path
        let category = '';
        const pathMatch = event.path.match(/\/(national|international|sports|technology)$/);
        if (pathMatch) {
            category = '/' + pathMatch[1];
        }
        
        // IMPORTANT: Use rawQuery to preserve multiple paper parameters
        // event.rawQuery preserves: paper=Prothom+Alo&paper=Kaler+Kantho
        // event.queryStringParameters would only keep the last one
        const queryString = event.rawQuery || '';
        
        // Build backend URL
        const backendUrl = `${BACKEND_URL}/api/feed${category}${queryString ? '?' + queryString : ''}`;
        
        console.log('Feed function called');
        console.log('Backend URL:', backendUrl);
        
        // Fetch from backend
        const response = await fetch(backendUrl, {
            headers: {
                'X-API-Key': INTERNAL_API_KEY
            }
        });
        
        console.log('Backend response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend error:', errorText);
            throw new Error(`Backend returned ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('Success! Items:', data.news?.length || 0);
        
        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Cache-Control': 'public, max-age=60'
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
}