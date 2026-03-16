const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

test("npm pack dry-run includes the public proxy entrypoints", async () => {
  const cacheDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "mcp-audit-pack-cache-"));

  try {
    const { stdout } = await execFileAsync("npm", ["pack", "--json", "--dry-run"], {
      cwd: path.join(__dirname, ".."),
      env: {
        ...process.env,
        npm_config_cache: cacheDir,
        NPM_CONFIG_CACHE: cacheDir
      },
      maxBuffer: 10 * 1024 * 1024
    });
    const packOutput = JSON.parse(stdout);
    const filePaths = new Set((packOutput[0] && packOutput[0].files ? packOutput[0].files : []).map((entry) => entry.path));

    assert.equal(packOutput[0].name, "mcp-audit-server");
    assert.ok(filePaths.has("index.js"));
    assert.ok(filePaths.has("cli.js"));
    assert.ok(filePaths.has("CHANGELOG.md"));
    assert.ok(filePaths.has("MIGRATION.md"));
  } finally {
    await fs.promises.rm(cacheDir, { recursive: true, force: true });
  }
});
