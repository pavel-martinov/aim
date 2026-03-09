"use client";

import OpaqueButton from "@/components/ui/OpaqueButton";
import { openDownloadStore } from "@/lib/download";

type DownloadButtonProps = {
  className?: string;
  children?: React.ReactNode;
};

/** Primary CTA button that opens the app download store. */
export default function DownloadButton({
  className,
  children = "DOWNLOAD NOW",
}: DownloadButtonProps) {
  return (
    <OpaqueButton onClick={openDownloadStore} className={className}>
      {children}
    </OpaqueButton>
  );
}
