"use client";

import { usePathname, useRouter } from "next/navigation";
import { HeaderNavigationBase } from "./header-navigation";
import { ROUTES } from "@/utils/constants";
import { BarChart04, Home01, Package, ShoppingCart01, Users01, Settings01 } from "@untitledui/icons";

interface DashboardHeaderNavigationProps {
    userName: string;
    userEmail: string;
    userAvatarUrl?: string;
}

export const DashboardHeaderNavigation = ({
    userName,
    userEmail,
    userAvatarUrl,
}: DashboardHeaderNavigationProps) => {
    const pathname = usePathname();

    const navItems = [
        {
            label: "Dashboard",
            href: ROUTES.DASHBOARD,
            current: pathname === ROUTES.DASHBOARD,
            icon: Home01,
        },
        {
            label: "Rentals",
            href: ROUTES.RENTALS,
            current: pathname.startsWith(ROUTES.RENTALS),
            icon: ShoppingCart01,
        },
        {
            label: "Customers",
            href: ROUTES.CUSTOMERS,
            current: pathname.startsWith(ROUTES.CUSTOMERS),
            icon: Users01,
        },
        {
            label: "Inventory",
            href: ROUTES.INVENTORY,
            current: pathname.startsWith(ROUTES.INVENTORY),
            icon: Package,
        },
        {
            label: "Analytics",
            href: ROUTES.ANALYTICS,
            current: pathname.startsWith(ROUTES.ANALYTICS),
            icon: BarChart04,
        },
    ];

    return (
        <HeaderNavigationBase
            items={navItems}
            activeUrl={pathname}
            showAvatarDropdown={true}
        />
    );
};
