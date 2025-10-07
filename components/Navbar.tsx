'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MagicWandIcon } from '@radix-ui/react-icons'
import {
  LayoutDashboard,
  FilePlus,
  BookOpen,
  FileText,
  Menu,
  X,
  ChevronRight,
  GraduationCap,
  Calendar,
  Code2,
  LucideIcon,
} from 'lucide-react'
import Image from 'next/image'
import { Fragment, useState, useEffect } from 'react'
import { useBuilder } from './builder/BuilderContext'
import UserMenuWrapper from './auth/UserMenuWrapper'
import { AdminNavLink } from './AdminNavLink'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useUser } from '@stackframe/stack'

interface MenuLink {
  label: string
  description?: string
  url: string
  icon: {
    component: LucideIcon
    color: string
  }
}

interface MenuItem {
  title: string
  url?: string
  links?: MenuLink[]
}

interface DesktopMenuItemProps {
  item: MenuItem
  index: number
}

interface MobileNavigationMenuProps {
  open: boolean
  navigation: MenuItem[]
}

interface MenuSubLinkProps {
  link: MenuLink
}

const MOBILE_BREAKPOINT = 1024

// Public navigation (not logged in)
const PUBLIC_NAVIGATION: MenuItem[] = [
  {
    title: 'Workshops',
    url: '/workshops',
  },
  {
    title: 'Blog',
    url: '/blog',
  },
]

// Authenticated navigation (logged in)
const AUTH_NAVIGATION: MenuItem[] = [
  {
    title: 'Workshops',
    links: [
      {
        label: 'Upcoming Workshops',
        description: 'Register for upcoming events',
        url: '/workshops',
        icon: {
          component: Calendar,
          color: '#f97316',
        },
      },
      {
        label: 'Workshop Credits',
        description: 'Track your attendance',
        url: '/dashboard',
        icon: {
          component: GraduationCap,
          color: '#10b981',
        },
      },
    ],
  },
  {
    title: 'Resources',
    links: [
      {
        label: 'Blog',
        description: 'Community insights & updates',
        url: '/blog',
        icon: {
          component: FileText,
          color: '#3b82f6',
        },
      },
      {
        label: 'Learning Resources',
        description: 'Tutorials & guides',
        url: '/resources',
        icon: {
          component: BookOpen,
          color: '#8b5cf6',
        },
      },
    ],
  },
  {
    title: 'Tools',
    links: [
      {
        label: 'PRD Builder',
        description: 'AI-powered documentation',
        url: '/builder/prd-builder',
        icon: {
          component: Code2,
          color: '#f59e0b',
        },
      },
      {
        label: 'Dashboard',
        description: 'Project management',
        url: '/dashboard',
        icon: {
          component: LayoutDashboard,
          color: '#6366f1',
        },
      },
    ],
  },
  {
    title: 'Community',
    url: '/dashboard',
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const isBuilderPage = pathname === '/builder'
  const [open, setOpen] = useState<boolean>(false)
  const user = useUser()

  // Determine navigation based on auth state
  const NAVIGATION = user ? AUTH_NAVIGATION : PUBLIC_NAVIGATION
  const logoHref = user ? '/dashboard' : '/'

  let builderProgress = null
  try {
    const builder = useBuilder()
    builderProgress = builder.progress
  } catch {
    // Not in builder context, ignore
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        setOpen(false)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto'
  }, [open])

  const handleMobileMenu = () => {
    const nextOpen = !open
    setOpen(nextOpen)
  }

  return (
    <Fragment>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href={logoHref} className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="VibePHX"
                width={160}
                height={30}
                className="h-7 w-auto"
                priority
              />
            </Link>

            {/* Builder Title - Desktop */}
            {isBuilderPage && (
              <div className="hidden lg:flex items-center gap-2">
                <MagicWandIcon className="w-5 h-5 text-blue-400" />
                <span className="text-lg font-semibold text-white">PRD Builder</span>
                {builderProgress && (
                  <span className="text-sm text-gray-400 ml-2">
                    Step {builderProgress.currentStep + 1}/{builderProgress.totalSteps}
                  </span>
                )}
              </div>
            )}

            {/* Desktop Navigation */}
            {!isBuilderPage && (
              <NavigationMenu className="hidden lg:flex">
                <NavigationMenuList>
                  {NAVIGATION.map((item, index) => (
                    <DesktopMenuItem
                      key={`desktop-link-${index}`}
                      item={item}
                      index={index}
                    />
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            )}

            {/* Auth & Mobile Menu */}
            <div className="flex items-center gap-4">
              {!isBuilderPage && (
                <>
                  <Suspense fallback={null}>
                    <AdminNavLink />
                  </Suspense>
                  <UserMenuWrapper />
                </>
              )}
              {isBuilderPage && (
                <Link href="/">
                  <Button variant="outline">
                    Back to VibePHX
                  </Button>
                </Link>
              )}
              <div className="lg:hidden">
                <Button variant="ghost" size="icon" onClick={handleMobileMenu}>
                  {open ? (
                    <X className="size-5 text-white" />
                  ) : (
                    <Menu className="size-5 text-white" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <MobileNavigationMenu open={open} navigation={NAVIGATION} />

      {/* Progress Bar Footer - Only on builder page */}
      {isBuilderPage && builderProgress && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-t border-gray-800">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>{builderProgress.stepTitle || `Step ${builderProgress.currentStep + 1}`}</span>
              <span>{Math.round(((builderProgress.currentStep + 1) / builderProgress.totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-1 rounded-full transition-all duration-500"
                style={{ width: `${((builderProgress.currentStep + 1) / builderProgress.totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  )
}

const DesktopMenuItem = ({ item, index }: DesktopMenuItemProps) => {
  if (item.links) {
    return (
      <NavigationMenuItem key={`desktop-menu-item-${index}`} value={`${index}`}>
        <NavigationMenuTrigger className="h-fit bg-transparent font-normal text-gray-300 hover:text-white focus:!bg-transparent data-[active=true]:!bg-transparent">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="!rounded-xl !p-0">
          <ul className="w-[20rem] p-2.5">
            {item.links.map((link, index) => (
              <li key={`desktop-nav-sublink-${index}`}>
                <MenuSubLink link={link} />
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  return (
    <NavigationMenuItem key={`desktop-menu-item-${index}`} value={`${index}`}>
      <NavigationMenuLink
        href={item.url}
        className={`${navigationMenuTriggerStyle()} h-fit bg-transparent font-normal text-gray-300 hover:text-white`}
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

const MenuSubLink = ({ link }: MenuSubLinkProps) => {
  return (
    <a
      href={link.url}
      className="flex items-center gap-4 rounded-lg p-2 hover:bg-gray-800/50"
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex gap-2.5">
          {link.icon && (
            <link.icon.component
              className="size-5"
              style={{ stroke: link.icon.color }}
            />
          )}
          <div className="flex flex-col gap-1.5">
            <h3 className="text-sm leading-none text-white">
              {link.label}
            </h3>
            <p className="text-sm leading-[1.2] text-gray-400">
              {link.description}
            </p>
          </div>
        </div>
        <ChevronRight className="size-3.5 text-gray-500 opacity-100" />
      </div>
    </a>
  )
}

const MobileNavigationMenu = ({ open, navigation }: MobileNavigationMenuProps) => {
  return (
    <Sheet open={open}>
      <SheetContent
        aria-describedby={undefined}
        side="top"
        className="inset-0 h-dvh w-full bg-black border-gray-800 pt-16 [&>button]:hidden"
      >
        <div className="flex-1 overflow-y-auto">
          <div className="container pb-12">
            <div className="mask-clip-border absolute -m-px h-px w-px overflow-hidden whitespace-nowrap text-nowrap border-0 p-0">
              <SheetTitle className="text-white">
                Mobile Navigation
              </SheetTitle>
            </div>
            <div className="flex h-full flex-col justify-between gap-20">
              <Accordion type="multiple" className="w-full">
                {navigation.map((item, index) =>
                  renderMobileMenuItem(item, index),
                )}
              </Accordion>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const renderMobileMenuItem = (item: MenuItem, index: number) => {
  if (item.links) {
    return (
      <AccordionItem key={item.title} value={`nav-${index}`}>
        <AccordionTrigger className="h-[3.75rem] items-center p-0 text-base font-normal leading-[3.75] text-gray-300 hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent>
          {item.links.map((subItem) => (
            <MenuSubLink key={subItem.label} link={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <a
      key={item.title}
      href={item.url}
      className="nth-last-1:border-0 flex h-[3.75rem] items-center border-b border-gray-800 p-0 text-left text-base font-normal leading-[3.75] text-gray-300 transition-all"
    >
      {item.title}
    </a>
  )
}
