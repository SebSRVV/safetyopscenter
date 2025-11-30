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

    const { data, error } = await supabase.rpc("rpc_listar_alarmas", {
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

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const body = await request.json();

    if (body.action === "reconocer") {
      const { data, error } = await supabase.rpc("rpc_reconocer_alarma", {
        p_id: body.id,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }

    if (body.action === "resolver") {
      const { data, error } = await supabase.rpc("rpc_resolver_alarma", {
        p_id: body.id,
        p_notas: body.notas,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: "Acción no válida" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
