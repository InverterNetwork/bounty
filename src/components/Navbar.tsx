'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import NextLink from 'next/link'
// import ThemeSwitcher from './ThemeSwitcher'
import Link from 'next/link'
import { Button, Dropdown } from 'react-daisyui'
import WalletWidget from './WalletWidget'
import { GiHamburgerMenu } from 'react-icons/gi'
import { cn } from '@/styles/cn'
import { useRole } from '@/hooks'
import { PathStatePostRequest, PathsCorrespondingTo } from '@/lib/types/paths'
import { firstLetterToUpper } from '@/lib/utils'

// Powered by Inverter Logo
const SVGLogo = () => (
  <div className="logo-container absolute -top-150 left-1/2 transform -translate-x-1/2 z-10">
    <svg
      id="b"
      xmlns="http://www.w3.org/2000/svg"
      width="195"
      height="195"
      viewBox="0 0 898 266"
    >
      <defs>
        <style>{`.d{fill:#fff;stroke-width:0}`}</style>
      </defs>
      <g id="c">
        <path d="M407 133c0 88 .3 133 1 133s1-45 1-133-.3-133-1-133-1 45-1 133ZM750 99v9h-11v13h11v10.7c0 13.5 1.5 22.8 4.2 26.6 3.2 4.5 7.3 5.7 19.8 5.7h11v-13h-8.5c-7.3 0-8.6-.3-9.5-1.9-.5-1.1-1-7.8-1-15V121h17.1l-.3-6.3-.3-6.2-8.2-.3-8.3-.3V90h-16v9ZM494 103c-4.2 4.2-.8 13 5 13 4.3 0 6.1-1 7.5-4.3 1.5-3.6.3-8.2-2.5-9.7-3.1-1.6-7.9-1.1-10 1ZM241 111.6v9.6l-3-2.6c-3.6-3-8.3-4-14.7-3.3-6.1.7-10.1 4.6-11.8 11.8-1.2 5-1.3 5.1-1.4 1.8-.1-4.6-3.6-9.9-8.1-12.2-4.7-2.4-14.9-1.9-18.7.9-5.2 3.9-6.8 7.1-6.8 13.7 0 8 2.7 12.7 9.1 15.8 7.8 3.7 18.4 1.2 22.4-5.4 1.9-3.1 1.9-3.2 0-3.9-1.4-.5-2.8.2-5.4 2.8-3.1 3.1-3.9 3.4-9.1 3.4-4.9 0-6-.4-8.6-2.9-1.6-1.6-2.9-3.9-2.9-5 0-1.9.7-2 14.4-2.3l14.5-.3 1.1 4.4c2.7 10.7 14.8 14.3 25.3 7.5l3.7-2.4v2.5c0 2 .5 2.5 2.5 2.5h2.5v-46h-2.5q-2.5 0-2.5 9.6Zm-38.8 11.3c1.5 1.7 2.8 4 2.8 5.1 0 1.7-.9 1.9-11.7 2.2-6.5.2-11.9.2-12.1.2-1-.5 3-7.4 5.4-9.3 4.4-3.3 11.8-2.5 15.6 1.8Zm31.3-2.5c4.3 1.8 7.5 6.9 7.5 12 0 3.1-.7 4.5-3.9 7.7-3.4 3.4-4.4 3.9-8.5 3.9-6.8 0-10.3-2.1-11.6-7.2-3.5-12.7 5.1-21.1 16.5-16.4ZM266 125v23h2.5c2 0 2.5-.5 2.5-2.5v-2.6l4.7 2.8c6.1 3.5 14.7 3.9 19 .7 4.2-3.1 6.3-8 6.3-14.7 0-10.9-5-16.7-14.3-16.7-5 0-10.9 2-13.9 4.7-1.7 1.5-1.8 1.2-1.8-8q0-9.7-2.5-9.7H266v23Zm23.1-5c5.1 1.4 7.3 5.9 6.7 13.5-.4 4.9-.9 6.2-3.4 8.2-2.5 2.1-3.7 2.4-8.6 2-6.6-.4-10-2.8-11.9-8.5-1.8-5.5.2-10.5 5.4-13.7 4.6-2.7 6.5-3 11.8-1.5ZM524.8 124.7 508 141.5V121h-16v19.8c0 23.6-.2 23.2 10.1 23.2h6.4l16-16c8.8-8.8 16.3-16 16.7-16 .5 0 .8 7.2.8 16v16h16.1l-.3-26c-.3-30.3 0-29.2-10-29.8l-6.3-.3-16.7 16.8ZM563 109.4c0 .8 4.3 13 9.5 27s9.5 25.9 9.5 26.5c0 .7 4 1.1 11.8 1.1h11.7l9.9-26.9c5.5-14.9 10-27.3 10-27.8.1-.4-3.6-.9-8.1-1.1-4.6-.2-8.3-.1-8.3.1s-3.1 9.5-7 20.7c-3.8 11.2-7 20.6-7 20.9-.1 2-3.2-5.9-13.3-34.4l-2.5-7-8.1-.3c-6.6-.2-8.1 0-8.1 1.2ZM648.5 109.1c-7.5 1.2-12.2 3.5-17.6 8.6-3.8 3.6-5.3 5.9-6.5 10.1-3 10.1-.2 21.4 6.8 27.9 10.6 9.9 36.7 11.2 49 2.5 3.6-2.7 7.3-7.9 8-11.5.3-1.7-.4-1.9-6.5-1.9-6.4 0-7.1.2-10.1 3.1-5.8 5.6-20.5 6.2-27.7 1-2.8-2-5.9-6.6-5.9-8.9 0-.7 8.4-1 25.5-1H689v-3.3c0-5.5-2.9-13.5-6.2-17.3-3.9-4.5-10.7-7.9-18.3-9.3-6.6-1.2-8.8-1.2-16 0Zm18.7 12.5c1.4.8 3.6 2.6 4.7 4 4.1 5.2 3.6 5.4-14.8 5.4-9.9 0-17.2-.4-17.6-1-.3-.5.9-2.6 2.7-4.6 5.5-5.9 17.2-7.7 25-3.8ZM704.2 109c-1.8.4-4.2 1.6-5.4 2.6-4.3 3.9-4.8 7.1-4.8 30.4v22h16v-19.8c0-24.5-.8-23.2 14.4-23.2h10.7l-.3-6.3-.3-6.2-13.5-.2c-7.4 0-15 .2-16.8.7ZM811.1 109.1c-10.6 1.8-20.5 9.4-22.9 17.8-3.6 12 .1 24.5 9.2 30.8 7.4 5.1 14.1 6.6 26 6 10.6-.5 15.5-2 21.4-6.4 3.4-2.5 7.6-9.6 6.9-11.6-.5-1.7-14-1-15 .8-.4.7-2.3 2.3-4.2 3.5-5 3.1-17.8 3.1-23.3 0-3.8-2.2-8.8-9-7.5-10.4.3-.3 11.8-.6 25.5-.6H852v-4.3c0-10.4-6.7-19.9-16.5-23.6-6.4-2.4-17.2-3.3-24.4-2Zm16.9 11.5c3.6.7 9 5.8 9 8.5 0 1.8-.9 1.9-17 1.9-11.4 0-17-.4-17-1.1 0-3.8 5.9-8.6 12.2-9.8 4.1-.9 6.3-.8 12.8.5ZM867.4 109.1c-5.4 1.3-8.5 4.7-9.5 10.6-.4 2.7-.8 13.7-.8 24.5L857 164h15.9l.3-20.1c.4-24.3-.5-22.9 14.5-22.9H898v-13l-13.2.1c-7.3.1-15.1.5-17.4 1ZM.2 138.2c.3 23.2.3 23.3 2.5 23.6 2.9.4 3.7-2.6 3.1-11.8-.3-3.9-.4-7-.2-7s1.9 1.1 3.9 2.4c6.8 4.7 16.6 4.3 21.3-.7 3-3.2 4.2-7.1 4.2-13.9s-2.4-11.9-7.3-14.4c-4.6-2.4-13.5-1.5-18.6 1.9l-4 2.7.2-2.8c.2-2.3-.2-2.8-2.6-3l-2.7-.3.2 23.3Zm23-18.1c5.2 1.4 7.2 5.3 6.6 13.2-.6 8-3.4 10.7-11.3 10.7-4.7 0-5.8-.4-8.9-3.4-3.2-3-3.6-3.9-3.6-8.3 0-5.8 2.5-9.7 7.4-11.9 3.8-1.6 5.1-1.7 9.8-.3Z" />
        <path d="M45.5 116.4c-10 4.4-12.4 19.5-4.4 27.5 7.8 7.9 23.3 5.7 28.1-3.9 4-7.8 1-18.8-6.1-22.8-4.5-2.5-12.8-2.9-17.6-.8Zm12.9 4c7.2 3 9.8 11.4 5.6 18.4-4.9 8.1-19.1 6.6-22-2.3-2.2-6.6.6-13.5 6.3-16 4.1-1.8 6-1.8 10.1-.1ZM70 116.2c0 .7 2.2 8 4.8 16.3l4.8 15 4.4.3 4.5.3 4-14c2.1-7.7 4.2-13.6 4.5-13.1.3.6 2.4 6.8 4.6 14l3.9 13h9l5.1-16.3c4-12.6 4.8-16.3 3.7-16.5-3.2-.8-4.4 1.3-8.5 14.3-2.3 7.4-4.5 13.5-4.8 13.5s-2.6-6.3-5-14l-4.3-14h-3.9c-4.5 0-4.2-.6-9 16.4-1.7 6.4-3.5 11.6-3.8 11.6s-2.6-6.3-5-14c-3.9-12.8-4.5-14-6.7-14-1.2 0-2.3.6-2.3 1.2ZM130.3 117c-6.2 3.7-8.9 11-7.2 19.1 2.8 13 19.8 17.2 29.6 7.4 3.8-3.8 4.1-5.1 1.3-5.8-1.3-.3-2.6.3-3.8 1.7-2.5 3.3-5.5 4.6-10.2 4.6-6.7 0-12-4-12-9.1 0-.5 6-.9 14-.9 15.8 0 15.9 0 14-7.1-2.1-8-7.6-11.9-16.7-11.9-4 0-6.8.6-9 2Zm17.9 5.9c1.5 1.7 2.8 4 2.8 5.1 0 1.7-.9 1.9-11.5 2.2-12.8.3-13.2.1-9.5-6 2.5-4.1 5.3-5.3 11-4.8 3.4.3 5.1 1.1 7.2 3.5ZM161.9 115.7c-3 .8-3.9 5.1-3.9 18.8V148h5v-12.4c0-6.8.3-13.1.6-14 .5-1.2 2.1-1.6 7.5-1.6 6.7 0 6.9-.1 6.9-2.5s-.2-2.5-7.2-2.4c-4 .1-8 .3-8.9.6ZM300.5 116.7c9.7 24.3 11.4 29.9 10.4 33.6-1.3 4.7-4.5 7.7-8.2 7.7-2.4 0-2.8.4-2.5 2.2.3 2 .9 2.3 4.2 2.2 2.9-.1 4.6-.9 7.1-3.5 3-3.2 5.4-8.7 18.1-42.2.6-1.6.2-1.8-2.2-1.5-2.7.3-3.2 1-7.4 12.5-4.1 11.1-6 14.6-6 11 0-.6-2-6.2-4.4-12.2-4-10-4.6-11-7.1-11.3-2.3-.3-2.7-.1-2 1.5Z" />
      </g>
    </svg>
  </div>
)

type NavbarFields = Exclude<PathStatePostRequest, 'bounties' | 'funds'>

const NavItems = ({
  pathname,
  reverse = false,
}: {
  pathname: string
  reverse?: boolean
}) => {
  const { roles } = useRole()
  const iS = roles.isSuccess

  const can: Record<NavbarFields, boolean> = {
    post: iS && roles.data!.isIssuer,
    verify: iS && roles.data!.isVerifier,
    admin: iS && roles.data!.isOwner,
    claims: iS && roles.data!.isClaimer,
  }

  const arr = [
    { href: '/', label: 'Bounties' },
    { href: '/funds', label: 'Funds' },
  ]

  Object.entries(PathsCorrespondingTo).forEach(([key, value]) => {
    if (can[key as NavbarFields])
      arr.push({
        href: value,
        label: firstLetterToUpper(key),
      })
  })

  if (reverse) arr.reverse()

  return arr.map((i, index) => {
    if (reverse) {
      const className = cn(
        'my-1 p-2 text-md',
        pathname === i.href && 'bg-base-200'
      )
      return (
        <Dropdown.Item href={i.href} key={index} className={className}>
          {i.label}
        </Dropdown.Item>
      )
    }
    return (
      <Link href={i.href} key={index}>
        <Button size={'sm'} {...(pathname !== i.href && { color: 'ghost' })}>
          {i.label}
        </Button>
      </Link>
    )
  })
}

export default function Navbar() {
  const pathname = usePathname()
  return (
    <div
      className={`
    fixed left-1/2 -translate-x-1/2 items-center p-2 flex 
    justify-center gap-4 z-10 w-max bottom-0 
    drop-shadow-2xl rounded-tl-xl rounded-tr-xl bg-base-100 
    border-t border-x border-color-faint
  `.trim()}
    >
      {/* <SVGLogo /> */}
      <NextLink href="https://bloomnetwork.earth" target="_blank">
        <Image
          priority
          src="/bloom-light-logo.svg"
          alt="bloom_logo"
          width={42}
          height={42}
        />
      </NextLink>

      {/* <ThemeSwitcher className="lg:flex hidden" /> */}

      <WalletWidget />

      <div className="items-center lg:flex hidden gap-4">
        <h1>|</h1>
        <NavItems pathname={pathname} />
      </div>

      <Dropdown className="relative items-center flex lg:hidden">
        <Button tag="label" color="ghost" className="py-0 px-1" tabIndex={0}>
          <GiHamburgerMenu className="fill-current w-5 h-5" />
        </Button>
        <Dropdown.Menu className="menu-sm absolute bottom-[120%] right-0">
          <Dropdown.Item className="flex gap-2">
            {/* <ThemeSwitcher className="w-full" /> */}
          </Dropdown.Item>
          <NavItems pathname={pathname} reverse />
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}
