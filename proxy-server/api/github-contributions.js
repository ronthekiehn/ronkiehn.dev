const GITHUB_REST_ENDPOINT = 'https://api.github.com';

const GITHUB_USERNAME = 'ronthekiehn';
const GITHUB_PAT = process.env.GITHUB_PAT;

const getGithubContributions = async () => {
    if (!GITHUB_PAT) {
        throw new Error('GitHub Personal Access Token (GITHUB_PAT) is not set in environment variables.');
    }

    // Get all repos for the user
    const reposResponse = await fetch(`${GITHUB_REST_ENDPOINT}/users/${GITHUB_USERNAME}/repos`, {
        headers: {
            'Authorization': `token ${GITHUB_PAT}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (!reposResponse.ok) {
        throw new Error(`Failed to fetch repos: ${reposResponse.statusText}`);
    }

    const repos = await reposResponse.json();

    // Get commits for each repo grouped by year
    const commitsByYear = {};

    for (const repo of repos) {
        // Skip forks
        if (repo.fork) continue;

        const commitsResponse = await fetch(`${GITHUB_REST_ENDPOINT}/repos/${GITHUB_USERNAME}/${repo.name}/commits?author=${GITHUB_USERNAME}&per_page=100`, {
            headers: {
                'Authorization': `token ${GITHUB_PAT}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!commitsResponse.ok) {
            console.warn(`Failed to fetch commits for repo ${repo.name}: ${commitsResponse.statusText}`);
            continue;
        }

        const commits = await commitsResponse.json();

        // Group commits by year
        for (const commit of commits) {
            const year = new Date(commit.commit.author.date).getFullYear();
            commitsByYear[year] = (commitsByYear[year] || 0) + 1;
        }
    }

    // Convert to array format
    const contributionsByYear = Object.entries(commitsByYear).map(([year, totalContributions]) => ({
        year: parseInt(year),
        totalContributions
    }));

    // Sort by year descending
    return contributionsByYear.sort((a, b) => b.year - a.year);
};

export default async function handler(req, res) {
    try {
        const contributions = await getGithubContributions();
        res.status(200).json(contributions);
    } catch (error) {
        console.error("Error in GitHub contributions handler:", error.message, error.stack);
        res.status(500).json({ error: 'Failed to fetch GitHub contribution data', details: error.message });
    }
}