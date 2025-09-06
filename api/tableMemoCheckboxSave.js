import { Octokit } from "@octokit/core";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const repoOwner = "jungjc1117";
const repoName = "test";
const filePath = "tableExample.json";
const branch = "main";

const octokit = new Octokit({ auth: GITHUB_TOKEN });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { checkbox, memo } = req.body;
  const contentObj = { checkbox, memo };
  const content = Buffer.from(JSON.stringify(contentObj, null, 2)).toString("base64");

  try {
    let sha = null;
    try {
      const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: repoOwner,
        repo: repoName,
        path: filePath,
      });
      sha = data.sha;
    } catch (error) {
      if (error.status !== 404) throw error;
    }

    const body = {
      message: "Update memo from Vercel function",
      content,
      branch,
      ...(sha && { sha }),
    };

    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner: repoOwner,
      repo: repoName,
      path: filePath,
      ...body,
    });

    return res.status(200).json({ success: true, message: "Saved successfully" });
  } catch (error) {
    console.error("GitHub API 호출 실패:", error);
    return res.status(500).json({ success: false, message: error.message || "Unknown error" });
  }
}
