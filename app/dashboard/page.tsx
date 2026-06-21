"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserNav } from "@/components/auth/user-nav"
import {
  Mic,
  Users,
  Play,
  BarChart3,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { MicdropLogo } from "@/components/ui/micdrop-logo"

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      // Get current user info
      setUser(session?.user)

      try {
        const res = await fetch(process.env.SITE_URL+"/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setDashboardData(data)
        }
      } catch (e) {
        // fail silently
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  // Extract username from email (remove @gmail.com part)
  const displayName = user?.email?.split('@')[0] || 'User'

  if (loading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MicdropLogo size="xxl" variant="white" />
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/personas">Personas</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/practice">Practice</Link>
            </Button>
            <UserNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, {displayName}!</h2>
              <p className="text-lg text-muted-foreground">
                Ready to practice your pitch? Let's get started!
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:flex-shrink-0">
              <Badge variant="outline" className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span className="font-medium">Ready to Practice</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Actions - Full Width */}
        <Card className="hover:shadow-lg transition-shadow mb-8">
          <CardHeader>
            <CardTitle className="text-foreground font-medium">Quick Actions</CardTitle>
            <CardDescription className="text-muted-foreground">Jump into your next practice session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg transition-all duration-200" asChild>
                <Link href="/practice">
                  <Play className="w-7 h-7" />
                  <span className="text-sm font-medium">Start Practice</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-accent transition-all duration-200"
                asChild
              >
                <Link href="/personas">
                  <Users className="w-7 h-7" />
                  <span className="text-sm font-medium">Choose Persona</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-accent transition-all duration-200"
                asChild
              >
                <Link href="/performance">
                  <BarChart3 className="w-7 h-7" />
                  <span className="text-sm font-medium">View Performance</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

          {/* Left Column */}
          <div className="space-y-6">

            {/* Left Column - Stats or Info */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-foreground font-medium">Your Progress</CardTitle>
                <CardDescription className="text-muted-foreground">Track your improvement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm">Start practicing to see your progress stats!</p>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Recent Feedback */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-foreground font-medium">Latest Feedback</CardTitle>
                <CardDescription className="text-muted-foreground">Recent insights from your practice sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData?.recentFeedback?.length > 0 ? (
                  dashboardData.recentFeedback.map((feedback: any) => (
                    <div key={feedback.id} className="p-4 border rounded-lg bg-accent/5 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="text-xs">
                          {feedback.category}
                        </Badge>
                        <span className="text-sm font-semibold text-foreground bg-accent px-2 py-1 rounded">
                          {feedback.score}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-2 leading-relaxed">{feedback.feedback}</p>
                      <p className="text-xs text-muted-foreground font-medium">{feedback.session}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Mic className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm">No feedback yet.</p>
                    <p className="text-sm">Start practicing to see your progress!</p>
                  </div>
                )}
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link href="/performance">View Detailed Feedback</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
      </main>
    </div>
  )
}