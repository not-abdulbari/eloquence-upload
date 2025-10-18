'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Palette, Camera, Code, Users } from 'lucide-react';

interface Stats {
  total: number;
  paperPresentation: number;
  webDesigning: number;
  reelsAndPhotography: number;
  codeDebugging: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    paperPresentation: 0,
    webDesigning: 0,
    reelsAndPhotography: 0,
    codeDebugging: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Use NEXT_PUBLIC_API_URL if set (so dashboard can query the Worker directly)
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '';
      const response = await fetch(`${apiBase}/api/submissions/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
  const data = await response.json();
  const payload = data.stats ? data.stats : data;

      // Support two shapes:
      // - { total, paperPresentation, webDesigning, reelsAndPhotography, codeDebugging }
      // - an array of submissions (legacy)
      if (Array.isArray(payload)) {
        const statsData: Stats = {
          total: payload.length,
          paperPresentation: payload.filter((s: any) => s.eventType === 'Paper Presentation').length,
          webDesigning: payload.filter((s: any) => s.eventType === 'Web Designing').length,
          reelsAndPhotography: payload.filter((s: any) => s.eventType === 'Reels & Photography').length,
          codeDebugging: payload.filter((s: any) => s.eventType === 'Code Debugging').length,
        };
        setStats(statsData);
      } else if (data && typeof data === 'object') {
        const statsData: Stats = {
          total: payload.total ?? 0,
          paperPresentation: payload.byEventType?.['Paper Presentation'] ?? payload.paperPresentation ?? 0,
          webDesigning: payload.byEventType?.['Web Designing'] ?? payload.webDesigning ?? 0,
          reelsAndPhotography: payload.byEventType?.['Reels & Photography'] ?? payload.reelsAndPhotography ?? 0,
          codeDebugging: payload.byEventType?.['Code Debugging'] ?? payload.codeDebugging ?? 0,
        };
        setStats(statsData);
      } else {
        throw new Error('Unexpected stats response');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Submissions',
      value: stats.total,
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Paper Presentation',
      value: stats.paperPresentation,
      icon: FileText,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Web Designing',
      value: stats.webDesigning,
      icon: Palette,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Reels & Photography',
      value: stats.reelsAndPhotography,
      icon: Camera,
      color: 'text-pink-600 dark:text-pink-400',
    },
    {
      title: 'Code Debugging',
      value: stats.codeDebugging,
      icon: Code,
      color: 'text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AdminLayout>
  );
}
