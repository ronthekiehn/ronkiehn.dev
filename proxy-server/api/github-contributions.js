const GITHUB_REST_ENDPOINT = 'https://api.github.com';

const GITHUB_USERNAME = 'ronthekiehn';
const GITHUB_PAT = process.env.GITHUB_PAT;

const getGithubContributions = async () => {
    if (!GITHUB_PAT) {
        throw new Error('GitHub Personal Access Token (GITHUB_PAT) is not set in environment variables.');
    }

    // Get all repos for the user
    const reposResponse = await fetch(`${GITHUB_REST_ENDPOINT}/user/repos?affiliation=owner`, {
        headers: {
            'Authorization': `token ${GITHUB_PAT}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (!reposResponse.ok) {
        throw new Error(`Failed to fetch repos: ${reposResponse.statusText}`);
    }

    const repos = await reposResponse.json();
    const currentYear = new Date().getFullYear();
    let totalCommits = 0;
    const repoStats = [];

    // Get statistics for each non-fork repository
    for (const repo of repos) {
        if (repo.fork) continue;

        // Get commit statistics
        const statsResponse = await fetch(`${GITHUB_REST_ENDPOINT}/repos/${GITHUB_USERNAME}/${repo.name}/stats/participation`, {
            headers: {
                'Authorization': `token ${GITHUB_PAT}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!statsResponse.ok) {
            console.warn(`Failed to fetch stats for repo ${repo.name}: ${statsResponse.statusText}`);
            continue;
        }

        const stats = await statsResponse.json();
        // Calculate weeks since Jan 1st of current year
        const now = new Date();
        const startOfYear = new Date(currentYear, 0, 1); // Jan 1st of current year
        const weeksSinceStart = Math.floor((now - startOfYear) / (7 * 24 * 60 * 60 * 1000));
        const yearlyCommits = stats.owner.slice(-weeksSinceStart).reduce((sum, week) => sum + week, 0);
        
        if (yearlyCommits > 0) {
            repoStats.push({
                name: repo.name,
                commits: yearlyCommits,
                url: repo.html_url,
                description: repo.description,
                language: repo.language,
                stars: repo.stargazers_count
            });
            
            totalCommits += yearlyCommits;
        }
    }

    // Sort repositories by commit count (descending)
    repoStats.sort((a, b) => b.commits - a.commits);

    return {
        year: currentYear,
        totalCommits,
        repositories: repoStats
    };
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