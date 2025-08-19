import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Flame, ArrowRight, CheckCircle, Users, TrendingUp, Sparkles } from 'lucide-react';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">The Ember Method</h1>
                <p className="text-sm text-muted-foreground">Women's Health Assessment Tool</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/assessment">
                <Button>Take Assessment</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Feel Like <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Yourself</span> Again
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            A revolutionary approach to reclaiming your spark after 35. Get your personalized 
            supplement protocol to restore energy, balance hormones, and reignite your vitality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/assessment">
              <Button size="lg" className="text-lg px-8 py-4">
                Take Free Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Login to Dashboard
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Users className="h-4 w-4" />
            Join 10,000+ women who've reclaimed their vitality
          </p>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">You're Not Broken</h2>
            <p className="text-lg text-muted-foreground">
              Your libido, energy, and vitality didn't disappear because of age. 
              There are 7 specific, reversible causes we can identify and fix.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">😴</div>
              <h3 className="font-semibold mb-2 text-foreground">Exhausted but Can't Sleep</h3>
              <p className="text-muted-foreground">Tired but wired, crashing every afternoon</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">🎢</div>
              <h3 className="font-semibold mb-2 text-foreground">Hormonal Roller Coaster</h3>
              <p className="text-muted-foreground">Unpredictable energy, mood, and desire</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="font-semibold mb-2 text-foreground">Lost Your Spark</h3>
              <p className="text-muted-foreground">Zero interest in intimacy or connection</p>
            </Card>
          </div>
          
          <div className="text-center">
            <Link to="/assessment">
              <Button size="lg">
                Discover What's Really Wrong
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">How The Ember Method Works</h2>
            <p className="text-lg text-muted-foreground">
              A simple 3-step process to reclaim your vitality
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Take Assessment</h3>
              <p className="text-muted-foreground">
                Complete our comprehensive assessment to identify your unique pattern of imbalances
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Get Your Protocol</h3>
              <p className="text-muted-foreground">
                Receive your personalized supplement protocol designed specifically for your body's needs
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Track Progress</h3>
              <p className="text-muted-foreground">
                Follow your restoration journey with our progress dashboard and feel yourself come back to life
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Real Women, Real Results</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  S
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-foreground">Sarah, 43</h4>
                  <p className="text-sm text-muted-foreground">Marketing Executive</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "Within 3 months, I felt like a completely different person. Not just sexually - 
                my energy, mood, sleep, everything was better. My husband said it was like 
                watching me come back to life."
              </p>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  M
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-foreground">Maria, 47</h4>
                  <p className="text-sm text-muted-foreground">Teacher & Mom</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "I stopped feeling like a victim of my hormones and started feeling like I 
                understood my body. The personalized protocol was exactly what I needed."
              </p>
            </Card>
          </div>
          
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-foreground">89%</div>
              <div className="text-muted-foreground">See improvements in 6 weeks</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">10,000+</div>
              <div className="text-muted-foreground">Women restored to vitality</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">30 years</div>
              <div className="text-muted-foreground">Dr. Forester's experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6 text-foreground">
            Your Vitality Is Waiting
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Take the first step toward feeling like yourself again. 
            Your personalized protocol is just minutes away.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/assessment">
              <Button size="lg" className="text-lg px-8 py-4">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Your Assessment Now
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Login to Continue
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Free assessment • Personalized results • No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">© 2024 The Ember Method. Empowering women's health through personalized wellness.</p>
            <p>This assessment is for educational purposes only and does not replace professional medical advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;