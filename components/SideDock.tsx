import { useRouter } from "next/router";
import { Home, Wrench, Users, Image, CalendarPlus, MessageCircle } from "lucide-react";
import { Dock } from "@/components/ui/dock-two";
import { useSite } from "@/context/SiteContext";

export default function SideDock() {
  const router = useRouter();
  const { settings } = useSite();

  const whatsappUrl = `https://wa.me/${(settings?.whatsapp_number || "917006830501").replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings?.whatsapp_message || "")}`;

  const dockItems = [
    {
      icon: Home,
      label: "Home",
      href: "/",
      active: router.pathname === "/",
      onClick: (e?: React.MouseEvent) => { e?.preventDefault(); router.push("/"); },
    },
    {
      icon: Wrench,
      label: "Services",
      href: "/services",
      active: router.pathname === "/services",
      onClick: (e?: React.MouseEvent) => { e?.preventDefault(); router.push("/services"); },
    },
    {
      icon: Users,
      label: "About Us",
      href: "/about",
      active: router.pathname === "/about",
      onClick: (e?: React.MouseEvent) => { e?.preventDefault(); router.push("/about"); },
    },
    {
      icon: Image,
      label: "Our Work",
      href: "/work",
      active: router.pathname === "/work",
      onClick: (e?: React.MouseEvent) => { e?.preventDefault(); router.push("/work"); },
    },
    {
      icon: CalendarPlus,
      label: "Book a Service",
      href: "/contact",
      active: router.pathname === "/contact",
      onClick: (e?: React.MouseEvent) => { e?.preventDefault(); router.push("/contact"); },
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: whatsappUrl,
      accent: true,
    },
  ];

  return <Dock items={dockItems} />;
}
