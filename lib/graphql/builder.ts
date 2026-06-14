import SchemaBuilder from "@pothos/core";
import type { GraphQLContext } from "./context";

export const builder = new SchemaBuilder<{
  Context: GraphQLContext;
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
}>({});

builder.scalarType("DateTime", {
  description: "ISO 8601 date-time string",
  serialize: (value) => {
    if (value instanceof Date) return value.toISOString();
    return String(value);
  },
  parseValue: (value) => new Date(value as string),
  parseLiteral: (ast) => {
    if (ast.kind === "StringValue") return new Date(ast.value);
    throw new Error("DateTime must be a string");
  },
});

builder.queryType({});
builder.mutationType({});
