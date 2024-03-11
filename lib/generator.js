const util = require("util"); // 工具库
const DownloadGitRepo = require("download-git-repo"); // 下载 git 仓库
const { getRepoList, getTagList, OWNER } = require("./https");
const inquirer = require("inquirer"); // 命令行交互
const { spinner } = require("./log");

// 将 DownloadGitRepo promise 化，因为它本身不是 promise 风格的
const downloadGitRepo = util.promisify(DownloadGitRepo);

// 封装一个 loading 函数，方便使用
const createLoading = async (fn, msg, ...fnArgs) => {
  spinner.start(msg);

  try {
    let result;

    if (typeof fn === "function") result = await fn(...fnArgs);

    spinner.succeed();
    return result;
  } catch (error) {
    spinner.fail(`【${msg}】error: ` + error.message);
    spinner.fail(`【${msg}】failed, please try again later.`);
  }
};

module.exports = class Generator {
  constructor(projectName, projectFullPath) {
    this.projectName = projectName;
    this.projectFullPath = projectFullPath;
  }

  // 核心创建流程
  async create() {
    // 创建的流程是：
    // 1、用户已选择的模板名称
    const repoName = await this.getRepo();

    if (repoName) {
      // 2、用户已选择的模板版本
      const tag = await this.getTag(repoName);

      // 3、下载模板到项目内
      await this.download(repoName, tag);
    }
  }

  async getRepo() {
    // 1、从远端拉取可选择的模板数据(使用 ora 加 loading)
    // 2、让用户选择模板
    // 3、提供给用户选择，并得到已选的模板

    // 1、
    const repoList = await createLoading(getRepoList, "Loading templates...");
    if (!repoList?.length) return;

    // 2、
    const chooseTemplateList = repoList.filter((item) => item.name);

    // 3、
    const promptName = "choosedTemplateName";
    const answer = await inquirer.prompt([
      {
        name: promptName,
        type: "list",
        message: `请选择对应模板`,
        choices: chooseTemplateList,
      },
    ]);

    return answer[promptName];
  }
  async getTag(repoName) {
    const tagList = await createLoading(
      getTagList,
      "Loading versions...",
      repoName
    );

    if (!tagList?.length) return "";

    return tagList[0];
  }

  // 下载 github 仓库
  async download(repoName, tag) {
    const repoUrl = `${OWNER}/${repoName}${tag ? "#" + tag : ""}`;

    await createLoading(
      downloadGitRepo,
      "download template...",
      repoUrl,
      this.projectFullPath
    );
  }
};
