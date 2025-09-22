
// src/app/profile/page.tsx
'use client'

import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useTheme } from 'next-themes'
import { Moon, Sun, Bell, Shield, FileText } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

/**
 * The user profile page.
 *
 * @returns {JSX.Element | null} The ProfilePage component, or null if the user is not authenticated.
 */
export default function ProfilePage() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()

  if (!user) {
    return null // Or a loading spinner
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Profile & Settings
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              This is how your name and email will appear in the app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.photoURL ?? ''} />
                <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
              </Avatar>
              <Button variant="outline">Change Photo</Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input id="displayName" defaultValue={user.displayName ?? ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" defaultValue={user.email ?? ''} disabled />
            </div>

            <Button>Update Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>App Preferences</CardTitle>
            <CardDescription>
              Customise the look and feel of the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className='flex items-center gap-2'>
                    <Sun className="h-5 w-5 transition-all scale-100 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 transition-all scale-0 dark:scale-100" />
                    <Label htmlFor="theme-switch" className="ml-2">
                        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </Label>
                </div>
              <Switch
                id="theme-switch"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive alerts from AssetStream.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                    <Label htmlFor="maintenance-alerts">Upcoming Maintenance Alerts</Label>
                    <Switch id="maintenance-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                    <Label htmlFor="warranty-expiry">Warranty Expiry Warnings</Label>
                    <Switch id="warranty-expiry" defaultChecked />
                </div>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account security settings.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline">Change Password</Button>
            </CardContent>
        </Card>
        
         <Card>
            <CardHeader>
                <CardTitle>Data & Privacy</CardTitle>
                <CardDescription>Manage your personal data and account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm">Download a copy of your data.</p>
                    <Button variant="secondary">Export My Data</Button>
                </div>
                 <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/50">
                    <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
                    </div>
                    <Button variant="destructive">Delete</Button>
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  )
}
