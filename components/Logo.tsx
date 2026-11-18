import Image from "next/image";
import logo from "@/public/honorlogo.jpeg";

export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return <Image src={logo} alt="Asif Book Store" sizes="64px" className={`rounded-xl object-cover ${className}`} priority />;
}
