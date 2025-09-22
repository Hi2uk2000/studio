'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Skeleton} from '@/components/ui/skeleton';
import {
  recommendServiceProviders,
  RecommendServiceProvidersInput,
  RecommendServiceProvidersOutput,
} from '@/ai/flows/recommend-service-providers';

export default function RecommendationsPage() {
  const [formData, setFormData] = useState<RecommendServiceProvidersInput>({
    location: '',
    maintenanceNeeds: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendServiceProvidersOutput>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(undefined);
    try {
      const response = await recommendServiceProviders(formData);
      setResult(response);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Handle error state in UI, e.g., show a toast notification
    }
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Get Service Provider Recommendations</CardTitle>
          <CardDescription>
            Tell us your location and what you need help with, and we&apos;ll
            suggest some top-rated professionals.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., San Francisco, CA"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenanceNeeds">Maintenance Needs</Label>
              <Input
                id="maintenanceNeeds"
                name="maintenanceNeeds"
                placeholder="e.g., leaky faucet, electrical issue, plumber"
                value={formData.maintenanceNeeds}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
            </Button>
          </CardFooter>
        </form>
        {loading && (
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">
              Recommended Service Providers
            </h3>
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-2/5" />
            </div>
          </CardContent>
        )}
        {result && (
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">
              Recommended Service Providers
            </h3>
            {result.serviceProviders.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {result.serviceProviders.map((provider, index) => (
                  <li key={index}>{provider}</li>
                ))}
              </ul>
            ) : (
              <p>No service providers found for your criteria.</p>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
