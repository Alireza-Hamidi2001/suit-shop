// app/api/admin/upload/route.js
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request) {
    try {
        const user = await getCurrentUser();
        if (user?.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 },
            );
        }

        const formData = await request.formData();
        const file = formData.get("image");

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 },
            );
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "Only image files are allowed" },
                { status: 400 },
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext = path.extname(file.name);
        const filename = `suit-${Date.now()}${ext}`;
        const uploadDir = path.join(process.cwd(), "public/uploads/suits");
        const filepath = path.join(uploadDir, filename);

        await mkdir(uploadDir, { recursive: true });
        await writeFile(filepath, buffer);

        const imageUrl = `/uploads/suits/${filename}`;

        return NextResponse.json({
            success: true,
            imageUrl,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
