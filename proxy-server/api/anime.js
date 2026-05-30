const MAL_USERNAME = process.env.MAL_USERNAME || "ronthekiehn";
const ANIME_LIST_ENDPOINT = `https://api.myanimelist.net/v2/users/${MAL_USERNAME}/animelist?status=completed&sort=list_updated_at&limit=8&fields=list_status,num_episodes,main_picture,mean`;

const client_id = process.env.MAL_CLIENT_ID;

const getRecentAnime = async () => {
    if (!client_id) {
        throw new Error("Missing MAL_CLIENT_ID environment variable");
    }

    const response = await fetch(ANIME_LIST_ENDPOINT, {
        headers: {
            "X-MAL-CLIENT-ID": client_id,
        },
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch anime list: ${response.status} ${response.statusText} - ${errorText}`);
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
            imageUrl: item.node.main_picture?.large || item.node.main_picture?.medium,
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
