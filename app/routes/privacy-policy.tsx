import PrivacyPolicy from '../components/PrivacyPolicy';
import {type MetaFunction} from "react-router";
import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import {useI18n, translations, type Locale} from "../i18n/context";

export const meta: MetaFunction = ({location}) => {
  const locale: Locale = 
    location.pathname.split("/")?.[1] === "de" ? "de" : 
    location.pathname.split("/")?.[1] === "es" ? "es" : 
    location.pathname.split("/")?.[1] === "ar" ? "ar" : "en";
  const messages = translations[locale] ?? translations.en;

  function t(key: string) {
    return messages[key] ?? key;
  }

  const meta = generateMeta(
    {
      title: t("privacy.meta.title"),
      description: t("privacy.meta.description"),
      url: "https://kleinbyte.com/privacy-policy",
    }
  );
  return meta;
};

export default function PrivacyPolicyRoute() {
  return <PrivacyPolicy />;
}