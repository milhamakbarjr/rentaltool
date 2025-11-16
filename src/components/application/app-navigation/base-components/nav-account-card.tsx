"use client";

import type { FC, HTMLAttributes } from "react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import type { Placement } from "@react-types/overlays";
import { ChevronSelectorVertical, LogOut01, Settings01, Globe01, Moon01, Sun } from "@untitledui/icons";
import { useFocusManager } from "react-aria";
import type { DialogProps as AriaDialogProps } from "react-aria-components";
import { Button as AriaButton, Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Popover as AriaPopover } from "react-aria-components";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group";
import { Toggle } from "@/components/base/toggle/toggle";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useAuth } from "@/hooks/use-auth";
import { useUserProfile } from "@/hooks/use-user-profile";
import { signOut } from "@/lib/auth/auth";
import { setUserLocale } from "@/i18n/locale";
import { localeConfigs, type Locale } from "@/i18n/config";
import { cx } from "@/utils/cx";
import { toast } from "sonner";
import { getAvatarSignedUrl } from "@/lib/storage/avatar";

export const NavAccountMenu = ({
    className,
    onClose,
    ...dialogProps
}: AriaDialogProps & { className?: string; onClose?: () => void }) => {
    const focusManager = useFocusManager();
    const dialogRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const t = useTranslations("common");
    const { theme, setTheme } = useTheme();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [currentLocale, setCurrentLocale] = useState<Locale>("id");
    const [isPending, startTransition] = useTransition();

    // Get current locale from cookie
    useEffect(() => {
        const locale = document.cookie
            .split("; ")
            .find((row) => row.startsWith("NEXT_LOCALE="))
            ?.split("=")[1] as Locale | undefined;
        if (locale) {
            setCurrentLocale(locale);
        }
    }, []);

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    focusManager?.focusNext({ tabbable: true, wrap: true });
                    break;
                case "ArrowUp":
                    focusManager?.focusPrevious({ tabbable: true, wrap: true });
                    break;
            }
        },
        [focusManager],
    );

    useEffect(() => {
        const element = dialogRef.current;
        if (element) {
            element.addEventListener("keydown", onKeyDown);
        }

        return () => {
            if (element) {
                element.removeEventListener("keydown", onKeyDown);
            }
        };
    }, [onKeyDown]);

    const handleSignOut = async () => {
        try {
            setIsSigningOut(true);
            const { error } = await signOut();
            if (error) {
                toast.error("Failed to sign out");
                console.error("Sign out error:", error);
                return;
            }
            // Redirect to login page
            router.push("/login");
        } catch (error) {
            console.error("Sign out error:", error);
            toast.error("Failed to sign out");
        } finally {
            setIsSigningOut(false);
        }
    };

    const handleAccountSettings = () => {
        onClose?.();
        router.push("/settings");
    };

    const handleLanguageChange = async (newLocale: Locale) => {
        try {
            setCurrentLocale(newLocale);
            await setUserLocale(newLocale);
            toast.success("Language updated");

            // Refresh the page to apply new locale
            startTransition(() => {
                window.location.reload();
            });
        } catch (error) {
            console.error("Language change error:", error);
            toast.error("Failed to change language");
        }
    };

    const isDarkMode = theme === "dark";

    return (
        <AriaDialog
            {...dialogProps}
            ref={dialogRef}
            className={cx("w-66 rounded-xl bg-secondary_alt shadow-lg ring ring-secondary_alt outline-hidden", className)}
        >
            <div className="rounded-xl bg-primary ring-1 ring-secondary">
                <div className="flex flex-col gap-0.5 py-1.5">
                    <NavAccountCardMenuItem
                        label="Account settings"
                        icon={Settings01}
                        onClick={handleAccountSettings}
                    />
                </div>

                {/* Language Selector */}
                <div className="border-t border-secondary px-3 py-3">
                    <div className="flex items-center gap-2 mb-2">
                        <Globe01 className="size-4 text-fg-quaternary" />
                        <span className="text-xs font-semibold text-tertiary">Language</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        {Object.entries(localeConfigs).map(([key, config]) => (
                            <button
                                key={key}
                                onClick={() => handleLanguageChange(key as Locale)}
                                disabled={isPending}
                                className={cx(
                                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-focus-ring transition hover:bg-primary_hover focus-visible:outline-2 focus-visible:outline-offset-2",
                                    currentLocale === key && "bg-primary_hover font-medium",
                                    isPending && "cursor-not-allowed opacity-50",
                                )}
                            >
                                <span>{config.flag}</span>
                                <span className="text-secondary">{config.nativeName}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Theme Toggle */}
                <div className="border-t border-secondary px-3 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {isDarkMode ? (
                                <Moon01 className="size-4 text-fg-quaternary" />
                            ) : (
                                <Sun className="size-4 text-fg-quaternary" />
                            )}
                            <span className="text-xs font-semibold text-tertiary">Dark mode</span>
                        </div>
                        <Toggle
                            size="sm"
                            slim
                            isSelected={isDarkMode}
                            onChange={(selected) => setTheme(selected ? "dark" : "light")}
                        />
                    </div>
                </div>
            </div>

            <div className="pt-1 pb-1.5">
                <NavAccountCardMenuItem
                    label={isSigningOut ? "Signing out..." : "Sign out"}
                    icon={LogOut01}
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                />
            </div>
        </AriaDialog>
    );
};

const NavAccountCardMenuItem = ({
    icon: Icon,
    label,
    shortcut,
    disabled,
    ...buttonProps
}: {
    icon?: FC<{ className?: string }>;
    label: string;
    shortcut?: string;
    disabled?: boolean;
} & HTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            {...buttonProps}
            disabled={disabled}
            className={cx(
                "group/item w-full cursor-pointer px-1.5 focus:outline-hidden",
                disabled && "cursor-not-allowed opacity-50",
                buttonProps.className,
            )}
        >
            <div
                className={cx(
                    "flex w-full items-center justify-between gap-3 rounded-md p-2 group-hover/item:bg-primary_hover",
                    // Focus styles.
                    "outline-focus-ring group-focus-visible/item:outline-2 group-focus-visible/item:outline-offset-2",
                )}
            >
                <div className="flex gap-2 text-sm font-semibold text-secondary group-hover/item:text-secondary_hover">
                    {Icon && <Icon className="size-5 text-fg-quaternary" />} {label}
                </div>

                {shortcut && (
                    <kbd className="flex rounded px-1 py-px font-body text-xs font-medium text-tertiary ring-1 ring-secondary ring-inset">{shortcut}</kbd>
                )}
            </div>
        </button>
    );
};

export const NavAccountCard = ({
    popoverPlacement,
}: {
    popoverPlacement?: Placement;
}) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const isDesktop = useBreakpoint("lg");
    const { user } = useAuth();
    const { profile } = useUserProfile();
    const [isOpen, setIsOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string>("");

    // Fallback values if user or profile data is not available
    const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
    const displayEmail = user?.email || "";

    // Generate signed URL for avatar when profile changes
    useEffect(() => {
        const loadAvatar = async () => {
            if (profile?.avatar_url) {
                // Generate signed URL for uploaded avatar
                const signedUrl = await getAvatarSignedUrl(profile.avatar_url);
                setAvatarUrl(signedUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`);
            } else {
                // Fallback to DiceBear initials
                setAvatarUrl(`https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`);
            }
        };

        loadAvatar();
    }, [profile?.avatar_url, displayName]);

    return (
        <div ref={triggerRef} className="relative flex items-center gap-3 rounded-xl p-3 ring-1 ring-secondary ring-inset">
            <AvatarLabelGroup
                size="md"
                src={avatarUrl}
                title={displayName}
                subtitle={displayEmail}
                status="online"
            />

            <div className="absolute top-1.5 right-1.5">
                <AriaDialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
                    <AriaButton className="flex cursor-pointer items-center justify-center rounded-md p-1.5 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:outline-2 focus-visible:outline-offset-2 pressed:bg-primary_hover pressed:text-fg-quaternary_hover">
                        <ChevronSelectorVertical className="size-4 shrink-0" />
                    </AriaButton>
                    <AriaPopover
                        placement={popoverPlacement ?? (isDesktop ? "right bottom" : "top right")}
                        triggerRef={triggerRef}
                        offset={8}
                        className={({ isEntering, isExiting }) =>
                            cx(
                                "origin-(--trigger-anchor-point) will-change-transform",
                                isEntering &&
                                    "duration-150 ease-out animate-in fade-in placement-right:slide-in-from-left-0.5 placement-top:slide-in-from-bottom-0.5 placement-bottom:slide-in-from-top-0.5",
                                isExiting &&
                                    "duration-100 ease-in animate-out fade-out placement-right:slide-out-to-left-0.5 placement-top:slide-out-to-bottom-0.5 placement-bottom:slide-out-to-top-0.5",
                            )
                        }
                    >
                        <NavAccountMenu onClose={() => setIsOpen(false)} />
                    </AriaPopover>
                </AriaDialogTrigger>
            </div>
        </div>
    );
};
