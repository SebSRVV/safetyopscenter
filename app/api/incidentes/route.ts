import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo");
    const severidad = searchParams.get("severidad");
    const estado = searchParams.get("estado");
    const minaId = searchParams.get("mina_id");
    const fechaInicio = searchParams.get("fecha_inicio");
    const fechaFin = searchParams.get("fecha_fin");

    const { data, error } = await supabase.rpc("rpc_listar_incidentes", {
      p_tipo: tipo || undefined,
      p_severidad: severidad || undefined,
      p_estado: estado || undefined,
      p_mina_id: minaId || undefined,
      p_fecha_inicio: fechaInicio || undefined,
      p_fecha_fin: fechaFin || undefined,
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

    const { data, error } = await supabase.rpc("rpc_crear_incidente", {
      p_tipo: body.tipo,
      p_severidad: body.severidad,
      p_titulo: body.titulo,
      p_descripcion: body.descripcion,
      p_fecha_hora: body.fecha_hora || new Date().toISOString(),
      p_unidad_id: body.unidad_id,
      p_lugar_id: body.lugar_id,
      p_mina_id: body.mina_id,
      p_trabajador_id: body.trabajador_id,
      p_latitud: body.latitud,
      p_longitud: body.longitud,
      p_danos: body.danos,
      p_causa_probable: body.causa_probable,
      p_acciones_correctivas: body.acciones_correctivas,
      p_estado: body.estado || "reportado",
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
