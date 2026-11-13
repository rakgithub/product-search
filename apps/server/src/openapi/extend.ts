import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

// Must run once, before any schema calls `.openapi()`.
extendZodWithOpenApi(z);
