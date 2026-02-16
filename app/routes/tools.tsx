import {redirect, type MetaFunction} from "react-router";
import type {Route} from "./+types/tools";
import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {course} from "@forge42/seo-tools/structured-data/course";
import PDFSVG from "/public/pdf.svg?raw";
import {getTranslationData} from "~/utils/route-utils";
import {ToolCategoryCard} from "~/components/tool-category-card";
import Layout from "~/components/layout";
import FREESVG from "/public/free.svg?raw";
import EMAILSVG from "/public/email.svg?raw";
import LOCKSVG from "/public/lock.svg?raw";
import FASTSVG from "/public/fast.svg?raw";
import EASYSVG from "/public/baby.svg?raw";
import MONITORSVG from "/public/monitor.svg?raw";
import CHECKCHECKSVG from "/public/check-check.svg?raw";
// SSR Loader - Async data fetching for translations
export async function loader({request}: {request: Request}) {
  const url = new URL(request.url);

  const {locale, messages, t} = await getTranslationData(url.pathname);

  return {
    locale,
    messages,
    seo: {
      title: t("pdf.meta.title"),
      description: t("pdf.meta.description"),
      keywords: t("pdf.meta.keywords"),
    },
  };
}

export const meta: MetaFunction = ({data, location}: any) => {
  if (!data) {
    return [
      {title: "All Tools - Kleinbyte"},
      {
        name: "description",
        content:
          "Free online tools for PDF, documents, images and more. No signup required.",
      },
    ];
  }

  const locale = data.locale;
  const t = (key: string) => data.messages[key] || key;

  const meta = generateMeta(
    {
      title: t("tools.meta.title"),
      description: t("tools.meta.description"),
      url: `https://kleinbyte.com/${locale === "en" ? "" : locale + "/"}tools`,
      image: "https://kleinbyte.com/og-image-tools.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: t("pdf.title"),
          url: `https://kleinbyte.com/${
            locale === "en" ? "" : locale + "/"
          }tools`,
          description: t("tools.description"),
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }),
      },
      {
        "script:ld+json": course({
          "@type": "HowTo",
          name: t("tools.meta.title"),
          description: t("tools.meta.description"),
        }),
      },
      {property: "og:type", content: "website"},
      {property: "og:site_name", content: "Kleinbyte"},
      {name: "twitter:card", content: "summary_large_image"},
      {name: "twitter:title", content: t("tools.meta.title")},
      {name: "twitter:description", content: t("tools.meta.description")},
      {
        name: "twitter:image",
        content: "https://kleinbyte.com/og-image-tools.png",
      },
      {name: "keywords", content: t("tools.meta.keywords")},
      {name: "author", content: "Kleinbyte"},
    ],
  );
  return meta;
};

export default function Tools({loaderData}: Route.ComponentProps) {
  const t = (key: string) => loaderData.messages[key] || key;
  return (
    <Layout loaderData={loaderData}>
      <main className="min-h-screen flex flex-col items-start justify-start mt-30">
        <ul className="gap-2 gap-x-2 flex select-none">
          <li>
            <span className="text-gray-600 font-bold rounded-2xl border border-gray-300  bg-transparent px-3 py-0.5 text-sm flex  items-center gap-x-2">
              <div
                dangerouslySetInnerHTML={{__html: FREESVG}}
                className="size-4 [&>svg]:size-4"
              />
              Free
            </span>
          </li>
          <li>
            <span className="text-gray-600 font-bold rounded-2xl border border-gray-300  bg-transparent px-3 py-0.5 text-sm flex  items-center gap-x-2">
              <div
                dangerouslySetInnerHTML={{__html: EMAILSVG}}
                className="size-4 [&>svg]:size-4"
              />
              No signup
            </span>
          </li>
          <li>
            <span className="text-gray-600 font-bold rounded-2xl border border-gray-300  bg-transparent px-3 py-0.5 text-sm flex  items-center gap-x-2">
              <div
                dangerouslySetInnerHTML={{__html: LOCKSVG}}
                className="size-4 [&>svg]:size-4"
              />
              Secure
            </span>
          </li>
          <li>
            <span className="text-gray-600 font-bold rounded-2xl border border-gray-300  bg-transparent px-3 py-0.5 text-sm flex  items-center gap-x-2">
              <div
                dangerouslySetInnerHTML={{__html: FASTSVG}}
                className="size-4 [&>svg]:size-4"
              />
              Fast
            </span>
          </li>
        </ul>
        <ol className="flex flex-col justify-start items-start gap-3 mt-2">
          <li className="text-sm text-gray-500  flex items-center gap-x-2 border-gray-300 border px-3 py-1 rounded-3xl">
            <div
              dangerouslySetInnerHTML={{__html: CHECKCHECKSVG}}
              className="size-6 [&>svg]:size-6 text-green-500"
            />
            We have 20+ tools and we are adding new tools every week.
          </li>
          <li className="text-sm text-gray-500  flex items-center gap-x-2 border-gray-300 border px-3 py-1 rounded-3xl">
            <div
              dangerouslySetInnerHTML={{__html: CHECKCHECKSVG}}
              className="size-6 [&>svg]:size-6 text-green-500"
            />
            Works on all platforms. You can use our tools from your computer,
            tablet or smartphone without any installation. Windows, Mac, Linux,
            Android, iOS, it works on all platforms.
          </li>
          <li className="text-sm text-gray-500  flex items-center gap-x-2 border-gray-300 border px-3 py-1 rounded-3xl">
            <div
              dangerouslySetInnerHTML={{__html: CHECKCHECKSVG}}
              className="size-6 [&>svg]:size-6  flex justify-center items-center text-green-500  rounded-full"
            />
            Trusted by millions of users worldwide. We have served over 10
            million users and we are growing rapidly.
          </li>
        </ol>
        <h1 className="text-4xl font-bold mb-0">Kleinbyte Tools</h1>
        <p className="mt-4 text-lg text-neutral-400">
          All tools are free to use and no signup is required.
          <br />
          We offer a variety of tools for PDF, documents, images and more.
        </p>

        <ul className="grid grid-cols-3 gap-3 mt-10">
          <li>
            <ToolCategoryCard
              title="Image Tools"
              description="Free online tools for image editing, conversion and optimization. No signup required."
              link="/tools/image-converter"
              count={1}
              badge="Available"
              icon={
                <div
                  dangerouslySetInnerHTML={{__html: PDFSVG}}
                  className="[&>svg]:w-8 [&>svg]:h-8 "
                />
              }
            />
          </li>
          <li>
            <ToolCategoryCard
              title="Image Tools"
              description="Free online tools for image editing, conversion and optimization. No signup required."
              link="/tools/image-converter"
              count={1}
              badge="Available"
              icon={
                <div
                  dangerouslySetInnerHTML={{__html: PDFSVG}}
                  className="[&>svg]:w-8 [&>svg]:h-8 "
                />
              }
            />
          </li>
          <li>
            <ToolCategoryCard
              title="Image Tools"
              description="Free online tools for image editing, conversion and optimization. No signup required."
              link="/tools/image-converter"
              count={1}
              badge="Available"
              icon={
                <div
                  dangerouslySetInnerHTML={{__html: PDFSVG}}
                  className="[&>svg]:w-8 [&>svg]:h-8 "
                />
              }
            />
          </li>
        </ul>
        <section className="mt-14">
          <h2 className="text-2xl font-bold mb-4">Why Choose Our Tools?</h2>
          <ol className="grid grid-cols-3 gap-2  p-1  rounded-lg">
            <li className="flex flex-col justify-start items-start rounded-lg gap-3 p-5 bg-slate-50/80 ">
              <div
                dangerouslySetInnerHTML={{__html: FREESVG}}
                className="size-10 [&>svg]:size-10! text-[#3e4ae7]"
              />
              <h3 className="font-semibold text-xl">Totaly Free 0$</h3>
              <p className=" text-slate-500">
                It is totaly free. We will not ask Credit Card or copuon code.
                We will not put Watermark to your files. You can use all
                features without any limitation. It is free for everyone. We
                believe in providing free tools to everyone. It is our mission
                to make it free and accessible for everyone.
              </p>
            </li>
            <li className="flex flex-col justify-start items-start rounded-lg gap-3  p-5 bg-slate-50/80 ">
              <div
                dangerouslySetInnerHTML={{__html: EASYSVG}}
                className="size-10 [&>svg]:size-10! text-[#3e4ae7]"
              />
              <h3 className="font-semibold text-xl">It is Easy</h3>
              <p className=" text-slate-500">
                Our tools are designed to be user-friendly and easy to use. You
                can use our tools without any technical knowledge. It is not
                rocket science. Just upload your file and get the result in
                seconds.
              </p>
            </li>
            <li className="flex flex-col justify-start items-start rounded-lg gap-3  p-5 bg-slate-50/80 ">
              <div
                dangerouslySetInnerHTML={{__html: LOCKSVG}}
                className="size-10 [&>svg]:size-10! text-[#3e4ae7]"
              />
              <h3 className="font-semibold text-xl">Secure</h3>
              <p className=" text-slate-500">
                We take your privacy and security seriously. All files are
                deleted from our servers after 1 hour. We do not share your
                files with anyone. We dont look at your files. You can use our
                tools with confidence. Your files are safe with us. It is
                enycpted and secure. We block viruses and malware to protect
                your files and our servers.
              </p>
            </li>
            <li className="flex flex-col justify-start items-start rounded-lg gap-3  p-5 bg-slate-50/80 ">
              <div
                dangerouslySetInnerHTML={{__html: EMAILSVG}}
                className="size-10 [&>svg]:size-10! text-[#3e4ae7]"
              />
              <h3 className="font-semibold text-xl">No signup required</h3>
              <p className=" text-slate-500">
                We dont ask you to create an account or sign up to use our
                tools. You can use our tools without any hassle. Just upload
                your file and get the result in seconds. No email, no password,
                no credit card required.
              </p>
            </li>
            <li className="flex flex-col justify-start items-start rounded-lg gap-3  p-5 bg-slate-50/80 ">
              <div
                dangerouslySetInnerHTML={{__html: MONITORSVG}}
                className="size-10 [&>svg]:size-10! text-[#3e4ae7]"
              />
              <h3 className="font-semibold text-xl">No install required</h3>
              <p className=" text-slate-500">
                You dont need to install any software or application to use our
                tools. You can use our tools online from any device with an
                internet connection. It is cloud-based and works on all
                platforms. You can use it from your computer, tablet or
                smartphone without any installation.
              </p>
            </li>
          </ol>
        </section>
      </main>
    </Layout>
  );
}
