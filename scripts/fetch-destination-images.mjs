import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

const OUTPUT_DIR = path.join(
  ROOT,
  "public/destinations/replacements"
);

const MANIFEST_FILE = path.join(
  OUTPUT_DIR,
  "attributions.json"
);

const USER_AGENT =
  "TrailNotFound/1.0 (destination image research)";

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const DESTINATIONS = [
  {
    id: "tirthan-valley",
    name: "Tirthan Valley",
    queries: [
      "Tirthan Valley river Himachal Pradesh",
      "Tirthan Valley mountain landscape India",
      "Tirthan river Great Himalayan National Park",
    ],
  },
  {
    id: "chopta",
    name: "Chopta",
    queries: [
      "Chopta Tungnath alpine meadow Uttarakhand",
      "Chopta bugyal Himalayan landscape",
      "Chopta Chandrashila mountain view",
    ],
  },
  {
    id: "munsiyari",
    name: "Munsiyari",
    queries: [
      "Munsiyari Panchachuli mountain peaks",
      "Munsiyari Uttarakhand Himalayan landscape",
      "Panchachuli peaks view Munsiyari",
    ],
  },
  {
    id: "kheerganga",
    name: "Kheerganga",
    queries: [
      "Kheerganga Parvati Valley trek landscape",
      "Kheerganga hot springs mountains",
      "Kheerganga Himachal Pradesh trail",
    ],
  },
  {
    id: "bhrigu-lake",
    name: "Bhrigu Lake",
    queries: [
      "Bhrigu Lake Manali high altitude lake",
      "Bhrigu Lake Himachal Pradesh landscape",
      "Bhrigu Lake trek alpine meadow",
    ],
  },
  {
    id: "hogenakkal-falls",
    name: "Hogenakkal Falls",
    queries: [
      "Hogenakkal Falls Tamil Nadu waterfall",
      "Hogenakkal Cauvery river waterfalls",
      "Hogenakkal waterfall aerial landscape",
    ],
  },
  {
    id: "kempty-falls",
    name: "Kempty Falls",
    queries: [
      "Kempty Falls Mussoorie waterfall",
      "Kempty waterfall Uttarakhand landscape",
      "Kempty Falls natural waterfall India",
    ],
  },
  {
    id: "vantawng-falls",
    name: "Vantawng Falls",
    queries: [
      "Vantawng Falls Mizoram waterfall",
      "Vantawng Khawhthla waterfall landscape",
      "Vantawng waterfall green valley",
    ],
  },
];

function clean(value = "") {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function metadata(info, key) {
  return clean(
    info.extmetadata?.[key]?.value || ""
  );
}

function allowedLicense(info) {
  const license = (
    info.extmetadata?.LicenseShortName?.value || ""
  ).toLowerCase();

  return (
    license.includes("cc by") ||
    license.includes("cc-by") ||
    license.includes("cc0") ||
    license.includes("public domain") ||
    license.includes("pdm")
  );
}

async function fetchJson(url, attempts = 5) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(25000),
      });

      if (response.status === 429) {
        const waitTime =
          Math.min(60000, 10000 * attempt);

        console.log(
          `  Rate limited (429). Waiting ${waitTime / 1000}s...`
        );

        await sleep(waitTime);
        continue;
      }

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      if (attempt === attempts) {
        throw error;
      }

      const waitTime =
        Math.min(30000, 5000 * attempt);

      console.log(
        `  Retry ${attempt}/${attempts - 1}: ${error.message}`
      );

      await sleep(waitTime);
    }
  }
}

async function searchCommons(query) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",

    gsrsearch: `filetype:bitmap ${query}`,

    gsrnamespace: "6",

    // Smaller result set = less server load
    gsrlimit: "15",

    prop: "imageinfo",

    iiprop:
      "url|extmetadata",

    iiurlwidth: "1400",

    format: "json",

    formatversion: "2",
  });

  const url =
    `https://commons.wikimedia.org/w/api.php?${params}`;

  const data = await fetchJson(url);

  const pages =
    data.query?.pages || [];

  return pages
    .filter((page) => {
      const info =
        page.imageinfo?.[0];

      return (
        info?.thumburl &&
        info?.descriptionurl &&
        allowedLicense(info)
      );
    })
    .map((page) => ({
      page,
      title: page.title,
      license: metadata(
        page.imageinfo[0],
        "LicenseShortName"
      ),
    }));
}

async function downloadImage(page, id) {
  const info = page.imageinfo[0];

  const response = await fetch(
    info.thumburl,
    {
      headers: {
        "User-Agent": USER_AGENT,
      },

      signal:
        AbortSignal.timeout(30000),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Image download returned ${response.status}`
    );
  }

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  const extensions = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  const extension =
    extensions[
      contentType
        .split(";")[0]
        .trim()
    ];

  if (!extension) {
    throw new Error(
      `Unsupported image type: ${contentType}`
    );
  }

  const buffer = Buffer.from(
    await response.arrayBuffer()
  );

  if (
    !buffer.length ||
    buffer.length >
      8 * 1024 * 1024
  ) {
    throw new Error(
      "Image is empty or exceeds 8 MB."
    );
  }

  const filename =
    `${id}.${extension}`;

  const filePath =
    path.join(
      OUTPUT_DIR,
      filename
    );

  await fs.writeFile(
    filePath,
    buffer
  );

  return `/destinations/replacements/${filename}`;
}

async function main() {
  await fs.mkdir(
    OUTPUT_DIR,
    { recursive: true }
  );

  let manifest = {};

  try {
    const existing =
      await fs.readFile(
        MANIFEST_FILE,
        "utf8"
      );

    manifest =
      JSON.parse(existing);

    console.log(
      "Existing replacement manifest loaded."
    );
  } catch {
    console.log(
      "No existing manifest found. Creating a new one."
    );
  }

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (
    const destination
    of DESTINATIONS
  ) {
    console.log(
      `\n================================`
    );

    console.log(
      `Searching: ${destination.name}`
    );

    console.log(
      `================================`
    );

    // --------------------------------------------------
    // Do not redownload Vantawng if it already exists
    // --------------------------------------------------

    const existingFiles = [];

    for (
      const extension of [
        "jpg",
        "png",
        "webp",
      ]
    ) {
      const filePath =
        path.join(
          OUTPUT_DIR,
          `${destination.id}.${extension}`
        );

      try {
        await fs.access(filePath);
        existingFiles.push(
          `${destination.id}.${extension}`
        );
      } catch {}
    }

    if (existingFiles.length) {
      console.log(
        `  Already exists: ${existingFiles[0]}`
      );

      console.log(
        "  Skipping download."
      );

      skipped++;
      continue;
    }

    let candidates = [];

    try {
      for (
        let i = 0;
        i < destination.queries.length;
        i++
      ) {
        const query =
          destination.queries[i];

        console.log(
          `  Query ${i + 1}: ${query}`
        );

        candidates =
          await searchCommons(query);

        console.log(
          `  Candidates found: ${candidates.length}`
        );

        if (
          candidates.length
        ) {
          break;
        }

        // Wait before another search
        await sleep(8000);
      }

      if (
        !candidates.length
      ) {
        console.log(
          "  No suitable licensed image found."
        );

        failed++;
        continue;
      }

      // --------------------------------------------------
      // First candidate only
      // IMPORTANT: review it before using in Explore
      // --------------------------------------------------

      const selected =
        candidates[0].page;

      const info =
        selected.imageinfo[0];

      console.log(
        `  Selected: ${selected.title}`
      );

      console.log(
        `  Licence: ${metadata(
          info,
          "LicenseShortName"
        )}`
      );

      const imagePath =
        await downloadImage(
          selected,
          destination.id
        );

      manifest[destination.id] = {
        destination:
          destination.name,

        image:
          imagePath,

        title:
          selected.title,

        creator:
          metadata(
            info,
            "Artist"
          ),

        credit:
          metadata(
            info,
            "Credit"
          ),

        license:
          metadata(
            info,
            "LicenseShortName"
          ),

        licenseUrl:
          metadata(
            info,
            "LicenseUrl"
          ),

        sourceUrl:
          info.descriptionurl,

        reviewStatus:
          "pending",
      };

      success++;

      console.log(
        `  ✓ Saved: ${imagePath}`
      );

      // Give Wikimedia a break
      await sleep(10000);

    } catch (error) {
      console.log(
        `  ✗ Failed: ${error.message}`
      );

      failed++;

      // Longer wait after an error
      await sleep(15000);
    }
  }

  await fs.writeFile(
    MANIFEST_FILE,
    JSON.stringify(
      manifest,
      null,
      2
    ),
    "utf8"
  );

  console.log(
    "\n================================"
  );

  console.log(
    "Replacement image fetching completed."
  );

  console.log(
    "================================"
  );

  console.log(
    `Successful: ${success}`
  );

  console.log(
    `Skipped: ${skipped}`
  );

  console.log(
    `Failed: ${failed}`
  );

  console.log(
    `Manifest: ${MANIFEST_FILE}`
  );

  console.log(
    "\nOriginal destination images were NOT modified."
  );

  console.log(
    "Review replacement images before connecting them to Explore."
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});