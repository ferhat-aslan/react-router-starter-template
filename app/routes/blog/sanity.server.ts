import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "7g9hg49b", // Kleinbyte Blog project ID
  dataset: "production",
  apiVersion: "2024-11-28",
  useCdn: false,
});

