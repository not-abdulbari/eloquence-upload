'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { FileText, Palette, Camera, Code, Users } from 'lucide-react';

interface Stats {
  total: number;
  paperPresentation: number;
  webDesigning: number;
  reelsPhotography: number;
  codeDebugging: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    paperPresentation: 0,
    webDesigning: 0,
    reelsPhotography: 0,
    codeDebugging: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from('submissions')
      .select('event_type');

    if (error) {
      console.error('Error fetching stats:', error);
      return;
    }

    const statsData: Stats = {
      total: data.length,
      paperPresentation: data.filter(s => s.event_type === 'Paper Presentation').length,
      webDesigning: data.filter(s => s.event_type === 'Web Designing').length,
      reelsPhotography: data.filter(s => s.event_type === 'Reels & Photography').length,
      codeDebugging: data.filter(s => s.event_type === 'Code Debugging').length,
    };

    setStats(statsData);
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
      value: stats.reelsPhotography,
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
