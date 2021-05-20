import chalk from "chalk";

export const error = (msg: string) =>
  console.log(chalk.bgRed.white.bold("  ERROR  ") + " " + chalk.white(msg));

export const warning = (msg: string) =>
  console.log(chalk.bgYellow.white.bold(" WARNING ") + " " + chalk.white(msg));

export const success = (msg: string) =>
  console.log(chalk.bgGreen.white.bold(" SUCCESS ") + " " + chalk.white(msg));

export const info = (msg: string) =>
  console.log(chalk.bgWhite.black.bold("   INFO  ") + " " + chalk.white(msg));

export const text_yellow = (text: string) => chalk.yellow(text);
