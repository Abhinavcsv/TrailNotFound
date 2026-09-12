import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

/*
|--------------------------------------------------------------------------
| Config
|--------------------------------------------------------------------------
*/

const WIKIDATA_ENDPOINT = "https://query.wikidata.org/sparql";

const USER_AGENT =
  "TrailNotFound/1.0 (travel discovery project; contact: abhiatrock7@gmail.com)";

const TARGET_PLACES = 550;
const BATCH_SIZE = 50;
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 90000;

/*
|--------------------------------------------------------------------------
| Notability threshold
|--------------------------------------------------------------------------
|
| Minimum Wikipedia sitelinks a Wikidata entity must have.
| This filters out obscure records that only exist as bare
| Wikidata entries with no real Wikipedia coverage.
|
*/

const MIN_SITELINKS = 3;

/*
|--------------------------------------------------------------------------
| Wikidata types
|--------------------------------------------------------------------------
|
| Important:
| Keep the QIDs here WITHOUT "wd:".
| We add wd: inside the SPARQL query.
|
| This platform's identity is EXCITING + UNDERRATED travel.
| Removed: museum, lake, temple, palace, castle, monument, and
| generic "tourist attraction" — these types skew toward mainstream
| city sightseeing / small local records rather than adventure or
| offbeat nature destinations.
|
*/

const WIKIDATA_TYPES = [
  "Q174313",   // natural place
  "Q46169",    // national park
  "Q35109",    // mountain
  "Q8502",     // mountain (alt class)
  "Q473972",   // hiking / trail related
  "Q34038",    // waterfall
  "Q40080",    // beach
  "Q35509",    // cave
  "Q839954",   // archaeological site
  "Q1107656",  // garden
];

/*
|--------------------------------------------------------------------------
| Junk filters
|--------------------------------------------------------------------------
*/

const JUNK_PATTERNS = [
  "apartment",
  "apartments",
  "properties",
  "telephone exchange",
  "secretariat",
  "office",
  "residence",
  "residential",
  "school",
  "college",
  "university",
  "hospital",
  "clinic",
  "warehouse",
  "factory",
  "station",
  "parking",
  "entry",
  "gate",
  "road",
  "street",
  "lane",
  "building",
  "block",
  "shop",
  "store",
  "market",
  "mall",
  "snooker",
  "gym",
  "bank",
  "atm",
  "petrol",
  "fuel",
  "railway",
  "bus stand",
  "bus station",
  "police",
  "post office",
  "court",
  "exchange",
  "tower block",
];

/*
|--------------------------------------------------------------------------
| Categories
|--------------------------------------------------------------------------
*/

const CATEGORY_MAP: Record<string, string> = {
  "Tourist attraction": "tourist-attraction",
  Heritage: "heritage",
  Nature: "nature",
  Waterfall: "waterfalls",
  Beach: "beaches",
  Mountain: "mountains",
  Trekking: "trekking",
  "National Park": "national-parks",
  Wildlife: "wildlife",
  Viewpoint: "viewpoints",
  Adventure: "adventure",
  Spiritual: "spiritual",
  Lakes: "lakes",
  Caves: "caves",
  Gardens: "gardens",
};

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 70);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCoordinates(coord: string) {
  const match = coord.match(
    /Point\(\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*\)/i
  );

  if (!match) {
    return null;
  }

  const longitude = Number(match[1]);
  const latitude = Number(match[2]);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
}

function cleanDescription(
  name: string,
  description?: string
) {
  if (description && description.trim()) {
    return description
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 5000);
  }

  return "Discover " + name + ", a remarkable travel destination in India.";
}

function isGoodPlaceName(name: string) {
  const value = name.trim().toLowerCase();

  if (!value) {
    return false;
  }

  if (value.length < 3) {
    return false;
  }

  if (/^\d+$/.test(value)) {
    return false;
  }

  /*
   * Reject numbered/hyperlocal naming patterns
   * such as "1 No. Ganga Temple".
   */

  if (/^\d+\s*(no\.?|number)\s/i.test(value)) {
    return false;
  }

  if (
    JUNK_PATTERNS.some((pattern) =>
      value.includes(pattern)
    )
  ) {
    return false;
  }

  /*
   * Reject obvious QID-only labels.
   */

  if (/^q\d+$/i.test(value)) {
    return false;
  }

  return true;
}

function detectCategories(
  name: string,
  description: string
) {
  const text =
    (name + " " + description).toLowerCase();

  const categories = new Set<string>();

  if (
    /waterfall|water fall|falls|cascade/.test(text)
  ) {
    categories.add(
      CATEGORY_MAP.Waterfall
    );
  }

  if (
    /beach|coast|coastal|seaside|shore/.test(text)
  ) {
    categories.add(
      CATEGORY_MAP.Beach
    );
  }

  if (
    /mountain|peak|himalaya|hill station/.test(text)
  ) {
    categories.add(
      CATEGORY_MAP.Mountain
    );
  }

  if (
    /trek|trekking|hiking|trail/.test(text)
  ) {
    categories.add(
      CATEGORY_MAP.Trekking
    );
  }

  if (
    /national park|national parks/.test(text)
  ) {
    categories.add(
      CATEGORY_MAP["National Park"]
    );
  }

  if (
    /wildlife|sanctuary|biosphere|tiger reserve|bird sanctuary/.test(
      text
    )
  ) {
    categories.add(
      CATEGORY_MAP.Wildlife
    );
  }

  if (
    /viewpoint|view point|lookout|scenic view|panorama|observation point/.test(
      text
    )
  ) {
    categories.add(
      CATEGORY_MAP.Viewpoint
    );
  }

  if (
    /fort|palace|monument|heritage|museum|archaeological|historic|historical|ruins|temple complex/.test(
      text
    )
  ) {
    categories.add(
      CATEGORY_MAP.Heritage
    );
  }

  if (
    /temple|mosque|church|gurudwara|gurdwara|shrine|monastery|ashram|stupa/.test(
      text
    )
  ) {
    categories.add(
      CATEGORY_MAP.Spiritual
    );
  }

  if (
    /adventure|rafting|paragliding|zipline|bungee|climbing/.test(
      text
    )
  ) {
    categories.add(
      CATEGORY_MAP.Adventure
    );
  }

  if (
    /lake|lagoon|reservoir/.test(text)
  ) {
    categories.add(
      CATEGORY_MAP.Lakes
    );
  }

  if (
    /cave|caves|cavern/.test(text)
  ) {
    categories.add(
      CATEGORY_MAP.Caves
    );
  }

  if (
    /garden|botanical garden|park garden/.test(text)
  ) {
    categories.add(
      CATEGORY_MAP.Gardens
    );
  }

  if (categories.size === 0) {
    categories.add(
      CATEGORY_MAP["Tourist attraction"]
    );
  }

  return Array.from(categories);
}

/*
|--------------------------------------------------------------------------
| SPARQL query
|--------------------------------------------------------------------------
*/

function buildQuery(offset: number) {
  const typeValues = WIKIDATA_TYPES
    .map((qid) => "wd:" + qid)
    .join("\n    ");

  return [
    "SELECT DISTINCT",
    "  ?place",
    "  ?placeLabel",
    "  ?coord",
    "  ?description",
    "  ?image",
    "WHERE {",
    "  ?place",
    "    wdt:P17 wd:Q668 ;",
    "    wdt:P625 ?coord ;",
    "    wdt:P31 ?type ;",
    "    wikibase:sitelinks ?sitelinks .",
    "",
    "  VALUES ?type {",
    "    " + typeValues,
    "  }",
    "",
    "  FILTER(?sitelinks >= " + MIN_SITELINKS + ")",
    "",
    "  ?place rdfs:label ?placeLabel .",
    "",
    "  FILTER(",
    '    LANG(?placeLabel) = "en" ||',
    '    LANG(?placeLabel) = "hi"',
    "  )",
    "",
    "  OPTIONAL {",
    "    ?place schema:description ?description .",
    "",
    "    FILTER(",
    '      LANG(?description) = "en"',
    "    )",
    "  }",
    "",
    "  OPTIONAL {",
    "    ?place wdt:P18 ?image .",
    "  }",
    "",
    "  SERVICE wikibase:label {",
    "    bd:serviceParam",
    '      wikibase:language "en,hi" .',
    "  }",
    "}",
    "ORDER BY ?place",
    "LIMIT " + BATCH_SIZE,
    "OFFSET " + offset,
  ].join("\n");
}

/*
|--------------------------------------------------------------------------
| HTTP request with timeout
|--------------------------------------------------------------------------
*/

async function fetchWithTimeout(
  url: string
) {
  const controller =
    new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept:
          "application/sparql-results+json",
        "User-Agent": USER_AGENT,
      },
    });

    return response;
  } catch (error: any) {
    if (
      error?.name === "AbortError"
    ) {
      throw new Error(
        "Request timed out."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/*
|--------------------------------------------------------------------------
| Fetch Wikidata batch
|--------------------------------------------------------------------------
*/

async function fetchWikidataBatch(
  offset: number
) {
  const query =
    buildQuery(offset);

  const url =
    WIKIDATA_ENDPOINT + "?query=" +
    encodeURIComponent(query) +
    "&format=json";

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    try {
      console.log(
        "Wikidata request " + attempt + "/" + MAX_RETRIES + " | offset=" + offset
      );

      const response =
        await fetchWithTimeout(url);

      console.log(
        "Wikidata status: " + response.status
      );

      if (!response.ok) {
        const text =
          await response.text();

        if (response.status === 400) {
          throw new Error(
            "HTTP 400: " + text.slice(0, 2000)
          );
        }

        throw new Error(
          "HTTP " + response.status + ": " + text.slice(0, 1000)
        );
      }

      const json =
        await response.json();

      return json.results?.bindings ?? [];
    } catch (error: any) {
      console.error(
        "Wikidata request failed: " + (error?.message ?? error)
      );

      if (
        error?.message?.startsWith(
          "HTTP 400:"
        )
      ) {
        throw error;
      }

      if (
        attempt < MAX_RETRIES
      ) {
        const wait =
          attempt * 5000;

        console.log(
          "Retrying in " + (wait / 1000) + "s..."
        );

        await sleep(wait);
      }
    }
  }

  throw new Error(
    "Wikidata request failed after multiple attempts."
  );
}

/*
|--------------------------------------------------------------------------
| Category helper
|--------------------------------------------------------------------------
*/

async function ensureCategories(
  slugs: string[]
) {
  for (const slug of slugs) {
    const name =
      Object.entries(
        CATEGORY_MAP
      ).find(
        ([, value]) =>
          value === slug
      )?.[0] ??
      slug
        .split("-")
        .map(
          (word) =>
            word
              .charAt(0)
              .toUpperCase() +
            word.slice(1)
        )
        .join(" ");

    await prisma.category.upsert({
      where: {
        slug,
      },
      update: {},
      create: {
        name,
        slug,
      },
    });
  }
}

/*
|--------------------------------------------------------------------------
| Duplicate check
|--------------------------------------------------------------------------
*/

async function isDuplicate(
  qid: string,
  name: string,
  latitude: number,
  longitude: number
) {
  const marker =
    "[wikidata:" + qid + "]";

  const byQid =
    await prisma.place.findFirst({
      where: {
        description: {
          contains: marker,
        },
      },
      select: {
        id: true,
      },
    });

  if (byQid) {
    return true;
  }

  const baseSlug =
    slugify(name);

  const bySlug =
    await prisma.place.findFirst({
      where: {
        slug: {
          startsWith: baseSlug + "-",
        },
      },
      select: {
        id: true,
      },
    });

  if (bySlug) {
    return true;
  }

  const byCoordinates =
    await prisma.place.findFirst({
      where: {
        latitude: {
          gte:
            latitude - 0.0005,
          lte:
            latitude + 0.0005,
        },
        longitude: {
          gte:
            longitude - 0.0005,
          lte:
            longitude + 0.0005,
        },
      },
      select: {
        id: true,
      },
    });

  return Boolean(
    byCoordinates
  );
}

/*
|--------------------------------------------------------------------------
| Main
|--------------------------------------------------------------------------
*/

async function main() {
  console.log(
    "Fetching exciting + underrated travel places from Wikidata..."
  );

  console.log(
    "Target: " + TARGET_PLACES + " places"
  );

  console.log(
    "Batch size: " + BATCH_SIZE
  );

  console.log(
    "Minimum sitelinks: " + MIN_SITELINKS
  );

  let imported = 0;
  let skipped = 0;
  let offset = 0;

  const maxBatches =
    Math.ceil(
      TARGET_PLACES /
        BATCH_SIZE
    );

  for (
    let batch = 1;
    batch <= maxBatches;
    batch++
  ) {
    if (
      imported >=
      TARGET_PLACES
    ) {
      break;
    }

    console.log("");
    console.log(
      "----------------------------"
    );
    console.log(
      "Batch " + batch + "/" + maxBatches
    );
    console.log(
      "Current imported: " + imported
    );
    console.log(
      "----------------------------"
    );

    let results;

    try {
      results =
        await fetchWikidataBatch(
          offset
        );
    } catch (error) {
      console.error(
        "Batch failed:",
        error
      );

      offset += BATCH_SIZE;

      continue;
    }

    if (
      results.length === 0
    ) {
      console.log(
        "No more Wikidata records."
      );

      break;
    }

    console.log(
      "Wikidata returned " + results.length + " records"
    );

    for (const result of results) {
      if (
        imported >=
        TARGET_PLACES
      ) {
        break;
      }

      try {
        const qid =
          result.place?.value
            ?.split("/")
            .pop();

        const name =
          result.placeLabel?.value
            ?.trim();

        const coord =
          result.coord?.value;

        const rawDescription =
          result.description?.value;

        const image =
          result.image?.value;

        if (
          !qid ||
          !name ||
          !coord
        ) {
          skipped++;
          continue;
        }

        if (
          !isGoodPlaceName(name)
        ) {
          console.log(
            "Junk -> " + name
          );

          skipped++;
          continue;
        }

        const coordinates =
          getCoordinates(coord);

        if (!coordinates) {
          skipped++;
          continue;
        }

        /*
         * India geographic sanity check.
         */

        if (
          coordinates.latitude < 6 ||
          coordinates.latitude > 37 ||
          coordinates.longitude < 68 ||
          coordinates.longitude > 98
        ) {
          skipped++;
          continue;
        }

        const description =
          cleanDescription(
            name,
            rawDescription
          );

        const categories =
          detectCategories(
            name,
            description
          );

        await ensureCategories(
          categories
        );

        const duplicate =
          await isDuplicate(
            qid,
            name,
            coordinates.latitude,
            coordinates.longitude
          );

        if (duplicate) {
          console.log(
            "Duplicate -> " + name
          );

          skipped++;
          continue;
        }

        /*
         * Unique slug.
         */

        const baseSlug =
          slugify(name);

        const coordinateSuffix =
          Math.round(coordinates.latitude * 1000) +
          "-" +
          Math.round(coordinates.longitude * 1000);

        let slug =
          baseSlug + "-" + coordinateSuffix;

        const existingSlug =
          await prisma.place.findUnique({
            where: {
              slug,
            },
            select: {
              id: true,
            },
          });

        if (existingSlug) {
          slug =
            baseSlug + "-" + qid.toLowerCase();
        }

        const coverImage =
          image &&
          image.startsWith("http")
            ? image
            : null;

        const finalDescription =
          description + "\n\n[wikidata:" + qid + "]";

        await prisma.place.create({
          data: {
            name,

            slug,

            description:
              finalDescription,

            coverImage,

            images:
              coverImage
                ? [coverImage]
                : [],

            latitude:
              coordinates.latitude,

            longitude:
              coordinates.longitude,

            bestTimeToVisit:
              null,

            avgBudget:
              null,

            rating: 0,

            isHiddenGem:
              false,

            categories: {
              connect: categories.map(
                (categorySlug) => ({
                  slug: categorySlug,
                })
              ),
            },
          },
        });

        imported++;

        console.log(
          categories.join(", ") + " -> " + name
        );
      } catch (error) {
        skipped++;

        console.error(
          "Failed -> " + (result.placeLabel?.value ?? "Unknown")
        );

        console.error(
          error
        );
      }
    }

    offset += BATCH_SIZE;

    if (
      batch < maxBatches
    ) {
      await sleep(1500);
    }
  }

  console.log("");
  console.log(
    "----------------------------"
  );
  console.log(
    "Wikidata import completed!"
  );
  console.log(
    "Imported this run: " + imported
  );
  console.log(
    "Skipped: " + skipped
  );
  console.log(
    "Target: " + TARGET_PLACES
  );
  console.log(
    "----------------------------"
  );

  const total =
    await prisma.place.count();

  console.log(
    "Total places in database: " + total
  );
}

/*
|--------------------------------------------------------------------------
| Run
|--------------------------------------------------------------------------
*/

main()
  .catch((error) => {
    console.error(
      "Import failed:",
      error
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });