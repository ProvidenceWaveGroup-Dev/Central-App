"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { User, Lock, Bell, Palette, LogOut } from "lucide-react"

export function SettingsPage() {
  const [theme, setTheme] = useState("light")
  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
  })

  const handleSaveProfile = () => {
    alert(`Profile saved: ${formData.firstName} ${formData.lastName}`)
  }

  const handleUpdatePassword = () => {
    alert("Password updated successfully")
  }

  const handleLogout = () => {
    alert("Logging out...")
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    alert(`Theme changed to ${newTheme}`)
  }

  return (
    <main className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">User preferences, theme toggle, and account info</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">First Name</label>
              <Input
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Last Name</label>
              <Input
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
              <Input
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground mb-2 block">Role</label>
              <Input placeholder="Admin" defaultValue="Admin" disabled />
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveProfile}>
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security
          </CardTitle>
          <CardDescription>Manage your password and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Current Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">New Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Confirm Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleUpdatePassword}>
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-foreground">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Receive alerts on your device</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-foreground">Email Alerts</p>
              <p className="text-sm text-muted-foreground">Receive important updates via email</p>
            </div>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-foreground">Daily Summary</p>
              <p className="text-sm text-muted-foreground">Get a daily summary of activities</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize your dashboard appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">Theme</label>
            <div className="flex gap-3">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => handleThemeChange("light")}
                className={theme === "light" ? "bg-primary hover:bg-primary/90" : ""}
              >
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => handleThemeChange("dark")}
                className={theme === "dark" ? "bg-primary hover:bg-primary/90" : ""}
              >
                Dark
              </Button>
              <Button
                variant={theme === "auto" ? "default" : "outline"}
                onClick={() => handleThemeChange("auto")}
                className={theme === "auto" ? "bg-primary hover:bg-primary/90" : ""}
              >
                Auto
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
