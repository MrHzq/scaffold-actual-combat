#! /usr/bin/env node

// 上述为 Node.js 脚本文件的行首注释，告知使用 node 来解析和执行后续的脚本内容

console.log("hello hzqCli");

// 引入 commander 模块，官方使用文档：https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md
const { program } = require("commander");

// 定义命令与参数，类似 hzqCli init、hzqCli list 等等
// create 的命令
program
  .command("create <projectName>")
  .description("create a new project")
  .option("-f --force", "overwrite existed project") // 定义选项，同时可以附加选项的简介，短名称（-后面接单个字符）和长名称（--后面接一个或多个单词，空格分隔
  .action((projectName, options) => {
    console.log("create project: ", projectName);
    console.log("options: ", options);
    require("../lib/create.js")(projectName, options);
  });

// 解析用户输入的命令和参数，第一个参数是要解析的字符串数组，第二个参数是解析选项
program.parse(process.argv); // 指明，按 node 约定
