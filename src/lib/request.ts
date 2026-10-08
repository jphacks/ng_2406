import "server-only";

// 他サイトのフォーム送信などからAPIを叩かれないよう、
// JSON で、かつ同一オリジンからのリクエストだけを受け付ける。
export function rejectForeignRequest(request: Request): Response | null {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return Response.json({ message: "不正なリクエスト" }, { status: 415 });
  }

  const origin = request.headers.get("origin");
  if (origin) {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    let originHost: string | null = null;
    try {
      originHost = new URL(origin).host;
    } catch {
      // 不正な Origin は拒否
    }
    if (!host || originHost !== host) {
      return Response.json({ message: "不正なリクエスト" }, { status: 403 });
    }
  }

  return null;
}
