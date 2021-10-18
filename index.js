const core = require("@actions/core");
const github = require("@actions/github");

const DEFAULT_SETTINGS = {
    branchFork: "main",
    branchUpstream: "main",
    isDraft: false,
    description: "",
    title: null
};

const SETTINGS = {...DEFAULT_SETTINGS, ...JSON.parse(process.env.AUTO_PR_SETTINGS || "{}")};
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const [FORKED_REPO_OWNER, FORKED_REPO_NAME] = process.env.GITHUB_REPOSITORY.split("/");

const createBody = () => `
${SETTINGS.description}

Auto generated PR by [auto-fork-pr](https://github.com/UKnowWhoIm/auto-pr-fork) on ${new Date().toString()}
`;

const defaultTitle = () => `Catch up with ${FORKED_REPO_OWNER}/${FORKED_REPO_NAME}`

async function run () {
    const octokit = github.getOctokit(GITHUB_TOKEN);
    try {
        const fokedRepoDetails = (await octokit.rest.repos.get({
            owner: FORKED_REPO_OWNER,
            repo: FORKED_REPO_NAME
        })).data;
        if (!fokedRepoDetails.fork) {
            throw Error("Repository must be a fork");
        }
        const upstreamReposDetails = fokedRepoDetails.source;
        await octokit.rest.pulls.create({
            owner: upstreamReposDetails.owner.login,
            repo: upstreamReposDetails.name,
            head: `${FORKED_REPO_OWNER}:${SETTINGS.branchFork}`,
            base: SETTINGS.branchUpstream,
            title: SETTINGS.title || defaultTitle(),
            body: createBody(),
            draft: SETTINGS.isDraft
        });
        return "Pull request created successfully";

    } catch (err) {
        if (err.status === 404) {
            throw Error("Repository not found, user may not have access to the repo");
        } else if (err.status === 422) {
            pattern = /Validation .+?: ({.+})/
            const regexResult = err.message.match(pattern);
            if (!regexResult) {
                throw Error(err.message);
            }
            return JSON.parse(regexResult[1]).message;
        }
        throw err;
    }   
}

run()
.then(r => {console.log(r)})
.catch(err => {core.setFailed(err)});
