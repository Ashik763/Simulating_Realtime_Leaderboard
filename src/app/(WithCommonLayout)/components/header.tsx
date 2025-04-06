'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'
// import Image from 'next/image'
import { Bell, User } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut, useSession } from 'next-auth/react'
import Loading from '@/app/loading'

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/leader-board', label: 'LEADERBOARD' },

]

export function Header() {

  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  console.log(session, status);
 
    
      if (status === "loading") return <Loading></Loading>;
      if (!session) return <p>Access Denied</p>;
  const handleLogout = async () => {
    console.log("Attempting to sign out...");
    await signOut({
      redirect: true,
      callbackUrl: "/login",
    });
    console.log("Signed out.");
  };

  return (
    <header className="w-full flex justify-center py-4 sticky top-0 z-50 border-b">
      <div className="container max-w-[50%] text-white flex justify-between items-center">

        {/* Desktop Navigation */}
        <nav className="hidden md:flex text-white items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`${
                link.href === '/' ? 'text-[#98e5d7]' : 'text-white'
              } hover:text-[#98e5d7] transition-colors`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`${
                    link.href === '/' ? 'text-[#98e5d7]' : 'text-gray-600'
                  } hover:text-[#98e5d7] transition-colors text-lg`}
                >
                  {link.label}
                </Link>
              ))}
        
              
            </nav>
           


          </SheetContent>
        </Sheet>

        <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none"> {session?.user?.username}</p>
                <p className="text-xs leading-none text-muted-foreground">
                {session?.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button onClick={()=> handleLogout()}>  Log out </Button>
             
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>


      </div>
    </header>
  )
}

