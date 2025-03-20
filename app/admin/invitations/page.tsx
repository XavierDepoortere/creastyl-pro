"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Mail, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const invitationSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.enum(["USER", "ADMIN"], {
    required_error: "Please select a role",
  }),
});

type InvitationFormValues = z.infer<typeof invitationSchema>;

export default function InvitationsPage() {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(false);

  const form = useForm<InvitationFormValues>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      email: "",
      role: "USER",
    },
  });

  async function onSubmit(data: InvitationFormValues) {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          role: data.role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to send invitation");
        return;
      }

      setSuccess(true);
      form.reset();
      toast({
        title: "Invitation sent",
        description: `Invitation email sent to ${data.email}`,
      });

      // Refresh the invitations list
      fetchInvitations();
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchInvitations() {
    setIsLoadingInvitations(true);
    try {
      const response = await fetch("/api/invitations");
      if (!response.ok) {
        throw new Error("Failed to fetch invitations");
      }
      const data = await response.json();
      setInvitations(data);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      toast({
        title: "Error",
        description: "Failed to load invitations",
      });
    } finally {
      setIsLoadingInvitations(false);
    }
  }

  // Load invitations on component mount
  useEffect(() => {
    fetchInvitations();
  }, []);

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invitations</h1>
          <p className="text-muted-foreground mt-2">
            Inviter de nouveaux utilisateurs à rejoindre le système
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchInvitations}
          disabled={isLoadingInvitations}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${
              isLoadingInvitations ? "animate-spin" : ""
            }`}
          />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Envoyer une invitation</CardTitle>
            <CardDescription>
              Envoyer une invitation par e-mail à un nouvel utilisateur
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  Invitation envoyée avec succès !
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Envoi..." : "Envoyer l'invitation"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invitations récentes</CardTitle>
            <CardDescription>
              Afficher les invitations récemment envoyées
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingInvitations ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : invitations.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Mail className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2">Aucune invitation envoyée pour l'instant</p>
              </div>
            ) : (
              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{invitation.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Role: {invitation.role}
                        </p>
                      </div>
                      <div
                        className={`px-2 py-1 text-xs rounded-full ${
                          invitation.used
                            ? "bg-green-100 text-green-800"
                            : invitation.expires < new Date().toISOString()
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {invitation.used
                          ? "Used"
                          : invitation.expires < new Date().toISOString()
                            ? "Expired"
                            : "Pending"}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p>
                        Envoyé par:{" "}
                        {invitation.sender.name || invitation.sender.email}
                      </p>
                      <p>
                        Envoyé le:{" "}
                        {new Date(invitation.createdAt).toLocaleString()}
                      </p>
                      <p>
                        Expire: {new Date(invitation.expires).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
