const endpoint = "http://localhost:9222";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate, label, timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      if (await predicate()) return;
    } catch {
      // Navigation may briefly destroy the current execution context.
    }
    await sleep(100);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

await waitFor(async () => {
  try {
    return (await fetch(`${endpoint}/json/list`)).ok;
  } catch {
    return false;
  }
}, "Edge debugging endpoint");

const pages = await (await fetch(`${endpoint}/json/list`)).json();
const page = pages.find(
  (item) => item.type === "page" && item.url.startsWith("http://localhost:3000/")
);
if (!page) throw new Error("No browser page was available");

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (!message.id) return;
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id);
  if (message.error) request.reject(new Error(message.error.message));
  else request.resolve(message.result);
});

function command(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await command("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Browser evaluation failed");
  }
  return result.result.value;
}

const requestCount = () =>
  evaluate(
    `performance.getEntriesByType('resource').filter((entry) => entry.name.includes('/api/creators/search')).length`
  );
const bodyText = () => evaluate("document.body.innerText");
const currentUrl = () => evaluate("location.href");
const navigate = (query) =>
  evaluate(
    `history.pushState(null, '', '/platform/discover${query ? `?${query}` : ""}')`
  );

await command("Runtime.enable");
await command("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 1000,
  deviceScaleFactor: 1,
  mobile: false,
});
await command("Page.reload", { ignoreCache: true });
await waitFor(
  async () => (await bodyText()).includes("Arjun Fit (Dev)"),
  "the exact URL results"
);
const initialRequests = await requestCount();

await navigate("state=Maharashtra&city=Nagpur&niches=Fitness&gender=female");
await waitFor(async () => (await currentUrl()).includes("gender=female"), "female URL");
await sleep(150);
await navigate("state=Maharashtra&city=Nagpur&niches=Fitness&gender=male");
await waitFor(async () => (await currentUrl()).includes("gender=male"), "male URL");
await waitFor(
  async () => (await bodyText()).includes("Showing 3 creators"),
  "latest male results"
);
const rapidGenderRequests = (await requestCount()) - initialRequests;

await navigate("state=Maharashtra&city=Nagpur&niches=Gaming&gender=male");
await waitFor(async () => (await currentUrl()).includes("niches=Gaming"), "gaming URL");
await waitFor(
  async () => (await bodyText()).includes("Sameer Kulkarni"),
  "latest gaming results"
);

const beforeFollower = await requestCount();
await navigate("state=Maharashtra&city=Nagpur&niches=Gaming&gender=male&minFollowers=50000&maxFollowers=100000");
await waitFor(async () => (await currentUrl()).includes("minFollowers=50000"), "follower URL");
await waitFor(
  async () => !(await bodyText()).includes("Searching creators..."),
  "follower search settlement"
);
const followerRequests = (await requestCount()) - beforeFollower;

await navigate("");
await waitFor(async () => new URL(await currentUrl()).search === "", "clean reset URL");
await waitFor(
  async () => (await bodyText()).includes("Showing 30 creators"),
  "default reset results"
);

console.log(
  JSON.stringify(
    {
      exactUrlSettled: true,
      finalRapidGender: "male",
      rapidGenderRequests,
      finalNiche: "Gaming",
      followerRequests,
      resetUrl: await currentUrl(),
      resetSettled: true,
    },
    null,
    2
  )
);
socket.close();
