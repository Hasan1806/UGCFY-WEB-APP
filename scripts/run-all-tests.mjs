// Comprehensive test suite for Creator Search API
async function runTests() {
  const baseUrl = "http://localhost:3000/api/creators/search";

  const testCases = [
    { name: "1. No filters", payload: {} },
    { name: "2. India", payload: { country: "India" } },
    { name: "3. Maharashtra", payload: { state: "Maharashtra" } },
    { name: "4. Maharashtra + Nagpur", payload: { state: "Maharashtra", city: "Nagpur" } },
    { name: "5. Maharashtra + Mumbai", payload: { state: "Maharashtra", city: "Mumbai" } },
    { name: "6. Nagpur + 10K-50K", payload: { city: "Nagpur", minFollowers: 10000, maxFollowers: 50000 } },
    { name: "7. Nagpur + Female", payload: { city: "Nagpur", gender: "female" } },
    { name: "8. Nagpur + Fashion", payload: { city: "Nagpur", niches: ["Fashion"] } },
    { name: "9. Nagpur + Female + Fashion", payload: { city: "Nagpur", gender: "female", niches: ["Fashion"] } },
    { name: "10. Nagpur + Female + Fashion + 10K-50K", payload: { city: "Nagpur", gender: "female", niches: ["Fashion"], minFollowers: 10000, maxFollowers: 50000 } },
    { name: "11. Nagpur + Female + Fashion + 10K-50K + 3%+", payload: { city: "Nagpur", gender: "female", niches: ["Fashion"], minFollowers: 10000, maxFollowers: 50000, minEngagementRate: 3.0 } },
    { name: "12. 150K-200K followers", payload: { minFollowers: 150000, maxFollowers: 200000 } },
    { name: "13. Male", payload: { gender: "male" } },
    { name: "14. Female", payload: { gender: "female" } },
    { name: "15. Fashion", payload: { niches: ["Fashion"] } },
    { name: "16. Gaming", payload: { niches: ["Gaming"] } },
    { name: "17. Beauty", payload: { niches: ["Beauty"] } },
    { name: "18. 3%+", payload: { minEngagementRate: 3 } },
    { name: "19. 5%+", payload: { minEngagementRate: 5 } },
    { name: "20. Search by name 'Priya'", payload: { query: "Priya" } },
    { name: "21. Search by handle '@priya_nagpur_style'", payload: { query: "@priya_nagpur_style" } },
    { name: "22. Sort followers high-low", payload: { sort: "followers_desc" } },
    { name: "23. Sort followers low-high", payload: { sort: "followers_asc" } },
    { name: "24. Sort engagement", payload: { sort: "engagement_desc" } },
    { name: "25. EXACT BUG URL: Maharashtra + Nagpur + Fitness + Male", payload: { country: "India", state: "Maharashtra", city: "Nagpur", niches: ["Fitness"], gender: "male", minFollowers: 10000, maxFollowers: null } },
  ];

  console.log(`Starting execution of ${testCases.length} test cases against ${baseUrl}...\n`);
  let passed = 0;

  for (const tc of testCases) {
    try {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tc.payload),
      });

      if (!res.ok) {
        console.error(`❌ [FAIL] ${tc.name} - HTTP ${res.status}`);
        continue;
      }

      const json = await res.json();
      if (!json.success || !json.pagination) {
        console.error(`❌ [FAIL] ${tc.name} - Invalid response shape:`, json);
        continue;
      }

      console.log(`✅ [PASS] ${tc.name} -> Total matching: ${json.pagination.total}, Returned in page: ${json.creators.length}`);
      if (tc.name.includes("Nagpur") && json.pagination.total > 0) {
        console.log(`   Sample Nagpur creator: ${json.creators[0].displayName} (@${json.creators[0].instagramUsername}) - ${json.creators[0].city}, ${json.creators[0].state} | ${json.creators[0].followersCount.toLocaleString()} followers`);
      }
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${tc.name} - Exception:`, err.message);
    }
  }

  console.log(`\nResults: ${passed}/${testCases.length} test cases passed.`);
}

runTests();
