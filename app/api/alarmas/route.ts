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
    const limite = searchParams.get("limite");

    // Usar la función RPC básica que creamos
    const { data, error } = await supabase.rpc("rpc_listar_eventos_recientes", {
      p_limite: limite ? parseInt(limite) : 50,
      p_id_mina: minaId ? parseInt(minaId) : null,
    });

    if (error) {
      console.error("Error en API de alarmas:", error);
      // Fallback a consulta directa si RPC falla
      let query = supabase
        .from("eventos_alarmas")
        .select(`
          *,
          minas!inner(nombre, codigo),
          flota_minera!inner(nombre, placa_o_credencial),
          lugar_de_los_dispositivos!inner(nombre),
          trabajadores!inner(nombre_completo)
        `)
        .order("creado_en", { ascending: false });

      if (tipo) query = query.eq("tipo_evento", tipo);
      if (severidad) query = query.eq("severidad", parseInt(severidad));
      if (estado) query = query.eq("estado", estado);
      if (limite) query = query.limit(parseInt(limite));

      const { data: fallbackData, error: fallbackError } = await query;

      if (fallbackError) {
        return NextResponse.json({ error: fallbackError.message }, { status: 500 });
      }

      return NextResponse.json(fallbackData);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en API de alarmas:", error);
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

    // Crear nueva alarma/evento
    const { data, error } = await supabase.from("eventos_alarmas").insert({
      tipo_evento: body.tipo_evento,
      categoria: body.categoria,
      descripcion: body.descripcion,
      severidad: body.severidad,
      id_dispositivo: body.id_dispositivo || null,
      id_flota: body.id_flota || null,
      id_lugar: body.id_lugar || null,
      id_trabajador: body.id_trabajador || null,
      latitud: body.latitud || null,
      longitud: body.longitud || null,
      altitud_metros: body.altitud_metros || null,
      datos_adicionales: body.datos_adicionales || null,
      estado: body.estado || "activo",
    }).select().single();

    if (error) {
      console.error("Error creando alarma:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en API de alarmas POST:", error);
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
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 });
    }

    if (body.action === "reconocer") {
      // Cambiar estado a 'revisado'
      const { data, error } = await supabase
        .from("eventos_alarmas")
        .update({ 
          estado: "revisado",
          fecha_resolucion: new Date().toISOString(),
          resuelto_por: body.resuelto_por || null
        })
        .eq("id_evento", id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }

    if (body.action === "resolver") {
      // Cambiar estado a 'resuelto'
      const { data, error } = await supabase
        .from("eventos_alarmas")
        .update({ 
          estado: "resuelto",
          fecha_resolucion: new Date().toISOString(),
          resuelto_por: body.resuelto_por || null,
          observaciones_resolucion: body.observaciones_resolucion || null
        })
        .eq("id_evento", id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }

    if (body.action === "falso_positivo") {
      // Cambiar estado a 'falso_positivo'
      const { data, error } = await supabase
        .from("eventos_alarmas")
        .update({ 
          estado: "falso_positivo",
          fecha_resolucion: new Date().toISOString(),
          resuelto_por: body.resuelto_por || null,
          observaciones_resolucion: body.observaciones_resolucion || null
        })
        .eq("id_evento", id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }

    // Actualización genérica
    const { data, error } = await supabase
      .from("eventos_alarmas")
      .update({
        tipo_evento: body.tipo_evento,
        categoria: body.categoria,
        descripcion: body.descripcion,
        severidad: body.severidad,
        estado: body.estado,
        observaciones_resolucion: body.observaciones_resolucion,
      })
      .eq("id_evento", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en API de alarmas PATCH:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 });
    }

    const { error } = await supabase
      .from("eventos_alarmas")
      .delete()
      .eq("id_evento", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en API de alarmas DELETE:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
