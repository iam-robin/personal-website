import { Cloudinary } from "@cloudinary/url-gen";

export async function search(options = {}) {
  const params = {
    ...options,
  };

  if (options.nextCursor) {
    params.next_cursor = options.nextCursor;
    delete params.nextCursor;
  }

  const paramString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");

  const results = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/search?${paramString}`,
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY +
            ":" +
            process.env.CLOUDINARY_API_SECRET
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        sort_by: [{"created_at":"desc"}],
      }),
    }
  ).then((r) => r.json());

  return results;
}

export function mapImageResources(resources) {
  return resources?.map((resource) => {
    const { width, height } = resource;
    return {
      assetId: resource.asset_id,
      publicId: resource.public_id,
      image: resource.secure_url,
      width,
      height,
    };
  });
}

export async function getFolders(options = {}) {
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/folders`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY +
            ":" +
            process.env.CLOUDINARY_API_SECRET
        ).toString("base64")}`,
      },
    }
  ).then((r) => r.json());

  return response;
}

const cld = new Cloudinary({
  cloud: {
    cloudName: "daxsvl9cg",
  },
  url: {
    secure: true,
  },
});

export function buildImage(src) {
  return cld.image(src).quality("auto").format("auto");
}
