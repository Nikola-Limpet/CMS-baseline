import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

export type FeatureSplitSectionProps = {
  title: string;
  description: string;
  primaryAction: { label: string; href: string };
  secondaryAction: { label: string; href: string };
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
  bgColor?: string; // e.g. "bg-[--color-yellow]" or "bg-white"
};

/**
 * FeatureSplitSection - Alternating image/content section for landing pages.
 * Uses MOVE color palette and accessible contrast.
 */
export const FeatureSplitSection: FC<FeatureSplitSectionProps> = ({
  title,
  description,
  primaryAction,
  secondaryAction,
  imageSrc,
  imageAlt,
  reverse = false,
  bgColor = "bg-[--color-yellow]",
}) => {
  return (
    <section className={`w-full ${bgColor} py-12 md:py-20`}>
      <div
        className={`container mx-auto px-4 flex flex-col md:flex-row items-center gap-10 md:gap-16 ${reverse ? "md:flex-row-reverse" : ""}`}
      >
        {/* Image */}
        <div className="flex-1 w-full max-w-xl">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={600}
            height={400}
            className="rounded-lg shadow-md object-cover w-full h-auto"
            priority
          />
        </div>
        {/* Content */}
        <div className="flex-1 w-full max-w-xl">
          <h2 className="font-bold text-2xl md:text-3xl text-[--color-navy] mb-4 font-poppins">
            {title}
          </h2>
          <p className="text-[--color-gray-dark] text-base md:text-lg mb-8 leading-relaxed font-kantumruy">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={primaryAction.href}
              className="inline-block px-6  rounded-md border-2 border-[--color-navy] text-[--color-navy] bg-white font-semibold text-base shadow-sm hover:bg-[--color-navy] hover:text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 font-poppins"
            >
              {primaryAction.label}
            </Link>
            <Link
              href={secondaryAction.href}
              className="inline-block px-6  rounded-md border-2 border-[--color-accent] text-[--color-accent] bg-white font-semibold text-base shadow-sm hover:bg-[--color-accent] hover:text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 font-poppins"
            >
              {secondaryAction.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSplitSection;
