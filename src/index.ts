/**
 * Fruityvice MCP — wraps Fruityvice API (free, no auth)
 *
 * Tools:
 * - get_fruit: Get nutritional information for a specific fruit by name
 * - list_fruits: List all fruits with their nutritional data
 * - get_by_nutrition: Find fruits within a nutritional range for a given nutrient
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://www.fruityvice.com/api/fruit';

type RawNutritions = {
  calories: number;
  fat: number;
  sugar: number;
  carbohydrates: number;
  protein: number;
};

type RawFruit = {
  id: number;
  name: string;
  family: string;
  genus: string;
  order: string;
  nutritions: RawNutritions;
};

function formatFruit(fruit: RawFruit) {
  return {
    id: fruit.id,
    name: fruit.name,
    family: fruit.family,
    genus: fruit.genus,
    order: fruit.order,
    nutritions: {
      calories: fruit.nutritions.calories,
      fat: fruit.nutritions.fat,
      sugar: fruit.nutritions.sugar,
      carbohydrates: fruit.nutritions.carbohydrates,
      protein: fruit.nutritions.protein,
    },
  };
}

const tools: McpToolExport['tools'] = [
  {
    name: 'get_fruit',
    description: 'Get detailed nutritional information for a specific fruit by name.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the fruit (e.g., "banana", "apple", "mango").',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'list_fruits',
    description: 'List all available fruits with their complete nutritional data.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_by_nutrition',
    description:
      'Find fruits within a nutritional range for a specific nutrient. Useful for filtering fruits by calories, sugar, fat, carbohydrates, or protein.',
    inputSchema: {
      type: 'object',
      properties: {
        nutrient: {
          type: 'string',
          description:
            'The nutrient to filter by. One of: calories, sugar, fat, carbohydrates, protein.',
        },
        min: {
          type: 'number',
          description: 'Minimum value for the nutrient (inclusive).',
        },
        max: {
          type: 'number',
          description: 'Maximum value for the nutrient (inclusive).',
        },
      },
      required: ['nutrient', 'min', 'max'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_fruit':
      return getFruit(args.name as string);
    case 'list_fruits':
      return listFruits();
    case 'get_by_nutrition':
      return getByNutrition(
        args.nutrient as string,
        args.min as number,
        args.max as number,
      );
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function getFruit(name: string) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(name.toLowerCase())}`);
  if (!res.ok) throw new Error(`Fruityvice error: ${res.status}`);

  const data = (await res.json()) as RawFruit;
  return formatFruit(data);
}

async function listFruits() {
  const res = await fetch(`${BASE_URL}/all`);
  if (!res.ok) throw new Error(`Fruityvice error: ${res.status}`);

  const data = (await res.json()) as RawFruit[];
  return {
    count: data.length,
    fruits: data.map(formatFruit),
  };
}

async function getByNutrition(nutrient: string, min: number, max: number) {
  // Fruityvice nutrition range endpoint: /api/fruit/nutritions?min=X&max=Y
  // The nutrient type is passed as a path segment, e.g. /api/fruit/calories?min=0&max=100
  const params = new URLSearchParams({ min: String(min), max: String(max) });
  const url = `${BASE_URL}/${encodeURIComponent(nutrient.toLowerCase())}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fruityvice error: ${res.status}`);

  const data = (await res.json()) as RawFruit[];
  return {
    nutrient,
    min,
    max,
    count: data.length,
    fruits: data.map(formatFruit),
  };
}

export default { tools, callTool } satisfies McpToolExport;
