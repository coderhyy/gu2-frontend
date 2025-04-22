import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ArrowRight, CirclePlay, Trophy, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section
        className="relative bg-cover bg-center h-[500px] flex items-center"
        style={{
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(0,0,0,0.7)",
          backgroundImage: "url('/hero1.jpg')",
        }}
      >
        <div className="container mx-auto px-4 text-center text-white z-10">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Simply Rugby Admin
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Professional platform for managing rugby teams, players and
            tournaments
          </p>
          <div className="flex justify-center mt-6">
            <Button className="mr-4 bg-primary hover:bg-primary/90" size="lg">
              <CirclePlay className="mr-2 h-5 w-5" />
              Get Started
            </Button>
            <Button
              className="border-white text-white hover:bg-white/20"
              size="lg"
              variant="outline"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border border-primary/20 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Player Management</CardTitle>
              <CardDescription className="line-clamp-2">
                Manage athlete profiles, statistics and performance data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-4">
                Comprehensive player management tools, including personal data
                records, progress tracking, and detailed analysis.
              </p>
            </CardContent>
            <CardFooter>
              <Link
                className="flex items-center text-primary text-sm font-medium"
                to="/player-manage"
              >
                Manage Players <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>

          <Card className="border border-primary/20 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
              <Activity className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Training Plan</CardTitle>
              <CardDescription className="line-clamp-2">
                Create and manage professional training plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-4">
                Design personalized training plans, track progress, optimize
                training effects, and improve athletic performance.
              </p>
            </CardContent>
            <CardFooter>
              <Link
                className="flex items-center text-primary text-sm font-medium"
                to="/training-management"
              >
                View Training Plan <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>

          <Card className="border border-primary/20 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
              <Trophy className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Tournament Management</CardTitle>
              <CardDescription className="line-clamp-2">
                Manage tournament data and create professional schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-4">
                Organize competitions, manage match statistics, track team
                performance, and generate comprehensive tournament reports.
              </p>
            </CardContent>
            <CardFooter>
              <Link
                className="flex items-center text-primary text-sm font-medium"
                to="/tournament-management"
              >
                View Tournament Data <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* News Section with Background */}
      <section
        className="py-16 bg-cover bg-center"
        style={{
          backgroundBlendMode: "overlay",
          // backgroundColor: "rgba(255,255,255,0.9)",
          backgroundImage: "url('/hero2.jpg')",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="bg-accent backdrop-blur-sm rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <span className="bg-primary rounded-full p-2 mr-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </span>
              Latest News
            </h2>
            <ul className="space-y-6">
              <li className="flex justify-between items-center border-b pb-4 border-primary/20">
                <div>
                  <h3 className="font-semibold text-lg">
                    2024 Season Training Plan Updated
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    New training methodology and exercise routines are now
                    available for all coaches
                  </p>
                </div>
                <span className="text-sm bg-primary/10 text-primary py-1 px-3 rounded-full">
                  2024-05-15
                </span>
              </li>
              <li className="flex justify-between items-center border-b pb-4 border-primary/20">
                <div>
                  <h3 className="font-semibold text-lg">
                    System Function Update
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Performance analytics module with advanced statistics and
                    visualization tools
                  </p>
                </div>
                <span className="text-sm bg-primary/10 text-primary py-1 px-3 rounded-full">
                  2024-05-10
                </span>
              </li>
              <li className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">
                    National Team Selection Notice
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Registration open for qualifying players - submit
                    applications by May 30th
                  </p>
                </div>
                <span className="text-sm bg-primary/10 text-primary py-1 px-3 rounded-full">
                  2024-05-05
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
            <h3 className="text-4xl font-bold text-primary mb-2">250+</h3>
            <p className="text-muted-foreground">Active Players</p>
          </div>
          <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
            <h3 className="text-4xl font-bold text-primary mb-2">42</h3>
            <p className="text-muted-foreground">Professional Coaches</p>
          </div>
          <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
            <h3 className="text-4xl font-bold text-primary mb-2">18</h3>
            <p className="text-muted-foreground">Teams Managed</p>
          </div>
          <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
            <h3 className="text-4xl font-bold text-primary mb-2">98%</h3>
            <p className="text-muted-foreground">Satisfaction Rate</p>
          </div>
        </div>
      </section>
    </div>
  );
}
