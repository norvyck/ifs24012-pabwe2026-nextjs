import { DELCOM_BASEURL } from "@/lib/config";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  if (!/^\d+$/.test(postId)) {
    return Response.json(
      { status: "fail", message: "ID postingan tidak valid." },
      { status: 400 }
    );
  }

  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return Response.json(
      { status: "fail", message: "Silakan masuk kembali sebelum mengunggah gambar." },
      { status: 401 }
    );
  }

  let incomingForm: FormData;
  try {
    incomingForm = await request.formData();
  } catch {
    return Response.json(
      { status: "fail", message: "Data gambar tidak dapat dibaca." },
      { status: 400 }
    );
  }

  const cover = incomingForm.get("cover");
  if (!cover || typeof cover === "string") {
    return Response.json(
      { status: "fail", message: "Pilih gambar cover sebelum mengunggah." },
      { status: 400 }
    );
  }

  const formData = new FormData();
  formData.append("cover", cover, cover.name);

  try {
    const upstream = await fetch(
      `${DELCOM_BASEURL.replace(/\/$/, "")}/posts/${postId}/cover`,
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
    console.error("Cover upload request to Delcom API failed:", error);
    return Response.json(
      { status: "error", message: "Tidak dapat terhubung ke layanan upload cover." },
      { status: 502 }
    );
  }
}
