import Link from "next/link"
import Image from "next/image"
import NavItems from "@/components/NavItems"
import UserDropdown from "@/components/UserDropdown"
import { searchStocks } from "@/lib/actions/finnhub.actions"

const Header = async ({user}:{user: User}) => {
  const initialStocks = await searchStocks('');
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link className="header-logo" href="/">
          <Image src="/assets/icons/logo.svg" alt="Investro Logo" width={140} height={140} className="h-8 w-auto cursor-pointer" />
        </Link>
        <nav className="hidden sm:block">
          {/* NavItems */}
          <NavItems initialStocks={initialStocks} />
        </nav>
        {/* UserDropdown */}
        <UserDropdown user={user} initialStocks={initialStocks}/>
      </div>
    </header>
  )
}

export default Header