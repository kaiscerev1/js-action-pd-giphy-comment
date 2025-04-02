const core = require('@actions/core');
const github = require('@actions/github');
const Gyphy = require('giphy-api');
const { Octokit } = require('@octokit/rest');

async function run() {
    try { 
        // Get the inputs from the action
        const githubToken = core.getInput('github-token');
        const giphyApiKey = core.getInput('giphy-api-key');

        // create a new instance of the Octokit class
        const octokit = new Octokit({ auth: githubToken });
        const giphy = Gyphy(giphyApiKey );

        // Get the context of the action
        const context = github.context;
        const { owner, repon, number } = context.issue;
        const prComment = await giphy.random({'thank-you': true});

        // Create a comment on the PR
        await octokit.pulls.createReviewComment({
            owner,
            repo,
            issue_number: number,
            body: `### PR - ${number} \n ### Thank you for your contribution! \n ![Giphy](${prComment.data.images.downsized.url})`
        });

        core.setOutput('comment-url', '${prComment.data.images.downsized.url}');
        console.log(`Gipgy GIF comment add successfully #${number} with Giphy: ${prComment.data.images.downsized.url}`);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
 run();