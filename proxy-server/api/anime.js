const TOKEN_ENDPOINT = `https://myanimelist.net/v1/oauth2/token`;
const ANIME_LIST_ENDPOINT = `https://api.myanimelist.net/v2/users/@me/animelist?status=completed&sort=list_updated_at&limit=8&fields=list_status,num_episodes,main_picture,mean`;

const client_id = process.env.MAL_CLIENT_ID;
const client_secret = process.env.MAL_CLIENT_SECRET;
const refresh_token = process.env.MAL_REFRESH_TOKEN;

const getAccessToken = async () => {
    try {
        const params = new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token,
            client_id,
            client_secret,
        });

        const response = await fetch(TOKEN_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
        });

        if (!response.ok) {
            throw new Error(`Failed to get access token: ${response.statusText}`);
        }
        
        return response.json();
    } catch (error) {
        console.error("Error in getAccessToken:", error);
        throw error;
    }
};

const getRecentAnime = async () => {
    const { access_token } = await getAccessToken();
    const response = await fetch(ANIME_LIST_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    
    if (!response.ok) {
        throw new Error(`Failed to fetch anime list: ${response.statusText}`);
    }
    
    return response.json();
};

export default async function handler(req, res) {
    try {
        const animeData = await getRecentAnime();

        if (!animeData || !animeData.data || animeData.data.length === 0) {
            res.status(204).send();
            return;
        }

        const recentAnime = animeData.data.map(item => ({
            imageUrl: item.node.main_picture.large,
            title: item.node.title,
            rating: item.list_status.score,
            updatedAt: item.list_status.updated_at
        }));

        res.status(200).json(recentAnime);
    } catch (error) {
        console.error("Error in handler:", error);
        res.status(500).json({ error: 'Failed to fetch recent anime data' });
    }
} 