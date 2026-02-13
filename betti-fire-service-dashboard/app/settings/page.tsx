"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  const handlePasswordUpdate = () => {
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    })
  }

  const handleConfigureDevice = (deviceName: string) => {
    toast({
      title: "Device Configuration",
      description: `Opening settings for ${deviceName}...`,
    })
  }

  const handleAddDevice = () => {
    toast({
      title: "Add Device",
      description: "Opening device pairing wizard...",
    })
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your dashboard preferences and configurations</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 animate-in fade-in duration-500">
            <Card className="p-6 transition-all hover:shadow-lg duration-300">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Dashboard Preferences</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facility-name">Facility Name</Label>
                  <Input id="facility-name" defaultValue="Fire & Rescue Station 1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="est">
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                      <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                      <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                      <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refresh-rate">Data Refresh Rate</Label>
                  <Select defaultValue="5">
                    <SelectTrigger id="refresh-rate">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Every 5 seconds</SelectItem>
                      <SelectItem value="10">Every 10 seconds</SelectItem>
                      <SelectItem value="30">Every 30 seconds</SelectItem>
                      <SelectItem value="60">Every minute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-6 transition-all hover:shadow-lg duration-300">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Display Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable dark theme for the dashboard</p>
                  </div>
                  <Switch id="dark-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compact-view">Compact View</Label>
                    <p className="text-sm text-muted-foreground">Show more information in less space</p>
                  </div>
                  <Switch id="compact-view" />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 animate-in fade-in duration-500">
            <Card className="p-6 transition-all hover:shadow-lg duration-300">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Alert Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="critical-alerts">Critical Alerts</Label>
                    <p className="text-sm text-muted-foreground">Fire, medical emergencies, panic buttons</p>
                  </div>
                  <Switch id="critical-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="warning-alerts">Warning Alerts</Label>
                    <p className="text-sm text-muted-foreground">Temperature changes, air quality issues</p>
                  </div>
                  <Switch id="warning-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="info-alerts">Info Alerts</Label>
                    <p className="text-sm text-muted-foreground">Device status, routine check-ins</p>
                  </div>
                  <Switch id="info-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sound-alerts">Sound Alerts</Label>
                    <p className="text-sm text-muted-foreground">Play audio for critical incidents</p>
                  </div>
                  <Switch id="sound-alerts" defaultChecked />
                </div>
              </div>
            </Card>

            <Card className="p-6 transition-all hover:shadow-lg duration-300">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Notification Channels</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="admin@firerescue.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-alerts">SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive text messages for critical alerts</p>
                  </div>
                  <Switch id="sms-alerts" defaultChecked />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4 animate-in fade-in duration-500">
            <Card className="p-6 transition-all hover:shadow-lg duration-300">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Connected Devices</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Halo Sensor - Kitchen</p>
                    <p className="text-sm text-muted-foreground">Battery: 85% • Last seen: Just now</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleConfigureDevice("Halo Sensor - Kitchen")}>
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Motion Sensor - Bedroom</p>
                    <p className="text-sm text-muted-foreground">Battery: 92% • Last seen: 1 min ago</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleConfigureDevice("Motion Sensor - Bedroom")}>
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Panic Button - Living Room</p>
                    <p className="text-sm text-muted-foreground">Battery: 78% • Last seen: 2 min ago</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConfigureDevice("Panic Button - Living Room")}
                  >
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Alexa Device - Bedroom</p>
                    <p className="text-sm text-muted-foreground">Connected • Last seen: Just now</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleConfigureDevice("Alexa Device - Bedroom")}>
                    Configure
                  </Button>
                </div>
              </div>
              <Button className="w-full mt-4 bg-primary" onClick={handleAddDevice}>
                Add New Device
              </Button>
            </Card>

            <Card className="p-6 transition-all hover:shadow-lg duration-300">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Device Maintenance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-updates">Automatic Updates</Label>
                    <p className="text-sm text-muted-foreground">Update device firmware automatically</p>
                  </div>
                  <Switch id="auto-updates" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="battery-alerts">Low Battery Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify when device battery is below 20%</p>
                  </div>
                  <Switch id="battery-alerts" defaultChecked />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 animate-in fade-in duration-500">
            <Card className="p-6 transition-all hover:shadow-lg duration-300">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Account Security</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button className="bg-primary" onClick={handlePasswordUpdate}>
                  Update Password
                </Button>
              </div>
            </Card>

            <Card className="p-6 transition-all hover:shadow-lg duration-300">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Two-Factor Authentication</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="2fa">Enable 2FA</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch id="2fa" />
                </div>
              </div>
            </Card>

            <Card className="p-6 transition-all hover:shadow-lg duration-300">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Access Control</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout</Label>
                  <Select defaultValue="30">
                    <SelectTrigger id="session-timeout">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="login-alerts">Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                  </div>
                  <Switch id="login-alerts" defaultChecked />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
    </div>
  )
}
