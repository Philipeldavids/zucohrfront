import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";

import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  LogOut,
  Mail,
  Building2,
  Clock,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  DollarSign,
} from "lucide-react";

import { toast } from "sonner";

type Appearance = "light" | "dark" | "system";

type NotificationSetting = {
  label: string;
  desc: string;
  enabled: boolean;
};

type UserSettings = {
  appearance: Appearance;
  currency: string;
  timezone: string;
  language: string;
  notifications: NotificationSetting[];
};

const defaultNotifications: NotificationSetting[] = [
  {
    label: "Leave request approvals",
    desc: "Get notified when a leave request needs your approval",
    enabled: true,
  },
  {
    label: "Payroll processing",
    desc: "Alerts before and after payroll runs",
    enabled: true,
  },
  {
    label: "New hire onboarding",
    desc: "Reminders for onboarding task completion",
    enabled: false,
  },
  {
    label: "Performance review cycles",
    desc: "Upcoming review deadlines and submissions",
    enabled: true,
  },
  {
    label: "Expense claim submissions",
    desc: "When employees submit expense claims",
    enabled: false,
  },
];

const appearanceOptions: {
  value: Appearance;
  label: string;
  icon: typeof Sun;
}[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function SettingsPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const [settings, setSettings] = useState<UserSettings>({
    appearance: "system",
    currency: "NGN",
    timezone: "Africa/Lagos",
    language: "English (UK)",
    notifications: defaultNotifications,
  });

  useEffect(() => {
    const foundUser = JSON.parse(localStorage.getItem("user") || "{}");
    const org = JSON.parse(localStorage.getItem("org") || "{}");

    setUser(foundUser?.name || "");
    setEmail(foundUser?.email || "");
    setCompany(org?.name || "");
    setRole(foundUser?.role || "");

    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      localStorage.clear();
      navigate("/login");
      return;
    }

    loadSettings();
  }, [navigate]);

  const loadSettings = () => {
    const saved = localStorage.getItem("settings");

    if (saved) {
      const parsed = JSON.parse(saved);

      setSettings(parsed);

      applyAppearance(parsed.appearance);
    }
  };

  const saveSettings = (updated: UserSettings) => {
    localStorage.setItem("settings", JSON.stringify(updated));
    setSettings(updated);
  };

  const isTokenExpired = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);

      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const applyAppearance = (appearance: Appearance) => {
    const root = document.documentElement;

    if (appearance === "dark") {
      root.classList.add("dark");
    } else if (appearance === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const changeAppearance = (value: Appearance) => {
    const updated = {
      ...settings,
      appearance: value,
    };

    saveSettings(updated);

    applyAppearance(value);

    toast.success(`Appearance updated to ${value}`);
  };

  const changeCurrency = (currency: string) => {
    const updated = {
      ...settings,
      currency,
    };

    saveSettings(updated);

    toast.success(`Currency changed to ${currency}`);
  };

  const changeTimezone = (timezone: string) => {
    const updated = {
      ...settings,
      timezone,
    };

    saveSettings(updated);

    toast.success("Timezone updated");
  };

  const toggleNotification = (index: number) => {
    const updatedNotifications = settings.notifications.map((n, i) =>
      i === index ? { ...n, enabled: !n.enabled } : n
    );

    const updated = {
      ...settings,
      notifications: updatedNotifications,
    };

    saveSettings(updated);

    toast.success("Notification preference updated");
  };

  const handleLogout = () => {
    localStorage.clear();

    navigate("/login");
  };

  const initials = user
    ? user
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* PROFILE */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="text-lg font-semibold">{user}</h2>

              <p className="text-sm text-muted-foreground">{email}</p>

              <div className="flex gap-2 mt-2">
                <Badge className="bg-primary/10 text-primary border-0">
                  {role}
                </Badge>

                <Badge variant="secondary">
                  {company || "Organization"}
                </Badge>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => toast.info("Profile editing coming soon")}
            >
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ACCOUNT */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />

            <CardTitle className="text-base">
              Account Details
            </CardTitle>
          </div>

          <CardDescription>
            Your account and organization information.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-1">
          {[
            {
              label: "Full Name",
              value: user,
            },
            {
              label: "Email",
              value: email,
            },
            {
              label: "Organization",
              value: company || "N/A",
              icon: Building2,
            },
            {
              label: "Timezone",
              value: settings.timezone,
              icon: Clock,
            },
            {
              label: "Language",
              value: settings.language,
              icon: Globe,
            },
            {
              label: "Currency",
              value: settings.currency,
              icon: DollarSign,
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
            >
              <span className="text-sm text-muted-foreground">
                {label}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {value}
                </span>

                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* APPEARANCE */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />

            <CardTitle className="text-base">
              Appearance
            </CardTitle>
          </div>

          <CardDescription>
            Customize your experience.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {appearanceOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => changeAppearance(value)}
                className={`rounded-xl border-2 p-4 transition-all ${
                  settings.appearance === value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon
                    className={`h-5 w-5 ${
                      settings.appearance === value
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />

                  <span className="text-sm font-medium">
                    {label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CURRENCY */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />

            <CardTitle className="text-base">
              Regional Settings
            </CardTitle>
          </div>

          <CardDescription>
            Configure currency and timezone preferences.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Default Currency
            </label>

            <select
              value={settings.currency}
              onChange={(e) => changeCurrency(e.target.value)}
              className="w-full border rounded-lg p-2 bg-background"
            >
              <option value="NGN">NGN - Nigerian Naira</option>
              <option value="USD">USD - US Dollar</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Timezone
            </label>

            <select
              value={settings.timezone}
              onChange={(e) => changeTimezone(e.target.value)}
              className="w-full border rounded-lg p-2 bg-background"
            >
              <option value="Africa/Lagos">Africa/Lagos</option>
              <option value="Europe/London">Europe/London</option>
              <option value="America/New_York">America/New_York</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* NOTIFICATIONS */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />

            <CardTitle className="text-base">
              Notifications
            </CardTitle>
          </div>

          <CardDescription>
            Manage alerts and reminders.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-1">
          {settings.notifications.map((notif, i) => (
            <div
              key={notif.label}
              className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
            >
              <div className="flex-1 pr-4">
                <p className="text-sm font-medium">
                  {notif.label}
                </p>

                <p className="text-xs text-muted-foreground">
                  {notif.desc}
                </p>
              </div>

              <button
                onClick={() => toggleNotification(i)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  notif.enabled
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    notif.enabled
                      ? "translate-x-4"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SECURITY */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />

            <CardTitle className="text-base">
              Security
            </CardTitle>
          </div>

          <CardDescription>
            Manage security settings.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <Button
            variant="secondary"
            className="w-full justify-start"
            onClick={() => toast.info("Coming soon")}
          >
            Change Password
          </Button>

          <Button
            variant="secondary"
            className="w-full justify-start"
            onClick={() => toast.info("Coming soon")}
          >
            Enable Two-Factor Authentication
          </Button>
        </CardContent>
      </Card>

      {/* SIGN OUT */}
      <Card className="border-destructive/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <LogOut className="h-4 w-4 text-destructive" />

            <CardTitle className="text-base text-destructive">
              Sign Out
            </CardTitle>
          </div>

          <CardDescription>
            Sign out from this device.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Separator className="mb-4" />

          <Button
            variant="destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}