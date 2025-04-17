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
    <div className="container mx-auto py-8 px-4">
      <section className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Simply Rugby Admin
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Simply Rugby Admin is a platform for managing rugby players and
            coaches.
          </p>
        </div>

        <div className="flex justify-center mt-6">
          <Button className="mr-4" size="lg">
            <CirclePlay className="mr-2 h-5 w-5" />
            Get Started
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
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

        <Card>
          <CardHeader>
            <Activity className="h-8 w-8 text-primary mb-2" />
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

        <Card>
          <CardHeader>
            <Trophy className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Game Results</CardTitle>
            <CardDescription className="line-clamp-2">
              Record and analyze game data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground line-clamp-4">
              Integrate game data and provide in-depth analysis to help coaches
              and athletes develop more effective strategies.
            </p>
          </CardContent>
          <CardFooter>
            <Link
              className="flex items-center text-primary text-sm font-medium"
              to="/"
            >
              View Game Data <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>
      </section>

      <section className="bg-primary/5 rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold mb-4">Latest News</h2>
        <ul className="space-y-4">
          <li className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="font-medium">2024 Season Training Plan Updated</h3>
              <p className="text-sm text-muted-foreground">
                New training plan is now available
              </p>
            </div>
            <span className="text-sm text-muted-foreground">2024-05-15</span>
          </li>
          <li className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="font-medium">System Function Update</h3>
              <p className="text-sm text-muted-foreground">
                New data analysis module added
              </p>
            </div>
            <span className="text-sm text-muted-foreground">2024-05-10</span>
          </li>
          <li className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">National Team Selection Notice</h3>
              <p className="text-sm text-muted-foreground">
                Please register for the national team if you meet the conditions
              </p>
            </div>
            <span className="text-sm text-muted-foreground">2024-05-05</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
