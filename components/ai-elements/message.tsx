import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { UIMessage } from "ai";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, HTMLAttributes } from "react";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"];
};

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      "group flex w-full items-end justify-end gap-2 py-4",
      from === "user" ? "is-user" : "is-assistant justify-start",
      className
    )}
    {...props}
  />
);

const messageContentVariants = cva(
  "is-user:dark flex flex-col gap-2 overflow-hidden rounded-lg text-sm prose prose-invert max-w-none",
  {
    variants: {
      variant: {
        contained: [
          "max-w-[80%] px-4 py-3",
          "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground",
          // Assistant bubble: black bg, thin gray border, white text
          "group-[.is-assistant]:bg-black group-[.is-assistant]:text-white group-[.is-assistant]:border group-[.is-assistant]:border-gray-700",
          // Inline code styling for assistant messages
          "group-[.is-assistant]:prose-code:bg-gray-800 group-[.is-assistant]:prose-code:text-orange-400 group-[.is-assistant]:prose-code:px-1.5 group-[.is-assistant]:prose-code:py-0.5 group-[.is-assistant]:prose-code:rounded group-[.is-assistant]:prose-code:text-xs group-[.is-assistant]:prose-code:font-mono group-[.is-assistant]:prose-code:before:content-[''] group-[.is-assistant]:prose-code:after:content-['']",
        ],
        flat: [
          "group-[.is-user]:max-w-[80%] group-[.is-user]:bg-secondary group-[.is-user]:px-4 group-[.is-user]:py-3 group-[.is-user]:text-foreground",
          "group-[.is-assistant]:text-foreground",
        ],
      },
    },
    defaultVariants: {
      variant: "contained",
    },
  }
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof messageContentVariants>;

export const MessageContent = ({
  children,
  className,
  variant,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(messageContentVariants({ variant, className }))}
    {...props}
  >
    {children}
  </div>
);

export type MessageAvatarProps = ComponentProps<typeof Avatar> & {
  src?: string;
  name?: string;
};

export const MessageAvatar = ({
  src,
  name,
  className,
  ...props
}: MessageAvatarProps) => (
  <Avatar className={cn("size-8 ring-1 ring-border", className)} {...props}>
    {src ? (
      <AvatarImage alt="" className="mt-0 mb-0" src={src} />
    ) : null}
    <AvatarFallback>{name?.slice(0, 2) || "AI"}</AvatarFallback>
  </Avatar>
);
