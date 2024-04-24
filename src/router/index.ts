import { createScinDNClient } from "@/scindn/server";
import { publicProcedure, router } from "../server";
import { z } from "zod";

const scindn = createScinDNClient({
  scindnDomain: process.env.NEXT_PUBLIC_SCINDN_DOMAIN!,
  secret: process.env.SCINDN_SECRET!,
});

export const appRouter = router({
  generatePresigned: publicProcedure.query(() => scindn.generateLink({ key: "upload-image" })),
  updateProfilePic: publicProcedure.input(z.object({ encrypted: z.string() })).mutation(async ({ input }) => {
    const decrypted = await scindn.decrypt({ key: "upload-image", encrypted: input.encrypted });
    return { files: decrypted.files };
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
