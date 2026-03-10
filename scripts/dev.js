import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();

const run = (name, cwd, command, args) => {
  const child = spawn(command, args, {
    cwd: path.join(rootDir, cwd),
    stdio: "inherit",
    shell: true,
  });

  child.on("exit", (code) => {
    if (code !== 0) {
      console.error(`${name} exited with code ${code}`);
    }
  });

  return child;
};

const backend = run("backend", "backend", "npm", ["start"]);
const frontend = run("frontend", "frontend", "npm", ["run", "dev"]);

const shutdown = () => {
  if (!backend.killed) {
    backend.kill();
  }
  if (!frontend.killed) {
    frontend.kill();
  }
};

process.on("SIGINT", () => {
  shutdown();
  process.exit(0);
});

process.on("SIGTERM", () => {
  shutdown();
  process.exit(0);
});
