# mcp-fruityvice

MCP server for fruit nutritional data via the [Fruityvice API](https://www.fruityvice.com/). No authentication required.

## Tools

| Tool | Description |
|------|-------------|
| `get_fruit` | Get detailed nutritional information for a specific fruit by name |
| `list_fruits` | List all available fruits with their complete nutritional data |
| `get_by_nutrition` | Find fruits within a nutritional range for a specific nutrient |

## Quickstart (Pipeworx Gateway)

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "fruityvice_get_fruit",
      "arguments": { "name": "banana" }
    },
    "id": 1
  }'
```

## License

MIT
