import { DELCOM_BASEURL } from "@/lib/config";

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return Response.json(
      { status: "fail", message: "Silakan masuk kembali sebelum mengunggah foto." },
      { status: 401 }
    );
  }

  let incomingForm: FormData;
  try {
    incomingForm = await request.formData();
  } catch {
    return Response.json(
      { status: "fail", message: "Data foto tidak dapat dibaca." },
      { status: 400 }
    );
  }

  const photo = incomingForm.get("photo");
  if (!photo || typeof photo === "string") {
    return Response.json(
      { status: "fail", message: "Pilih foto profil sebelum mengunggah." },
      { status: 400 }
    );
  }

  const formData = new FormData();
  formData.append("photo", photo, photo.name);

  try {
    const upstream = await fetch(
      `${DELCOM_BASEURL.replace(/\/$/, "")}/users/me/photo`,
      {
        method: "POST",
        headers: { Authorization: authorization },
        body: formData,
        cache: "no-store",
      }
    );
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error("Photo upload request to Delcom API failed:", error);
    return Response.json(
      { status: "error", message: "Tidak dapat terhubung ke layanan upload foto." },
      { status: 502 }
    );
  }
}
