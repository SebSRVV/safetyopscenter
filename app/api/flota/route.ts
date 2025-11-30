import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { searchParams } = new URL(request.url);
    const minaId = searchParams.get("mina_id");

    const { data, error } = await supabase.rpc("rpc_listar_flota", {
      p_mina_id: minaId || undefined,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const body = await request.json();

    const { data, error } = await supabase.rpc("rpc_crear_unidad", {
      p_codigo: body.codigo,
      p_tipo: body.tipo,
      p_marca: body.marca,
      p_modelo: body.modelo,
      p_anio: body.anio,
      p_mina_id: body.mina_id,
      p_estado: body.estado || "activo",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
