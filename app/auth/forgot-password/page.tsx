"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, Loader2, CheckCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase/client";

const forgotSchema = z.object({
  email: z.string().email("Ingresa un correo electronico valido"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Ocurrio un error inesperado. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card border-border/50 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Correo Enviado</CardTitle>
            <CardDescription>
              Hemos enviado un enlace de recuperacion a tu correo electronico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-emerald-500/10 border-emerald-500/30">
              <Mail className="h-4 w-4 text-emerald-500" />
              <AlertDescription className="text-emerald-400">
                Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contrasena.
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground text-center">
              Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Link href="/auth/login" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio de sesion
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="mb-4">
        <Link href="/auth/login">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al login
          </Button>
        </Link>
      </div>

      <Card className="bg-card border-border/50 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Shield className="h-7 w-7 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Recuperar Contrasena</CardTitle>
          <CardDescription>
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contrasena
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electronico</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@poderosa.com.pe"
                {...register("email")}
                className={`bg-background border-border/50 focus:border-primary/50 ${errors.email ? "border-destructive" : ""}`}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar enlace de recuperacion
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            Recordaste tu contrasena?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Inicia sesion
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
