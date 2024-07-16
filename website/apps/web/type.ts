import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "server/api/root";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;