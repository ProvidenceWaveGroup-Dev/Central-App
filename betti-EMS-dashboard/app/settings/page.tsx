"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  User,
  Bell,
  Shield,
  Smartphone,
  Database,
  Palette,
  Clock,
  AlertTriangle,
  Save,
  RefreshCw,
  Plus,
  Mail,
  QrCode,
  Check,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "Margaret",
    lastName: "Chen",
    dob: "1945-03-15",
    bloodType: "o-positive",
    allergies: "Penicillin, Sulfa drugs, Latex",
  })

  // Notification preferences state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(true)
  const [fallAlerts, setFallAlerts] = useState(true)
  const [medicationReminders, setMedicationReminders] = useState(true)

  const [show2FAModal, setShow2FAModal] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [twoFactorMethod, setTwoFactorMethod] = useState<"email" | "app" | null>(null)
  const [twoFactorStep, setTwoFactorStep] = useState<"select" | "verify">("select")
  const [verificationCode, setVerificationCode] = useState("")

  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false)
  const [newDevice, setNewDevice] = useState({
    name: "",
    type: "",
    serialNumber: "",
  })
  const [devices, setDevices] = useState([
    {
      name: "Halo Sensor",
      type: "Wearable Device",
      status: "Connected",
      battery: "85%",
      lastSync: "2 minutes ago",
    },
    {
      name: "Smart Watch",
      type: "Wearable Device",
      status: "Connected",
      battery: "62%",
      lastSync: "5 minutes ago",
    },
    {
      name: "Home Hub",
      type: "Smart Home Device",
      status: "Connected",
      battery: "Plugged In",
      lastSync: "Just now",
    },
  ])

  // Other settings state
  const [autoBackup, setAutoBackup] = useState(true)
  const [theme, setTheme] = useState("light")
  const [fontSize, setFontSize] = useState("medium")
  const [language, setLanguage] = useState("english")
  const [timezone, setTimezone] = useState("pst")
  const [timeFormat, setTimeFormat] = useState("12h")
  const [dateFormat, setDateFormat] = useState("mdy")

  const handleSaveProfile = () => {
    setIsEditingProfile(false)
    toast({
      title: "Profile Updated",
      description: "Your patient profile has been successfully updated.",
    })
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Preferences Saved",
      description: "Your notification preferences have been updated.",
    })
  }

  const handleEnable2FA = () => {
    setShow2FAModal(true)
    setTwoFactorStep("select")
  }

  const handleSelect2FAMethod = (method: "email" | "app") => {
    setTwoFactorMethod(method)
    setTwoFactorStep("verify")
  }

  const handleVerify2FA = () => {
    if (verificationCode.length === 6) {
      setTwoFactorEnabled(true)
      setShow2FAModal(false)
      setVerificationCode("")
      toast({
        title: "2FA Enabled",
        description: `Two-factor authentication via ${twoFactorMethod === "email" ? "email" : "authenticator app"} has been enabled.`,
      })
    }
  }

  const handleAddDevice = () => {
    if (newDevice.name && newDevice.type && newDevice.serialNumber) {
      setDevices([
        ...devices,
        {
          name: newDevice.name,
          type: newDevice.type,
          status: "Connected",
          battery: "100%",
          lastSync: "Just now",
        },
      ])
      setShowAddDeviceModal(false)
      setNewDevice({ name: "", type: "", serialNumber: "" })
      toast({
        title: "Device Added",
        description: `${newDevice.name} has been successfully connected.`,
      })
    }
  }

  const handleSaveDataSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Data management settings have been updated.",
    })
  }

  const handleSaveAppearance = () => {
    toast({
      title: "Appearance Updated",
      description: "Your appearance preferences have been saved.",
    })
  }

  const handleSaveTimeSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Time and timezone settings have been updated.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your dashboard preferences and system configuration</p>
      </div>

      <div className="space-y-6">
        {/* Patient Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  disabled={!isEditingProfile}
                  className="bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  disabled={!isEditingProfile}
                  className="bg-transparent"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input id="patientId" defaultValue="#12847" disabled className="bg-muted" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={profileData.dob}
                  onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                  disabled={!isEditingProfile}
                  className="bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select
                  value={profileData.bloodType}
                  onValueChange={(value) => setProfileData({ ...profileData, bloodType: value })}
                  disabled={!isEditingProfile}
                >
                  <SelectTrigger id="bloodType" className="bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a-positive">A+</SelectItem>
                    <SelectItem value="a-negative">A-</SelectItem>
                    <SelectItem value="b-positive">B+</SelectItem>
                    <SelectItem value="b-negative">B-</SelectItem>
                    <SelectItem value="o-positive">O+</SelectItem>
                    <SelectItem value="o-negative">O-</SelectItem>
                    <SelectItem value="ab-positive">AB+</SelectItem>
                    <SelectItem value="ab-negative">AB-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">Known Allergies</Label>
              <Input
                id="allergies"
                value={profileData.allergies}
                onChange={(e) => setProfileData({ ...profileData, allergies: e.target.value })}
                disabled={!isEditingProfile}
                className="bg-transparent"
                placeholder="Comma-separated list"
              />
            </div>
            <div className="flex gap-2">
              {!isEditingProfile ? (
                <Button
                  onClick={() => setIsEditingProfile(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </Button>
                  <Button onClick={() => setIsEditingProfile(false)} variant="outline">
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive alerts and updates</p>
              </div>
              <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email">Email Alerts</Label>
                <p className="text-sm text-muted-foreground">Send notifications to email</p>
              </div>
              <Switch id="email" checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms">SMS Alerts</Label>
                <p className="text-sm text-muted-foreground">Send text message notifications</p>
              </div>
              <Switch id="sms" checked={smsAlerts} onCheckedChange={setSmsAlerts} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="fall">Fall Detection Alerts</Label>
                <p className="text-sm text-muted-foreground">Immediate alerts for fall incidents</p>
              </div>
              <Switch id="fall" checked={fallAlerts} onCheckedChange={setFallAlerts} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="medication">Medication Reminders</Label>
                <p className="text-sm text-muted-foreground">Daily medication schedule alerts</p>
              </div>
              <Switch id="medication" checked={medicationReminders} onCheckedChange={setMedicationReminders} />
            </div>
            <Button
              onClick={handleSaveNotifications}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Change Password</Label>
              <Input id="password" type="password" placeholder="Enter new password" className="bg-transparent" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                className="bg-transparent"
              />
            </div>
            <Button variant="outline" className="bg-transparent">
              Update Password
            </Button>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-foreground">Two-Factor Authentication</h4>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">2FA Status</p>
                  <p className="text-xs text-muted-foreground">Add extra security to your account</p>
                </div>
                <Badge
                  variant={twoFactorEnabled ? "default" : "outline"}
                  className={twoFactorEnabled ? "bg-primary" : ""}
                >
                  {twoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <Button
                onClick={handleEnable2FA}
                variant="outline"
                className="w-full bg-transparent"
                disabled={twoFactorEnabled}
              >
                {twoFactorEnabled ? "Two-Factor Authentication Active" : "Enable Two-Factor Authentication"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Device Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Connected Devices
            </CardTitle>
            <Button
              onClick={() => setShowAddDeviceModal(true)}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {devices.map((device, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-semibold text-sm text-foreground">{device.name}</p>
                  <p className="text-xs text-muted-foreground">{device.type}</p>
                  <p className="text-xs text-muted-foreground mt-1">Last sync: {device.lastSync}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-primary text-primary-foreground mb-2">{device.status}</Badge>
                  <p className="text-xs text-muted-foreground">Battery: {device.battery}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync All Devices
            </Button>
          </CardContent>
        </Card>

        {/* Data & Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoBackup">Automatic Backup</Label>
                <p className="text-sm text-muted-foreground">Daily backup of health data</p>
              </div>
              <Switch id="autoBackup" checked={autoBackup} onCheckedChange={setAutoBackup} />
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">Last Backup</p>
                  <Badge variant="outline">Today, 3:00 AM</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Next scheduled backup: Tomorrow, 3:00 AM</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="bg-transparent">
                  Backup Now
                </Button>
                <Button variant="outline" className="bg-transparent">
                  Restore Data
                </Button>
              </div>
            </div>
            <Separator />
            <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-foreground mb-1">Data Retention</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Health data is retained for 7 years in compliance with medical record regulations. You can export
                    your data at any time.
                  </p>
                </div>
              </div>
            </div>
            <Button onClick={handleSaveDataSettings} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme" className="bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto (System)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fontSize">Font Size</Label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger id="fontSize" className="bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="extra-large">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language" className="bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveAppearance} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Save Appearance
            </Button>
          </CardContent>
        </Card>

        {/* Time & Timezone */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time & Timezone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger id="timezone" className="bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                  <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                  <SelectItem value="cst">Central Time (CST)</SelectItem>
                  <SelectItem value="est">Eastern Time (EST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeFormat">Time Format</Label>
              <Select value={timeFormat} onValueChange={setTimeFormat}>
                <SelectTrigger id="timeFormat" className="bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                  <SelectItem value="24h">24-hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select value={dateFormat} onValueChange={setDateFormat}>
                <SelectTrigger id="dateFormat" className="bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveTimeSettings} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={show2FAModal} onOpenChange={setShow2FAModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              {twoFactorStep === "select"
                ? "Choose your preferred method for two-factor authentication"
                : `Enter the verification code sent to your ${twoFactorMethod === "email" ? "email" : "authenticator app"}`}
            </DialogDescription>
          </DialogHeader>

          {twoFactorStep === "select" ? (
            <div className="space-y-3 py-4">
              <Button
                onClick={() => handleSelect2FAMethod("email")}
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-4"
              >
                <Mail className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-semibold">Email Authentication</p>
                  <p className="text-xs text-muted-foreground">Receive codes via email</p>
                </div>
              </Button>
              <Button
                onClick={() => handleSelect2FAMethod("app")}
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-4"
              >
                <QrCode className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-semibold">Authenticator App</p>
                  <p className="text-xs text-muted-foreground">Use Google Authenticator or similar</p>
                </div>
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {twoFactorMethod === "app" && (
                <div className="flex justify-center p-4 bg-muted rounded-lg">
                  <div className="w-48 h-48 bg-white flex items-center justify-center border-2 border-border">
                    <QrCode className="h-24 w-24 text-muted-foreground" />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  id="verificationCode"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>
            </div>
          )}

          {twoFactorStep === "verify" && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setTwoFactorStep("select")}>
                Back
              </Button>
              <Button onClick={handleVerify2FA} disabled={verificationCode.length !== 6} className="bg-primary">
                <Check className="h-4 w-4 mr-2" />
                Verify & Enable
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDeviceModal} onOpenChange={setShowAddDeviceModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogDescription>Connect a new device to your health monitoring system</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deviceName">Device Name</Label>
              <Input
                id="deviceName"
                placeholder="e.g., Blood Pressure Monitor"
                value={newDevice.name}
                onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deviceType">Device Type</Label>
              <Select value={newDevice.type} onValueChange={(value) => setNewDevice({ ...newDevice, type: value })}>
                <SelectTrigger id="deviceType">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wearable Device">Wearable Device</SelectItem>
                  <SelectItem value="Smart Home Device">Smart Home Device</SelectItem>
                  <SelectItem value="Medical Monitor">Medical Monitor</SelectItem>
                  <SelectItem value="Sensor">Sensor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                placeholder="Enter device serial number"
                value={newDevice.serialNumber}
                onChange={(e) => setNewDevice({ ...newDevice, serialNumber: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDeviceModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddDevice}
              disabled={!newDevice.name || !newDevice.type || !newDevice.serialNumber}
              className="bg-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
