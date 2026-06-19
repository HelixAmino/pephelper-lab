import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Filename, X-Content-Type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST required" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const filename = req.headers.get("X-Filename");
  const contentType = req.headers.get("X-Content-Type") ?? "application/octet-stream";
  if (!filename) {
    return new Response(JSON.stringify({ error: "X-Filename header required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const bytes = new Uint8Array(await req.arrayBuffer());

  const { error } = await supabase.storage
    .from("product-images")
    .upload(filename, bytes, { contentType, upsert: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data } = supabase.storage.from("product-images").getPublicUrl(filename);
  return new Response(JSON.stringify({ filename, url: data.publicUrl }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
