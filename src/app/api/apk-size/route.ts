import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const APK_URLS = {
  arm64: "https://github.com/txeneza/txeneza-mobile/releases/download/latest/txeneza-arm64-v8a.apk",
  v7a: "https://github.com/txeneza/txeneza-mobile/releases/download/latest/txeneza-armeabi-v7a.apk",
  x86: "https://github.com/txeneza/txeneza-mobile/releases/download/latest/txeneza-x86_64.apk",
};

export async function GET() {
  const result: Record<string, string> = {
    arm64: "18.4 MB",
    v7a: "16.2 MB",
    x86: "20.1 MB",
  };

  try {
    // 1. Tentar verificar se existe APK local na pasta public/downloads
    const localApkPath = path.join(process.cwd(), "public", "downloads", "txeneza.apk");
    if (fs.existsSync(localApkPath)) {
      const stats = fs.statSync(localApkPath);
      if (stats.size > 1000) {
        const localMb = (stats.size / (1024 * 1024)).toFixed(1) + " MB";
        result.arm64 = localMb;
        result.v7a = localMb;
        result.x86 = localMb;
        return NextResponse.json(result);
      }
    }

    // 2. Tentar calcular o tamanho exato dos APKs remotos via HEAD request no servidor (sem CORS)
    await Promise.all(
      Object.entries(APK_URLS).map(async ([key, url]) => {
        try {
          const response = await fetch(url, {
            method: "HEAD",
            headers: { "User-Agent": "Txeneza-Server-Fetcher" },
            next: { revalidate: 3600 },
          });

          const contentLength = response.headers.get("content-length");
          if (contentLength) {
            const bytes = parseInt(contentLength, 10);
            if (!isNaN(bytes) && bytes > 0) {
              const mb = (bytes / (1024 * 1024)).toFixed(1) + " MB";
              result[key] = mb;
            }
          }
        } catch {
          // Mantém o valor pré-calculado se a requisição remota falhar
        }
      })
    );
  } catch (err) {
    console.warn("Erro ao calcular tamanho real dos APKs:", err);
  }

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
