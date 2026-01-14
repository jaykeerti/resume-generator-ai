import { performance } from 'node:perf_hooks';

async function check(url) {
    console.log(`\nTesting: ${url}`);
    const start = performance.now();
    try {
        const res = await fetch(url);
        await res.text();
        console.log("Status:", res.status);
    } catch (err) {
        console.log("Error:", err.message);
    }
    const end = performance.now();
    console.log(`Time: ${(end - start).toFixed(2)} ms`);
}

async function run() {
    await check("https://example.com");
    await check("https://cdbfksuhdnmzwgxjefwq.supabase.co/auth/v1/health");
    await check("https://ofpryzjdhgqqtkegpcjl.supabase.co/auth/v1/health");
}

run();
