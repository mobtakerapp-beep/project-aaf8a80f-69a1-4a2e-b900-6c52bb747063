import { createFileRoute } from "@tanstack/react-router";
import { Museum } from "@/components/museum/Museum";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "شيفرة الهبوت… ذاكرة ظفار الرقمية" },
      { name: "description", content: "متحف افتراضي ثلاثي الأبعاد لاكتشاف فن الهبوت الظفاري وفك شيفرته التراثية." },
      { property: "og:title", content: "شيفرة الهبوت… ذاكرة ظفار الرقمية" },
      { property: "og:description", content: "رحلة تفاعلية ثلاثية الأبعاد في تراث ظفار وفن الهبوت." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Museum,
});
