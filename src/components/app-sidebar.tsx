'use client';

import {
  IconCategory,
  IconDashboard,
  IconInnerShadowTop,
  IconWriting,
} from '@tabler/icons-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'Blog Management',
      url: '/dashboard/blogs',
      icon: IconWriting,
      items: [
        {
          title: 'All Blogs',
          url: '/dashboard/blogs',
        },
        {
          title: 'Add New Blog',
          url: '/dashboard/blogs/new',
        },
      ],
    },
    {
      title: 'Categories',
      url: '/dashboard/categories',
      icon: IconCategory,
      items: [
        {
          title: 'All Categories',
          url: '/dashboard/categories',
        },
        {
          title: 'Add New Category',
          url: '/dashboard/categories/new',
        },
      ],
    },
  ],

  // navSecondary: [
  //   {
  //     title: 'Settings',
  //     url: '#',
  //     icon: IconSettings,
  //   },
  //   {
  //     title: 'Get Help',
  //     url: '#',
  //     icon: IconHelp,
  //   },
  //   {
  //     title: 'Search',
  //     url: '#',
  //     icon: IconSearch,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={[]} />
        <NavSecondary items={[]} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
