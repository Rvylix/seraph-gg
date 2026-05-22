export const dynamic = "force-dynamic";

interface Props { 
  params: any;
  searchParams: any;
}

export default async function UnitProfilePage(props: Props) {
  const params = await props.params;
  const id = params?.id ?? "NO_ID";

  return (
    <div style={{ padding: 48, color: "white", fontFamily: "monospace" }}>
      <a href="/units" style={{ color: "#666", fontSize: 12 }}>← Back</a>
      <p style={{ marginTop: 24 }}>Raw props: {JSON.stringify(params)}</p>
      <p>ID extracted: {id}</p>
    </div>
  );
}
