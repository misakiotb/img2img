import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { fetchImageByImage, SIZE_PORTRAIT } from "./fetchImageByImage.js";

const loadFile = async (fn) => {
  if (fn.startsWith("http://") || fn.startsWith("https://")) {
    return await (await fetch(fn)).arrayBuffer();
  }
  return await Deno.readFile(fn);
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Uint8Array → base64変換（大きなバイナリも安全に変換）
function uint8ToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}


serve(async (req) => {
  // CORSプリフライトリクエスト対応
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  console.log(req);
  if (req.method === "POST" && new URL(req.url).pathname === "/api/convert") {
    try {
      const { prompt, imagePath } = await req.json();
      if (!prompt || !imagePath) {
        return new Response(
          JSON.stringify({ error: 'prompt と imagePath を指定してください' }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      const src = await loadFile(imagePath);
      const bin = await fetchImageByImage(prompt, src, { size: SIZE_PORTRAIT });
      // base64エンコードして返す
      const b64 = uint8ToBase64(new Uint8Array(bin));
      return new Response(
        JSON.stringify({ data: [{ b64_json: b64 }] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (e) {
      console.error("APIサーバエラー: " + e);
      return new Response(
        JSON.stringify({ error: e.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }
  return new Response("Not Found", { status: 404, headers: corsHeaders });
}, { port: 5000 });
