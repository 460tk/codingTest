export default async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (url.pathname.startsWith("/api")) {
    url.pathname = url.pathname.replace("/api", "");

    const targetUrl = new URL(url.pathname + url.search, env.VITE_API_URL);

    const newRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers),
        "X-API-KEY": env.VITE_XAPI_KEY,
      },
      body: request.body,
      redirect: "follow",
    });

    return fetch(newRequest);
  }

  return new Response("Not found", { status: 404 });
}
