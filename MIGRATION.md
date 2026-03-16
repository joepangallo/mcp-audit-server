# Migration Guide

This package replaces the ambiguous `mcp-server-agent-security` name for the thin MCP/CLI proxy.

## What Changed

- Old package name: `mcp-server-agent-security`
- New package name: `mcp-audit-server`
- Preferred CLI: `mcp-audit-server`

## Upgrade

```bash
npm uninstall mcp-server-agent-security
npm install mcp-audit-server
```

If you launch the MCP proxy through `npx`, update your client config:

```json
{
  "mcpServers": {
    "mcp-audit-server": {
      "command": "npx",
      "args": ["-y", "mcp-audit-server", "--mcp"]
    }
  }
}
```

## Package Split

The old package name was overloaded across two different repos. The split is now:

- `mcp-security-audit`: full local audit engine, HTTP API, MCP server, and CLI
- `mcp-audit-server`: thin MCP/CLI proxy that forwards to a running audit API

Use `mcp-audit-server` only when you want the forwarding model. If you want local scanning and the HTTP service in one package, use `mcp-security-audit` instead.

## Publisher Checklist

1. Publish this package under the new name: `npm publish`
2. Deprecate the old package name:

```bash
npm deprecate mcp-server-agent-security@"*" "Deprecated: use mcp-security-audit for the local audit engine or mcp-audit-server for the thin MCP/API proxy."
```

3. Link the proxy repo README to the engine repo so users can find the required backend package quickly.
