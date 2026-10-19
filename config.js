// Public settings. The publishable key is safe to expose; database rules protect your data.
const SUPABASE_URL = "https://dyzbicavsmfoefomqdyt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8Rj1pXpzwlZhJqV6kNBGpw_g6EIrRDd";
const CATEGORIES = ["Paper I", "Paper II", "General"];
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt = d => new Date(d).toLocaleDateString("en-IN", {day:"numeric", month:"short", year:"numeric"});
