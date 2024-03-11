const ora = require("ora");
const chalk = require("chalk");

const log = {
  successText: function (msg) {
    return chalk.green.bold(`${msg}`);
  },
  success: function (msg) {
    console.log(this.successText(msg));
  },
  errorText: function (msg) {
    return chalk.red(`${msg}`);
  },
  error: function (msg) {
    console.log(this.errorText(msg));
  },
};

// 创建一个spinner实例：初始为【青色并加粗】
const spinner = ora();

module.exports = {
  log,
  spinner: {
    start(text = "") {
      spinner.start(text);
    },
    succeed(text = "") {
      spinner.succeed(log.successText(text));
    },
    fail(text = "") {
      spinner.fail(log.errorText(text));
    },
  },
};
