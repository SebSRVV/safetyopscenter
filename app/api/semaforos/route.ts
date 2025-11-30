import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { searchParams } = new URL(request.url);
    const minaId = searchParams.get("mina_id");

    const { data, error } = await supabase.rpc("rpc_listar_semaforos", {
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

    const { data, error } = await supabase.rpc("rpc_crear_semaforo", {
      p_codigo: body.codigo,
      p_nombre: body.nombre,
      p_lugar_id: body.lugar_id,
      p_mina_id: body.mina_id,
      p_latitud: body.latitud,
      p_longitud: body.longitud,
      p_estado_actual: body.estado_actual || "verde",
      p_modo: body.modo || "automatico",
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
