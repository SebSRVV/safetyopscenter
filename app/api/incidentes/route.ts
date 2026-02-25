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
    const limite = searchParams.get("limite");

    let query = supabase
      .from("reportes_incidentes")
      .select(`
        *,
        minas!inner(nombre, codigo, empresa),
        lugar_de_los_dispositivos!inner(nombre),
        flota_minera!inner(nombre, placa_o_credencial),
        trabajadores!inner(nombre_completo),
        usuarios_aplicacion!inner(nombre, email)
      `)
      .order("fecha_hora_incidente", { ascending: false });

    if (tipo) query = query.eq("tipo_incidente", tipo);
    if (severidad) query = query.eq("severidad", severidad);
    if (estado) query = query.eq("estado_investigacion", estado);
    if (minaId) query = query.eq("id_mina", parseInt(minaId));
    if (fechaInicio) query = query.gte("fecha_hora_incidente", fechaInicio);
    if (fechaFin) query = query.lte("fecha_hora_incidente", fechaFin);
    if (limite) query = query.limit(parseInt(limite));

    const { data, error } = await query;

    if (error) {
      console.error("Error en API de incidentes:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en API de incidentes:", error);
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

    // Crear nuevo incidente
    const { data, error } = await supabase.from("reportes_incidentes").insert({
      id_mina: body.id_mina,
      id_lugar: body.id_lugar || null,
      id_flota: body.id_flota || null,
      id_trabajador_afectado: body.id_trabajador_afectado || null,
      id_reportante: body.id_reportante,
      tipo_incidente: body.tipo_incidente,
      severidad: body.severidad,
      descripcion_detallada: body.descripcion_detallada,
      fecha_hora_incidente: body.fecha_hora_incidente || new Date().toISOString(),
      acciones_inmediatas: body.acciones_inmediatas || null,
      testigos_presentes: body.testigos_presentes || null,
      danos_materiales: body.danos_materiales || null,
      tiempo_parada_horas: body.tiempo_parada_horas || null,
      estado_investigacion: body.estado_investigacion || "abierto",
      medidas_correctivas: body.medidas_correctivas || null,
    }).select(`
      *,
      minas!inner(nombre, codigo),
      lugar_de_los_dispositivos!inner(nombre),
      flota_minera!inner(nombre, placa_o_credencial),
      trabajadores!inner(nombre_completo),
      usuarios_aplicacion!inner(nombre, email)
    `)
    .single();

    if (error) {
      console.error("Error creando incidente:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error en API de incidentes POST:", error);
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

    if (body.action === "cerrar") {
      // Cerrar incidente
      const { data, error } = await supabase
        .from("reportes_incidentes")
        .update({ 
          estado_investigacion: "cerrado",
          fecha_cierre: new Date().toISOString(),
          medidas_correctivas: body.medidas_correctivas || null
        })
        .eq("id_reporte", id)
        .select(`
          *,
          minas!inner(nombre, codigo),
          lugar_de_los_dispositivos!inner(nombre),
          flota_minera!inner(nombre, placa_o_credencial),
          trabajadores!inner(nombre_completo),
          usuarios_aplicacion!inner(nombre, email)
        `)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }

    if (body.action === "en_investigacion") {
      // Cambiar estado a en investigación
      const { data, error } = await supabase
        .from("reportes_incidentes")
        .update({ 
          estado_investigacion: "en_investigacion"
        })
        .eq("id_reporte", id)
        .select(`
          *,
          minas!inner(nombre, codigo),
          lugar_de_los_dispositivos!inner(nombre),
          flota_minera!inner(nombre, placa_o_credencial),
          trabajadores!inner(nombre_completo),
          usuarios_aplicacion!inner(nombre, email)
        `)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }

    // Actualización genérica
    const { data, error } = await supabase
      .from("reportes_incidentes")
      .update({
        tipo_incidente: body.tipo_incidente,
        severidad: body.severidad,
        descripcion_detallada: body.descripcion_detallada,
        acciones_inmediatas: body.acciones_inmediatas,
        danos_materiales: body.danos_materiales,
        tiempo_parada_horas: body.tiempo_parada_horas,
        estado_investigacion: body.estado_investigacion,
        medidas_correctivas: body.medidas_correctivas,
      })
      .eq("id_reporte", id)
      .select(`
        *,
        minas!inner(nombre, codigo),
        lugar_de_los_dispositivos!inner(nombre),
        flota_minera!inner(nombre, placa_o_credencial),
        trabajadores!inner(nombre_completo),
        usuarios_aplicacion!inner(nombre, email)
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en API de incidentes PATCH:", error);
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
      .from("reportes_incidentes")
      .delete()
      .eq("id_reporte", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en API de incidentes DELETE:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
