import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { sendSIgnUpEmail } from "@/lib/inngest/functions/functions";
export const {GET,POST,PUT} = serve({
    client:inngest,
    functions: [sendSIgnUpEmail],
})