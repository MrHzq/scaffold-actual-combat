// 创建的流程：
// 1、 判断项目是否存在(可以单独写个方法 checkFileExist)

const path = require("path"); // 路径处理
const fs = require("fs-extra"); // 文件操作
const inquirer = require("inquirer"); // 命令行交互
const Generator = require("./generator");

/**
 * 异步检查文件是否存在
 *
 * @param path 文件路径
 * @returns 返回一个布尔值，表示文件是否存在
 */
async function checkFileExist(path) {
  return await fs.existsSync(path);
}

/**
 * 异步删除文件
 *
 * @param path 文件路径
 * @returns 返回删除操作的结果
 */
async function removeFile(path) {
  return await fs.removeSync(path);
}

module.exports = async function (projectName, options) {
  // 1、判断项目是否存在 -- start

  // 1.1 获取当前项目的完整路径：当前命令行的路径 + 项目名称
  const projectFullPath = path.join(process.cwd(), projectName);

  // 1.2 判断项目是否存在
  const isExits = await checkFileExist(projectFullPath);

  if (isExits) {
    // 1.2.1 项目已经存在
    // 再判断是否需要强制创建
    if (options.force) {
      // 1.2.1.1 强制创建：则删除已存在项目，继续走创建流程
      await removeFile(projectFullPath);
    } else {
      // 1.2.1.2 不强制创建：则询问用户是否确认覆盖
      const answer = await inquirer.prompt([
        {
          name: "choosedForce",
          type: "list",
          message: `请选择是否覆盖已存在的 ${projectName} 文件？`,
          choices: [
            { name: "是（选择后将删除文件）", value: true },
            { name: "否（选择后将退出流程）", value: false },
          ],
        },
      ]);

      if (answer.choosedForce) {
        // 1.2.1.2.1 是：则删除已存在项目，继续走创建流程
        await removeFile(projectFullPath);
      } else {
        // 1.2.1.2.2 否：则退出
        return;
      }
    }
  }

  // 2、创建项目流程 -- start
  const generator = new Generator(projectName, projectFullPath);
  await generator.create(); // 创建项目
};
