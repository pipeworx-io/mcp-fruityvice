# mcp-fruityvice

Fruityvice MCP — wraps Fruityvice API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_fruit` | Get nutritional facts for a specific fruit. Returns calories, protein, fat, carbs, sugar, and fiber per 100g (e.g., 'apple', 'banana'). |
| `list_fruits` | List all available fruits with their nutritional profiles. Returns name, calories, protein, fat, carbs, sugar, and fiber for each. |
| `get_by_nutrition` | Find fruits matching a nutritional range. Specify nutrient type (calories, sugar, fat, carbs, protein) and min/max values to filter results. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "fruityvice": {
      "url": "https://gateway.pipeworx.io/fruityvice/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Fruityvice data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
