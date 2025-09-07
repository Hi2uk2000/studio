
// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Home, User, Mail, Key, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

const formSchema = z.object({
  fullName: z.string().min(3, 'Full name is required.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  role: z.enum(['homeowner', 'landlord', 'tenant'], {
    required_error: 'You need to select a role.',
  }),
});

type RegistrationFormValues = z.infer<typeof formSchema>;

export default function RegistrationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signUpWithEmailAndPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: RegistrationFormValues) {
    setIsLoading(true);
    try {
      await signUpWithEmailAndPassword(data.email, data.password, data.fullName);
      
      toast({
        title: 'Account Created!',
        description: "We've created your account for you.",
      });

      // The AuthProvider's onAuthStateChanged will handle the redirect
      // to the correct page based on the user's role. We can just push
      // them to the dashboard and let the logic sort it out.
      if (data.role === 'homeowner') {
        router.push('/register/home-setup');
      } else {
        router.push('/');
      }

    } catch (error: any) {
      console.error('Registration failed:', error);
       toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.code === 'auth/email-already-in-use' 
            ? 'This email is already registered. Please log in.'
            : (error.message || 'An unexpected error occurred. Please try again.'),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Home className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">AssetStream</h1>
          </div>
          <CardTitle className="text-2xl">Create your AssetStream account</CardTitle>
          <CardDescription>Join us to start managing your property with ease.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input {...form.register('fullName')} id="fullName" placeholder="John Doe" className="pl-10" />
                </div>
                {form.formState.errors.fullName && <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input {...form.register('email')} id="email" type="email" placeholder="you@example.com" className="pl-10" />
                </div>
                 {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Create Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input {...form.register('password')} id="password" type="password" placeholder="••••••••" className="pl-10" />
                </div>
                 {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
              </div>
            </div>

            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <div className="space-y-3">
                  <Label>I am a...</Label>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <Label className="cursor-pointer flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                      <RadioGroupItem value="homeowner" id="homeowner" className="sr-only" />
                      <span>Homeowner</span>
                    </Label>
                    <Label className="cursor-pointer flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                      <RadioGroupItem value="landlord" id="landlord" className="sr-only" />
                       <span>Landlord</span>
                    </Label>
                     <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 cursor-not-allowed opacity-50">
                      <RadioGroupItem value="tenant" id="tenant" className="sr-only" disabled/>
                      <span>Tenant</span>
                      <span className="text-xs text-muted-foreground mt-1">(By invitation only)</span>
                    </Label>
                  </RadioGroup>
                  {form.formState.errors.role && <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>}
                </div>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin" />}
              CREATE ACCOUNT
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

    