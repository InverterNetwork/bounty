'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import NextLink from 'next/link'
import Link from 'next/link'
import { Button, cn } from '@inverter-network/react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
  Separator,
} from '@inverter-network/react/client'
import {
  Menu,
  PiggyBank,
  ScrollIcon,
  GitPullRequestCreate,
  ShieldPlus,
  BaggageClaim,
  CheckCheck,
} from 'lucide-react'
import { ThemeSwitcher } from './theme-switcher'
import { WalletWidget } from './wallet-widget'
import { useTheme } from 'next-themes'

export function Navbar() {
  const { resolvedTheme } = useTheme()
  const pathname = usePathname()

  return (
    <div
      className={`
      items-center py-2 px-4 flex w-screen
      justify-between gap-3 top-0 
      drop-shadow-2xl bg-background-100/50 backdrop-blur-2xl
      border-b border-input
    `.trim()}
    >
      <div className="flex items-center gap-2">
        <NextLink href="/">
          <Image
            style={{
              filter: resolvedTheme === 'light' ? 'invert(1)' : '',
            }}
            className={cn('w-24 md:w-28')}
            priority
            src="/text_icon.svg"
            alt="Ineverter Icon"
            width={100}
            height={30}
          />
        </NextLink>

        <ThemeSwitcher />

        <Separator orientation="vertical" />

        <div className="items-center hidden lg:flex gap-2">
          <NavItems pathname={pathname} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <WalletWidget size={'sm'} />

        <span className="md:hidden">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" asChild>
                <Menu className="fill-current w-5 h-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent aria-describedby="mobile-menu">
              <DrawerTitle className="border-none" />
              <DrawerDescription />
              <div className="p-4 flex flex-col gap-4">
                <NavItems pathname={pathname} />
              </div>
            </DrawerContent>
          </Drawer>
        </span>
      </div>
    </div>
  )
}

const NavItems = ({ pathname }: { pathname: string }) => {
  const arr = [
    {
      href: '/',
      label: 'Bounties',
      icon: <ScrollIcon />,
    },
    {
      href: '/deposit',
      label: 'Deposit',
      icon: <PiggyBank />,
    },
    {
      href: '/post',
      label: 'Post',
      icon: <GitPullRequestCreate />,
    },
    {
      href: '/claims',
      label: 'Claims',
      icon: <BaggageClaim />,
    },
    {
      href: '/verify',
      label: 'Verify',
      icon: <CheckCheck />,
    },
    {
      href: '/admin',
      label: 'Admin',
      icon: <ShieldPlus />,
    },
  ]

  return arr.map((i, index) => {
    if ('comingSoon' in i && i.comingSoon) {
      return (
        <Button
          key={index}
          startIcon={i.icon}
          size="sm"
          variant={pathname === i.href ? 'link' : 'ghost'}
          className={cn('w-full min-w-max justify-start truncate')}
          disabled
        >
          {i.label} | soon
        </Button>
      )
    }

    return (
      <Link href={i.href} key={index}>
        <Button
          startIcon={i.icon}
          size="sm"
          variant={pathname === i.href ? 'link' : 'ghost'}
          className={cn('w-full min-w-max justify-start truncate')}
        >
          {i.label}
        </Button>
      </Link>
    )
  })
}
