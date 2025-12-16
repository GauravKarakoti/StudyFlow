import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import axios from 'axios'
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false) // New state
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/send-otp`, { phoneNumber });
      console.log(`OTP sent to ${phoneNumber}`);
      setOtpSent(true);
    } catch (err) {
      setError('Failed to send OTP. Ensure number includes country code (e.g., +91...)');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP Handler
  const handleMobileLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp`, {
        phoneNumber,
        code: otp
      });
      auth.login(response.data.token, response.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true) // Start loading

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        email,
        password,
      })
      auth.login(response.data.token, response.data.user)
      navigate(from, { replace: true })
    } catch (err) {
      setError('Invalid email or password.')
    } finally {
      setLoading(false) // Stop loading regardless of success/failure
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, {
        credential: credentialResponse.credential,
      });
      
      auth.login(response.data.token, response.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Google Login failed. Please try again.');
      console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        {/* ... Header ... */}
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Choose your preferred login method.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* ... Inputs ... */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <div className="text-right">
                    <Link to="/forgot-password" className="text-sm text-muted-foreground hover:underline">Forgot password?</Link>
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                {/* Updated Button */}
                <Button type="submit" className="w-full" isLoading={loading}>
                  Login
                </Button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="flex justify-center w-full">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google Login Failed')}
                    useOneTap
                />
              </div>
            </TabsContent>
            <TabsContent value="mobile">
              <form onSubmit={handleMobileLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label>WhatsApp Number</Label>
                  <Input 
                    type="tel" 
                    placeholder="+919876543210" 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)} 
                    disabled={otpSent}
                  />
                </div>
                
                {otpSent && (
                  <div className="space-y-2">
                    <Label>OTP</Label>
                    <Input 
                      type="text" 
                      placeholder="123456" 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value)} 
                    />
                  </div>
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}

                {!otpSent ? (
                  <Button type="button" onClick={handleSendOtp} className="w-full" disabled={loading}>
                    Send OTP via WhatsApp
                  </Button>
                ) : (
                  <Button type="submit" className="w-full" disabled={loading}>
                    Verify & Login
                  </Button>
                )}
              </form>
            </TabsContent>
          </Tabs>

           {/* ... Footer Links ... */}
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login