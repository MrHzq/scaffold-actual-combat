const axios = require("axios");

const BASEURL = "https://api.github.com";
const OWNER = "hzq-fe-template";

axios.defaults.baseURL = BASEURL;

axios.defaults.headers.common["User-Agent"] = "myTestApp"; // 不加这个会报 403 错误

axios.interceptors.response.use((res) => res.data); // 处理 github api 返回的数据

// 通过调用 github API 来获取模板列表
async function getRepoList() {
  // 从 orgs/hzq-fe-template/repos 获取模板列表
  // 具体 github 地址为：https://github.com/orgs/hzq-fe-template/repositories
  return axios.get(`/orgs/${OWNER}/repos`);
}

async function getTagList(repoName) {
  // 从 repos/hzq-fe-template/${repo}/tags 获取模板列表
  return axios.get(`/repos/${OWNER}/${repoName}/tags`);
}

module.exports = {
  OWNER,
  getRepoList,
  getTagList,
};
