import {
  normalizeInstagramUsername,
  buildInstagramProfileUrl,
  normalizeLocation,
  normalizeNiches,
  normalizeGender,
  calculateEngagementRate,
} from "../normalization";
import { CreatorSearchQuerySchema } from "../validation";
import { CreatorSearchService } from "../searchService";
import { DevMockCreatorProvider } from "../providers/DevMockCreatorProvider";
import { filterAndSortCreators } from "../filterEngine";
import { MOCK_INSTAGRAM_CREATORS } from "../mockData";
import { DEFAULT_CREATOR_SEARCH_FILTERS } from "../searchFilters";
import { DEFAULT_FILTERS } from "@/types/creator";

// Simple test runner for verification
async function runTests() {
  console.log("=== STARTING UGCFY CREATOR DISCOVERY TEST SUITE ===\n");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Username Normalization
  console.log("--- Testing Username Normalization ---");
  assert(
    normalizeInstagramUsername("@RahulCreator") === "rahulcreator",
    "Strips leading @ and lowercases"
  );
  assert(
    normalizeInstagramUsername("   RAHUL.CREATOR   ") === "rahul.creator",
    "Trims whitespace and preserves dots"
  );
  assert(
    normalizeInstagramUsername("@tarini_peshwaria") === "tarini_peshwaria",
    "Preserves underscores"
  );

  let errorThrown = false;
  try {
    normalizeInstagramUsername("invalid username with spaces!");
  } catch {
    errorThrown = true;
  }
  assert(errorThrown, "Rejects usernames with invalid characters");

  assert(
    buildInstagramProfileUrl("RahulCreator") === "https://www.instagram.com/rahulcreator/",
    "Constructs canonical Instagram profile URL"
  );

  // 2. Location Normalization
  console.log("\n--- Testing Location Normalization ---");
  const loc1 = normalizeLocation({ city: "Bombay", state: "MH", country: "India" });
  assert(loc1.city === "Mumbai" && loc1.cityNormalized === "mumbai", "Normalizes Bombay -> Mumbai");
  assert(loc1.state === "Maharashtra", "Normalizes MH -> Maharashtra");

  const loc2 = normalizeLocation({ city: "Bangalore", state: "Karnataka" });
  assert(loc2.city === "Bengaluru" && loc2.cityNormalized === "bengaluru", "Normalizes Bangalore -> Bengaluru");

  const loc3 = normalizeLocation({ city: "Calcutta" });
  assert(loc3.city === "Kolkata", "Normalizes Calcutta -> Kolkata");

  const loc4 = normalizeLocation({ city: "Delhi NCR" });
  assert(loc4.city === "Delhi", "Normalizes Delhi NCR -> Delhi");

  // 3. Niche Taxonomy Normalization
  console.log("\n--- Testing Niche Taxonomy Mapping ---");
  const niches1 = normalizeNiches(["Streetwear", "Clothing", "Outfits"]);
  assert(niches1.niches.includes("Fashion"), "Maps Streetwear & Clothing -> Fashion");
  assert(niches1.primaryNiche === "Fashion", "Sets primary niche correctly");

  const niches2 = normalizeNiches(["Beauty & Skincare", "Makeup"]);
  assert(niches2.niches.includes("Beauty"), "Maps Skincare & Makeup -> Beauty");

  const niches3 = normalizeNiches(["Gym", "Workout"]);
  assert(niches3.niches.includes("Fitness"), "Maps Gym & Workout -> Fitness");

  // 4. Gender Normalization (No Image Inference)
  console.log("\n--- Testing Gender Normalization ---");
  assert(normalizeGender("female") === "female", "Maps female -> female");
  assert(normalizeGender("Woman") === "female", "Maps Woman -> female");
  assert(normalizeGender("male") === "male", "Maps male -> male");
  assert(normalizeGender("non-binary") === "other", "Maps non-binary -> other");
  assert(normalizeGender(null) === "unspecified", "Missing gender resolves to unspecified");
  assert(normalizeGender(undefined) === "unspecified", "Undefined gender resolves to unspecified");
  assert(normalizeGender("unknown_data") === "unspecified", "Invalid gender string resolves to unspecified");

  // 5. Engagement Rate Calculation & Documentation
  console.log("\n--- Testing Engagement Rate Calculation ---");
  const er1 = calculateEngagementRate({
    avgLikes: 4800,
    avgComments: 200,
    followersCount: 100000,
  });
  assert(er1 === 5.0, "Calculates ((4800 + 200) / 100000) * 100 = 5.0%");

  const er2 = calculateEngagementRate({
    avgLikes: null,
    followersCount: 100000,
  });
  assert(er2 === null, "Returns null (unknown) when avgLikes is missing, never invents 0");

  // 6. Search Validation Schemas (Zod)
  console.log("\n--- Testing Search Validation Schemas ---");
  const validSearch = CreatorSearchQuerySchema.safeParse({
    minFollowers: 10000,
    maxFollowers: 50000,
    gender: "female",
    city: "Mumbai",
    niches: ["Fashion"],
    minEngagementRate: 3,
  });
  assert(validSearch.success, "Accepts valid search payload");

  const invalidFollowers = CreatorSearchQuerySchema.safeParse({
    minFollowers: 50000,
    maxFollowers: 10000, // min > max
  });
  assert(!invalidFollowers.success, "Rejects minFollowers > maxFollowers");

  const negativeFollowers = CreatorSearchQuerySchema.safeParse({
    minFollowers: -500,
  });
  assert(!negativeFollowers.success, "Rejects negative followers");

  // 7. Filter & Search Query Matrix Tests
  console.log("\n--- Testing Multi-Combination Search Queries ---");
  
  // Test A: Female + Fashion + Mumbai + 10K-200K + 3%+ ER
  const resultsA = filterAndSortCreators(MOCK_INSTAGRAM_CREATORS, {
    ...DEFAULT_FILTERS,
    query: "",
    minFollowers: 10000,
    maxFollowers: 200000,
    country: "India",
    state: "",
    city: "Mumbai",
    niches: ["Fashion"],
    gender: "female",
    minEngagementRate: 3,
    sort: "relevance",
    viewMode: "grid",
  });
  assert(
    resultsA.length > 0 &&
      resultsA.every(
        (c) =>
          c.creatorGender === "female" &&
          c.city === "Mumbai" &&
          c.niches.includes("Fashion") &&
          (c.followersCount ?? 0) >= 10000 &&
          (c.followersCount ?? 0) <= 200000 &&
          (c.engagementRate ?? 0) >= 3
      ),
    "Filters exact combination: Female + Fashion + Mumbai + 10K-200K + 3%+"
  );

  // Test B: Male + Gaming + Ahmedabad + 500K-1M
  const resultsB = filterAndSortCreators(MOCK_INSTAGRAM_CREATORS, {
    ...DEFAULT_FILTERS,
    query: "",
    minFollowers: 500000,
    maxFollowers: 1000000,
    country: "India",
    state: "",
    city: "Ahmedabad",
    niches: ["Gaming"],
    gender: "male",
    minEngagementRate: 0,
    sort: "relevance",
    viewMode: "grid",
  });
  assert(
    resultsB.length > 0 && resultsB[0]?.instagramUsername === "vikram_gaming",
    "Filters exact combination: Male + Gaming + Ahmedabad + 500K-1M"
  );

  // Test C: Arbitrary Range 10K-15K
  const resultsC = filterAndSortCreators(MOCK_INSTAGRAM_CREATORS, {
    ...DEFAULT_FILTERS,
    query: "",
    minFollowers: 10000,
    maxFollowers: 15000,
    country: "India",
    state: "",
    city: "",
    niches: [],
    gender: null,
    minEngagementRate: 0,
    sort: "relevance",
    viewMode: "grid",
  });
  assert(
    resultsC.every((c) => (c.followersCount ?? 0) >= 10000 && (c.followersCount ?? 0) <= 15000),
    "Supports arbitrary custom range 10,000 to 15,000"
  );

  // Test D: Sorting Followers Descending
  const sortedDesc = filterAndSortCreators(MOCK_INSTAGRAM_CREATORS, {
    ...DEFAULT_FILTERS,
    query: "",
    minFollowers: 10000,
    maxFollowers: 10000000,
    country: "India",
    state: "",
    city: "",
    niches: [],
    gender: null,
    minEngagementRate: 0,
    sort: "followers_desc",
    viewMode: "grid",
  });
  assert(
    (sortedDesc[0]?.followersCount ?? 0) >= (sortedDesc[1]?.followersCount ?? 0) &&
      (sortedDesc[1]?.followersCount ?? 0) >= (sortedDesc[2]?.followersCount ?? 0),
    "Correctly sorts by Followers: High to Low"
  );

  // Test E: Sorting Engagement Descending
  const sortedEng = filterAndSortCreators(MOCK_INSTAGRAM_CREATORS, {
    ...DEFAULT_FILTERS,
    query: "",
    minFollowers: 10000,
    maxFollowers: 10000000,
    country: "India",
    state: "",
    city: "",
    niches: [],
    gender: null,
    minEngagementRate: 0,
    sort: "engagement_desc",
    viewMode: "grid",
  });
  assert(
    (sortedEng[0]?.engagementRate ?? 0) >= (sortedEng[1]?.engagementRate ?? 0),
    "Correctly sorts by Engagement: High to Low"
  );

  // 8. Cache Key Determinism
  console.log("\n--- Testing Cache Key Determinism ---");
  const key1 = CreatorSearchService.generateSearchCacheKey({
    ...DEFAULT_CREATOR_SEARCH_FILTERS,
    minFollowers: 10000,
    maxFollowers: 50000,
    niches: ["Fashion", "Beauty"],
    gender: "female",
    city: "Mumbai",
  });
  const key2 = CreatorSearchService.generateSearchCacheKey({
    ...DEFAULT_CREATOR_SEARCH_FILTERS,
    minFollowers: 10000,
    maxFollowers: 50000,
    niches: ["Beauty", "Fashion"], // reverse order
    gender: "female",
    city: "Mumbai",
  });
  assert(key1 === key2, "Generates identical deterministic cache keys regardless of niche array order");

  // 9. Provider Search Execution
  console.log("\n--- Testing Dev Provider Adapter ---");
  const provider = new DevMockCreatorProvider();
  const providerSearch = await provider.searchCreators({
    ...DEFAULT_CREATOR_SEARCH_FILTERS,
    minFollowers: 50000,
    maxFollowers: 500000,
    gender: "female",
  });
  assert(providerSearch.creators.length > 0, "Provider returns normalized raw creator candidates");

  const singleCreator = await provider.getCreator("@tarinipeshawaria");
  assert(
    singleCreator !== null && singleCreator.rawUsername === "tarinipeshawaria",
    "Provider retrieves specific creator by normalized handle"
  );

  console.log(`\n========================================`);
  console.log(`TOTAL TESTS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log(`STATUS: ${failed === 0 ? "ALL TESTS PASSED ✓" : "SOME TESTS FAILED ✗"}`);
  console.log(`========================================\n`);

  return failed === 0;
}

runTests().then((success) => {
  if (!success) {
    process.exit(1);
  }
});
