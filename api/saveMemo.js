import { Octokit } from "@octokit/core";

// GitHub Personal Access Token을 Vercel 환경 변수에서 가져옵니다.
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const repoOwner = "jungjc1117";
const repoName = "test";
const filePath = "tableExample.json";
const branch = "main";

// Octokit 라이브러리를 사용해 GitHub API를 더 쉽게 호출할 수 있습니다.
const octokit = new Octokit({ auth: GITHUB_TOKEN });

export default async (req, res) => {
  // 요청이 POST 방식인지 확인합니다.
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // 클라이언트에서 보낸 데이터를 받습니다.
  const { checkbox, memo } = req.body;
  const contentObj = { checkbox, memo };
  const content = Buffer.from(JSON.stringify(contentObj, null, 2)).toString('base64');

  try {
    let sha = null;
    try {
      // 먼저 기존 파일의 SHA를 가져옵니다.
      const { data } = await octokit.request(`GET /repos/{owner}/{repo}/contents/{path}`, {
        owner: repoOwner,
        repo: repoName,
        path: filePath
      });
      sha = data.sha;
    } catch (error) {
      // 파일이 아직 존재하지 않는 경우 에러를 무시하고 SHA를 null로 둡니다.
      if (error.status !== 404) {
        throw error;
      }
    }

    // 파일 업데이트 또는 생성을 위한 바디를 구성합니다.
    const body = {
      message: "Update memo from Vercel function",
      content: content,
      branch: branch,
    };
    if (sha) {
      body.sha = sha; // 파일이 존재하면 SHA를 추가합니다.
    }

    // GitHub API를 호출하여 파일 내용을 커밋합니다.
    await octokit.request(`PUT /repos/{owner}/{repo}/contents/{path}`, {
      owner: repoOwner,
      repo: repoName,
      path: filePath,
      ...body
    });

    res.status(200).json({ message: "저장 완료!" });
  } catch (error) {
    console.error("GitHub API 호출 실패:", error);
    res.status(500).json({ message: "저장 실패: " + (error.message || error) });
  }
};