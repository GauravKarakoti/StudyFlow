import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Settings = () => {
  const { user, token, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [linkPhone, setLinkPhone] = useState("");
  const [linkOtp, setLinkOtp] = useState("");
  const [isLinkingOtpSent, setIsLinkingOtpSent] = useState(false);
  const [linkEmail, setLinkEmail] = useState("");

  const [name, setName] = useState(user?.name || "");
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    if (user?.name) setName(user.name);
  }, [user]);

  const handleSendLinkOtp = async () => {
     try {
       await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/send-otp`, { phoneNumber: linkPhone });
       setIsLinkingOtpSent(true);
       toast.success("OTP sent to WhatsApp");
     } catch (e) { toast.error("Failed to send OTP"); }
  };

  const handleVerifyLinkPhone = async () => {
     try {
       await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/link-phone`, { 
         phoneNumber: linkPhone, 
         code: linkOtp 
       }, { headers: { Authorization: `Bearer ${token}` } });
       toast.success("Phone linked!");
       // Trigger user reload here if possible, or manually update local user state
     } catch (e) { toast.error("Invalid OTP or Phone in use"); }
  };

  const handleLinkEmail = async () => {
     try {
       await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/link-email`, { 
         email: linkEmail
       }, { headers: { Authorization: `Bearer ${token}` } });
       toast.success("Email linked!");
     } catch (e) { toast.error("Email already in use"); }
  };

  // Handle Text Profile Update
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedData = await response.json();
      updateUser(updatedData); // Update global auth state
      toast.success("Profile details updated successfully.");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Avatar Upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/avatar`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error("Failed to upload avatar");

      const updatedData = await response.json();
      updateUser(updatedData); // Update global auth state (triggers UI update)
      toast.success("Avatar updated successfully!");
    } catch (error) {
      toast.error("Failed to upload avatar. Make sure it's an image < 5MB.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle Password Change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed");

      toast.success("Password updated. Please log in again.");
      logout();
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const displayAvatar = user?.avatarUrl 
    ? user.avatarUrl 
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`;

  return (
    <div className="container max-w-4xl py-10 px-4 mx-auto animate-accordion-down">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-glow">Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="border-t py-4 mt-4 space-y-4">
             <h3 className="text-lg font-medium">Contact Details</h3>
             
             {/* Email Field */}
             <div className="grid gap-2">
               <Label>Email</Label>
               {user?.email ? (
                 <Input value={user.email} disabled className="bg-muted" />
               ) : (
                 <div className="flex gap-2">
                   <Input 
                     placeholder="Add your email" 
                     value={linkEmail} 
                     onChange={e => setLinkEmail(e.target.value)} 
                   />
                   <Button onClick={handleLinkEmail}>Link</Button>
                 </div>
               )}
             </div>

             {/* Phone Field */}
             <div className="grid gap-2">
               <Label>WhatsApp Number</Label>
               {user?.phoneNumber ? ( // Assuming you added phoneNumber to user context/type
                 <Input value={user.phoneNumber} disabled className="bg-muted" />
               ) : (
                 <div className="space-y-2">
                    <div className="flex gap-2">
                       <Input 
                         placeholder="+91..." 
                         value={linkPhone} 
                         onChange={e => setLinkPhone(e.target.value)} 
                         disabled={isLinkingOtpSent}
                       />
                       {!isLinkingOtpSent && <Button onClick={handleSendLinkOtp}>Send OTP</Button>}
                    </div>
                    {isLinkingOtpSent && (
                      <div className="flex gap-2">
                        <Input 
                          placeholder="OTP" 
                          value={linkOtp} 
                          onChange={e => setLinkOtp(e.target.value)} 
                        />
                        <Button onClick={handleVerifyLinkPhone}>Verify</Button>
                      </div>
                    )}
                 </div>
               )}
             </div>
          </div>
          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal details and profile picture.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarImage src={displayAvatar} alt="Avatar" className="object-cover" />
                  <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={triggerFileInput}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload New Picture
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max 5MB.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="max-w-md bg-background/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="max-w-md bg-muted/50"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={isLoading} className="cosmic-glow">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. You will be logged out after saving.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input 
                    id="current" 
                    type="password" 
                    required 
                    className="bg-background/50"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input 
                    id="new" 
                    type="password" 
                    required 
                    className="bg-background/50"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="mt-2 cosmic-glow">
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;