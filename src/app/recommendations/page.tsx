'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, List, UserCheck } from 'lucide-react';
import { recommendServiceProviders } from '@/ai/flows/recommend-service-providers';

const formSchema = z.object({
  location: z.string().min(3, 'Location is required.'),
  maintenanceNeeds: z.string().min(10, 'Please describe your needs in more detail.'),
});

type RecommendationFormValues = z.infer<typeof formSchema>;

export default function RecommendationsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { location: '', maintenanceNeeds: '' },
  });

  async function onSubmit(data: RecommendationFormValues) {
    setIsLoading(true);
    setRecommendations([]);
    try {
      const result = await recommendServiceProviders(data);
      setRecommendations(result.serviceProviders);
      toast({
        title: 'Recommendations Found',
        description: `We found ${result.serviceProviders.length} potential providers for you.`,
      });
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not get recommendations. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">AI Service Recommendations</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Find a Pro</CardTitle>
              <CardDescription>Describe your issue and location to get AI-powered recommendations.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Manchester, UK" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maintenanceNeeds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What do you need help with?</FormLabel>
                        <FormControl>
                          <Textarea rows={4} placeholder="e.g., I have a leaky faucet in my kitchen sink and need a plumber." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Get Recommendations
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="min-h-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Recommended Providers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
              {!isLoading && recommendations.length > 0 && (
                <ul className="space-y-3">
                  {recommendations.map((provider, index) => (
                    <li key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                      <UserCheck className="h-5 w-5 text-primary" />
                      <span className="font-medium">{provider}</span>
                    </li>
                  ))}
                </ul>
              )}
              {!isLoading && recommendations.length === 0 && (
                <div className="text-center text-muted-foreground h-48 flex items-center justify-center">
                  <p>Your AI-powered recommendations will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
