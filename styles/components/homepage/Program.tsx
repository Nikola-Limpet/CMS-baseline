import { Clock, Laptop, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export default function Program() {
  // Custom styles for the animated underline effect
  const linkStyles = "relative group no-underline";
  const underlineStyles = "absolute w-0 h-1 cursor-pointer bg-blue-400/40 bottom-0 hover:text-blue-400 left-0 transition-all duration-300 group-hover:w-full";

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-slate-800 mb-12 font-medium">Ways to study</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 my-6">
          {/* Teaching centre */}
          <div className="space-y-4 font-serif">
            <div className="w-16 h-16 text-red-500">
              <Clock className="w-full h-full stroke-1" />
            </div>
            <h2 className="text-2xl font-medium">Teaching centre</h2>
            <p className="text-gray-600 text-lg font-medium leading-relaxed">
              For many of our online degrees, you can also receive in-person support at a teaching centre in your
              country.
            </p>
            <Link href="/learning">
              <Button
                variant="link"
                className="p-0 h-auto cursor-pointer hover:text-primary text-lg text-gray-700 font-medium  hover:text-navy transition-colors no-underline hover:no-underline"
              >
                <span className={linkStyles}>
                  View more <ChevronRight className="w-4 h-4 ml-1 m-1 inline" />
                  <span className={underlineStyles}></span>
                </span>
              </Button>
            </Link>
          </div>

          {/* Study online */}
          <div className="space-y-4 font-serif">
            <div className="w-16 h-16 text-red-500">
              <Laptop className="w-full h-full stroke-1" />
            </div>
            <h2 className="text-2xl font-medium">Study online</h2>
            <p className="text-gray-600 text-lg font-medium leading-relaxed">
              Many of courses can be studied independently online, supported by our Virtual Learning Environment.
            </p>
            <Link href="/learning">
              <Button
                variant="link"
                className="p-0 h-auto cursor-pointer hover:text-primary text-secondary text-lg font-medium transition-colors no-underline hover:no-underline"
              >
                <span className={linkStyles}>
                  View more <ChevronRight className="w-4 h-4 m-1 inline" />
                  <span className={underlineStyles}></span>
                </span>
              </Button>
            </Link>
          </div>

          {/* On campus in London */}
          <div className="space-y-4 font-serif">
            <div className="w-16 h-16 text-red-500">
              <Timer className="w-full h-full stroke-1" />
            </div>
            <h2 className="text-2xl font-medium">On campus in London</h2>
            <p className="text-gray-600 text-lg font-medium leading-relaxed">
              The School of Advanced Study offers on-campus postgraduate degrees in a wide range of humanities subjects.
            </p>
            <Link href="/learning">
              <Button
                variant="link"
                className="p-0 h-auto cursor-pointer hover:text-primary text-gray-700 text-lg font-medium transition-colors no-underline hover:no-underline"
              >
                <span className={linkStyles}>
                  View more <ChevronRight className="w-4 h-4 m-1 inline" />
                  <span className={underlineStyles}></span>
                </span>
              </Button>
            </Link>
          </div>

          {/* On campus in Paris */}
          <div className="space-y-4 font-serif">
            <div className="w-16 h-16 text-red-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
                <path d="M12 2L14 8L20 8L15 12L17 18L12 15L7 18L9 12L4 8L10 8L12 2Z" />
                <path d="M12 15V22" />
                <path d="M8 22H16" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium">On campus in Paris</h2>
            <p className="text-gray-600 text-lg font-medium leading-relaxed">
              The Institute in Paris offers a selection of undergraduate degrees and a master's programme.
            </p>
            <Link href="/learning">
              <Button
                variant="link"
                className="p-0 h-auto cursor-pointer hover:text-primary  text-gray-700 text-lg font-medium transition-colors no-underline hover:no-underline"
              >
                <span className={linkStyles}>
                  View more <ChevronRight className="w-4 h-4 m-1 inline" />
                  <span className={underlineStyles}></span>
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
