export const dynamic = "force-dynamic";

type Props = { params: any };

export default async function Page(props: Props) {
  const params = await props.params;
  const id = params?.id ?? "empty";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "NO_URL";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "NO_KEY";

  return (
    <div style={{ padding: 48, color: "white", fontFamily: "monospace" }}>
      <a href="/units">← Back</a>
      <p style={{ marginTop: 24 }}>ID: {id}</p>
      <p>URL: {url}</p>
      <p>Key: {key.slice(0, 20)}</p>
    </div>
  );
}