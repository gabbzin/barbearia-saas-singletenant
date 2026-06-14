import { createContext } from "@/lib/graphql/context";
import { schema } from "@/lib/graphql/schema";
import { createYoga } from "graphql-yoga";

export const dynamic = "force-dynamic";

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  context: ({ request }) => createContext(request),
  graphiql: process.env.NODE_ENV === "development",
  fetchAPI: { Response },
});

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS };
