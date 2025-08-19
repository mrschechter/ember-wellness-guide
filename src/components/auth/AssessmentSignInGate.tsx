import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AssessmentSignInGateProps {
  onSignInComplete: () => void;
}

export function AssessmentSignInGate({ onSignInComplete }: AssessmentSignInGateProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, {
          firstName,
          lastName,
          source: 'assessment_completion'
        });
        
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              variant: "destructive",
              title: "Account already exists",
              description: "Please sign in with your existing account or use a different email."
            });
          } else {
            toast({
              variant: "destructive",
              title: "Sign up failed",
              description: error.message
            });
          }
          return;
        }
        
        toast({
          title: "Account created successfully!",
          description: "Please check your email for verification."
        });
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          toast({
            variant: "destructive",
            title: "Sign in failed",
            description: "Invalid email or password. Please try again."
          });
          return;
        }
      }
      
      onSignInComplete();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-foreground mb-2">
            Assessment Complete!
          </CardTitle>
          <p className="text-muted-foreground">
            Your personalized results are ready. Sign in to view your restoration roadmap.
          </p>
        </CardHeader>

        <CardContent>
          {/* Value proposition */}
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-foreground mb-2">Your Results Include:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Your personalized health profile</li>
              <li>✓ Specific supplement protocol recommendations</li>
              <li>✓ Custom restoration timeline</li>
              <li>✓ Access to progress tracking dashboard</li>
            </ul>
          </div>

          {/* Sign-in form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignUp ? 'Create Account & View Results' : 'Sign In to View Results'}
            </Button>
            
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
              </Button>
            </div>
          </form>

          {/* Trust signals */}
          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">
              🔒 Your information is secure and private<br/>
              📧 No spam, only your personalized health insights
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}