import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo");
    const estado = searchParams.get("estado");
    const minaId = searchParams.get("mina_id");

    const { data, error } = await supabase.rpc("rpc_listar_dispositivos", {
      p_tipo: tipo || undefined,
      p_estado: estado || undefined,
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

    const { data, error } = await supabase.rpc("rpc_crear_dispositivo", {
      p_codigo: body.codigo,
      p_tipo: body.tipo,
      p_marca: body.marca,
      p_modelo: body.modelo,
      p_numero_serie: body.numero_serie,
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
