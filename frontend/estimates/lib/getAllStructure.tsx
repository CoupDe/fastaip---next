export async function getAllStructures() {
  const res = await fetch("http://127.0.0.1:8000/api/v1/projects/", {
    next: { revalidate: 60 },
  });
  console.log("revalidate");
  if (!res.ok) {
    throw new Error("Failed fetch data");
  }
  return res.json();
}
