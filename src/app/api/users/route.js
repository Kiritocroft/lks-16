import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, email, password, name } = body;

    if (!action) {
      return NextResponse.json({ error: "Action is required (register/login)" }, { status: 400 });
    }

    if (action === "register") {
      if (!name || !email || !password) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      const newUser = await prisma.user.create({
        data: { name, email, password },
      });

      return NextResponse.json(newUser, { status: 201 });
    } else if (action === "login") {
      if (!email || !password) {
        return NextResponse.json({ error: "Email dan password harus diisi" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || user.password !== password) {
        return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
      }

      return NextResponse.json({ message: "Login berhasil", user }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const deletedUser = await prisma.user.delete({ where: { id: parseInt(id) } });
    return NextResponse.json(deletedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user", details: error.message }, { status: 500 });
  }
}
