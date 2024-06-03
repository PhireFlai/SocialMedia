import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url"

export const client = createClient({
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset: "production",
    useCdn: true,
    apiVersion: "2024-06-03",
    token: process.env.REACT_APP_SANITY_SECRET_TOKEN,
}
);

const builder = imageUrlBuilder(client)

function urlFor(source) {
  return builder.image(source)
};