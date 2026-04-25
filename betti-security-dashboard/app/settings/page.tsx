"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bell, Shield, User, Smartphone, Mail, Key, Building2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DisclaimerBar } from "@/components/disclaimer-bar"

export default function SettingsPage() {
  const { toast } = useToast()
  const [hasChanges, setHasChanges] = useState(false)
  const [show2FADialog, setShow2FADialog] = useState(false)
  const [twoFactorMethod, setTwoFactorMethod] = useState<"email" | "app">("email")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")

  const [agencyDetails, setAgencyDetails] = useState({
    name: "SecureWatch Security Services",
    email: "contact@securewatch.com",
    phone: "+1 (555) 123-4567",
    address: "123 Security Blvd, Safety City, SC 12345",
    licenseNumber: "SEC-2024-001",
    emergencyContact: "+1 (555) 911-0000",
  })

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully updated.",
    })
    setHasChanges(false)
  }

  const handleEnable2FA = () => {
    setShow2FADialog(true)
  }

  const handleVerify2FA = () => {
    if (verificationCode.length === 6) {
      setTwoFactorEnabled(true)
      setShow2FADialog(false)
      toast({
        title: "2FA Enabled",
        description: `Two-factor authentication via ${twoFactorMethod === "email" ? "email" : "authenticator app"} has been enabled.`,
      })
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8"><div className="mx-auto max-w-7xl">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Manage your dashboard preferences and configurations
            </p>
          </div>
          <Button
            onClick={handleSaveSettings}
            disabled={!hasChanges}
            className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg sm:text-xl">
                <Building2 className="h-5 w-5 text-secondary" />
                Security Agency Details
              </CardTitle>
              <CardDescription>Manage your security agency information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="agency-name">Agency Name</Label>
                  <Input
                    id="agency-name"
                    value={agencyDetails.name}
                    onChange={(e) => {
                      setAgencyDetails({ ...agencyDetails, name: e.target.value })
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license-number">License Number</Label>
                  <Input
                    id="license-number"
                    value={agencyDetails.licenseNumber}
                    onChange={(e) => {
                      setAgencyDetails({ ...agencyDetails, licenseNumber: e.target.value })
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agency-email">Email Address</Label>
                  <Input
                    id="agency-email"
                    type="email"
                    value={agencyDetails.email}
                    onChange={(e) => {
                      setAgencyDetails({ ...agencyDetails, email: e.target.value })
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agency-phone">Phone Number</Label>
                  <Input
                    id="agency-phone"
                    type="tel"
                    value={agencyDetails.phone}
                    onChange={(e) => {
                      setAgencyDetails({ ...agencyDetails, phone: e.target.value })
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="agency-address">Address</Label>
                  <Input
                    id="agency-address"
                    value={agencyDetails.address}
                    onChange={(e) => {
                      setAgencyDetails({ ...agencyDetails, address: e.target.value })
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="emergency-contact">Emergency Contact Number</Label>
                  <Input
                    id="emergency-contact"
                    type="tel"
                    value={agencyDetails.emergencyContact}
                    onChange={(e) => {
                      setAgencyDetails({ ...agencyDetails, emergencyContact: e.target.value })
                      setHasChanges(true)
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg sm:text-xl">
                <Bell className="h-5 w-5 text-primary" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure how you receive alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="critical-alerts">Critical Alerts</Label>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Receive notifications for critical incidents
                  </p>
                </div>
                <Switch id="critical-alerts" defaultChecked onCheckedChange={() => setHasChanges(true)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="check-in-alerts">Check-In Alerts</Label>
                  <p className="text-muted-foreground text-xs sm:text-sm">Get notified about missed check-ins</p>
                </div>
                <Switch id="check-in-alerts" defaultChecked onCheckedChange={() => setHasChanges(true)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="routine-alerts">Routine Deviations</Label>
                  <p className="text-muted-foreground text-xs sm:text-sm">Alerts for changes in daily routines</p>
                </div>
                <Switch id="routine-alerts" defaultChecked onCheckedChange={() => setHasChanges(true)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg sm:text-xl">
                <Shield className="h-5 w-5 text-secondary" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage security and privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-muted-foreground text-xs sm:text-sm">Add an extra layer of security</p>
                </div>
                <Switch
                  id="two-factor"
                  checked={twoFactorEnabled}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleEnable2FA()
                    } else {
                      setTwoFactorEnabled(false)
                      toast({
                        title: "2FA Disabled",
                        description: "Two-factor authentication has been disabled.",
                      })
                    }
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="video-recording">Video Recording</Label>
                  <p className="text-muted-foreground text-xs sm:text-sm">Enable continuous video recording</p>
                </div>
                <Switch id="video-recording" defaultChecked onCheckedChange={() => setHasChanges(true)} />
              </div>
            </CardContent>
          </Card>

          {/* Device Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg sm:text-xl">
                <Smartphone className="h-5 w-5 text-primary" />
                Device Settings
              </CardTitle>
              <CardDescription>Configure Betti device preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="battery-alerts">Low Battery Alerts</Label>
                  <p className="text-muted-foreground text-xs sm:text-sm">Get notified when battery is low</p>
                </div>
                <Switch id="battery-alerts" defaultChecked onCheckedChange={() => setHasChanges(true)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="connectivity-alerts">Connectivity Alerts</Label>
                  <p className="text-muted-foreground text-xs sm:text-sm">Alerts for connection issues</p>
                </div>
                <Switch id="connectivity-alerts" defaultChecked onCheckedChange={() => setHasChanges(true)} />
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg sm:text-xl">
                <User className="h-5 w-5 text-secondary" />
                Profile Settings
              </CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Edit Profile Information
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Change Password
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive bg-transparent"
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
            <DialogDescription>Choose your preferred 2FA method and complete the setup</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <RadioGroup value={twoFactorMethod} onValueChange={(value) => setTwoFactorMethod(value as "email" | "app")}>
              <div className="flex items-center space-x-3 rounded-lg border p-4">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="font-semibold">Email Verification</span>
                  </div>
                  <p className="text-muted-foreground text-xs mt-1">Receive codes via email</p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border p-4">
                <RadioGroupItem value="app" id="app" />
                <Label htmlFor="app" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-secondary" />
                    <span className="font-semibold">Authenticator App</span>
                  </div>
                  <p className="text-muted-foreground text-xs mt-1">Use Google Authenticator or similar</p>
                </Label>
              </div>
            </RadioGroup>

            {twoFactorMethod === "email" && (
              <div className="space-y-3">
                <p className="text-sm">
                  A verification code will be sent to <strong>{agencyDetails.email}</strong>
                </p>
                <div className="space-y-2">
                  <Label htmlFor="verification-code">Enter Verification Code</Label>
                  <Input
                    id="verification-code"
                    placeholder="000000"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>
            )}

            {twoFactorMethod === "app" && (
              <div className="space-y-3">
                <p className="text-sm">Scan this QR code with your authenticator app:</p>
                <div className="flex justify-center p-4 bg-muted rounded-lg">
                  <div className="w-32 h-32 bg-white border-2 border-border rounded flex items-center justify-center">
                    <Key className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app-code">Enter Code from App</Label>
                  <Input
                    id="app-code"
                    placeholder="000000"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>
            )}

            <Button onClick={handleVerify2FA} className="w-full bg-primary hover:bg-primary/90 text-white">
              Verify and Enable 2FA
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <DisclaimerBar />
    </div></div>
  )
}
