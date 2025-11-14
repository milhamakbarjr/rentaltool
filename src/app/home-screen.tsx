"use client";

import { Building02, Check, Copy01, HelpCircle, Key01, Users01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { useClipboard } from "@/hooks/use-clipboard";

export const HomeScreen = () => {
    const clipboard = useClipboard();

    return (
        <div className="flex h-dvh flex-col">
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 md:px-8">
                <div className="relative flex size-28 items-center justify-center">
                    <Building02 className="size-16 text-brand-solid" />
                </div>

                <h1 className="max-w-3xl text-center text-display-sm font-semibold text-primary">Welcome to RentalTool</h1>

                <p className="mt-2 max-w-xl text-center text-lg text-tertiary">
                    A modern rental management platform built with Next.js, React, and TypeScript. Get started by running the development server:
                </p>

                <div className="relative mt-6 flex h-10 items-center rounded-lg border border-secondary bg-secondary">
                    <code className="px-3 font-mono text-secondary">npm run dev</code>

                    <hr className="h-10 w-px bg-border-secondary" />

                    <ButtonUtility
                        color="tertiary"
                        size="sm"
                        tooltip="Copy"
                        className="mx-1"
                        icon={clipboard.copied ? Check : Copy01}
                        onClick={() => clipboard.copy("npm run dev")}
                    />
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 max-w-3xl w-full">
                    <div className="flex flex-col items-center gap-3 p-6 rounded-lg border border-secondary bg-primary">
                        <Building02 className="size-8 text-brand-solid" />
                        <h3 className="font-semibold text-secondary">Property Management</h3>
                        <p className="text-center text-sm text-tertiary">Manage your rental properties efficiently</p>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-6 rounded-lg border border-secondary bg-primary">
                        <Users01 className="size-8 text-brand-solid" />
                        <h3 className="font-semibold text-secondary">Tenant Portal</h3>
                        <p className="text-center text-sm text-tertiary">Streamline tenant communications</p>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-6 rounded-lg border border-secondary bg-primary">
                        <Key01 className="size-8 text-brand-solid" />
                        <h3 className="font-semibold text-secondary">Lease Tracking</h3>
                        <p className="text-center text-sm text-tertiary">Track rental agreements and payments</p>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-3">
                    <Button
                        href="https://github.com/milhamakbarjr/rentaltool"
                        target="_blank"
                        rel="noopener noreferrer"
                        color="link-color"
                        size="lg"
                        iconLeading={HelpCircle}
                    >
                        Documentation
                    </Button>
                </div>
            </div>
        </div>
    );
};
